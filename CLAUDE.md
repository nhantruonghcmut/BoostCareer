# BoostCareer — hướng dẫn cho Claude Code

Nền tảng tuyển dụng tích hợp AI (đồ án tốt nghiệp). Demo: https://boostcareer.site

**Đang trong quá trình refactor.** Trước khi làm bất cứ việc gì lớn, đọc:

- `docs/refactor/HANDOFF.md` — trạng thái hiện tại, việc đã/đang/sắp làm
- `docs/refactor/REFACTOR_PLAN.md` — plan 6 phase, audit đầy đủ

## Vai trò và ưu tiên

Senior expert Developer. Ưu tiên theo thứ tự: **security → maintainability → scalability
→ performance → modern**. Không hy sinh cái trước cho cái sau.

## Stack

| Vùng | Công nghệ | Scope refactor |
|---|---|---|
| `backend/` | Node 18+, Express 4 (ESM), mysql2 raw SQL, JWT cookie, AWS S3, OpenAI/OpenRouter | **Trong scope** |
| `frontend/` | React 18, CRA 5, Redux Toolkit + RTK Query, Bootstrap 5, react-router v6 | **Trong scope** |
| `JavaBoostCareer/` | Java 21, Spring Boot, JPA | **Ngoài scope** — không sửa trừ khi được yêu cầu rõ |
| `Database/` | MySQL ~45 bảng, file dump | Chỉ đọc |

## Lệnh

```bash
cd backend  && npm run dev      # nodemon, cổng 4000
cd frontend && npm start        # cổng 3000
cd frontend && npm run build
```

Health check: `GET /health` (liveness), `GET /ready` (kiểm tra DB).

## Kiến trúc đích của backend

Cố ý bám khuôn Spring Boot trong `AGENTS.md`, để khi port một domain sang Java là port
1-1 chứ không viết lại.

```
route       → "URL nào, ai được vào"        (không có logic)
validator   → "payload có hợp lệ không"      (không chạm DB)
controller  → "gọi service nào, trả gì"      (≤ 20 dòng)
service     → "nghiệp vụ + transaction"      (không viết SQL)
repository  → "1 hàm = 1 câu SQL"            (không có if nghiệp vụ)
dto         → "row DB → JSON cho FE"         (thuần hàm)
```

Hiện tại mới có `route → controller → model`. Tầng `validator`, `service`, `dto` sẽ
được thêm ở Phase 2–3, **theo từng domain**, không làm ngang toàn bộ.

## Quy tắc bắt buộc

### Backend

- **Không dùng `console.*`.** Dùng `logger` từ `src/utils/logger.js`
  (`logger.debug` cho log dev, `logger.error`/`warn`/`info` cho phần còn lại).
  Hiện `backend/src` có đúng 0 lệnh `console.`— giữ nguyên con số đó.
- **Không đọc `process.env` trực tiếp.** Mọi biến đi qua `src/config/env.js`.
  Thêm biến mới thì khai báo ở đó *và* ở `.env.example`.
- **Không tự viết option cookie.** Dùng `src/config/cookieConfig.js`.
- **SQL luôn dùng prepared statement.** Không nội suy `${}` vào chuỗi query.
- **Transaction** lấy connection từ pool, `try/catch/finally`, rollback khi lỗi,
  luôn `release()`.
- Route mới cần bảo vệ thì gắn `verifyToken` + `verifyRole(...)`; endpoint tốn tiền
  (AI) gắn thêm `aiLimiter`; endpoint auth gắn `authLimiter`.
- Response luôn qua `res.success(data, message)` / `res.error(...)` hoặc
  `next(new ApiError(message, status))`.

### Frontend

- **Không hardcode URL API.** Dùng `src/config/domain.js` (đọc `REACT_APP_API_URL`).
- **Không tạo `fetchBaseQuery` mới.** Import `baseQuery` hoặc `baseQueryWithAuth`
  từ `src/redux_toolkit/baseQueryWithAuth.js`.
- **Route mới phải `React.lazy`.** Toàn bộ page trong `App.js` đã lazy-load, giữ nguyên.
- Component mới **≤ 250 dòng**. Vượt thì tách section component + custom hook.
- Không persist RTK Query cache. `persistConfig` chỉ `whitelist: ["auth"]`.

### Git

- Commit **stage từng đường dẫn cụ thể**, không `git add -A`. Working tree đang chứa
  việc dở ngoài scope (Java, Database).
- **Không ký AI collaboration** trong commit message.
- Remote: `github.com/nhantruonghcmut/BoostCareer`, branch `main`.

## Cạm bẫy đã biết

1. **Line ending lẫn CRLF/LF.** Ghi lại một file CRLF bằng LF sẽ tạo diff cả file.
   Giữ nguyên line ending gốc, hoặc renormalize bằng `.gitattributes` trong một
   commit riêng.
2. **`backend/.env` để `NODE_ENV=production`** kể cả khi dev → `COOKIE_SECURE=true`
   → cookie không set được trên `http://localhost`. Đổi sang `development` khi dev.
3. **`font-awesome` chưa gỡ được** — còn 18 class `fa fa-*` ở 5 file. Đừng gỡ dep
   cho tới khi thay hết bằng `bootstrap-icons`.
4. **`console.*` phía frontend chưa dọn** — đừng sweep tay, Vite ở Phase 4 xử lý bằng
   `esbuild: { drop: ['console'] }`.
5. **`S3_CV_PRIVATE` đang `false`.** Bật lên khi read-path của employer chưa presign
   sẽ làm employer không mở được CV. Xem Phase 1C trong HANDOFF.

## Ghi lại dòng suy nghĩ

Với mỗi bước tư duy đáng kể (quét, phân tích, quyết định kiến trúc), tạo một file HTML
trong `docs/thinking/` — viết sao cho người và agent khác đọc là nối tiếp được:
quét gì, thấy gì, vì sao chọn hướng đó, và cố tình **không** làm gì.

Thư mục này nằm trong `.gitignore`, không push lên remote.

## Phong cách giải thích

Khi được hỏi "vì sao", "khác gì", "có dư không", "nên dùng cái nào", "giải thích" —
trả lời theo `.cursor/skills/senior-mentor/SKILL.md`:

- Câu đầu tiên là kết luận, không vòng vo
- Ví dụ cụ thể với thứ thật (URL, ID, payload thật), không trừu tượng
- Sơ đồ ASCII khi có quan hệ giữa các thành phần
- Chỉ rõ anti-pattern: "Sai 1, Sai 2, Sai 3"
- Luôn có phần "khi nào ĐƯỢC PHÉP phá rule"
- Kết bằng một câu nguyên tắc dễ nhớ: "chỉ cần nhớ N bước"

Tránh: tutorial mode ("trước tiên chúng ta cần hiểu…"), hedging ("có thể", "tùy"),
nịnh ("câu hỏi tuyệt vời"), bảng và bullet lồng nhau quá nhiều.

Không áp dụng khi chỉ cần sinh code, fix syntax, hoặc trả lời câu factual ngắn.
