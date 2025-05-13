import React, { useState, useEffect } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from '../../redux_toolkit/AuthSlice';
import { validateField } from "../../utils/validateField";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [dataLogin, setDataLogin] = useState({
    username: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    username: "",
    password: "",
  });


  const { isLogin, loading } = useSelector((state) => state.auth);

  const [formValid, setFormValid] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDataLogin((prev) => ({ ...prev, [name]: value }));
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const error = validateField(name, value); // Validate each field
    setErrors((prev) => ({ ...prev, [name]: error })); // Update error state
  };

  const submitLogin = async (e) => {
    e.preventDefault();

    let newErrors = {};
    let hasError = false;

    // Validate both username and password
    Object.keys(dataLogin).forEach((key) => {
      const error = validateField(key, dataLogin[key]);
      if (error) {
        hasError = true;
      }
      newErrors[key] = error;
    });

    setErrors(newErrors);

    if (hasError) {
      return; // Prevent submission if there are validation errors
    }
    
    try {
      const result = await dispatch(loginUser(dataLogin)).unwrap();
      if (result.success) {
        navigate("/"); // Redirect to home page on success
      }
    } catch (error) {
      // Error handling already done in the thunk
      console.error("Login failed:", error);
    }
  };

  useEffect(() => {
    // Nếu người dùng đã đăng nhập và đang cố truy cập trang đăng nhập
    // thì chuyển hướng họ đến trang chính
    if (isLogin) {
      navigate("/");
    }
  }, [isLogin, navigate]);

  useEffect(() => {
    // Enable submit button if no errors and fields are filled
    const allFieldsFilled = Object.values(dataLogin).every(
      (val) => val.trim() !== ""
    );
    const noErrors = Object.values(errors).every((err) => err === "");
    setFormValid(allFieldsFilled && noErrors);
  }, [dataLogin, errors]);

  return (
    <div className="d-flex align-items-center justify-content-center p-5">
      <div className="card shadow-lg w-100" style={{ maxWidth: 480 }}>
        <div className="card-body">
          <div className="text-center">
            <h1 className="card-title h3">ĐĂNG NHẬP</h1>
            <p className="card-text text-muted">
              Nếu bạn chưa có tài khoản, xin vui lòng bấm "Đăng ký" chuyển qua
              trang đăng ký.
              <br />
              Những trường có * là bắt buộc
            </p>
          </div>
          <div className="mt-4">
            <form onSubmit={submitLogin}>
              <div className="mb-4">
                <label htmlFor="username" className="form-label text-muted">
                  Tên đăng nhập
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="username"
                  name="username"
                  placeholder="Tên đăng nhập"
                  value={dataLogin.username}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                />
                {errors.username && (
                  <div className="alert alert-danger mt-2">
                    {errors.username}
                  </div>
                )}
              </div>
              <div className="mb-4">
                <label htmlFor="password" className="form-label text-muted">
                  Mật khẩu
                </label>
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  name="password"
                  placeholder="Mật khẩu"
                  value={dataLogin.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                />
                {errors.password && (
                  <div className="alert alert-danger mt-2">
                    {errors.password}
                  </div>
                )}
              </div>
              <div className="d-grid">
                <button
                  type="submit"
                  className="btn btn-dark btn-lg"
                  disabled={loading || !formValid}
                >
                  {loading ? "Đang xử lý..." : "Đăng nhập"}
                </button>
              </div>
              <p className="text-center text-muted mt-4">
                Bạn chưa có tài khoản?{" "}
                <NavLink to="/register" className="text-decoration-none">
                  Đăng ký
                </NavLink>
                .
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
