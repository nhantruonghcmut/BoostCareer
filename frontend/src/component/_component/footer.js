import React from "react";
import "./footer.css";
import { NavLink } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="modern-footer pt-5">
      <div className="container footer-content">
        <div className="row g-4 mb-5">
          {/* Company Info */}
          <div className="col-lg-4 col-md-6">
            <NavLink to="/" className="footer-logo d-block mb-4">
              <span className="text-primary">BoostCareer.</span>
            </NavLink>
            <p className="text-muted mb-4">
              "Cùng chúng tôi xây dựng tương lai, nơi mỗi bước đi đều dẫn đến
              thành công và hạnh phúc!"
            </p>
            <ul className="contact-info mb-4">
              <li>
                <i className="bi bi-geo-alt-fill"></i>
                <span>
                  268 Đ. Lý Thường Kiệt, <br />
                  Phường 14, Quận 10, Hồ Chí Minh
                </span>
              </li>
              <li>
                <i className="bi bi-telephone-fill"></i>
                <span>+84 777784090</span>
              </li>
              <li>
                <i className="bi bi-envelope-fill"></i>
                <span>nhan.truongcse@hcmut.edu.vn</span>
              </li>
            </ul>
          </div>
          {/* Quick Links */}
          <div className="col-lg-4 col-md-6">
            <h3 className="footer-title">Liên kết nhanh</h3>
            <ul className="quick-links">
              <li>
                <a href="#aa">Dịch vụ của chúng tôi</a>
              </li>
              <li>
                <NavLink to="/about" className="text-decoration-none">
                  Giới thiệu công ty{" "}
                </NavLink>
              </li>
              {/* <li>
                <a href="#aaa">Latest Projects</a>
              </li> */}
              <li>
                <a href="#aaa">Thông tin gần đây</a>
              </li>
              <li>
                <NavLink to="/help" className="text-decoration-none">
                  Hỗ trợ
                </NavLink>
              </li>
              <li>
                <NavLink to="/contact" className="text-decoration-none">
                  Liên hệ
                </NavLink>
              </li>
              <li>
                <NavLink to="/policy" className="text-decoration-none">
                  Chính sách bảo mật
                </NavLink>
              </li>
              <li>
                <NavLink to="/terms" className="text-decoration-none">
                  Điều khoản dịch vụ
                </NavLink>
              </li>
            </ul>
          </div>
          {/* Newsletter */}
          <div className="col-lg-4 col-md-12">
            <h3 className="footer-title">Kết nối với chúng tôi</h3>
            <p className="text-muted mb-4">
              Đăng ký nhận bản tin của chúng tôi để cập nhật những tin tức và
              thông tin mới nhất.
            </p>
            <form className="mb-4">
              <div className="mb-3">
                <input
                  type="email"
                  className="form-control newsletter-input"
                  placeholder="Địa chỉ email của bạn"
                />
              </div>
              <button
                type="submit"
                className="btn btn-subscribe text-white w-100"
              >
                Đăng ký ngay
              </button>
            </form>
            <div className="social-links">
              <a href="#aa" className="social-icon">
                <i className="bi bi-facebook"></i>
              </a>
              <a href="#aa" className="social-icon">
                <i className="bi bi-twitter-x"></i>
              </a>
              <a href="#aa" className="social-icon">
                <i className="bi bi-instagram"></i>
              </a>
              <a href="#aa" className="social-icon">
                <i className="bi bi-linkedin"></i>
              </a>
              <a href="#aa" className="social-icon">
                <i className="bi bi-youtube"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
      {/* Footer Bottom */}
      <div className="footer-bottom">
        <div className="container">
          <div className="row py-4">
            <div className="col-md-6 text-center text-md-start">
              <p>© 2025 BoostCareer. All rights reserved.</p>
            </div>
            <div className="col-md-6 text-center text-md-end">
              <p>
                Made with <i className="fa fa-heart text-danger" /> by{" "}
                <NavLink to="/">BoostCareer.</NavLink>
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
