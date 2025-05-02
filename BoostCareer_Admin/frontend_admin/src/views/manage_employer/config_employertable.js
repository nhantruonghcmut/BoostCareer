import React from "react";
import { 
  useDelete_EmployersMutation,
  useUpdate_status_EmployersMutation,
  useSend_message_employerMutation,
  useReset_Password_employerMutation } from '../../redux/api/api_employers'
import { useDispatch } from "react-redux";
import Modal_message from "../../components/Modal_message";
const formatDate = (dateStr) => {
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(dateStr));
};

export const config_employertable = ( need_reload, setNeed_reload ) => {    
  const [delete_employers] = useDelete_EmployersMutation();
  const [update_employers_status] = useUpdate_status_EmployersMutation();
  const [send_message] = useSend_message_employerMutation();
  const [reset_Password] = useReset_Password_employerMutation();

  
  const [visible, setVisible] = React.useState(false);
  const openMessageModal = () => {setVisible(true);};
  const handleSendMessage = async (message) =>  {
    try {
      const result = await send_message({'message':message});
      if (result.data) {
        alert("Gửi tin nhắn thành công");
      }
    }
    catch (error) {
      console.error("Send message error:", error);
    }
  };

  const columns = [
      {
        header: "employer_ID",
        field: "employer_id",
        render: (item) => <strong>{item.employer_id}</strong>
      },
      {
        header: "User Name",
        field: "company_name",
        render: (item) => (<strong>{item.company_name.length > 40 ? item.company_name.slice(0, 40) + "..." : item.company_name}</strong>)
      },
      {
        header: "Email",
        field: "email",
        render: (item) => (item.email.length > 40 ? item.email.slice(0, 40) + "..." : item.email)
      },
      {
        header: "Địa chỉ",
        field: "work_location",
        render: (item) => (item.work_location.length > 40 ? item.work_location.slice(0, 40) + "..." : item.work_location)
      },
      {
        header: "Lĩnh vực",
        field: "industry",
        render: (item) => (item.industry_name)
      },
      {
        header: "Quy mô",
        field: "scale_total",
        render: (item) => (item.scale_total)
      },
      {
        header: "Status",
        field: "employer_status",
        render: (item) => (
          <span className={`badge ${item.employer_status === 1 ? "bg-success" : "bg-secondary"}`}>
            {item.employer_status === 1 ? "Active" : "InActive"}
          </span>
        )
      },       
      ];
return {
columns,
actions : [
    {
      label: "Xem hồ sơ",
      color: "warning",
      onClick: (item) => alert(`Xem tin tuyển dụng: ${item.title}`)
    },
    {
      label: "Xóa",
      color: "danger",
      onClick: async (item) => {
          try {            
            const result =await delete_employers({ employer_ids: [item.employer_id] })
            // Cập nhật state để reload   
            if (result.data) { setNeed_reload(true); }
            alert(`Xóa tài khoản tuyển dụng: ${item.company_name} thành công`);
          }
          catch (error) {
            console.log("Xóa thất bại", error);
          }
      },
    },
    {
      label: "Gửi tin nhăn",
      color: "primary",
      onClick: (item) => openMessageModal(),
    },
    {
      label: (item) => (item.employer_status===1? "Khóa" : "Mở khóa"),
      color: (item) => item.employer_status === 1 ? "dark" : "success",
      onClick: async (item) => {
        try {
          const newStatus = item.employer_status === 1 ? 0 : 1;
          const result = await update_employers_status({ 'status_': newStatus, 'employer_ids': [item.employer_id] });
          if (result.data) {  setNeed_reload(true); }
            }
        catch (error) 
            {  console.log("Cập nhật trạng thái thất bại", error); }
      },
    },
    {
      label: "Đặt lại mật khẩu",
      color: "info",
      onClick: async (item) => {
        try {
          const result =await reset_Password(item.employer_id);
          if (result.data) {
              alert(`Reset mật khẩu cho: ${item.company_name} thành công`);
              setNeed_reload(true); // Cập nhật state để reload
          } 
        }
        catch (error) {
          console.log("Xóa thất bại",error);
        }
      },
    },
  ]
}
};

export const useConfigemployertable = (need_reload, setNeed_reload) => {
  return config_employertable(need_reload, setNeed_reload);};