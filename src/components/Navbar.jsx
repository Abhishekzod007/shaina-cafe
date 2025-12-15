import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import useCart from "../hooks/useCart";
import useAuth from "../hooks/useAuth";
import { motion } from "framer-motion";
import CartDrawer from "./CartDrawer";
import { cartIconRef } from "../utils/globalRefs";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);

  const localRef = useRef(null);
  const { cart } = useCart();
  const { user, role, logout } = useAuth();

  useEffect(() => {
    cartIconRef.current = localRef.current;
  }, []);

  const cartCount = cart.reduce((sum, i) => sum + i.qty, 0);

  return (
    <>
      <nav className="bg-white shadow-sm border-b border-amber-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">

          {/* LOGO */}
          <Link to="/" className="text-2xl font-bold text-amber-800">
            Shaina Café
          </Link>

          {/* DESKTOP MENU */}
          <div className="hidden md:flex items-center gap-6 text-amber-900 font-medium">

            <Link to="/menu">Menu</Link>
            <Link to="/about">About</Link>
            <Link to="/location">Location</Link>
            <Link to="/gallery">Gallery</Link>
            <Link to="/testimonials">Testimonials</Link>
            <Link to="/contact">Contact</Link>

            {/* AUTH LINKS */}
            {!user ? (
              <>
                <Link to="/login">Login</Link>
                <Link to="/signup">Signup</Link>
              </>
            ) : role === "admin" ? (
              <Link to="/admin">Dashboard</Link>
            ) : (
              <Link to="/dashboard/user">My Orders</Link>
            )}

            {user && (
              <button onClick={logout} className="text-sm ml-2">Logout</button>
            )}

            {/* CART ICON */}
            <motion.div
              ref={localRef}
              key={cartCount}
              onClick={() => setOpen(true)}
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 0.3 }}
              className="cursor-pointer relative text-2xl"
            >
              🛒
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs rounded-full px-2">
                  {cartCount}
                </span>
              )}
            </motion.div>
          </div>

          {/* MOBILE HAMBURGER */}
          <button
            className="md:hidden text-3xl"
            onClick={() => setMobileMenu(true)}
          >
            ☰
          </button>
        </div>
      </nav>

      {/* 🟠 MOBILE MENU DRAWER */}
      {mobileMenu && (
  <div
    className="fixed inset-0 bg-black/50 z-50"
    onClick={() => setMobileMenu(false)}
  >
    <motion.div
      initial={{ x: 300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 300, opacity: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      onClick={(e) => e.stopPropagation()}
      className="absolute top-0 right-0 bg-white w-64 h-full shadow-xl p-6 flex flex-col gap-4"
    >
      <button className="self-end text-xl" onClick={() => setMobileMenu(false)}>
        ✕
      </button>

      <Link to="/menu" onClick={() => setMobileMenu(false)}>Menu</Link>
      <Link to="/about" onClick={() => setMobileMenu(false)}>About</Link>
      <Link to="/location" onClick={() => setMobileMenu(false)}>Location</Link>
      <Link to="/gallery" onClick={() => setMobileMenu(false)}>Gallery</Link>
      <Link to="/testimonials" onClick={() => setMobileMenu(false)}>Testimonials</Link>
      <Link to="/contact" onClick={() => setMobileMenu(false)}>Contact</Link>

      {!user ? (
        <>
          <Link to="/login" onClick={() => setMobileMenu(false)}>Login</Link>
          <Link to="/signup" onClick={() => setMobileMenu(false)}>Signup</Link>
        </>
      ) : role === "admin" ? (
        <Link to="/admin" onClick={() => setMobileMenu(false)}>Dashboard</Link>
      ) : (
        <Link to="/dashboard/user" onClick={() => setMobileMenu(false)}>My Orders</Link>
      )}

      {user && (
        <button
          onClick={() => {
            logout();
            setMobileMenu(false);
          }}
          className="text-left text-red-600 font-semibold"
        >
          Logout
        </button>
      )}

      <button
        className="mt-4 px-4 py-2 bg-amber-700 text-white rounded-lg"
        onClick={() => {
          setOpen(true);
          setMobileMenu(false);
        }}
      >
        View Cart ({cartCount})
      </button>
    </motion.div>
  </div>
)}


      {/* CART DRAWER */}
      <CartDrawer isOpen={open} onClose={() => setOpen(false)} />
    </>
  );
}
