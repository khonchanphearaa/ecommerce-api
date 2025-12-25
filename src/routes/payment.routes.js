import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import { createPayment } from "../controllers/payment.controller.js";

const router = express.Router();

router.use(protect); // user must be logged in
router.post("/create", createPayment);

export default router;
