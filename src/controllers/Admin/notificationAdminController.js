

import notifications from "../../models/NotificationModel.js";


const adminNotification = {
  getAdminNotifications: async (req, res) => {
    try {
      // Fetch system + booking notifications for admin
      const adminNotifications = await notifications
        .find({ type: { $in: ["system", "booking"] } })
        .sort({ createdAt: -1 });

      res.status(200).json({
        success: true,
        notifications: adminNotifications,
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  // Mark Admin Notification as Read
  markAdminNotificationAsRead: async (req, res) => {
    try {
      const { id } = req.params;

      await notifications.findByIdAndUpdate(id, { read: true });

      res
        .status(200)
        .json({ success: true, message: "Notification marked as read" });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
};


export default adminNotification
