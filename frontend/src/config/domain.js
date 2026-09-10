/**
 * Base URL của API. KHÔNG hardcode - đổi môi trường = đổi .env, không sửa code.
 *
 *   frontend/.env.development  -> REACT_APP_API_URL=http://localhost:4000
 *   frontend/.env.production   -> REACT_APP_API_URL=https://boostcareer.site
 *
 * (Sau khi migrate Vite ở Phase 4: đổi sang import.meta.env.VITE_API_URL)
 */
const domain = (process.env.REACT_APP_API_URL || "http://localhost:4000").replace(/\/+$/, "");

export default domain;
