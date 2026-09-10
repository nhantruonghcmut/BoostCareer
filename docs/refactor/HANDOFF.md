# HANDOFF — Chuyển tiếp từ session Cowork sang Claude Code

> **Đọc file này đầu tiên.** Nó chứa toàn bộ context của phiên làm việc ngày 2026-08-21
> (Claude Opus 5, môi trường Chat & Cowork) mà session Claude Code mới cần để làm tiếp
> mà không phải quét lại repo.
>
> - Kế hoạch chi tiết: `docs/refactor/REFACTOR_PLAN.md`
> - Dòng suy nghĩ khi quét: `docs/thinking/2026-08-21-refactor-scan.html` (không push lên remote)
> - Quy ước thường trực: `CLAUDE.md` ở thư mục gốc

---

## 1. TL;DR — 30 giây

| | |
|---|---|
| **Đã làm** | Quét toàn bộ `backend/` + `frontend/`, viết plan 6 phase, **code xong Phase 1** (security hardening + config + code splitting) |
| **Đang dở** | Phase 1 mới nằm trên đĩa. **Chưa `npm install`, chưa commit, chưa push.** |
| **Việc đầu tiên** | Chạy `bash scripts/commit-phase1.sh` (install → build → 2 commit → push) |
| **Git HEAD** | `221d044 initial Java Springboot backend` — chưa có commit nào của phiên refactor |
| **Ngoài scope** | `JavaBoostCareer/` (Spring Boot) — không refactor, nhưng working tree đang có ~18 file Java sửa dở của bạn |

---

## 2. Vì sao chuyển sang Claude Code

Session cũ chạy trong cloud container, thao tác file qua remote mount tới máy Windows.
Mount đó **không unlink được file**, nên mọi lệnh ghi của git (`add`, `commit`, `reset`)
để lại `.git/index.lock` và làm hỏng index (`fatal: index file corrupt` — xảy ra 2 lần,
đã khôi phục nguyên trạng, không mất dữ liệu).

Claude Code chạy trực tiếp trên máy bạn nên **vấn đề này biến mất hoàn toàn**.
Đó là lý do chính nên chuyển.

Hệ quả kèm theo cần biết:

- `device_commit_files` của session cũ **cắt cụt file đang tồn tại** về đúng độ dài cũ.
  Vài file đã bị hỏng theo cách này và đã được viết lại bằng heredoc. Ở Claude Code
  không còn cơ chế này, ghi file bình thường.
- Bộ nhớ (memory) của Cowork **không đi theo** sang Claude Code. Nội dung đáng giữ đã
  được chép vào `CLAUDE.md` và file này.

---

## 3. Quyết định đã chốt (đừng hỏi lại)

Ba câu hỏi đã được xác nhận ngày 2026-08-21:

| Câu hỏi | Quyết định |
|---|---|
| Node backend còn sống hay bị thay bởi Spring Boot? | **Còn là production** → refactor đầy đủ |
| Frontend hiện đại hoá tới đâu? | **Vite + TypeScript** (migrate dần, không big-bang) |
| Làm gì trước? | Viết plan **và** làm luôn Phase 1 |

Hai nguyên tắc rút ra từ đó, áp dụng cho mọi phase sau:

1. **Kiến trúc đích của Node backend cố ý bám khuôn Spring Boot** trong `AGENTS.md`
   (`validator → controller → service → repository → dto`). Lý do: khi một domain
   được port sang Java, đó là port 1-1 chứ không phải viết lại. Refactor Node
   *chính là* dọn đường cho migration Java.
2. **Việc đổi "hình dạng" đi trước việc đổi "số lượng file".**
   Chốt contract trước khi tách service; migrate Vite+TS trước khi bóc god component.
   Làm ngược lại thì phải sờ vào cùng một đoạn code hai lần.

---

## 4. Kết quả quét — những gì đã tìm thấy

Chi tiết đầy đủ ở `docs/refactor/REFACTOR_PLAN.md` mục 2. Đây là bản rút gọn.

### Kiến trúc

Backend thiếu **đúng 2 mắt xích**: không có `validator` trước controller, không có
`service` giữa controller và model. Business logic vì thế chui xuống model:

```
jobseekerModels.js   1565 dòng / 68 query
employerModels.js    1512 dòng / 51 query
```

Frontend có god component tương tự:

```
yourCVwithUs.js           1972 dòng
EmployerPage/MyPost       1151 dòng
JobSeekersPage/Profile    1016 dòng
```

### Những gì đã TỐT (đừng đập)

- **0 chỗ** nội suy chuỗi vào SQL — prepared statement dùng đúng khắp nơi
- Transaction đúng pattern ở `register` và `add job`
- `responseHandler` (`res.success` / `res.error`) + `errorConverter` + `ApiError` + winston
- `baseQueryWithAuth.js` đã gom refresh + forceLogout gọn gàng

### Rủi ro nghiêm trọng nhất

Không phải SQL injection, mà là **upload** — `middlewares/imageUpload.js`:

```js
limits: { fileSize: 250 * 1024 * 1024 },  // comment ghi "Giới hạn 5MB"
storage: multer.memoryStorage()            // 250MB nạp thẳng vào RAM
ACL: "public-read"                         // áp cho CẢ CV ứng viên (chứa PII)
```

Comment nói 5MB nên mọi lần review trước đều lướt qua. Bài học: đọc code, đừng đọc comment.

---

## 5. Phase 1 — ĐÃ CODE XONG (chưa commit)

### Backend

| File | Trạng thái | Nội dung |
|---|---|---|
| `src/config/env.js` | **MỚI** | Validate env lúc boot, fail-fast kèm danh sách biến thiếu |
| `src/config/cookieConfig.js` | **MỚI** | Gom option cookie vốn lặp ở 8 chỗ |
| `src/config/security.js` | **MỚI** | helmet, compression, trust proxy, 3 tầng rate limit |
| `src/config/corsConfig.js` | sửa | Nhiều origin qua `CORS_ORIGINS`, chặn origin lạ |
| `src/config/databaseConfig.js` | sửa | Bỏ log env ra stdout, pool cấu hình được, `pingDatabase`/`closeDatabase` |
| `src/middlewares/imageUpload.js` | sửa | `uploadImage` 5MB / `uploadCv` 10MB, lọc mimetype **và** extension, `getSignedFileUrl` |
| `src/middlewares/authMiddleware.js` | sửa | Dùng `cookieConfig` + `env`, bỏ log, gọn 40% |
| `index.js` | sửa | Thứ tự middleware rõ ràng, body limit, `/health` + `/ready`, graceful shutdown |
| `src/**/*.js` (16 file) | sửa | Thay toàn bộ `console.*` bằng winston logger — hiện còn **0** |
| `src/routes/*.js` (4 file) | sửa | Gắn `authLimiter` / `aiLimiter`, đổi sang `uploadImage`/`uploadCv` |
| `src/controllers/authencationControllers.js` | sửa | Cookie qua `cookieConfig`, secret qua `env` |
| `.env.example` | **MỚI** | Đầy đủ biến, có ghi chú |
| `package.json` | sửa | +helmet +compression +express-rate-limit +cross-env, −aws-sdk v2 |

Rate limit chia 3 tầng:

```
globalLimiter  →  /api        300 req / 15 phút
authLimiter    →  login, register, refresh    20 / 15 phút (skip request thành công)
aiLimiter      →  /analyze, /score-matching   10 / phút   (mỗi request tốn tiền thật)
```

### Frontend

| File | Trạng thái | Nội dung |
|---|---|---|
| `src/config/domain.js` | sửa | Đọc `REACT_APP_API_URL` thay vì hardcode `localhost:4000` |
| `src/App.js` | sửa | 38 page → `React.lazy` + `Suspense` + fallback spinner |
| `src/index.js` | sửa | Gỡ `jquery` + `popper.js`, dùng `bootstrap.bundle` |
| `src/redux_toolkit/store.js` | sửa | `whitelist: ["auth"]` |
| `guestApi.js`, `CategoryApi.js` | sửa | Dùng chung `baseQuery` thay vì tự tạo `fetchBaseQuery` |
| `.env.development`, `.env.production.example` | **MỚI** | |
| `package.json` | sửa | −jquery −popper.js |

**Bug thật đã sửa trong `store.js`:** `persistConfig.blacklist` khai `'isLogin'` và
`'user'` ở cấp root, trong khi hai key đó nằm *trong* slice `auth`. Blacklist vì vậy
vô tác dụng và RTK Query cache vẫn bị ghi vào localStorage mỗi lần reload.

### Repo

- `.gitignore`: thêm `**/*.zip`, `docs/thinking/`, `**/_to_delete/`
- `backend/src.zip` (220 KB) và `frontend/build.zip` (3.1 MB) đã `git rm --cached`
- `frontend/src/test-date-fns.js` + `frontend/test-date-fns.cjs` (file rác) → `frontend/_to_delete/`
- `scripts/commit-phase1.sh`: **MỚI** — install + build + 2 commit + push

### Đã verify

```
backend  : node --check trên toàn bộ 39 file ESM → 0 lỗi
           env.js load được .env thật, in ra config đúng
           corsConfig chặn đúng origin lạ, cho qua localhost:3000
           cookieConfig sinh option nhất quán
frontend : @babel/parser (sourceType module + plugin jsx) trên 6 file đã sửa → 0 lỗi
           App.js parse OK qua esbuild
```

**Chưa verify:** `npm run build` của frontend và boot thật của backend — vì môi trường cũ
không cài được package (mount không có mạng). Đó là việc đầu tiên của session Code.

---

## 6. VIỆC TIẾP THEO — làm theo đúng thứ tự

### Bước 1. Chạy Phase 1 cho xong

```bash
cd E:\Git\BoostCareer\BoostCareer
bash scripts/commit-phase1.sh
```

Script làm: `npm install` cả hai bên → kiểm tra `env.js` load được → `npm run build`
frontend → commit 1 (backend) → commit 2 (frontend + docs) → `git push origin main`.

Nếu muốn kiểm soát từng bước thì mở file ra chạy tay, phần commit nằm ở cuối.

**Kiểm tra sau khi push:**

```bash
cd backend && npm run dev
curl http://localhost:4000/health   # {"status":"ok",...}
curl http://localhost:4000/ready    # {"status":"ready","database":"up"}
```

Rồi bấm login sai mật khẩu 21 lần liên tiếp → phải nhận `429 RATE_LIMITED`.

### Bước 2. Phase 1C — hoàn tất bảo mật CV

Hiện `S3_CV_PRIVATE=false`. Bật ngay sẽ làm employer **không mở được CV mới**, vì
read-path bên employer chưa presign. Bốn việc để bật an toàn:

1. `getResume` trong `jobseekerControllers.js` → trả presigned URL khi có `s3_key`
2. `employerModels.js:219` → subquery select thêm `s3_key`, presign khi trả về
3. Script backfill: đổi ACL các object CV cũ trên S3 sang private
4. Đặt `S3_CV_PRIVATE=true` trong `.env` production

### Bước 3. Phase 2 trở đi

Xem `docs/refactor/REFACTOR_PLAN.md` mục 4. Tóm tắt:

```
Phase 2  Validation + contract  (zod, error code enum dùng chung FE/BE)
Phase 3  Service layer + tách repository  (theo domain: auth → category → guest
                                           → employer → jobseeker → ai)
Phase 4  Frontend Vite + TypeScript       (chạy song song Phase 3)
Phase 5  Bóc god component
Phase 6  Test + CI + Docker Compose + health/index review
```

---

## 7. Cạm bẫy trong repo này — đọc trước khi sửa

### 7.1. Line ending lẫn lộn CRLF/LF

Repo đang lẫn. File nào trong git là CRLF mà bạn ghi lại bằng LF thì **cả file thành diff**.

Phiên trước đã dính đúng lỗi này: một script Python đọc bằng universal-newline rồi ghi
lại LF, làm 41 file nở ra diff giả (`aiControllers.js` 1157 dòng thay đổi cho file 649 dòng).
Đã sửa bằng cách convert ngược về CRLF cho file trong scope và revert 90 file ngoài scope.

**Cách xử lý đúng:** thêm `.gitattributes` (`* text=auto eol=lf`) rồi renormalize toàn repo
trong **một commit riêng**, không trộn với commit logic.

### 7.2. `backend/.env` đang để `NODE_ENV=production`

Kể cả khi dev local. Hệ quả: `COOKIE_SECURE=true` → cookie không set được trên
`http://localhost`. Code cũ cũng vậy nên **không phải hồi quy mới**, nhưng khi dev
nhớ đổi sang `development`.

### 7.3. `font-awesome` chưa gỡ được

Còn 18 chỗ dùng class `fa fa-*` ở 5 file:

```
component/HomePage/WorkManagePage/workDetail.js   (14 chỗ)
component/JobSeekersPage/Profile/index.js
component/JobSeekersPage/Profile/yourCV.js
component/_component/footer.js
component/_component/ui/NotificationHeader.js
```

Đã thử gỡ rồi phải khôi phục. Chuyển sang `bootstrap-icons` ở Phase 5, khi có so sánh
screenshot trước/sau.

### 7.4. `console.*` phía frontend

Chưa dọn (~30 file). **Đừng sweep tay** — Vite ở Phase 4 xử lý miễn phí bằng
`esbuild: { drop: ['console'] }`.

### 7.5. Working tree đang bẩn

Ngoài thay đổi của Phase 1, working tree còn chứa việc dở của bạn từ trước:

```
~18 file JavaBoostCareer/  (entity, exception, pom.xml, application.yaml)
 4 file Database/*.sql     (đã xoá)
 README.md, backend/.dockerignore, backend/scripts/encryptPasswords.js
~40 file frontend/src/     (đa số chỉ là đổi line ending sang LF)
```

`scripts/commit-phase1.sh` **cố ý stage từng đường dẫn cụ thể**, không dùng `git add -A`,
để không nuốt nhầm phần Java. Giữ nguyên cách đó.

Một chi tiết nữa: `JavaBoostCareer/.../UnauthorizedException.java` từng được bạn stage
sẵn dưới dạng rename (`RM`). Việc khôi phục index đã làm mất trạng thái stage đó —
file trên đĩa vẫn nguyên, chỉ cần `git add` lại khi bạn commit phần Java.

---

## 8. Quy ước làm việc (chuyển từ project instruction cũ)

1. Vai trò: **Senior expert Developer**. Ưu tiên: scalable, maintainable, smooth,
   modern, secure, high performance.
2. Mỗi bước tư duy đáng kể → ghi lại thành **file HTML** trong `docs/thinking/`,
   viết sao cho người *và* agent khác đọc là nối tiếp được.
   Thư mục này đã nằm trong `.gitignore` — **không push**.
3. Commit và push lên `github.com/nhantruonghcmut/BoostCareer`,
   **không ký tên AI collaboration** trong commit message.
4. Khi giải thích kỹ thuật (code, database, framework):
   - Mở đầu bằng vài quy tắc cốt lõi ngắn gọn
   - Ví dụ cụ thể với 2-3 thứ thực tế, không trừu tượng
   - Vẽ sơ đồ ASCII nếu có quan hệ giữa các thành phần
   - Đi từ đơn giản → phức tạp, không liệt kê hết mọi trường hợp ngay
   - Kết bằng "chỉ cần nhớ N bước/quy tắc"
   - Tránh bảng và bullet lồng nhau quá nhiều
   - Chi tiết đầy đủ: `.cursor/skills/senior-mentor/SKILL.md`

---

## 9. Bản đồ file cần biết

```
BoostCareer/
├── CLAUDE.md                       ← quy ước thường trực, Claude Code nạp mỗi session
├── AGENTS.md                       ← 80KB, kiến trúc đích Spring Boot. Đọc khi làm Java
├── README.md                       ← mô tả sản phẩm (đồ án tốt nghiệp)
├── .cursor/skills/senior-mentor/   ← phong cách giải thích
├── docs/
│   ├── refactor/
│   │   ├── REFACTOR_PLAN.md        ← plan 6 phase, audit đầy đủ, bảng Impact × Effort
│   │   └── HANDOFF.md              ← file này
│   ├── thinking/                   ← dòng suy nghĩ (gitignored)
│   ├── frontend-refactor-plan.md   ← plan cũ 2026-05-30, vẫn còn giá trị tham chiếu
│   └── ai-provider-cache.md
├── scripts/commit-phase1.sh        ← chạy đầu tiên
├── backend/                        ← Express + MySQL, TRONG scope
├── frontend/                       ← React CRA, TRONG scope
├── JavaBoostCareer/                ← Spring Boot, NGOÀI scope refactor
└── Database/                       ← 45 file dump SQL
```

---

## 10. Câu lệnh mở đầu gợi ý cho session Claude Code

```
Đọc docs/refactor/HANDOFF.md và docs/refactor/REFACTOR_PLAN.md.
Phase 1 đã code xong nhưng chưa install/commit. Chạy scripts/commit-phase1.sh,
báo lại kết quả build, rồi ta bắt đầu Phase 1C.
```
