import { useState, useEffect } from "react";
import CartContext from "./CartContextObject";

export default function CartProvider({ children }) {
  const loadCart = () => {
    try {
      const saved = localStorage.getItem("cart");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  };

  const [cart, setCart] = useState(loadCart());
  const [toast, setToast] = useState(null);
  const [flyData, setFlyData] = useState(null);

  const startFlyAnimation = (start, end, img) => {
    setFlyData({ start, end, img });
    setTimeout(() => setFlyData(null), 900);
  };

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2000);
  };

  const showSuccess = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  const addToCart = (item) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === item.id);

      if (existing) {
        showToast("Increased quantity");
        return prev.map((i) =>
          i.id === item.id ? { ...i, qty: i.qty + 1 } : i
        );
      }

      showToast("Added to cart");
      return [...prev, { ...item, qty: 1 }];
    });
  };

  const increaseQty = (id) => {
    setCart((prev) =>
      prev.map((i) => (i.id === id ? { ...i, qty: i.qty + 1 } : i))
    );
  };

  const decreaseQty = (id) => {
    setCart((prev) =>
      prev.map((i) =>
        i.id === id ? { ...i, qty: Math.max(1, i.qty - 1) } : i
      )
    );
  };

  const removeItem = (id) => {
    setCart((prev) => prev.filter((i) => i.id !== id));
  };

  // ⭐ TOTAL includes addons
  const total = cart.reduce((sum, i) => {
    const perUnit = Number(i.price); // already final


    return sum + perUnit * i.qty;
  }, 0);

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("cart");
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        increaseQty,
        decreaseQty,
        removeItem,
        total,
        toast,
        showToast,
        showSuccess,
        flyData,
        startFlyAnimation,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
