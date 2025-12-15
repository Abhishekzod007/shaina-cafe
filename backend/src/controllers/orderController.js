// src/controllers/orderController.js
import Order from "../models/Order.js";
import { generateOrderId } from "../utils/generateOrderId.js";
import { getIO } from "../socket.js";

export const placeOrder = async (req, res) => {
  try {
    // allow guest orders (no auth) — if you later want auth, use req.user
    const { items, total, customer, paymentId } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ msg: "Cart is empty" });
    }

    // validate customer
    if (!customer || !customer.name || !customer.phone || !customer.address) {
      return res.status(400).json({ msg: "Customer details required" });
    }

    // sanitize items: ensure numeric price and numeric qty
    const cleanedItems = items.map((it) => {
  const basePrice = Number(it.basePrice) || 0;
  const addonTotal = Number(it.addonTotal) || 0;
  const addons = Array.isArray(it.addons) ? it.addons : [];
  const price = Number(it.price) || basePrice + addonTotal;

  return {
    itemId: it.itemId || it._id || undefined,
    name: it.name,
    variant: it.variant,
    qty: Number(it.qty) || 1,

    basePrice,
    addonTotal,
    addons,

    price, // final per-unit price

    image: it.image || it.img || ""
  };
});



    // ensure numeric total (frontend's savedTotal should be numeric)
    const numericTotal = Number(total) 

    const orderObj = {
      orderId: generateOrderId(),
      items: cleanedItems,
      total: numericTotal,
      customer,
      paymentId: paymentId || undefined,
      status: "pending"
    };

    // If user is logged (you might have auth), attach userId
    if (req.user && req.user.id) {
      orderObj.userId = req.user.id;
    }

    const order = await Order.create(orderObj);
    const io = getIO();

io.emit("new-order", {
  orderId: order._id,
  orderNo: order.orderId,
  status: order.status,
  createdAt: order.createdAt,
});
    return res.status(201).json({ msg: "Order placed", order });
  } catch (err) {
    console.error("Place order error:", err);
    return res.status(500).json({ msg: "Server error", error: err.message });
  }
};

export const getUserOrders = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ msg: "Unauthorized" });
    }
    const userId = req.user.id;
    const orders = await Order.find({ userId }).sort({ createdAt: -1 });
    res.json({ orders });
  } catch (err) {
    console.error("User orders error:", err);
    res.status(500).json({ msg: "Server error" });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    return res.json({ orders });
  } catch (err) {
    console.error("Admin get all orders error:", err);
    res.status(500).json({ msg: "Server error" });
  }
};

export const updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const valid = ["pending", "placed", "preparing", "ready", "completed", "cancelled"];
    if (!valid.includes(status)) {
      return res.status(400).json({ msg: "Invalid status" });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!order) return res.status(404).json({ msg: "Order not found" });

    res.json({ msg: "Status updated", order });
  } catch (err) {
    console.error("Update status error:", err);
    res.status(500).json({ msg: "Server error" });
  }
};

export const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) return res.status(404).json({ msg: "Order not found" });
    res.json({ msg: "Order deleted" });
  } catch (err) {
    console.error("Delete order error:", err);
    res.status(500).json({ msg: "Server error" });
  }
};
