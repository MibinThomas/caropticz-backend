import express from "express";
import referralController from "../controllers/referralController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
const router = express.Router();