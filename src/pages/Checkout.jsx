import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useCart from "../hooks/useCart";
import { motion } from "framer-motion";
import useAuth from "../hooks/useAuth";

export default function Checkout() {
  const navigate = useNavigate();
  const { cart, total, clearCart } = useCart();
  const { user, token } = useAuth();
useEffect(() => {
  if (!token) {
    navigate("/login?redirect=/checkout");
  }
}, [token]);
  const [placed, setPlaced] = useState(false);
  const [loading, setLoading] = useState(false);
  const [finalOrderId, setFinalOrderId] = useState(null);
  const [paymentId, setPaymentId] = useState(null);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
  });

  const [errors, setErrors] = useState({});

  // AUTO-FILL USER DETAILS
  useEffect(() => {
    if (user) {
      setForm((prev) => ({
        ...prev,
        name: user.name || "",
        phone: user.phone || "",
      }));
    }
  }, [user]);

  // VALIDATION
  const validate = () => {
    const e = {};

    if (!form.name.trim()) e.name = "Name is required";
    if (!form.phone.trim()) e.phone = "Phone is required";
    if (form.phone && !/^\d{10}$/.test(form.phone))
      e.phone = "Enter valid 10-digit number";
    if (!form.address.trim()) e.address = "Address is required";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: null }));
  };

  // FINAL ORDER SAVE
  const finalizeOrder = async (paymentId) => {
    try {
      setLoading(true);

      const cleanedItems = cart.map((item) => {
        const basePrice = Number(item.basePrice || 0);
        const addonTotal = Number(item.addonTotal || 0);
        const finalPrice = Number(item.price); // already correct

        return {
          itemId: item._id || item.itemId || null,
          name: item.name,



          variant: item.variant,
          addons: item.addons || [],
          qty: item.qty,

          basePrice,
          addonTotal,
          price: finalPrice,

          image: item.img,
        };
      });

      const res = await fetch("http://localhost:5000/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({
          customer: form,
          items: cleanedItems,
          total,
          paymentId,
          status: "placed",
          userId: user ? user.id : null,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setFinalOrderId(data.order.orderId);
        setPaymentId(paymentId);
        setPlaced(true);
        clearCart();
      } else {
        alert(data.msg || "Failed to place order");
      }
    } catch (err) {
      console.error("Order error:", err);
      alert("Server error");
    } finally {
      setLoading(false);
    }
  };

  // START PAYMENT
  const startPayment = () => {
    if (!validate()) return;

    const fakePaymentId = "TEST_PAY_" + Date.now();
    finalizeOrder(fakePaymentId);
  };

  // SUCCESS PAGE
  if (placed) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col items-center px-6 py-10 text-green-700"
      >
        <div className="text-6xl mb-3">🎉</div>
        <h1 className="text-3xl font-bold">Payment Successful!</h1>

        <div className="bg-white shadow-md rounded-xl p-6 w-full max-w-lg border border-amber-200 text-amber-900">
          <h2 className="text-xl font-bold mb-2">Order Summary</h2>

          <p><b>Order ID:</b> {finalOrderId}</p>
          <p><b>Payment ID:</b> {paymentId}</p>
          <p><b>Date:</b> {new Date().toLocaleString()}</p>

          <div className="border-t mt-3 pt-3">
            <p><b>Name:</b> {form.name}</p>
            <p><b>Phone:</b> {form.phone}</p>
            <p><b>Address:</b> {form.address}</p>
          </div>
        </div>

        <button
          onClick={() => navigate("/")}
          className="mt-6 px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700"
        >
          Back to Home
        </button>
      </motion.div>
    );
  }

  // CHECKOUT PAGE
  return (
    <div className="max-w-4xl mx-auto px-6 py-10 text-amber-900">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>

      <div className="bg-white rounded-xl p-6 shadow">
        <h2 className="text-xl font-semibold mb-4">Your Details</h2>

        {/* DETAILS FORM */}
        <div className="flex flex-col gap-3">
          <input
            name="name"
            value={form.name}
            placeholder="Your Name"
            onChange={handleChange}
            className="w-full border p-3 rounded-lg bg-amber-100"
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}

          <input
            name="phone"
            value={form.phone}
            placeholder="Phone Number"
            onChange={handleChange}
            className="w-full border p-3 rounded-lg bg-amber-100"
          />
          {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}

          <textarea
            name="address"
            value={form.address}
            placeholder="Full Address"
            onChange={handleChange}
            className="w-full border p-3 rounded-lg bg-amber-100 min-h-[90px]"
          />
          {errors.address && <p className="text-red-500 text-sm">{errors.address}</p>}
        </div>

        <h2 className="text-xl font-semibold mt-6 mb-3">Order Summary</h2>

        {/* ORDER ITEMS */}
        <div className="space-y-3">
          {cart.map((item) => {
            const basePrice = Number(item.basePrice || 0);
            const addonTotal = Number(item.addonTotal || 0);
            const finalPrice = Number(item.price);

            return (
              <div key={item.id} className="flex justify-between py-2 border-b">
                <div className="flex flex-col">
                  <span className="font-semibold">{item.name}</span>

                  <span className="text-sm text-gray-700">
                    Variant: <span className="font-medium">{item.variant}</span>
                  </span>

                  {item.addons?.length > 0 && (
                    <div className="mt-1">
                      <p className="text-sm font-semibold text-gray-700">
                        Add-ons:
                      </p>
                      {item.addons.map((addon, i) => (
                        <p key={i} className="text-xs text-gray-600">
                          ➕ {addon.name} (+₹{addon.price})
                        </p>
                      ))}
                    </div>
                  )}

                  {/* PRICE BREAKDOWN */}
                  <p className="text-xs text-gray-600 mt-1">
                    Base: ₹{basePrice}{" "}
                    {addonTotal > 0 && <>| Add-ons: ₹{addonTotal}</>}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-sm text-amber-700 font-semibold">
                    ₹{finalPrice} × {item.qty}
                  </p>
                  <p className="font-bold">₹{finalPrice * item.qty}</p>
                </div>
              </div>
            );
          })}
        </div>

        <h2 className="text-2xl font-bold mt-4">Total: ₹{total}</h2>

        <button
          onClick={startPayment}
          disabled={loading}
          className="mt-6 w-full py-3 bg-amber-600 text-white font-semibold rounded-lg hover:bg-amber-700"
        >
          {loading ? "Processing..." : "Place Order"}
        </button>
      </div>
    </div>
  );
}
