import express from "express";
// import userNotification from "../controllers/User/notificationAdminController.js";
import { userNotifcation } from "../controllers/User/notificationUserController.js";

const router = express.Router();

router.get('/',userNotifcation.getUserNotifications)

router.patch('/:id/read',userNotifcation.markUserNotificationAsRead)


export default router;