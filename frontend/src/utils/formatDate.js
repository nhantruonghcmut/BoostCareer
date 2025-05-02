const formatDateToDDMMYYYY = (isoDateString) => {
  const date = new Date(isoDateString); // Tạo đối tượng Date từ chuỗi ISO
  const day = String(date.getDate()).padStart(2, "0"); // Lấy ngày và thêm số 0 nếu cần
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Lấy tháng (tháng bắt đầu từ 0)
  const year = date.getFullYear(); // Lấy năm
  return `${day}/${month}/${year}`; // Trả về định dạng DD/MM/YYYY
};

export default formatDateToDDMMYYYY;
