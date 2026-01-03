import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import { isAdmin } from "../middlewares/admin.middleware.js";
import { createBakongPayment, confirmBakongPayment, getKHQRImage } from "../controllers/payment.controller.js";

const router = express.Router();

/* USER routes */
router.use(protect);
router.post("/create",protect, createBakongPayment);
router.post("/qr",protect, getKHQRImage);

/* Admin routes */
router.post("/confirm",protect, isAdmin, confirmBakongPayment);

export default router;
