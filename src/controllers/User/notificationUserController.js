import notifications from "../../models/NotificationModel.js";


export const userNotifcation = {
  // Fetch User Notifications
  getUserNotifications: async (req, res) => {
    try {
      const userId = req.user.id; // from JWT middleware

      const userNotifications = await notifications
        .find({ userId })
        .sort({ createdAt: -1 });

      res.status(200).json({
        success: true,
        notifications: userNotifications,
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  // Mark User Notification as Read
  markUserNotificationAsRead: async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      await notifications.findOneAndUpdate({ _id: id, userId }, { read: true });

      res
        .status(200)
        .json({ success: true, message: "Notification marked as read" });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
};
