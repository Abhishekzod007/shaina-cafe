// src/routes/orderRoutes.js
import express from "express";
import {
  placeOrder,
  getUserOrders,
  getAllOrders,
  updateStatus,
  deleteOrder
} from "../controllers/orderController.js";

import { authMiddleware, requireAdmin } from "../middleware/authMiddleware.js";
import { orderLimiter } from "../middleware/rateLimit.js";

const router = express.Router();

// Public route for placing order (guest ordering)
router.post("/",orderLimiter, authMiddleware,  placeOrder);

// If you want user-specific orders (requires login)
router.get("/my-orders", authMiddleware, getUserOrders);

// Admin routes (you can require admin here)
router.get("/", /* authMiddleware, requireAdmin, */ getAllOrders);
router.put("/:id/status", /* authMiddleware, requireAdmin, */ updateStatus);
router.delete("/:id", /* authMiddleware, requireAdmin, */ deleteOrder);

export default router;
