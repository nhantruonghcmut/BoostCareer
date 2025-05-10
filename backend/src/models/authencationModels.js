const db = require("../config/databaseConfig.js");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const generateTokens = (userLogin) => {
  // Access token chứa thông tin cần thiết cho xác thực
  const accessToken = jwt.sign(
    {
      id: userLogin.user_id,
      role: userLogin.role_id,
      // Không nên đưa thông tin nhạy cảm vào token
    }, 
    process.env.JWT_SECRET,
    { expiresIn: '1h' } // Token hết hạn sau 1h
  );

  // Refresh token để cấp mới access token
  const refreshToken = jwt.sign(
    { id: userLogin.user_id },
    process.env.JWT_REFRESH_SECRET, 
    { expiresIn: '7d' } // Refresh token tồn tại 7 ngày
  );

  return {
    accessToken,
    refreshToken
  };
};
// Tìm người dùng bằng tên đăng nhập
const findUserByUsername = async (username) => {
  const [rows] = await db.query("SELECT * FROM user_ WHERE username = ?", [
    username,
  ]);
  return rows[0]; // Trả về người dùng đầu tiên nếu tìm thấy
};

//Đăng nhập - login
const loginExecute = async (username, password) => {
  try {
    const [rows] = await db.query(
      `SELECT * FROM user_ WHERE username = ?`,
      [username]
    );
    if (rows.length === 0) return null;
    
    const user = rows[0];
    const validPassword = await bcrypt.compare(password, user.password_);
    if (!validPassword) return null;
    const { password_, ...userWithoutPassword } = user;
    // console.log("userWithoutPassword", userWithoutPassword);
    if (Number(userWithoutPassword.role_id) === 2) {
      const [avatar] = await db.query(
        `SELECT  logo    
        FROM company WHERE company_id = ?`,
        [user.user_id]
      );
      return { ...userWithoutPassword, logo: avatar[0]?.logo }; // Trả về người dùng đầu tiên nếu tìm thấy
    } else if (Number(userWithoutPassword.role_id) === 3) {
      const [avatar] = await db.query(
        `SELECT  avatar  as logo  
        FROM user_jobseeker WHERE jobseeker_id = ?`,
        [user.user_id]
      );
      // console.log("tra ve frontend");
      return { ...userWithoutPassword, logo: avatar[0]?.logo }; // Trả về người dùng đầu tiên nếu tìm thấy
    }
  } catch (error) {
    console.error("Lỗi khi thực hiện truy vấn:", error);
    throw error; // Ném lỗi để xử lý ở nơi khác nếu cần
  }
};

const registerExecute = async (
  role,
  username,
  name,
  password,
  email,
  phone
) => {
  // console.log("role", role);
  const salt = await bcrypt.genSalt(Number(process.env.PASSWORD_SALT_ROUNDS));
  const hashedPassword = await bcrypt.hash(password, salt);
  
  let connection;
  try {
    connection = await db.getConnection(); // Lấy kết nối từ pool
    await connection.beginTransaction(); // Bắt đầu giao dịch
    const create_at = new Date();
    const [user] = await db.query(
      `INSERT INTO user_ (username,password_,email, phone_number, create_at, role_id) VALUES (?, ?, ?, ?, ?, ?)`,
      [username, hashedPassword, email, phone, create_at, role]
    );
    if (!user.insertId) {
      throw new Error("Không thể tạo người dùng mới");
    }
    if (Number(role) === 2) {
      const [user_employer] = await db.query(
        `INSERT INTO user_employer (employer_id, status_) VALUES (?, ?)`,
        [user.insertId, 1] // Trạng thái mặc định là 1 (hoạt động)
      );
      if (user_employer.affectedRows === 0) {
        throw new Error("Không thể tạo người dùng nhà tuyển dụng mới");
      }
      const [company] = await db.query(
        `INSERT INTO company (company_id, company_name, phone_number) VALUES (?, ?,?)`,
        [user.insertId, name, phone] // Trạng thái mặc định là 1 (hoạt động)
      );
      if (company.affectedRows === 0) {
        throw new Error("Không thể tạo công ty mới");
      }
    } else if (Number(role) === 3) {
      const [user_jobseeker] = await db.query(
        `INSERT INTO user_jobseeker (jobseeker_id, status_) VALUES (?, ?)`,
        [user.insertId, 1] // Trạng thái mặc định là 1 (hoạt động)
      );
      if (user_jobseeker.affectedRows === 0) {
        throw new Error("Không thể tạo người dùng ứng viên mới");
      }
      const [profile_jobseeker] = await db.query(
        `INSERT INTO profile_jobseeker (profile_id, full_name, create_at) VALUES (?, ?, ?)`,
        [user.insertId, name, create_at] // Trạng thái mặc định là 1 (hoạt động)
      );
      if (profile_jobseeker.affectedRows === 0) {
        throw new Error("Không thể tạo hồ sơ ứng viên mới");
      }
    } else {
      throw new Error("Kiểu người dùng không hợp lệ");
    }
    await connection.commit();
    return user.insertId; // Trả về id người dùng
  } catch (error) {
    // Chỉ rollback khi connection đã được khởi tạo
    if (connection) {
      await connection.rollback();
    }
    console.error("Error register:", error);
    throw error;
  } finally {
    // Chỉ release khi connection đã được khởi tạo
    if (connection) {
      connection.release();
    }
  }
};

module.exports = { findUserByUsername, loginExecute, registerExecute,generateTokens };
