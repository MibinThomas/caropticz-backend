import express from "express";
import serviceController from "../controllers/serviceController.js";

const router = express.Router();

router.get("/", serviceController.getAllServices);
router.get("/:id", serviceController.getServiceById);
router.get("/category/:name", serviceController.getServiceByCategoryName);


export default router;