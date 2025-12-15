import { useState } from "react";
import MyOrders from "./MyOrders";
import Profile from "./Profile";
import OrderTracking from "./OrderTracking";

export default function UserDashboard() {
  const [tab, setTab] = useState("orders");

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 text-amber-900">
      <h1 className="text-3xl font-bold mb-6">User Dashboard</h1>

      <div className="flex gap-6 mb-8 text-lg">
        <button
          onClick={() => setTab("orders")}
          className={tab === "orders" ? "font-bold text-amber-700" : ""}
        >
          My Orders
        </button>

        <button
          onClick={() => setTab("profile")}
          className={tab === "profile" ? "font-bold text-amber-700" : ""}
        >
          Profile
        </button>

        <button
          onClick={() => setTab("track")}
          className={tab === "track" ? "font-bold text-amber-700" : ""}
        >
          Track Order
        </button>
      </div>

      {tab === "orders" && <MyOrders />}
      {tab === "profile" && <Profile />}
      {tab === "track" && <OrderTracking />}
    </div>
  );
}
