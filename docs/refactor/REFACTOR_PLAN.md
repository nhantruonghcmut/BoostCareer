# BoostCareer — Refactor Plan (Node backend + React frontend)

- **Audit date**: 2026-08-21
- **Scope**: `backend/` (Express + MySQL, ~8.7k LOC) và `frontend/` (React CRA, ~17.4k LOC)
- **Out of scope**: `JavaBoostCareer/` (Spring Boot migration — plan riêng)
- **Mục tiêu**: scalable, maintainable, smooth, modern, secure, high performance

---

## 0. Ba quy tắc cốt lõi của plan này

1. **Không đổi cấu trúc thư mục một phát.** Đổi từng slice dọc (route → controller → service → model → UI) để route/auth/cache không vỡ.
2. **Contract trước, code sau.** Chuẩn hoá response envelope + error code trước, rồi mới bóc component/service. Nếu contract còn drift thì mọi refactor đều phải sửa 2 lần.
3. **Mỗi phase phải deploy được độc lập.** Không có branch sống quá 1 tuần.

---

## 1. Kiến trúc hiện tại

```
                       ┌──────────────────────────────┐
   Browser ──────────► │ frontend/  React 18 + CRA 5  │
                       │  ├─ component/  (page + UI trộn lẫn)
                       │  ├─ redux_toolkit/ (4 RTK Query API)
                       │  ├─ features/  (mới, gần như trống)
                       │  └─ shared/    (mới, 5 file)
                       └──────────────┬───────────────┘
                                      │ fetch, credentials: include
                                      │ baseUrl = hardcoded localhost:4000
                       ┌──────────────▼───────────────┐
                       │ backend/  Express 4 (ESM)    │
                       │  routes → controllers → models│
                       │  KHÔNG có service layer      │
                       │  KHÔNG có validation layer   │
                       │  KHÔNG có DTO / mapper       │
                       └──────────────┬───────────────┘
                          mysql2 pool │ raw SQL
                       ┌──────────────▼───────────────┐
                       │ MySQL (~45 bảng)             │
                       └──────────────────────────────┘
                     external: AWS S3, OpenAI / OpenRouter
```

**Điểm mạnh đã có** (giữ lại, đừng đập):

| Thứ đã tốt | Ở đâu |
|---|---|
| Response envelope `res.success` / `res.error` | `middlewares/responseHandler.js` |
| Error converter + ApiError + winston logger | `middlewares/errorHandler.js`, `utils/ApiError.js` |
| Prepared statements ở hầu hết query (0 chỗ interpolate SQL) | `models/*.js` |
| Transaction đúng pattern ở register / add job | `authencationModels.js`, `employerModels.js` |
| `baseQueryWithAuth` đã gom refresh + forceLogout | `redux_toolkit/baseQueryWithAuth.js` |
| RTK Query + tag invalidation | `redux_toolkit/*Api.js` |

---

## 2. Findings — xếp theo mức độ nguy hiểm

### P0 — Security & production blocker

| # | Vấn đề | Bằng chứng | Hệ quả |
|---|---|---|---|
| S1 | Không có `helmet`, không có rate limit, không có `compression` | `backend/package.json` | XSS header, brute-force login, payload nặng |
| S2 | Upload limit **250 MB** trong khi comment ghi "5MB", không lọc mimetype | `middlewares/imageUpload.js:15` | DoS RAM (memoryStorage), upload file thực thi |
| S3 | S3 object `ACL: "public-read"` cho **CV ứng viên** | `imageUpload.js` `uploadToS3CV` | Lộ CV/PII ra Internet nếu đoán được URL |
| S4 | `console.log` in secrets & flow ở 16 file backend (49 lần trong `employerModels.js`) | grep | Rò rỉ log, chậm event loop |
| S5 | Không validate input — `req.query` / `req.body` đi thẳng xuống model | mọi controller | Type confusion, crash, over-fetch |
| S6 | `.env` không được validate lúc boot; thiếu biến → lỗi runtime mơ hồ | `config/databaseConfig.js` in cả env ra stdout | Deploy hỏng im lặng |
| S7 | `sameSite: "lax"` hardcode + `secure` phụ thuộc NODE_ENV, không cấu hình được | `authMiddleware.js` | Cross-site cookie fail khi FE/BE khác domain |
| S8 | `backend/src.zip` (220 KB) và `frontend/build.zip` (3.1 MB) bị **commit vào git** | `git ls-files` | Repo phình, snapshot code cũ lẫn lộn |

### P1 — Kiến trúc & maintainability

| # | Vấn đề | Bằng chứng |
|---|---|---|
| A1 | **Thiếu service layer**. Controller gọi thẳng model; business logic (tính `totalPages`, ghép AI prompt) nằm rải rác | `employerControllers.js:37-60`, `aiControllers.js` 649 dòng |
| A2 | **Model file khổng lồ**: `jobseekerModels.js` 1565 dòng / 68 query, `employerModels.js` 1512 dòng / 51 query | wc -l |
| A3 | Model vừa query vừa transform vừa business rule (`forEach` build object trong model) | `jobseekerModels.js:469-540` |
| A4 | Naming sai chính tả lan khắp codebase: `authencation*`, `CandidateMaganePage`, `craw` | routes, controllers, FE folder |
| A5 | Không có test nào chạy được (`npm test` = exit 1; FE chỉ có `App.test.js` mặc định) | package.json |
| A6 | Frontend **god components**: `yourCVwithUs.js` 1972 dòng, `MyPost/index.js` 1151, `Profile/index.js` 1016 | wc -l |
| A7 | Ba thư mục song song cùng mục đích: `component/`, `features/`, `shared/` — chưa migrate xong | tree |
| A8 | `App.js` import tĩnh **38 page** → 1 bundle duy nhất, không code splitting | `App.js` |
| A9 | Frontend không có TypeScript → contract FE↔BE chỉ tồn tại trong đầu | — |

### P2 — Performance

| # | Vấn đề | Bằng chứng |
|---|---|---|
| P1 | **N+1 write**: insert certification / language / skill trong `for` loop, mỗi vòng 1 round-trip | `employerModels.js:625,638,651,721,738,756,1069` |
| P2 | N+1 read khi build overview jobseeker | `jobseekerModels.js:653,661,673` |
| P3 | `SELECT *` 22 chỗ → kéo cả cột blob/text không dùng | grep |
| P4 | `connectionLimit: 10` cố định, không cấu hình theo env | `databaseConfig.js` |
| P5 | Frontend load `jquery` + `popper.js` + `bootstrap.min.js` + `font-awesome` **và** `bootstrap-icons` — 2 bộ icon, jQuery không dùng cho logic | `index.js`, `package.json` |
| P6 | CRA 5 (`react-scripts` 5.0.1) — build chậm, dep tree đã EOL | package.json |
| P7 | `redux-persist` persist cả `auth` vào localStorage; `blacklist` khai `'isLogin','user'` sai cấp (chúng nằm trong `auth`, không phải root) → **persist thừa** | `store.js:16` |

### P3 — Dev experience

| # | Vấn đề |
|---|---|
| D1 | Không có ESLint/Prettier config chung, không có pre-commit hook |
| D2 | Không có Docker Compose cho dev (backend có `.dockerignore` nhưng không Dockerfile) |
| D3 | Không có CI (GitHub Actions) |
| D4 | Comment tiếng Việt + Anh trộn, nhiều code chết bị comment out (`crawRoutes`, `redux/store`) |
| D5 | `frontend/test-date-fns.cjs` (0 byte) và `src/test-date-fns.js` — file rác |

---

## 3. Kiến trúc đích

### Backend

```
backend/src/
├── config/          env schema (zod) + db + s3 + cors + cookie
├── routes/          chỉ khai báo path + middleware chain
├── validators/      ← MỚI: zod schema mỗi endpoint
├── controllers/     ← MỎNG: parse req → gọi service → res.success
├── services/        ← MỚI: business logic, transaction boundary
├── repositories/    ← đổi tên từ models/, CHỈ chứa SQL
│   ├── jobseeker/   profile.repo.js, job.repo.js, notification.repo.js …
│   └── employer/    job.repo.js, candidate.repo.js, company.repo.js …
├── dto/             ← MỚI: mapper row → response shape
├── middlewares/
└── utils/
```

**Quy tắc 1 dòng cho mỗi layer:**

```
route       → "URL nào, ai được vào"        (không có logic)
validator   → "payload có hợp lệ không"      (không chạm DB)
controller  → "gọi service nào, trả gì"      (≤ 20 dòng)
service     → "nghiệp vụ + transaction"      (không viết SQL)
repository  → "1 hàm = 1 câu SQL"            (không có if nghiệp vụ)
dto         → "row DB → JSON cho FE"         (thuần hàm)
```

### Frontend

```
frontend/src/
├── app/             store, router, providers
├── features/        ← mỗi feature tự chứa
│   ├── auth/        api.ts  hooks/  components/  pages/
│   ├── jobseeker-profile/
│   ├── employer-jobs/
│   ├── job-search/
│   └── company/
├── shared/
│   ├── api/         baseQuery, tagTypes, error mapping
│   ├── components/  AppModal, FormField, AsyncState, ConfirmDialog…
│   ├── hooks/       useListQuery, useFormSection, usePagination
│   └── lib/         date, validate, format
└── types/           ← MỚI: contract dùng chung với BE
```

---

## 4. Roadmap 6 phase

> Mỗi phase = 1 PR series, deploy được, có rollback.

### Phase 1 — Stabilize & harden (tuần 1) ⬅ **đang làm**

Không đổi kiến trúc, chỉ vá lỗ và dọn nền.

**Backend**
- [ ] Thêm `helmet`, `express-rate-limit` (login/register/AI riêng), `compression`
- [ ] `config/env.js` — validate env bằng zod, fail-fast khi thiếu biến
- [ ] Sửa upload: limit 5 MB ảnh / 10 MB CV, whitelist mimetype, CV chuyển sang **private + presigned URL**
- [ ] Thay toàn bộ `console.*` bằng `logger`, tắt debug log ở production
- [ ] `config/cookieConfig.js` — gom option cookie, `sameSite`/`domain` theo env
- [ ] `connectionLimit` theo env
- [ ] Body size limit `express.json({ limit: '1mb' })`

**Frontend**
- [ ] `config/domain.js` → đọc `REACT_APP_API_URL` (giữ file cũ re-export để không vỡ import)
- [ ] Mọi API file dùng chung `baseQueryWithAuth` (bỏ bản copy)
- [ ] `React.lazy` + `Suspense` cho toàn bộ route → giảm bundle đầu
- [ ] Gỡ `jquery`, `popper.js`, `font-awesome` (giữ `bootstrap-icons`)
- [ ] Sửa `persistConfig` (whitelist `auth` thay vì blacklist sai cấp)
- [ ] Xoá file rác `test-date-fns.*`

**Repo**
- [ ] `git rm --cached backend/src.zip frontend/build.zip`, thêm vào `.gitignore`
- [ ] ESLint + Prettier + `.editorconfig` dùng chung

**Done khi**: build FE pass, backend boot pass, `npm run build` bundle giảm ≥ 30%, không còn `console.log` trong `backend/src`.

---

### Phase 2 — Validation + contract (tuần 2)

- [ ] Cài `zod`, tạo `validators/` cho **auth + jobseeker profile** trước (2 domain rủi ro nhất)
- [ ] Middleware `validate(schema, 'body'|'query'|'params')`
- [ ] Chuẩn hoá **error code enum** dùng chung FE/BE: `TOKEN_EXPIRED | TOKEN_INVALID | TOKEN_MISSING | AUTH_REQUIRED | REFRESH_TOKEN_INVALID | VALIDATION_FAILED | NOT_FOUND | FORBIDDEN`
- [ ] Response envelope thống nhất tuyệt đối: `{ success, message, data, errorCode? }`
- [ ] FE: `shared/api/errorCodes.js` + hàm `toUserMessage(error)`

**Done khi**: gửi payload rác vào `/api/auth/register` trả `400 VALIDATION_FAILED` với danh sách field lỗi, không crash.

---

### Phase 3 — Service layer + tách repository (tuần 3–4)

Làm **theo domain**, không làm ngang. Thứ tự: `auth` → `category` → `guest` → `employer` → `jobseeker` → `ai`.

Ví dụ cụ thể với domain `employer / job`:

```
TRƯỚC:
  employerRoutes.js
    → employerControllers.queryAddJobByUser  (parse + logic + gọi model)
      → employerModels.js (1512 dòng, insert job + 3 vòng for)

SAU:
  routes/employer/job.routes.js
    → validators/employer/job.schema.js
      → controllers/employer/job.controller.js   (12 dòng)
        → services/employer/job.service.js       (transaction, rule)
          → repositories/employer/job.repo.js    (createJob)
          → repositories/employer/jobRequirement.repo.js (bulkInsert)
```

- [ ] Chuyển `for` loop insert → **bulk insert 1 query** (P1)
- [ ] Bỏ `SELECT *` ở query hot path, chỉ select cột cần
- [ ] Transaction chuyển hết vào service, repository nhận `connection` optional

**Done khi**: `employerModels.js` và `jobseekerModels.js` biến mất; không file backend nào > 300 dòng.

---

### Phase 4 — Frontend: Vite + TypeScript (tuần 4–5)

Chạy **song song** Phase 3, không đụng backend.

1. [ ] Scaffold Vite, giữ nguyên `src/`. Đổi `REACT_APP_` → `VITE_`, `process.env` → `import.meta.env`
2. [ ] `allowJs: true`, `strict: false` — TypeScript bật nhưng **không ép** ngay
3. [ ] Viết `types/api.ts` từ contract Phase 2 trước, rồi convert theo thứ tự: `shared/` → `redux_toolkit/` → `features/`
4. [ ] Bật dần `strict` từng thư mục qua `tsconfig` project references
5. [ ] Vitest + React Testing Library thay `react-scripts test`

**Done khi**: `vite build` pass, dev server HMR < 200 ms, `shared/` + API layer đã 100% `.ts`.

---

### Phase 5 — Bóc god component (tuần 5–7)

Thứ tự theo rủi ro giảm dần:

| File | Dòng | Tách thành |
|---|---:|---|
| `yourCVwithUs.js` | 1972 | 7 section component + `useProfileSection` hook + 1 page |
| `EmployerPage/MyPost/index.js` | 1151 | `JobListTable`, `JobFormModal`, `useJobForm`, page |
| `JobSeekersPage/Profile/index.js` | 1016 | layout + `ProfileCompletion` + tab router |
| `companyProfile.js` | 783 | `CompanyInfoForm`, `BenefitSection`, `LocationSection` |
| `WorkManagePage/*` | 1427 | `JobFilterPanel`, `JobList`, `JobDetailPanel`, `useJobSearch` |

Hook dùng chung cần tạo trước: `useListQuery` (paging + filter + URL sync), `useFormSection` (state + validate + submit + toast), `useConfirmDelete`.

**Done khi**: không component nào > 250 dòng; `features/` chứa toàn bộ page; `component/` chỉ còn re-export tạm.

---

### Phase 6 — Quality gate & ops (tuần 7–8)

- [ ] Vitest (FE) + Jest/Supertest (BE) — mục tiêu: cover 100% happy path của auth + job apply + AI fit
- [ ] GitHub Actions: lint → typecheck → test → build
- [ ] Husky + lint-staged
- [ ] `docker-compose.dev.yml`: mysql + backend + frontend
- [ ] `/health` + `/ready` endpoint, structured JSON log ở production
- [ ] Index review cho các cột filter nóng (`job.job_function_id`, `job.work_location`, `logs_*.job_id`)

---

## 5. Rủi ro & cách chặn

| Rủi ro | Chặn bằng |
|---|---|
| Đổi tên `authencation*` làm vỡ import | Đổi tên ở **Phase 3**, kèm file re-export cũ 1 sprint rồi mới xoá |
| Vite migration làm vỡ CSS import order (bootstrap) | Migrate trên branch riêng, so sánh screenshot 10 page chính |
| CV chuyển sang private làm vỡ link CV cũ | Viết script backfill + fallback: URL cũ vẫn đọc được 30 ngày |
| Bulk insert đổi thứ tự record | Test so sánh output trước/sau trên DB copy |
| Working tree hiện có ~30 file uncommitted (cả Java) | Commit theo scope, không `git add -A` |

---

## 6. Chỉ cần nhớ 5 bước

1. **Vá bảo mật + dọn rác trước** (helmet, upload, log, zip trong git) — 1 tuần, không rủi ro.
2. **Chốt contract** (zod validate + error code enum) — mọi thứ sau đó dựa vào đây.
3. **Bổ backend theo domain**: route → validator → controller mỏng → service → repository.
4. **FE đổi nền (Vite + TS) trước, bóc component sau** — đổi nền khi file còn to thì merge conflict chết người.
5. **Khoá lại bằng test + CI**, nếu không 3 tháng nữa quay về chỗ cũ.

---

## Phụ lục A — Bảng ưu tiên nhanh

```
       Impact
         ▲
   cao   │  S1 S2 S3        A1 A2 A6        P6
         │  S5 S8           A8 A9           P1
         │
   TB    │  S4 S6 S7        A4 A7           P3 P5 P7
         │
   thấp  │  D1 D4 D5        A5              P4
         └────────────────────────────────────────► Effort
            thấp            TB              cao
```

Làm hết cột "effort thấp / impact cao" (S1–S8, A8, P5, P7) trong Phase 1.

---

## Phụ lục B — Trạng thái Phase 1 (2026-08-21)

### Đã làm

**Backend**

| File | Thay đổi |
|---|---|
| `src/config/env.js` | MỚI — validate env lúc boot, fail-fast |
| `src/config/cookieConfig.js` | MỚI — gom option cookie (trước lặp ở 8 chỗ) |
| `src/config/security.js` | MỚI — helmet, compression, 3 tầng rate limit |
| `src/config/corsConfig.js` | nhiều origin qua `CORS_ORIGINS`, chặn origin lạ |
| `src/config/databaseConfig.js` | bỏ log env ra stdout, pool cấu hình được, `pingDatabase`/`closeDatabase` |
| `src/middlewares/imageUpload.js` | `uploadImage` 5MB / `uploadCv` 10MB, lọc mimetype + extension, `getSignedFileUrl` |
| `src/middlewares/authMiddleware.js` | dùng `cookieConfig` + `env`, bỏ log, gọn 40% |
| `index.js` | thứ tự middleware rõ ràng, body limit, `/health` + `/ready`, graceful shutdown |
| `src/**/*.js` (16 file) | thay toàn bộ `console.*` bằng winston logger |
| `src/routes/*` | gắn `authLimiter` / `aiLimiter`, đổi sang `uploadImage`/`uploadCv` |
| `.env.example` | MỚI |

**Frontend**

| File | Thay đổi |
|---|---|
| `src/config/domain.js` | đọc `REACT_APP_API_URL` thay vì hardcode |
| `src/App.js` | 38 page → `React.lazy` + `Suspense` |
| `src/index.js` | gỡ `jquery` + `popper.js`, dùng `bootstrap.bundle` |
| `src/redux_toolkit/store.js` | `whitelist: ["auth"]` (blacklist cũ khai sai cấp nên vô tác dụng) |
| `guestApi.js`, `CategoryApi.js` | dùng chung `baseQuery` |
| `.env.development`, `.env.production.example` | MỚI |

**Repo**: `.gitignore` bỏ qua `*.zip`, `docs/thinking/`, `_to_delete/`; gỡ `src.zip` + `build.zip`.

### Cần chạy trước khi deploy

```bash
cd backend  && npm install     # helmet, compression, express-rate-limit, cross-env
cd frontend && npm install
```

Hoặc chạy `scripts/commit-phase1.sh` (đã gồm install + build + commit + push).

### Lưu ý phát hiện thêm

1. **`backend/.env` local đang đặt `NODE_ENV=production`** → `COOKIE_SECURE` bật, cookie không set được trên `http://localhost`. Đổi thành `development` khi dev local. (Hành vi này giống code cũ, không phải hồi quy mới.)
2. **`font-awesome` chưa gỡ được** — còn 18 chỗ dùng class `fa fa-*` ở 5 file. Chuyển sang `bootstrap-icons` ở Phase 5 khi có so sánh screenshot.
3. **Line ending trong repo đang lẫn CRLF/LF.** Nên thêm `.gitattributes` (`* text=auto eol=lf`) và renormalize trong một commit riêng, không trộn với commit logic.
4. **`console.*` phía frontend chưa dọn** — Vite ở Phase 4 xử lý miễn phí bằng `esbuild.drop: ['console']`, không cần sweep thủ công.
5. **Git không ghi được index qua remote mount** (lock file không unlink được) → mọi thao tác `git add/commit/push` phải chạy ở máy local.

### Phase 1C — việc còn lại của mảng CV private

- [ ] `getResume` trả presigned URL khi có `s3_key`
- [ ] `employerModels.js:219` select thêm `s3_key`, presign khi trả về employer
- [ ] Script backfill ACL cho object CV cũ trên S3
- [ ] Bật `S3_CV_PRIVATE=true`
