import React, { useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";

import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../redux_toolkit/AuthSlice.js";
import { toast } from "react-toastify"; 

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Lấy state từ Redux
  const { isLogin, user } = useSelector((state) => state.auth);

  console.log("header check ", isLogin, user);

  const handleLogout = async () => {
    try {
      const result = await dispatch(logout()).unwrap();
      if (result.success) {
      toast.success("Đăng xuất thành công!");
      navigate("/");
      }
      else{
        toast.error(result.message || "Đăng xuất thất bại, vui lòng thử lại!");
      }
    } catch (error) {
      console.error("Logout error", error);
      // Still navigate away since we've removed the token in the action
      toast.error(error || "Đăng xuất thất bại, vui lòng thử lại!");
      navigate("/");
    }
  };

  const handleViewProfile = () => {
    if (!isLogin || !user) {
      navigate("/login");
    } else {
      if (user?.role === 2) {
        navigate("/employer/overview");
      } else if (user?.role === 3) {
        navigate("/jobseeker/overview");
      }
    }
  };

  return (
    <>
      {/* Navbar fixed top */}
      <nav className="navbar navbar-expand-lg bg-white border-bottom px-3 py-2 shadow-sm sticky-top">
        <div className="container-fluid ">
          {/* Logo */}
          <NavLink
            className="text-decoration-none ms-lg-4 d-flex align-items-center"
            to="/"
          >
            <img
              src="/img/logo/logo.jpg"
              alt="logo"
              style={{ height: 40, width: 40 }}
            />
            <span className=" ms-2 text-primary fw-bold me-4">
              Boost Career
            </span>
          </NavLink>

          {/* Toggle button on mobile */}
          <button
            className="btn d-lg-none"
            type="button"
            data-bs-toggle="offcanvas"
            data-bs-target="#mobileMenu"
            aria-controls="mobileMenu"
          >
            <i className="bi bi-list fs-3"></i>
          </button>

          {/* Desktop Menu */}
          <div className="collapse navbar-collapse justify-content-between align-items-center d-none d-lg-flex">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0 gap-4">
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  href="#aaaa"
                  id="marketDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Việc làm
                </a>
                <ul className="dropdown-menu" aria-labelledby="marketDropdown">
                  <li>
                    <NavLink className="dropdown-item" to="/post">
                      Tất cả việc làm
                    </NavLink>
                  </li>
                </ul>
              </li>

              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  href="#aaa"
                  id="applyDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Công ty
                </a>
                <ul className="dropdown-menu" aria-labelledby="applyDropdown">
                  <li>
                    <NavLink className="dropdown-item" to="/list-company">
                      Tất cả công ty
                    </NavLink>
                  </li>
                </ul>
              </li>

              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  href="#aa"
                  id="resourceDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Về chúng tôi
                </a>
                <ul
                  className="dropdown-menu"
                  aria-labelledby="resourceDropdown"
                >
                  <li>
                    <NavLink className="dropdown-item" to="/about">
                      Giới thiệu công ty
                    </NavLink>
                  </li>
                  <li>
                    <NavLink className="dropdown-item" to="/help">
                      Hỗ trợ
                    </NavLink>
                  </li>
                  <li>
                    <NavLink className="dropdown-item" to="/contact">
                      Liên hệ
                    </NavLink>
                  </li>
                  <li>
                    <NavLink className="dropdown-item" to="/policy">
                      Chính sách bảo mật
                    </NavLink>
                  </li>
                  <li>
                    <NavLink className="dropdown-item" to="/terms">
                      Điều khoản dịch vụ
                    </NavLink>
                  </li>
                </ul>
              </li>

              {user?.role === 2 ? (
                <li className="d-flex nav-item align-items-center custom-hover-3">
                  <NavLink className="dropdown-item" to="/candidates">
                    Tìm kiếm ứng viên
                  </NavLink>
                </li>
              ) : (
                ""
              )}
            </ul>

            {/* Search + Right Options */}
            <div className="d-flex align-items-center gap-4">
              {/* <input
                className="form-control form-control-sm"
                type="search"
                placeholder="Tìm kiếm..."
                aria-label="Search"
                style={{ width: "200px" }}
              /> */}

              <div className="navbar-nav mb-2 mb-lg-0">
                {isLogin ? (
                  <>
                    {" "}
                    <a
                      className="nav-link  me-lg-3 text-secondary "
                      href="#aaa"
                      id="navbarDropdown"
                      role="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      {" "}
                      {user?.logo ? (
                        <img
                          src={user?.logo}
                          alt="Avatar"
                          className="rounded-circle"
                          width="32"
                          height="32"
                        />
                      ) : (
                        <i
                          className="bi bi-person-circle ms-2 me-2"
                          style={{
                            fontSize: "24px",
                          }}
                        ></i>
                      )}
                    </a>
                    <ul
                      className="dropdown-menu dropdown-menu-end me-1"
                      aria-labelledby="navbarDropdown"
                    >
                      <li>
                        <button
                          className="dropdown-item"
                          onClick={handleViewProfile}
                        >
                          Hồ sơ của bạn
                        </button>
                      </li>
                      <li>
                        <button
                          className="dropdown-item"
                          onClick={handleLogout}
                        >
                          Đăng xuất
                        </button>
                      </li>
                    </ul>
                  </>
                ) : (
                  <>
                    <div className="d-flex align-items-center">
                      <span className="me-2">
                        <NavLink className="dropdown-item" to="/login">
                          Đăng nhập
                        </NavLink>
                      </span>
                      <button className="btn btn-primary">
                        <NavLink className="dropdown-item" to="/register">
                          Đăng ký
                        </NavLink>
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Offcanvas for Mobile */}
      <div
        className="offcanvas offcanvas-start"
        tabIndex="-1"
        id="mobileMenu"
        aria-labelledby="mobileMenuLabel"
      >
        <div className="offcanvas-header border-bottom">
          <NavLink className="navbar-brand ms-lg-4" to="/">
            <img
              src="/img/logo/logo.jpg"
              alt="logo"
              style={{ height: 40, width: 40 }}
            />
            <span className="ms-2 text-primary fw-bold">Boost Career</span>
          </NavLink>
          <button
            type="button"
            className="btn-close text-reset"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          ></button>
        </div>

        <div className="offcanvas-body">
          {/* Repeat mobile menu content here */}
          <div className="mb-4">
            <h6 className="fw-bold">Việc làm</h6>
            <ul className="list-unstyled ps-3 text-muted">
              <li>
                <NavLink
                  to="/post"
                  className="text-decoration-none text-secondary"
                >
                  Tất cả việc làm
                </NavLink>
              </li>
            </ul>
          </div>

          <div className="mb-4">
            <h6 className="fw-bold">Công ty</h6>
            <ul className="list-unstyled ps-3 text-muted">
              <li>
                <NavLink
                  to="/list-company"
                  className="text-decoration-none text-secondary"
                >
                  Tất cả công ty
                </NavLink>
              </li>
            </ul>
          </div>

          <div className="mb-4">
            <h6 className="fw-bold">Về chúng tôi</h6>
            <ul className="list-unstyled ps-3 text-muted">
              <li>
                <NavLink
                  to="/about"
                  className="text-decoration-none text-secondary"
                >
                  Giới thiệu công ty
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/help"
                  className="text-decoration-none text-secondary"
                >
                  Hỗ trợ
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/contact"
                  className="text-decoration-none text-secondary"
                >
                  Liên hệ
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/policy"
                  className="text-decoration-none text-secondary"
                >
                  Chính sách bảo mật
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/terms"
                  className="text-decoration-none text-secondary"
                >
                  Điều khoản dịch vụ
                </NavLink>
              </li>
            </ul>
          </div>

          {user?.role === 2 ? (
            <>
              <h6 className="fw-bold">Về chúng tôi</h6>
              <ul className="list-unstyled ps-3 text-muted">
                <li className="d-flex nav-item align-items-center">
                  <NavLink
                    to="/candidates"
                    className="text-decoration-none text-secondary"
                  >
                    Tìm kiếm ứng viên
                  </NavLink>
                </li>
              </ul>
            </>
          ) : (
            ""
          )}

          <div className="mb-4">
            <h6 className="fw-bold">Tài khoản</h6>
            <ul className="list-unstyled ps-3 text-muted">
              {isLogin ? (
                <>
                  <li onClick={handleViewProfile}>Hồ sơ của bạn</li>
                  <li onClick={handleLogout}>Đăng xuất</li>
                </>
              ) : (
                <>
                  <li>
                    <NavLink
                      className="text-decoration-none text-secondary"
                      to="/login"
                    >
                      Đăng nhập
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      className="text-decoration-none text-secondary"
                      to="/register"
                    >
                      Đăng ký
                    </NavLink>
                  </li>
                </>
              )}
            </ul>
          </div>

          {/* <div className="d-flex align-items-center justify-content-between mt-5 px-2">
            <span className="badge bg-light text-dark d-flex align-items-center">
              <img
                src="https://cryptologos.cc/logos/bnb-bnb-logo.png"
                alt="BNB"
                width="20"
                height="20"
                className="me-2"
              />
              BNB Chain
            </span>

            <div className="d-flex gap-3 fs-5 text-muted">
              <i className="bi bi-globe"></i>
              <i className="bi bi-moon"></i>
            </div>
          </div> */}
        </div>
      </div>
    </>
  );
};

export default Header;
