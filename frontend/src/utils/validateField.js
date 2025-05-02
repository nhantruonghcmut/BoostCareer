export function validateField(name, value, formValues = {}) {
  if (typeof value === "string" && value.trim() === "") {
    return `${name} không được để trống`;
  }

  switch (name) {
    case "username":
      if (value.length < 5 || value.length > 30) {
        return "Tên đăng nhập phải từ 5-30 ký tự";
      }
      break;
    case "name":
      if (value.length < 5 || value.length > 30) {
        return "Họ và tên phải từ 5-30 ký tự";
      }
      break;
    case "major":
      if (value.length < 5 || value.length > 30) {
        return "Chuyên ngành phải từ 5-30 ký tự";
      }
      break;
    case "school":
      if (value.length < 5 || value.length > 30) {
        return "Trường học phải từ 5-30 ký tự";
      }
      break;
    case "project_name":
      if (value.length < 5 || value.length > 30) {
        return "Tên dự án phải từ 5-30 ký tự";
      }
      break;
    case "phone":
      if (!/^[0-9]{7,14}$/.test(value)) {
        return "Số điện thoại phải từ 7-14 chữ số";
      }
      break;
    case "email":
      if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(value)) {
        return "Email không đúng định dạng";
      }
      break;
    case "password":
      if (value.length < 8) {
        return "Mật khẩu phải có ít nhất 8 ký tự";
      }
      break;
    case "exp_from":
      if (
        formValues.exp_from &&
        formValues.exp_to &&
        new Date(formValues.exp_to) < new Date(formValues.exp_from)
      ) {
        return "Ngày kết thúc phải sau ngày bắt đầu";
      }
      break;
    case "exp_to":
      if (
        formValues.exp_from &&
        formValues.exp_to &&
        new Date(formValues.exp_to) < new Date(formValues.exp_from)
      ) {
        return "Ngày kết thúc phải sau ngày bắt đầu";
      }
      break;
    case "expectedSalary":
      if (value < 1000000) {
        return "Mức lương mong muốn phải lớn hơn hoặc bằng 1 triệu";
      }
      break;
    case "exp_title":
      if (value.length < 5 || value.length > 30) {
        return "Chức danh phải từ 5-30 ký tự";
      }
      break;
    case "exp_company":
      if (value.length < 5 || value.length > 30) {
        return "Tên công ty phải từ 5-30 ký tự";
      }
      break;
    case "from_":
      if (
        formValues.from_ &&
        formValues.to_ &&
        new Date(formValues.to_) < new Date(formValues.from_)
      ) {
        return "Ngày kết thúc phải sau ngày bắt đầu";
      }
      break;
    case "to_":
      if (
        formValues.from_ &&
        formValues.to_ &&
        new Date(formValues.to_) < new Date(formValues.from_)
      ) {
        return "Ngày kết thúc phải sau ngày bắt đầu";
      }
      break;
    case "project_from":
      if (
        formValues.project_from &&
        formValues.project_to &&
        new Date(formValues.project_to) < new Date(formValues.project_from)
      ) {
        return "Ngày kết thúc phải sau ngày bắt đầu";
      }
      break;
    case "project_to":
      if (
        formValues.project_from &&
        formValues.project_to &&
        new Date(formValues.project_to) < new Date(formValues.project_from)
      ) {
        return "Ngày kết thúc phải sau ngày bắt đầu";
      }
      break;
    default:
      break;
  }

  return ""; // Nếu không lỗi
}
