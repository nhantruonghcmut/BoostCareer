const db = require("../config/databaseConfig.js");

// Tìm người dùng bằng tên đăng nhập
const findUserByUsername = async (username) => {
  const [rows] = await db.query("SELECT * FROM user_ WHERE username = ?", [
    username,
  ]);
  return rows[0]; // Trả về người dùng đầu tiên nếu tìm thấy
};

//Đăng nhập - login
const loginExecute = async (username, password) => {
  const [rows] = await db.query(
    "SELECT * FROM user_ WHERE username = ? and password_ = ?",
    [username, password]
  );
  return rows[0];
};

const register_user = async (username, full_name, phone_number, email, password, role ) => {
  const connection = await db.getConnection(); 
  try {
    console.log("role",role);
    await connection.beginTransaction();
    if (role==="3")     
      { await db.query( 'CALL create_user_jobseeker(?,?,?,?,?,@p_status);',
                        [username,full_name,phone_number,email, password]);}
    else
      { await db.query( 'CALL create_user_employer(?,?,?,?,?,@p_status);',
                        [username,full_name,phone_number,email, password]);}
    const [[{ newid }]] = await db.query('SELECT @p_status as newid;');
    await connection.commit();
    console.log(newid);
    if (newid != 0) {
      const [rows] = await db.query(
        "SELECT * FROM user_ WHERE user_id = ?", [newid] );
      return rows[0]; // return user mới tạo
    }

    return newid; // return 0 nếu không tạo được user
  
} catch (error) {
  // Rollback nếu có lỗi
  await connection.rollback();
  console.error("Error logs hệ thống:", error);
  return -1;
}
finally {
  // Đóng connection để tránh rò rỉ
  connection.release();
}
};

module.exports = { findUserByUsername, loginExecute,register_user};

