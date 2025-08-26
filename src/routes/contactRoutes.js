import express from "express";
import { sendContactForm } from "../controllers/User/contactFormController.js";
// import userNotification from "../controllers/User/notificationAdminController.js";

const router = express.Router();

router.post('/',sendContactForm)



export default router;