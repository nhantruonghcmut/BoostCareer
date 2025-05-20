import React, { useState } from "react";
import { 
  useDelete_EmployersMutation,
  useUpdate_status_EmployersMutation,
  useSend_message_employerMutation,
  useReset_Password_employerMutation 
} from '../../redux/api/api_employers';
import Modal_message from "../../components/Modal_message";
import { CSpinner, CBadge } from "@coreui/react";

const formatDate = (dateStr) => {
  if (!dateStr) return "";
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(dateStr));
};

export const config_employertable = (need_reload, setNeed_reload) => {    
  const [delete_employers, { isLoading: isDeleting }] = useDelete_EmployersMutation();
  const [update_employers_status, { isLoading: isUpdatingStatus }] = useUpdate_status_EmployersMutation();
  const [send_message, { isLoading: isSending }] = useSend_message_employerMutation();
  const [reset_Password, { isLoading: isResetting }] = useReset_Password_employerMutation();

  // Message modal state
  const [visible, setVisible] = useState(false);
  const [currentEmployer, setCurrentEmployer] = useState(null);
  
  const columns = [
    {
      header: "ID",
      field: "employer_id",
      render: (item) => <strong>{item.employer_id}</strong>
    },
    {
      header: "Công ty",
      field: "company_name",
      render: (item) => (
        <div className="d-flex align-items-center">
          {item.logo && (
            <img 
              src={item.logo} 
              alt="Company logo" 
              style={{ width: '40px', height: '40px', marginRight: '10px', borderRadius: '50%' }} 
              onError={(e) => { e.target.onerror = null; e.target.src = '/assets/images/logo_default.png'; }}
            />
          )}
          <strong>{item.company_name?.length > 30 ? item.company_name.slice(0, 30) + "..." : item.company_name}</strong>
        </div>
      )
    },
    {
      header: "Email",
      field: "email",
      render: (item) => (item.email?.length > 25 ? item.email.slice(0, 25) + "..." : item.email)
    },
    {
      header: "Địa chỉ",
      field: "work_location",
      render: (item) => (item.work_location?.length > 25 ? item.work_location.slice(0, 25) + "..." : item.work_location)
    },
    {
      header: "Lĩnh vực",
      field: "industry_name",
      render: (item) => (item.industry_name)
    },
    {
      header: "Quy mô",
      field: "scale_total",
      render: (item) => (item.scale_total)
    },
    {
      header: "Trạng thái",
      field: "employer_status",
      render: (item) => (
        <CBadge color={item.employer_status === 1 ? "success" : "secondary"} shape="rounded-pill">
          {item.employer_status === 1 ? "Đang hoạt động" : "Tạm khóa"}
        </CBadge>
      )
    },       
  ];
  
  return {
    columns,
    actions: [
      {
        label: "Xem hồ sơ",
        color: "info",
        onClick: (item) => window.open(`/employer-profile/${item.employer_id}`, "_blank")
      },      {
        label: "Xóa",
        color: "danger",
        // disabled: isDeleting,
        onClick: async (item) => {
          try {            
            const result = await delete_employers({ employer_ids: [item.employer_id] });
            if (result.data) { 
              setNeed_reload(true);
            }
          } catch (error) {
            console.error("Delete error:", error);
          }
        },
        renderContent: (item) => isDeleting ? <><CSpinner size="sm" /> Đang xóa...</> : "Xóa"
      },      {        label: (item) => (item.employer_status === 1 ? "Khóa" : "Mở khóa"),
        color: (item) => item.employer_status === 1 ? "dark" : "success",
        disabled: isUpdatingStatus,
        onClick: async (item) => {
          try {
            const newStatus = item.employer_status === 1 ? 0 : 1;
            const result = await update_employers_status({ 
              status_: newStatus, 
              employer_ids: [item.employer_id] 
            });
            
            if (result.data) {
              setNeed_reload(true);
            }
          } catch (error) {
            console.error("Update status error:", error);
          }
        },
        renderContent: (item) => {
          // if (isUpdatingStatus) return <><CSpinner size="sm" /> Đang cập nhật...</>;
          return item.employer_status === 1 ? "Khóa" : "Mở khóa";
        }
      },      {
        label: "Đặt lại mật khẩu",
        color: "warning",
        disabled: isResetting,
        onClick: async (item) => {
          try {
            const result = await reset_Password({ employer_ids: [item.employer_id] });
            if (result.data) {
              setNeed_reload(true);
            } 
          } catch (error) {
            console.error("Reset password error:", error);
          }
        },
        renderContent: (item) => isResetting ? <><CSpinner size="sm" /> Đang đặt lại...</> : "Đặt lại mật khẩu"
      },
    ],   

  };
};

export default config_employertable;