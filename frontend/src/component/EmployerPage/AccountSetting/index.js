import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
// import { logout } from "../../../redux/actions/authAction.js";
import { logout } from "../../../redux_toolkit/AuthSlice.js";
import { toast } from "react-toastify"; // Import toast nếu cần thông báo
import { useChangePasswordMutation } from "../../../redux_toolkit/employerApi.js";
export default function EmployerAccountSetting() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [changePassword] = useChangePasswordMutation();


  const handleLogout = () => {
    dispatch(logout());
  };

  const [data, setData] = useState({
    password: "",
    rePassword: "",
  });

  const handleChangePassword = async () => {
    // Validate password match
    if (data.password !== data.rePassword) {
      toast.error("Mật khẩu không khớp!");
      return;
    }

    // Validate password not empty
    if (!data.password) {
      toast.error("Mật khẩu không được để trống!");
      return;
    }

    try {
      const response = await changePassword({
        newPassword: data.password,
      }).unwrap();
      
      if (response.success) {
        toast.success("Đổi mật khẩu thành công!");
        setData({
          password: "",
          rePassword: "",
        });
      } else {
        toast.error("Đổi mật khẩu thất bại!");
      }
    } catch (error) {
      console.error("Error change password:", error);
      toast.error("Đã xảy ra lỗi khi đổi mật khẩu!");
    }
  };


  return (
    <div>
      {/* Modal đổi mật khẩu */}
      <div
        className="modal fade"
        id="changePassword1"
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
                Đổi mật khẩu
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              />
            </div>
            <div className="modal-body">
              <form>                <div className="mb-4">
                  <label htmlFor="newPassword" className="form-label text-muted">
                    Mật khẩu mới
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="newPassword"
                    placeholder="Mật khẩu mới"
                    value={data.password}
                    required
                    onChange={(e) => {
                      setData({
                        ...data,
                        password: e.target.value,
                      });
                    }}
                  />
                  {data.password && data.password.length < 6 && (
                    <div className="text-danger small mt-1">
                      Mật khẩu cần có ít nhất 6 ký tự
                    </div>
                  )}
                </div><div className="mb-4">
                  <label htmlFor="password" className="form-label text-muted">
                    Nhập lại mật khẩu
                  </label>
                  <input
                    type="password"
                    className={`form-control ${data.rePassword && data.password !== data.rePassword ? 'is-invalid' : ''}`}
                    id="password"
                    placeholder="Nhập lại mật khẩu"
                    value={data.rePassword}
                    required
                    onChange={(e) => {
                      setData({
                        ...data,
                        rePassword: e.target.value,
                      });
                    }}
                  />
                  {data.rePassword && data.password !== data.rePassword && (
                    <div className="invalid-feedback">
                      Mật khẩu không khớp
                    </div>
                  )}
                </div>
                <div className="d-grid">
                  <button
                    type="button"
                    data-bs-dismiss="modal"
                    className="btn btn-dark btn-lg"
                    disabled={
                      !(
                        data.password === data.rePassword &&
                        data.password !== ""
                      )
                    }
                    onClick={handleChangePassword}
                  >
                    Thay đổi
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      {/* End modal đổi mật khẩu */}

      <div className="bg-light rounded-2 me-2 my-2 p-2">
        <h3>Quản lý tài khoản</h3>
      </div>

      <div className="bg-light rounded-2 me-2 my-2 p-2">
        <h4>Tài khoản và mật khẩu</h4>
        <div
          className="d-flex justify-content-between align-items-center p-3 rounded border"
          style={{ backgroundColor: "#e9ecef" }}
        >
          <div>
            <p className="mb-1 fw-bold">
              Tên đăng nhập: <span className="fw-normal">{user?.username}</span>
            </p>
            <p className="mb-0 fw-bold">
              Mật khẩu: <span className="fw-normal">******</span>
            </p>
          </div>
          {/* <div>
            <p className="mb-0 text-muted">Ngày tạo: {user?.create_at}</p>
          </div> */}
        </div>
      </div>
      <div className="d-flex justify-content-end me-2 my-2 p-2">
        <p
          onClick={handleLogout}
          className="text-primary text-decoration-primary d-block mt-2 pe-3 border-end border-primary"
        >
          Đăng xuất
        </p>

        <span
          className="text-primary text-decoration-underline text-decoration-primary d-block mt-2 me-4 ms-3 custom-hover-2"
          data-bs-toggle="modal"
          data-bs-target="#changePassword1"
        >
          Đổi mật khẩu
        </span>
      </div>

      <div className="d-flex justify-content-start me-2 my-2 p-2">
        <p className="text-danger text-decoration-none d-block mt-2 ms-3">
          <i className="bi bi-dash-circle-fill me-2"></i>Xóa tài khoản
        </p>
      </div>
    </div>
  );
}
