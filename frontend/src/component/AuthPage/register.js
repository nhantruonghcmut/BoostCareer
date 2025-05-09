import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { registerUser } from '../../redux_toolkit/AuthSlice';
import { toast } from "react-toastify";
import { validateField } from "../../utils/validateField";

export default function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [dataRegister, setDataRegister] = useState({
    username: "",
    name: "",
    phone: "",
    email: "",
    password: "",
    role: "3",
  });

  const [errors, setErrors] = useState({
    username: "",
    name: "",
    phone: "",
    email: "",
    password: "",
  });

  const [formValid, setFormValid] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDataRegister((prev) => ({ ...prev, [name]: value }));
    console.log("change", name, value);
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const error = validateField(name, value); // Validate field
    setErrors((prev) => ({ ...prev, [name]: error })); // Update errors
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let newErrors = {};
    let hasError = false;

    // Validate all fields
    Object.keys(dataRegister).forEach((key) => {
      if (key !== "role") {
        const error = validateField(key, dataRegister[key]);
        if (error) {
          hasError = true;
        }
        newErrors[key] = error;
      }
    });

    setErrors(newErrors);

    if (hasError) {
      toast.error("Vui lòng kiểm tra lại thông tin đăng ký!");
      return;
    }

    try {
      const result = await dispatch(registerUser(dataRegister)).unwrap();
      console.log("response register", result);

      if (result.success) {
        toast.success("Đăng ký thành công! Vui lòng đăng nhập.");
        setDataRegister({
          username: "",
          name: "",
          phone: "",
          email: "",
          password: "",
          role: "3",
        });
        navigate("/login");
      } else {
        toast.error("Đăng ký thất bại! Vui lòng thử lại.");
      }
    } catch (error) {
      toast.error("Đăng ký thất bại! Vui lòng thử lại.");
    }
  };

  useEffect(() => {
    const allFieldsFilled = Object.values(dataRegister).every(
      (val) => val.trim() !== "" || typeof val === "number"
    );
    const noErrors = Object.values(errors).every((err) => err === "");
    setFormValid(allFieldsFilled && noErrors);
  }, [dataRegister, errors]);

  return (
    <div className="d-flex align-items-center justify-content-center p-5">
      <div className="card shadow-lg w-100" style={{ maxWidth: 800 }}>
        <div className="card-body">
          <div className="text-center">
            <h1 className="card-title h3">ĐĂNG KÝ TÀI KHOẢN</h1>
            <p className="card-text text-muted">
              Nếu bạn có một tài khoản, xin vui lòng{" "}
              <NavLink to="/login" className="text-decoration-none">
                đăng nhập
              </NavLink>
              .<br />
              Những trường có * là bắt buộc
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-4">
            <div className="mb-4">
              <label htmlFor="yourRole" className="form-label text-muted">
                Bạn là:*
              </label>
              <select
                className="form-control"
                id="yourRole"
                name="role"
                value={dataRegister.role}
                onChange={handleChange}
              >
                <option value="3">Người tìm việc</option>
                <option value="2">Nhà tuyển dụng</option>
              </select>
            </div>

            <div className="mb-4">
              <label htmlFor="username" className="form-label text-muted">
                Tên đăng nhập*
              </label>
              <input
                type="text"
                className="form-control"
                id="username"
                name="username"
                value={dataRegister.username}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {errors.username && (
                <div className="alert alert-danger mt-2">{errors.username}</div>
              )}
            </div>

            <div className="mb-4">
              <label htmlFor="name" className="form-label text-muted">
                {dataRegister.role === "2" ? "Tên công ty*" : "Họ và tên*"}
              </label>
              <input
                type="text"
                className="form-control"
                id="name"
                name="name"
                value={dataRegister.name}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {errors.name && (
                <div className="alert alert-danger mt-2">{errors.name}</div>
              )}
            </div>

            <div className="mb-4">
              <label htmlFor="phone" className="form-label text-muted">
                Số điện thoại*
              </label>
              <input
                type="text"
                className="form-control"
                id="phone"
                name="phone"
                value={dataRegister.phone}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {errors.phone && (
                <div className="alert alert-danger mt-2">{errors.phone}</div>
              )}
            </div>

            <div className="mb-4">
              <label htmlFor="email" className="form-label text-muted">
                Email*
              </label>
              <input
                type="text"
                className="form-control"
                id="email"
                name="email"
                value={dataRegister.email}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {errors.email && (
                <div className="alert alert-danger mt-2">{errors.email}</div>
              )}
            </div>

            <div className="mb-4">
              <label htmlFor="password" className="form-label text-muted">
                Mật khẩu*
              </label>
              <input
                type="password"
                className="form-control"
                id="password"
                name="password"
                value={dataRegister.password}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {errors.password && (
                <div className="alert alert-danger mt-2">{errors.password}</div>
              )}
            </div>

            <div className="d-grid">
              <button
                type="submit"
                className="btn btn-dark btn-lg"
                disabled={!formValid}
              >
                Đăng ký
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
