// Cart.jsx
import useCart from "../hooks/useCart";

export default function Cart() {
  const { cart, increaseQty, decreaseQty, removeItem, total } = useCart();

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 text-amber-900">
      <h1 className="text-3xl font-bold mb-8">Your Cart</h1>

      {cart.length === 0 ? (
        <p className="text-gray-600 text-lg">Your cart is empty.</p>
      ) : (
        <div className="space-y-6">
          {cart.map((item) => {
            // ⭐ FINAL FIX → price already contains (basePrice + addonTotal)
            const finalItemPrice = Number(item.price);

            return (
              <div
                key={item.id}
                className="flex items-center justify-between bg-white p-4 rounded-xl shadow"
              >
                {/* LEFT SIDE - IMG + DETAILS */}
                <div className="flex items-center gap-4">
                  <img
                    src={item.img || "/assets/placeholder.png"}
                    alt={item.name}
                    className="w-20 h-20 rounded-xl border border-amber-300 object-cover"
                  />

                  <div>
                    <h2 className="text-lg font-semibold">{item.name}</h2>

                    <p className="text-sm text-gray-700">
                      Variant:{" "}
                      <span className="font-medium">{item.variant}</span>
                    </p>

                    {/* ⭐ SHOW ADDONS */}
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

                    {/* PRICE DISPLAY */}
                    <p className="text-sm text-amber-700 font-semibold mt-1">
                      ₹{finalItemPrice} × {item.qty} ={" "}
                      <span className="font-bold">
                        ₹{finalItemPrice * item.qty}
                      </span>
                    </p>
                  </div>
                </div>

                {/* RIGHT SIDE - BUTTONS */}
                <div className="flex items-center gap-3">
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

                  <button
                    onClick={() => removeItem(item.id)}
                    className="px-3 py-1 bg-red-500 text-white rounded-lg"
                  >
                    Remove
                  </button>
                </div>
              </div>
            );
          })}

          {/* CART TOTAL */}
          <h2 className="text-2xl font-bold mt-6">
            Total: <span className="text-amber-700">₹{total}</span>
          </h2>
        </div>
      )}
    </div>
  );
}
