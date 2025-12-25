import express from "express";
import { register, login, logout } from "../controllers/auth.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Public routes
router.post("/register", register);
router.post("/login", login);

// Protected route
router.post("/logout", protect, logout);

export default router;
    

