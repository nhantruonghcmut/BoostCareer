import React from "react";

const notificationData = {
  count_isRead: 2,
  notifications: [
    {
      notification_id: 1,
      recipient_id: 1,
      notification_type: "Theo dõi", //Theo dõi
      entity_id: 1,
      entity_name: "Kèo banh Cầu Xéo",
      is_read: false,
      content: "đã nhắc đến bạn và những người khác ở một bình luận trong",
      created_at: "1 giờ",
    },
    {
      notification_id: 2,
      recipient_id: 1,
      notification_type: "Lưu hồ sơ", //Lưu hồ sơ
      entity_id: 1,
      entity_name: "Kèo banh Cầu Xéo",
      is_read: false,
      content: "đã nhắc đến bạn và những người khác ở một bình luận trong",
      created_at: "2 giờ",
    },
    {
      notification_id: 3,
      recipient_id: 1,
      notification_type: "Hủy theo dõi", //Hủy theo dõi
      entity_id: 1,
      entity_name: "Kèo banh Cầu Xéo",
      is_read: true,
      content: "đã nhắc đến bạn và những người khác ở một bình luận trong",
      created_at: "3 ngày",
    },
    {
      notification_id: 4,
      recipient_id: 1,
      notification_type: "Hủy lưu hồ sơ", //Hủy lưu hồ sơ
      entity_id: 1,
      entity_name: "Kèo banh Cầu Xéo",
      is_read: true,
      content: "đã nhắc đến bạn và những người khác ở một bình luận trong",
      created_at: "3 ngày",
    },
    {
      notification_id: 5,
      recipient_id: 1,
      notification_type: "Ứng tuyển", //Hủy lưu hồ sơ
      entity_id: 1,
      entity_name: "Kèo banh Cầu Xéo",
      is_read: true,
      content: "đã nhắc đến bạn và những người khác ở một bình luận trong",
      created_at: "3 ngày",
    },
    {
      notification_id: 6,
      recipient_id: 1,
      notification_type: "Thông báo hệ thống", //Thông báo từ hệ thống
      entity_id: 1,
      entity_name: "Kèo banh Cầu Xéo",
      is_read: false,
      content: "đã nhắc đến bạn và những người khác ở một bình luận trong",
      created_at: "3 ngày",
    },
  ],
};

const NotificationHeader = () => {
  return (
    <div className="container my-3">
      {/* Tabs */}
      <ul className="nav nav-tabs mb-3">
        <li className="nav-item">
          <a className="nav-link active" href="#">
            Tất cả
          </a>
        </li>
        <li className="nav-item">
          <a className="nav-link" href="#">
            Chưa đọc
          </a>
        </li>
      </ul>

      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="mb-0">Thông báo</h5>
        <a href="#" className="text-decoration-none">
          Xem tất cả
        </a>
      </div>

      {/* Notification List */}
      <div className="navbar-nav mb-2 mb-lg-0">
        <div className="dropdown">
          <div
            // type="button"
            className="rounded-circle "
            id="dropdownMenuButton1"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <i
              className="fa fa-bell fa-lg"
              width="40"
              height="40"
              aria-hidden="true"
            ></i>{" "}
            <span
              className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
              style={{ fontSize: "0.7rem" }}
            >
              {notificationData.count_isRead}
            </span>
          </div>
          <ul
            className="dropdown-menu dropdown-menu-end"
            aria-labelledby="dropdownMenuButton1"
            style={{
              minWidth: 320,
              maxWidth: "20vw",
              maxHeight: "500px",
              overflowY: "auto",
              overflowX: "hidden",
            }}
          >
            <li>
              <h6 className="dropdown-header">Thông báo</h6>
            </li>

            <li className="">
              <a className="dropdown-item align-self-end " href="#">
                Tất cả
              </a>
            </li>

            {notificationData?.notifications?.map((noti, index) => (
              <li
                key={index}
                className={`dropdown-item d-flex align-items-center mb-1 ${
                  noti.is_read !== true ? "bg-light" : ""
                }`}
              >
                <div className="flex-grow-1">
                  <p
                    className="text-truncate m-0"
                    style={{
                      maxWidth: "220px",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                    }}
                    title={`${noti.name} ${noti.content} ${noti.group || ""}`}
                  >
                    <strong>{noti.notification_type}</strong>{" "}
                    {/* {noti.content}{" "} */}
                  </p>
                  {(() => {
                    if (noti.notification_type === "Thông báo hệ thống") {
                      return (
                        <p className="m-0">
                          Bạn nhận được thông báo từ hệ thông.
                        </p>
                      );
                    } else if (noti.notification_type === "Theo dõi") {
                      return (
                        <p className="m-0">
                          {noti.entity_name} đã theo dõi bạn.
                        </p>
                      );
                    } else if (noti.notification_type === "Lưu hồ sơ") {
                      return (
                        <p className="m-0">
                          {noti.entity_name} đã lưu hồ sơ của bạn.
                        </p>
                      );
                    } else if (noti.notification_type === "Hủy theo dõi") {
                      return (
                        <p className="m-0">
                          {noti.entity_name} đã hủy theo dõi bạn.
                        </p>
                      );
                    } else if (noti.notification_type === "Lưu công việc") {
                      return (
                        <p className="m-0">
                          {noti.entity_name} đã lưu công việc của bạn.
                        </p>
                      );
                    } else {
                      return (
                        <p className="m-0">
                          {noti.entity_name} đã {noti.notification_type} bạn.
                        </p>
                      );
                    }
                  })()}

                  <small className="text-muted m-0">{noti.created_at}</small>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default NotificationHeader;
