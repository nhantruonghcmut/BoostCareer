const queryGetNotificationByID = async (id) => {
    const [notification] = await db.query(
      `
          SELECT m.*, mr.*, u.username
          FROM message m
          LEFT JOIN message_recipients mr ON m.message_id = mr.message_id AND mr.recipient_id = ?
          LEFT JOIN user_ u ON mr.recipient_id = u.user_id
          WHERE m.is_global = TRUE OR mr.recipient_id IS NOT NULL
       ;
      `,
      [id]
    );
    return notification;
  };
  