import { format, isValid, parseISO, parse } from "date-fns";
import { vi } from "date-fns/locale";
const formatSafeDate = (dateString, formatPattern = "dd/MM/yyyy") => {
  if (!dateString) return "N/A";
  
  try {
    let date;
    
    // Nếu đã là đối tượng Date
    if (dateString instanceof Date) {
      date = dateString;
    } 
    // Nếu là chuỗi ISO đầy đủ (với T và Z)
    else if (typeof dateString === 'string' && dateString.includes('T')) {
      date = parseISO(dateString);
    }
    // Nếu là chuỗi YYYY-MM-DD đơn giản
    else if (typeof dateString === 'string' && dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
      date = parse(dateString, 'yyyy-MM-dd', new Date());
    }
    // Nếu là chuỗi DD-MM-YYYY
    else if (typeof dateString === 'string' && dateString.match(/^\d{2}-\d{2}-\d{4}$/)) {
      date = parse(dateString, 'dd-MM-yyyy', new Date());
    }
    // Nếu là chuỗi DD/MM/YYYY
    else if (typeof dateString === 'string' && dateString.match(/^\d{2}\/\d{2}\/\d{4}$/)) {
      date = parse(dateString, 'dd/MM/yyyy', new Date());
    }
    // Trường hợp còn lại, thử với constructor Date
    else {
      date = new Date(dateString);
    }
    
    if (!isValid(date)) return "N/A";
    return format(date, formatPattern, { locale: vi });
  } catch (error) {
    console.error("Date formatting error:", error);
    return "N/A";
  }
};

export default formatSafeDate;