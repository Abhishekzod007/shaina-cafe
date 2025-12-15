import { useState, useEffect } from "react";
import AuthContext from "./AuthContextObject";

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // ------------------------------
  // FETCH FULL PROFILE FROM BACKEND
  // ------------------------------
  const loadProfile = async (tokenValue) => {
    try {
      const res = await fetch("http://localhost:5000/api/auth/profile", {
        headers: { Authorization: `Bearer ${tokenValue}` },
      });

      const data = await res.json();

      if (res.ok) {
        const fullUser = { ...data.user, _id: data.user._id };

        setUser(fullUser);
        setRole(fullUser.role);

        localStorage.setItem(
          "auth",
          JSON.stringify({
            user: fullUser,
            role: fullUser.role,
            token: tokenValue,
          })
        );
      }
    } catch (err) {
      console.error("Profile load failed:", err);
    }
  };

  // ---------------------------
  // RESTORE SESSION ON REFRESH
  // ---------------------------
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("auth"));
    if (saved?.token) {
      setToken(saved.token);
      loadProfile(saved.token); // ⭐ auto-refresh user details
    }
    setLoading(false);
  }, []);

  // ---------------- LOGIN WITH OTP ----------------
  const loginWithOTP = async (phone) => {
    try {
      const res = await fetch("http://localhost:5000/api/auth/login-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });

      const data = await res.json();
      if (!res.ok) return null;

      const fixedUser = { ...data.user, _id: data.user.id };

      setUser(fixedUser);
      setRole(fixedUser.role);
      setToken(data.token);

      // Save minimal data first
      localStorage.setItem(
        "auth",
        JSON.stringify({ user: fixedUser, role: fixedUser.role, token: data.token })
      );

      // ⭐ Fetch updated name/phone/address from DB
      await loadProfile(data.token);

      return fixedUser.role;
    } catch (err) {
      console.error("OTP login failed", err);
      return null;
    }
  };

  // ---------------- LOGIN WITH EMAIL ----------------
  const loginWithEmail = async (email, password , captchaToken) => {
    try {
      const res = await fetch("http://localhost:5000/api/auth/login-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password , captchaToken }),
      });

      const data = await res.json();
      if (!res.ok) return null;

      const fixedUser = { ...data.user, _id: data.user.id };

      setUser(fixedUser);
      setRole(fixedUser.role);
      setToken(data.token);

      // Save minimal first
      localStorage.setItem(
        "auth",
        JSON.stringify({ user: fixedUser, role: fixedUser.role, token: data.token })
      );

      // ⭐ Fetch full DB profile
      await loadProfile(data.token);

      return fixedUser.role;
    } catch (err) {
      console.error("Email login failed:", err);
      return null;
    }
  };

  // ---------------- LOGOUT ----------------
  const logout = () => {
    setUser(null);
    setRole(null);
    setToken(null);
    localStorage.removeItem("auth");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        token,
        setUser, // Needed for profile updates
        loginWithOTP,
        loginWithEmail,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
