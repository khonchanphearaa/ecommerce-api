import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import { createBakongPayment, confirmBakongPayment, getKHQRImage } from "../controllers/payment.controller.js";

const router = express.Router();

/* publoc route */

router.use(protect);
router.post("/create",protect, createBakongPayment);
router.post("/qr",protect, getKHQRImage); 
router.post("/confirm", confirmBakongPayment);

export default router;
