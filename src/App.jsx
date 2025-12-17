import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import "./styles/global.css";
import './styles/components.css'
import Navbar from "./components/Navbar";
import Toast from "./components/Toast";
import Footer from "./components/Footer";

// PAGES
import Home from "./pages/Home";
import Menu from "./pages/Menu";
import CategoryPage from "./pages/CategoryPage";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Gallery from "./pages/Gallery";
import Location from "./pages/Location";
import Testimonials from "./pages/Testimonials";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import NotFound from "./pages/NotFound";
import FlyToCart from "./components/FlyToCart";
import useCart from "./hooks/useCart";
import Login from "./pages/Login";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import ProtectedRoute from "./pages/ProtectedRoute";
import AdminOrders from "./pages/AdminOrders";
import AdminMenu from "./pages/AdminMenu";
import SubcategoryPage from "./pages/SubcategoryPage.jsx";
import UserDashboard from "./pages/user/UsrDashboard.jsx";
import Signup from "./pages/Signup.jsx";
import PrivacyPolicy from "./pages/PrivacyPolicy";
export default function App() {
  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: "ease-in-out",
      once: true,
    });
  }, []);
  const { flyData } = useCart();
  return (
    <Router>
      <Navbar />
      <Toast />
      {/* REMOVE TOAST until we fix it */}
      {/* <Toast /> */}
      <FlyToCart
        start={flyData?.start}
        end={flyData?.end}
        img={flyData?.img}
        onComplete={() => {}}
      />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/menu" element={<Menu />} />
        {/* <Route path="/menu/:main/:sub" element={<CategoryPage />} /> */}
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/location" element={<Location />} />
        <Route path="/testimonials" element={<Testimonials />} />

        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />

        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />

         <Route path="/privacy-policy" element={<PrivacyPolicy />} />

        <Route
          path="/admin"
          element={
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        {/* optional alias */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/orders"
          element={
            <ProtectedRoute role="admin">
              <AdminOrders />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/menu"
          element={
            <ProtectedRoute role="admin">
              <AdminMenu />
            </ProtectedRoute>
          }
        />
        <Route path="/dashboard/user" element={<UserDashboard />} />

        <Route
          path="/menu/:mainCategory/:subCategory"
          element={<SubcategoryPage />}
        />

        <Route path="*" element={<NotFound />} />
       
      </Routes>

      <Footer />
    </Router>
  );
}
