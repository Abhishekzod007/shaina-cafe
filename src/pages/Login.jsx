import { Turnstile } from "@marsidev/react-turnstile";
import { useState, useEffect } from "react";
import useAuth from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const { loginWithOTP, loginWithEmail, user, role } = useAuth();
  const navigate = useNavigate();

  // 🔐 CAPTCHA TOKEN
  const [captchaToken, setCaptchaToken] = useState(null);

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      if (role === "admin") navigate("/admin");
      else navigate("/");
    }
  }, [user, role, navigate]);

  // -----------------------------
  // STATE
  // -----------------------------
  const [phone, setPhone] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // -----------------------------
  // EMAIL LOGIN FLOW
  // -----------------------------
  const handleEmailLogin = async () => {
    if (!email.trim() || !password.trim()) {
      return alert("Please enter email and password");
    }

    // 🔴 IMPORTANT: CAPTCHA CHECK
    if (!captchaToken) {
      return alert("Please verify captcha");
    }

    // ✅ SEND captchaToken TO BACKEND
    const role = await loginWithEmail(
      email.trim(),
      password,
      captchaToken
    );

    if (!role) return alert("Invalid login");

    if (role === "admin") navigate("/admin");
    else navigate("/");
  };

  // -----------------------------
  // UI
  // -----------------------------
  return (
    <div className="max-w-md mx-auto mt-14 p-6 bg-white rounded-xl shadow">
      <h1 className="text-3xl text-center font-bold mb-6">Login</h1>

      {/* Email Login */}
      <h2 className="text-xl font-semibold mt-6 mb-2">
        Login with Email
      </h2>

      <input
        type="email"
        placeholder="Email"
        className="w-full p-3 border rounded-lg mb-2"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        className="w-full p-3 border rounded-lg mb-3"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      {/* 🛡️ CLOUDFLARE TURNSTILE */}
      <div className="mb-4">
        <Turnstile
          siteKey="0x4AAAAAACGmM0HxdRwa-hBy"
          onSuccess={(token) => setCaptchaToken(token)}
          onError={() => setCaptchaToken(null)}
          options={{ theme: "light" }}
        />
      </div>

      <button
        onClick={handleEmailLogin}
        className="w-full bg-blue-600 text-white py-2 rounded-lg"
      >
        Login
      </button>
    </div>
  );
}
