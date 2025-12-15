import { useState, useEffect } from "react";
import useAuth from "../../hooks/useAuth";

export default function Profile() {
  const { user, token, setUser } = useAuth();

  const [form, setForm] = useState({
    name: "",
    phone: ""
  });

  // 🔥 Prefill user data from DB/localStorage
  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || "",
        phone: user.phone || ""
      });
    }
  }, [user]);

  // 🔥 Update profile API
  const updateProfile = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/auth/update-profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          name: form.name,
          phone: form.phone
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.msg || "Profile update failed");
        return;
      }

      alert("Profile updated successfully!");

      // 🔥 Update context and localStorage
      setUser(data.user);

      localStorage.setItem(
        "auth",
        JSON.stringify({
          user: data.user,
          token,
          role: data.user.role
        })
      );
    } catch (err) {
      console.error("Profile update error:", err);
      alert("Server error");
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Profile</h2>

      {/* NAME */}
      <input
        className="w-full border p-3 rounded bg-amber-100"
        value={form.name}
        placeholder="Your Name"
        name="name"
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />

      {/* PHONE */}
      <input
        className="w-full border p-3 rounded bg-amber-100 mt-3"
        value={form.phone}
        placeholder="Phone Number"
        name="phone"
        onChange={(e) => setForm({ ...form, phone: e.target.value })}
      />

      <button
        onClick={updateProfile}
        className="mt-4 bg-amber-700 text-white px-5 py-2 rounded"
      >
        Save Changes
      </button>
    </div>
  );
}
