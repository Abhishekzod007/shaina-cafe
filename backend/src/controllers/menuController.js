import MenuItem from "../models/MenuItem.js";
import cloudinary from "../config/cloudinary.js";

// ----------------------------------------------------------
// ADD NEW MENU ITEM (ADMIN)
// ----------------------------------------------------------
export const addMenuItem = async (req, res) => {
  try {
    const { name, mainCategory, subCategory, description, tags , addons } = req.body;

    if (!name || !mainCategory || !subCategory) {
      return res.status(400).json({ msg: "Required fields missing" });
    }

    // Parse variants array from FormData string → array
    let variantArray = [];
    if (req.body.variantCategory) {
      try {
        variantArray = JSON.parse(req.body.variantCategory);
      } catch (err) {
        console.log("Variant parsing error:", err);
      }
    }
    let addonsArray = [];
if (req.body.addons) {
  try {
    addonsArray = JSON.parse(req.body.addons);
  } catch (err) {
    console.log("Addon parse error:", err);
  }
}

    let imageUrl = "";
    let imagePublicId = "";

    // If image uploaded
    if (req.file) {
      imageUrl = req.file.path;
      imagePublicId = req.file.filename;
    }

    const item = await MenuItem.create({
      name,
      mainCategory,
      subCategory,
      variantCategory: variantArray,
      description,
      tags: tags ? tags.split(",").map((t) => t.trim()) : [],
      image: imageUrl,
      imagePublicId,
      addons: addonsArray 
    });

    res.json({ msg: "Menu item created", item });
  } catch (err) {
    console.error("Menu create error:", err);
    res.status(500).json({ msg: "Server error" });
  }
};

// ----------------------------------------------------------
// GET ALL MENU ITEMS
// ----------------------------------------------------------
export const getAllMenuItems = async (req, res) => {
  try {
    const items = await MenuItem.find().sort({ createdAt: -1 });
    res.json({ items });
  } catch (err) {
    console.error("Fetch menu error:", err);
    res.status(500).json({ msg: "Server error" });
  }
};

// ----------------------------------------------------------
// GET UNIQUE MAIN CATEGORIES
// ----------------------------------------------------------
export const getMainCategories = async (req, res) => {
  try {
    const categories = await MenuItem.distinct("mainCategory");
    res.json(categories);
  } catch (err) {
    console.error("Main categories error:", err);
    res.status(500).json({ msg: "Server error" });
  }
};

// ----------------------------------------------------------
// GET SUBCATEGORIES BY MAIN CATEGORY
// ----------------------------------------------------------
export const getSubCategories = async (req, res) => {
  try {
    const { mainCategory } = req.params;

    const subs = await MenuItem.distinct("subCategory", { mainCategory });

    res.json(subs);
  } catch (err) {
    console.error("Sub categories error:", err);
    res.status(500).json({ msg: "Server error" });
  }
};

// ----------------------------------------------------------
// GET ITEMS BY CATEGORY / SUBCATEGORY
// ----------------------------------------------------------
export const getMenuByCategory = async (req, res) => {
  try {
    const { mainCategory, subCategory } = req.params;

    const filter = {};
    if (mainCategory) filter.mainCategory = mainCategory;
    if (subCategory) filter.subCategory = subCategory;

    const items = await MenuItem.find(filter);

    res.json(items);
  } catch (err) {
    console.error("Get menu category error:", err);
    res.status(500).json({ msg: "Server error" });
  }
};

// ----------------------------------------------------------
// UPDATE MENU ITEM (ADMIN)
// ----------------------------------------------------------
export const updateMenuItem = async (req, res) => {
  try {
    const { id } = req.params;

    // Parse variants properly from FormData
    let variantArray = [];
    if (req.body.variantCategory) {
      try {
        variantArray = JSON.parse(req.body.variantCategory);
      } catch (err) {
        console.log("Variant parse error:", err);
      }
    }

    let addonsArray = [];
if (req.body.addons) {
  try {
    addonsArray = JSON.parse(req.body.addons);
  } catch (err) {
    console.log("Addon parse error:", err);
  }
}

    // Build new data object
    const updateData = {
      name: req.body.name,
      mainCategory: req.body.mainCategory,
      subCategory: req.body.subCategory,
      variantCategory: variantArray,
      description: req.body.description,
      tags: req.body.tags
        ? req.body.tags.split(",").map((t) => t.trim())
        : [],
          addons: addonsArray
    };

    // If image uploaded
    if (req.file) {
      updateData.image = req.file.path;
      updateData.imagePublicId = req.file.filename;
    }

    const updated = await MenuItem.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!updated) return res.status(404).json({ msg: "Menu item not found" });

    res.json({ msg: "Item updated", updated });
  } catch (err) {
    console.error("Update menu error:", err);
    res.status(500).json({ msg: "Server error" });
  }
};

// ----------------------------------------------------------
// DELETE MENU ITEM
// ----------------------------------------------------------
export const deleteMenuItem = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await MenuItem.findByIdAndDelete(id);

    if (!deleted)
      return res.status(404).json({ msg: "Menu item not found" });

    res.json({ msg: "Item deleted successfully" });
  } catch (err) {
    console.error("Delete menu error:", err);
    res.status(500).json({ msg: "Server error" });
  }
};
