import express from "express";
import upload from "../config/multer.js";
import multer from "multer";


import {
  addMenuItem,
  getAllMenuItems,
  getMainCategories,
  getSubCategories,
  getMenuByCategory,
  updateMenuItem,
  deleteMenuItem
} from "../controllers/menuController.js";


import { authMiddleware, requireAdmin } from "../middleware/authMiddleware.js";


const router = express.Router();

/* ---------------------------
        PUBLIC ROUTES
----------------------------*/

// Get ALL menu items
//router.get("/", authMiddleware, requireAdmin, getAllMenuItems);


// Get all main categories (Drinks, Food…)
router.get("/", getAllMenuItems);


/* ---------------------------
       ADMIN ROUTES
----------------------------*/

// Create new menu item
router.post("/",
  authMiddleware,
  requireAdmin,
  upload.single("image"),
  addMenuItem);

  // 2. Public routes
router.get("/categories", getMainCategories);
router.get("/subcategories/:mainCategory", getSubCategories);

// 3. Dynamic route LAST
router.get("/:mainCategory/:subCategory", getMenuByCategory);


// Update menu item
router.put("/:id",upload.single("image"), updateMenuItem);

// Delete menu item
router.delete("/:id", deleteMenuItem);


export default router;
