const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
require('dotenv').config({ path: '../.env' });
const db = require("../src/config/databaseConfig.js");



const encryptExistingPasswords = async () => {
//   const connection = await mysql.createConnection({
//     host: process.env.MYSQL_LOCALHOST,
//     user: process.env.MYSQL_USER,
//     password: process.env.MYSQL_PASSWORD,
//     database: process.env.MYSQL_DB
//   });

  try {
    // Lấy tất cả user với password chưa mã hóa
    const [users] = await db.query('SELECT user_id, password_ FROM user_');
    
  // console(`Found ${users.length} users to update`);

    for (const user of users) {
      // Mã hóa password
      const salt = await bcrypt.genSalt(Number(process.env.PASSWORD_SALT_ROUNDS));
      const hashedPassword = await bcrypt.hash(user.password_, salt);

      // Cập nhật password đã mã hóa
      await db.query(
        'UPDATE user_ SET password_ = ? WHERE user_id = ?',
        [hashedPassword, user.user_id]
      );

    // console(`Updated password for user ID: ${user.user_id}`);
    }

  // console('Password encryption completed successfully!');
  } catch (error) {
    console.error('Error encrypting passwords:', error);
  } 
  
//   finally {
//     await db.end();
//   }
};

encryptExistingPasswords();