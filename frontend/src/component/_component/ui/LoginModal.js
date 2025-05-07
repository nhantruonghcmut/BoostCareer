import React, { useState, useEffect } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  login,
  checkLoginStatus,
} from "../../../redux_toolkit/AuthSlice.js";
import { validateField } from "../../../utils/validateField";

const LoginModal = ({ title }) => {
  const dispatch = useDispatch();

  const { isLogin, loading } = useSelector((state) => state.auth);

  const [dataLogin, setDataLogin] = useState({
    username: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    username: "",
    password: "",
  });

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

  const submitLogin = (e) => {
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

    dispatch(login({params:dataLogin})); // Proceed with login if no errors
  };

  useEffect(() => {
    // Enable submit button if no errors and fields are filled
    const allFieldsFilled = Object.values(dataLogin).every(
      (val) => val.trim() !== ""
    );
    const noErrors = Object.values(errors).every((err) => err === "");
    setFormValid(allFieldsFilled && noErrors);
  }, [dataLogin, errors]);

  return (
    <div
      className="modal fade"
      id="LoginModal"
      tabIndex={-1}
      aria-labelledby="modalTitle"
      aria-hidden="true"
    >
      <div
        className="modal-dialog modal-lg card shadow-lg w-100"
        style={{ maxWidth: 480 }}
      >
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title card-title h3" id="modalTitle">
              {title ? title : "Đổi mật khẩu"}
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            />
          </div>
          <div className="modal-body">
            <form onSubmit={submitLogin}>
              <div className="mb-4">
                <label htmlFor="email" className="form-label text-muted">
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
                  data-bs-dismiss="modal"
                  type="submit"
                  className="btn btn-dark btn-lg"
                  disabled={loading || !formValid}
                >
                  {loading ? "Đang xử lý..." : "Đăng nhập"}
                </button>
              </div>
              <p className="text-center text-muted mt-4">
                Bạn chưa có tài khoản?
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
};

export default LoginModal;
