import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { Turnstile } from "@marsidev/react-turnstile";

export default function Signup() {
  const navigate = useNavigate();
  const { loginWithEmail } = useAuth();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const [captchaToken, setCaptchaToken] = useState(null); // 🔐 CAPTCHA
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // ---------------- HANDLE INPUT ----------------
  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setError(null);
  };

  // ---------------- SUBMIT (REGISTER) ----------------
  const handleSignup = async (e) => {
    e.preventDefault();

    // 🔴 CAPTCHA CHECK
    if (!captchaToken) {
      return setError("Please verify captcha");
    }

    setLoading(true);

    try {
      const res = await fetch(
        "https://shaina-cafe-backend.onrender.com/api/auth/register",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...form,
            captchaToken, // ✅ send to backend
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setError(data.msg || "Registration failed");
        setLoading(false);
        return;
      }

      // Auto login after signup
      

      navigate("/dashboard/user");
    } catch (err) {
      console.error("Signup error:", err);
      setError("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-amber-50 px-4">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md border border-amber-200">

        <h1 className="text-3xl font-bold text-amber-800 mb-6 text-center">
          Create Account
        </h1>

        {error && (
          <p className="text-red-500 text-center mb-3">{error}</p>
        )}

        <form className="flex flex-col gap-4" onSubmit={handleSignup}>

          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            className="border p-3 rounded-lg bg-amber-100"
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={form.email}
            onChange={handleChange}
            className="border p-3 rounded-lg bg-amber-100"
            required
          />

          <input
            type="text"
            name="phone"
            placeholder="Phone Number"
            value={form.phone}
            onChange={handleChange}
            className="border p-3 rounded-lg bg-amber-100"
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Create Password"
            value={form.password}
            onChange={handleChange}
            className="border p-3 rounded-lg bg-amber-100"
            required
          />

          {/* 🛡️ CLOUDFLARE TURNSTILE */}
          <div className="mt-2">
            <Turnstile
              siteKey="0x4AAAAAACGmM0HxdRwa-hBy"
              onSuccess={(token) => setCaptchaToken(token)}
              onError={() => setCaptchaToken(null)}
              options={{ theme: "light" }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-amber-600 text-white rounded-lg font-semibold hover:bg-amber-700"
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        <p className="text-center text-sm mt-4">
          Already have an account?{" "}
          <a href="/login" className="text-amber-700 font-semibold">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}
