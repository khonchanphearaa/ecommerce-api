import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem
} from "../controllers/cart.controller.js";

const router = express.Router();

router.use(protect); // All cart routes are protected

router.get("/", getCart);
router.post("/add",protect, addToCart);
router.put("/update/:productId", updateCartItem);
router.delete("/remove/:productId", removeCartItem);

export default router;
