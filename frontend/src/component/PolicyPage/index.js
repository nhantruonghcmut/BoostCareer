import React from "react";
import TitleComponent from "../_component/ui/TitleComponent.js";

export default function PolicyPage() {
  return (
    <>
      <TitleComponent
        title={"Chính sách bảo mật"}
        description={
          "Boost Career cam kết bảo vệ thông tin cá nhân của người dùng và đảm bảo sự minh bạch trong việc thu thập, sử dụng và bảo mật dữ liệu. Khi sử dụng dịch vụ của chúng tôi, bạn đồng ý với các điều khoản trong chính sách bảo mật này."
        }
      />
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-10">
            <div className="mb-3">
              <h4 className="fw-semibold">1. Thông tin thu thập</h4>
              <ul className="text-muted">
                <li>
                  <strong>Thông tin cá nhân:</strong> Họ tên, email, số điện
                  thoại, địa chỉ, ngày sinh, hình ảnh…
                </li>
                <li>
                  <strong>Thông tin nghề nghiệp:</strong> Học vấn, kinh nghiệm
                  làm việc, kỹ năng, chứng chỉ, mong muốn nghề nghiệp.
                </li>
                <li>
                  <strong>Thông tin nhà tuyển dụng:</strong> Tên công ty, địa
                  chỉ, thông tin liên hệ, mô tả công việc.
                </li>
                <li>
                  <strong>Dữ liệu tự động:</strong> Cookies, địa chỉ IP, loại
                  thiết bị, trình duyệt, lịch sử tìm kiếm và truy cập trang web.
                </li>
              </ul>
            </div>

            <div className="mb-3">
              <h4 className="fw-semibold">2. Mục đích sử dụng thông tin</h4>
              <ul className="text-muted">
                <li>Cung cấp, duy trì và cải thiện dịch vụ.</li>
                <li>Gửi thông báo về việc làm, tuyển dụng.</li>
              </ul>
            </div>

            <div className="mb-3">
              <h4 className="fw-semibold">3. Bảo vệ thông tin người dùng</h4>
              <ul className="text-muted">
                <li>Giới hạn quyền truy cập vào thông tin cá nhân.</li>
                <li>
                  Kiểm tra bảo mật định kỳ để ngăn chặn truy cập trái phép.
                </li>
              </ul>
            </div>

            <div className="mb-3">
              <h4 className="fw-semibold">4. Chia sẻ thông tin</h4>
              <ul className="text-muted">
                <li>Khi có sự đồng ý của bạn.</li>
                <li>
                  Với nhà tuyển dụng khi bạn ứng tuyển hoặc bật chế độ công khai
                  hồ sơ.
                </li>
              </ul>
            </div>

            <div className="mb-3">
              <h4 className="fw-semibold">5. Quyền lợi của người dùng</h4>
              <ul className="text-muted">
                <li>Truy cập, chỉnh sửa hoặc xóa thông tin cá nhân.</li>
                <li>Thiết lập quyền riêng tư của hồ sơ.</li>
              </ul>
            </div>

            <div className="mb-3">
              <h4 className="fw-semibold">6. Thay đổi chính sách bảo mật</h4>
              <p className="text-muted">
                Boost Career có thể cập nhật chính sách này tùy theo tình hình
                thực tế. Chúng tôi sẽ thông báo nếu có thay đổi quan trọng.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
