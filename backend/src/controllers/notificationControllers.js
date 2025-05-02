// Create a basic structure for the notification controller


const getNotifications = async (req, res, next) => {
  try {
    const id = req.query.id;
    
    if (!id) {
      return next(new ApiError("Thiếu thông tin ID người dùng", 400));
    }
    
    const notification = await queryGetNotificationByID(id);
    
    if (!notification) {
      return next(new ApiError("Không tìm thấy thông báo", 404));
    }
    
    return res.success({ notification }, "Lấy thông tin thông báo thành công");
  } catch (err) {
    return next(new ApiError("Có lỗi khi lấy thông tin thông báo", 500));
  }
};

module.exports = {
  getNotifications,
};