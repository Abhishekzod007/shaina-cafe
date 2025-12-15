import { useState, useEffect } from "react";
import useAuth from "../../hooks/useAuth";

export default function OrderTracking() {
  const { token } = useAuth();
  const [activeOrders, setActiveOrders] = useState([]);

  const loadOrders = async () => {
    try {
      const res = await fetch("https://shaina-cafe-backend.onrender.com/api/orders/my-orders", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (!res.ok) return;

      // Keep only orders that are NOT completed/cancelled
      const liveOrders = data.orders.filter(
        (o) => o.status !== "completed" && o.status !== "cancelled"
      );

      setActiveOrders(liveOrders);
    } catch (err) {
      console.error("Track order error:", err);
    }
  };

  useEffect(() => {
    loadOrders();              // initial load
    const interval = setInterval(loadOrders, 5000); // auto-refresh
    return () => clearInterval(interval);
  }, []);

  if (!activeOrders.length)
    return <p>No ongoing orders right now.</p>;

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Track Your Order (Live)</h2>

      {activeOrders.map((order) => (
        <div
          key={order._id}
          className="border border-amber-300 p-4 rounded-lg mb-4 bg-white shadow"
        >
          <p className="font-bold text-lg">{order.orderId}</p>

          <p className="text-amber-700 text-md mt-1">
            Status: <b className="capitalize">{order.status}</b>
          </p>

          {/* progress bar */}
          <div className="mt-3 w-full bg-amber-100 h-2 rounded">
            <div
              className="bg-amber-600 h-2 rounded transition-all"
              style={{ width: getProgress(order.status) }}
            ></div>
          </div>
        </div>
      ))}
    </div>
  );
}

// 🔥 Status → Progress Bar Mapping
function getProgress(status) {
  switch (status) {
    case "pending": return "10%";
    case "placed": return "30%";
    case "preparing": return "60%";
    case "ready": return "90%";
    case "completed": return "100%";
    default: return "0%";
  }
}
