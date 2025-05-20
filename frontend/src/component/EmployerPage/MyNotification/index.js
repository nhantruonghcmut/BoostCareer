import React, { useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  useGetNotificationQuery,
  useUpdateReadNotificationMutation,
} from "../../../redux_toolkit/employerApi";
import { ca, vi } from "date-fns/locale";
import { formatDistanceToNow } from "date-fns";

export default function EmployerNotification() {
  const { isLogin, user } = useSelector((state) => state.auth);

  const { data: notificationData, refetch } = useGetNotificationQuery(
{},
    {
      skip: !user?.id, // Skip the query if user ID is not available
    }
  );
  console.log("notificationData", notificationData);
  const [updateReadNotification] = useUpdateReadNotificationMutation();

  const navigate = useNavigate();

  const handleReadNotification = async (notification_id) => {
    if (isUpdating) return; // Prevent multiple calls

    setIsUpdating(true);
    try {
      console.log("Sending update request with:", {
        notification_id: notification_id,
      });

      const response = await updateReadNotification({
        notification_id: notification_id,
      }).unwrap();

      if (response.success) {
        console.log("Notification updated successfully:", response);
        // Trigger a refetch of notifications to update the UI
        refetch();
      } else {
        console.error("Failed to update notification:", response);
      }
    } catch (error) {
      console.error("Error updating notification:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const [openItem, setOpenItem] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const toggle = (id) => {
    setOpenItem(openItem === id ? null : id);
  };

  return (
    <div>
      <div className="bg-light rounded-2 me-2 my-2 p-2">
        <h3>Thông báo của bạn</h3>
      </div>

      {notificationData?.length > 0 ? (
        <div className="accordion" id="faqAccordion">
          {notificationData?.map((item, index) => (
            <div
              className="accordion-item border-0 mb-1 custom-hover-4 shadow-sm"
              key={index}
            >
              <h2 className="accordion-header">
                <button
                  className={`accordion-button fw-semibold ${
                    openItem === item.notification_id ? "" : "collapsed"
                  } ${item.is_read ? "" : "bg-secondary"}`}
                  type="button"
                  onClick={async () => {
                    console.log(
                      "Button clicked for notification:",
                      item.notification_id
                    );
                    console.log("Current is_read status:", item.is_read);

                    // First update the read status if needed
                    if (!item.is_read) {
                      await handleReadNotification(item.notification_id);
                    }

                    // Then toggle the accordion
                    toggle(item.notification_id);
                  }}
                  aria-expanded={openItem === item.notification_id}
                  disabled={isUpdating}
                >
                  {item.notification_type} từ{" "}
                  {item?.entity_name === "Anonymous"
                    ? "Người dùng ẩn danh"
                    : item?.entity_name}
                </button>
              </h2>
              {openItem === item.notification_id && (
                <div className="accordion-body d-flex justify-content-between align-items-center">
                  <div className="d-flex align-items-center">
                    <img
                      src={
                        item?.entity_logo
                          ? item?.entity_logo === "Anonymous"
                            ? "/img/notification/thong-bao.png"
                            : item?.entity_logo
                          : "/img/notification/thong-bao.png"
                      }
                      alt="Logo"
                      className="img-fluid me-2 rounded-1 me-3"
                      style={{ width: 80, height: 80 }}
                    />
                    Nội dung: {item?.content} từ: {item?.entity_name} <br />
                    Loại thông báo: {item?.type_name}
                  </div>

                  <div className="d-flex flex-column align-items-center">
                    <p className="text-secondary">
                      {formatDistanceToNow(new Date(item?.created_at), {
                        addSuffix: true,
                        locale: vi,
                      })}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        "Chưa có thông báo nào."
      )}
    </div>
  );
}
