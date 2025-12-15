// src/models/Order.js
import mongoose from "mongoose";

// ------------------------------
// Add-on Schema
// ------------------------------
const addonSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true }
});

// ------------------------------
// Order Item Schema
// ------------------------------
const itemSchema = new mongoose.Schema({
  itemId: { type: mongoose.Schema.Types.ObjectId, ref: "MenuItem", required: false },
  name: { type: String, required: true },
  variant: { type: String },

  basePrice: { type: Number, required: true },
  addonTotal: { type: Number, default: 0 },

  addons: [
    {
      name: String,
      price: Number
    }
  ],

  qty: { type: Number, required: true },
  price: { type: Number, required: true }, // final price = base + addons
  image: { type: String }
});



// ------------------------------
// Main Order Schema
// ------------------------------
const orderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      unique: true,
      required: true
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false // allow guest orders
    },

    items: {
      type: [itemSchema],
      validate: [(arr) => arr.length > 0, "Order must have at least one item"]
    },

    total: {
      type: Number,
      required: true
    },

    customer: {
      name: { type: String, required: true },
      phone: { type: String, required: true },
      address: { type: String, required: true }
    },

    status: {
      type: String,
      enum: ["pending", "placed", "preparing", "ready", "completed", "cancelled"],
      default: "placed"
    },

    paymentId: { type: String }
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
