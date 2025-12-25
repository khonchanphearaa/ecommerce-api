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
router.post("/add", addToCart);
router.put("/update", updateCartItem);
router.delete("/remove", removeCartItem);

export default router;
