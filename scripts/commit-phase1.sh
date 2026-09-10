#!/usr/bin/env bash
# Chạy trên máy Windows (Git Bash / WSL) tại thư mục gốc repo.
# Git không ghi được index qua remote mount nên phần commit phải chạy ở local.
set -e
cd "$(dirname "$0")/.."

echo "==> Cài dependency mới"
( cd backend  && npm install )
( cd frontend && npm install )

echo "==> Kiểm tra backend boot"
( cd backend && node --input-type=module -e "await import('./src/config/env.js'); console.log('env OK')" )

echo "==> Kiểm tra frontend build"
( cd frontend && npm run build )

echo "==> Commit 1: backend"
git add backend/index.js backend/package.json backend/package-lock.json backend/.env.example backend/src
git rm --cached -q backend/src.zip || true
git commit -F - <<'MSG'
refactor(backend): security hardening, centralized config, structured logging

Phase 1A của kế hoạch refactor. Không đổi kiến trúc, chỉ vá lỗ và dọn nền.

Security
- Thêm helmet, compression, trust proxy qua src/config/security.js
- Rate limit 3 mức: global (/api), auth (login/register/refresh), AI (endpoint tốn phí)
- Giới hạn body request theo BODY_LIMIT (mặc định 1mb)
- Upload: tách uploadImage (5MB) và uploadCv (10MB) thay cho giới hạn 250MB
  dùng chung; lọc cả mimetype lẫn extension
- Hạ tầng cho CV private + presigned URL (getSignedFileUrl), bật bằng cờ S3_CV_PRIVATE

Config
- src/config/env.js: validate biến môi trường lúc boot, fail-fast kèm thông báo rõ
- src/config/cookieConfig.js: gom option cookie vốn bị lặp ở 8 chỗ
- corsConfig hỗ trợ nhiều origin qua CORS_ORIGINS và chặn origin lạ
- databaseConfig: bỏ log biến môi trường ra stdout, pool size cấu hình được,
  thêm pingDatabase/closeDatabase
- Bổ sung backend/.env.example

Observability và vận hành
- Thay toàn bộ console.* trong src/ bằng winston logger
- Thêm /health và /ready (đặt trước rate limit để probe không bị chặn)
- Graceful shutdown: đóng HTTP server rồi đóng MySQL pool

Dọn dẹp
- Gỡ aws-sdk v2 (EOL, đã có @aws-sdk/* v3)
- Bỏ backend/src.zip khỏi git
MSG

echo "==> Commit 2: frontend + tài liệu"
git add .gitignore CLAUDE.md docs/refactor/REFACTOR_PLAN.md docs/refactor/HANDOFF.md scripts/commit-phase1.sh \
  frontend/package.json frontend/package-lock.json \
  frontend/.env.development frontend/.env.production.example \
  frontend/src/App.js frontend/src/index.js frontend/src/config/domain.js \
  frontend/src/redux_toolkit/store.js frontend/src/redux_toolkit/guestApi.js \
  frontend/src/redux_toolkit/CategoryApi.js
git rm --cached -q frontend/build.zip || true
git commit -F - <<'MSG'
refactor(frontend): env-driven API URL, route code splitting, dọn dependency

Phase 1B của kế hoạch refactor.

Cấu hình
- config/domain.js đọc REACT_APP_API_URL thay vì hardcode localhost:4000
- Thêm .env.development và .env.production.example

Hiệu năng
- App.js: toàn bộ 38 page chuyển sang React.lazy + Suspense.
  Bundle đầu chỉ còn shell (Header/Footer/router/store) thay vì cả app.
- Gỡ jquery và popper.js (không còn chỗ nào dùng), thay bằng bootstrap.bundle
- store.js: persistConfig dùng whitelist ["auth"]. blacklist cũ khai
  'isLogin','user' ở cấp root trong khi hai key này nằm trong slice auth,
  nên RTK Query cache vẫn bị ghi vào localStorage.

API layer
- guestApi và CategoryApi dùng chung baseQuery từ baseQueryWithAuth
  thay vì tự tạo fetchBaseQuery riêng

Tài liệu
- docs/refactor/REFACTOR_PLAN.md: audit đầy đủ và lộ trình 6 phase
- docs/refactor/HANDOFF.md: bàn giao trạng thái sang Claude Code
- CLAUDE.md: quy ước thường trực cho Claude Code
- .gitignore: bỏ qua *.zip, docs/thinking/, _to_delete/
- Bỏ frontend/build.zip khỏi git
MSG

echo "==> Push"
git push origin main
echo "Xong."
