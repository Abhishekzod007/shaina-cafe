// CartDrawer.jsx
import { motion } from "framer-motion";
import useCart from "../hooks/useCart";
import { useNavigate } from "react-router-dom";

export default function CartDrawer({ isOpen, onClose }) {
  const { cart, total, increaseQty, decreaseQty, removeItem } = useCart();
  const navigate = useNavigate();

  const goCheckout = () => {
    onClose();
    navigate("/checkout", { state: { cartBackup: cart, totalBackup: total } });
  };

  return (
    <>
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
        />
      )}

      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: isOpen ? 0 : "100%" }}
        transition={{ type: "spring", stiffness: 250, damping: 25 }}
        className="fixed top-0 right-0 h-full w-80 bg-white shadow-2xl p-5 z-50 overflow-y-auto"
      >
        <h2 className="text-2xl font-bold mb-4">Your Cart</h2>

        {cart.length === 0 ? (
          <p className="text-amber-700">Your cart is empty.</p>
        ) : (
          <>
            {cart.map((item) => {
              // const basePrice = Number(item.basePrice ?? 0);
              // const addonTotal =
              //   item.addonTotal ??
              //   (item.addons?.reduce(
              //     (sum, a) => sum + Number(a.price || 0),
              //     0
              //   ) ||
              //     0);

              const finalItemPrice = Number(item.price); // already base + addons

              return (
                <div
                  key={item.id}
                  className="border-b border-gray-200 pb-4 mb-4"
                >
                  {/* Top row: image + info + remove */}
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.img || "/assets/placeholder.png"}
                        alt={item.name}
                        className="w-16 h-16 rounded-full object-cover border border-amber-300"
                      />

                      <div>
                        <h3 className="text-lg font-semibold">{item.name}</h3>

                        <p className="text-sm text-gray-700">
                          Variant:{" "}
                          <span className="font-medium">{item.variant}</span>
                        </p>

                        {/* ⭐ Add-ons list */}
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

                        {/* Line total with addons */}
                        <p className="text-sm text-amber-700 font-semibold mt-1">
                          ₹{finalItemPrice} × {item.qty} ={" "}
                          <span className="font-bold">
                            ₹{finalItemPrice * item.qty}
                          </span>
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-red-500 text-xl font-bold px-2"
                    >
                      ✕
                    </button>
                  </div>

                  {/* Qty controls row */}
                  <div className="flex items-center justify-center gap-3 mt-3">
                    <button
                      onClick={() => decreaseQty(item.id)}
                      className="px-3 py-1 bg-amber-200 rounded-lg font-bold text-lg"
                    >
                      -
                    </button>
                    <span className="font-bold text-lg">{item.qty}</span>
                    <button
                      onClick={() => increaseQty(item.id)}
                      className="px-3 py-1 bg-amber-200 rounded-lg font-bold text-lg"
                    >
                      +
                    </button>
                  </div>
                </div>
              );
            })}

            <h2 className="text-xl font-bold mt-2">Total: ₹{total}</h2>

            <button
              onClick={goCheckout}
              className="mt-4 w-full bg-amber-600 text-white py-2 rounded-lg hover:bg-amber-700"
            >
              Checkout
            </button>
          </>
        )}
      </motion.div>
    </>
  );
}
