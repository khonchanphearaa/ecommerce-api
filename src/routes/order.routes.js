import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import {
  createOrder,
  getUserOrders,
  getOrderById,
  updateOrderStatus
} from "../controllers/order.controller.js";

const router = express.Router();

router.use(protect);

// User routes
router.post("/", createOrder);
router.get("/", getUserOrders);
router.get("/:id", getOrderById);

// Admin route to update status
router.put("/:id", updateOrderStatus);

export default router;
