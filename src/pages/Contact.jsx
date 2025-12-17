import { useState } from "react";
import { Turnstile } from "@marsidev/react-turnstile";

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    message: ""
  });

  const [captchaToken, setCaptchaToken] = useState(null);
  const [error, setError] = useState(null);

  const ownerNumber = "919253039964"; // Shaina Café WhatsApp

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(null);
  };

  const sendWhatsApp = () => {
    // 🔴 basic validation
    if (!form.name || !form.phone || !form.message) {
      setError("Please fill all fields");
      return;
    }

    // 🔐 CAPTCHA CHECK
    if (!captchaToken) {
      setError("Please verify captcha");
      return;
    }

    const text = `Hello Shaina Café,%0A%0A
Name: ${form.name}%0A
Phone: ${form.phone}%0A
Message: ${form.message}`;

    const url = `https://api.whatsapp.com/send?phone=${ownerNumber}&text=${text}`;
    window.open(url, "_blank");
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-16 text-amber-900">
      <h1 className="text-4xl font-bold text-center mb-10">Contact Us</h1>

      <div className="bg-white rounded-2xl shadow-md p-8 border border-amber-200">

        <p className="text-amber-700 mb-6 text-lg text-center">
          Have a question or want to book a party? We're here to help!
        </p>

        {error && (
          <p className="text-red-500 text-center mb-4">{error}</p>
        )}

        <form className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <div className="flex flex-col">
            <label className="text-sm font-semibold mb-1">Your Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="border rounded-lg p-3 bg-amber-50"
              placeholder="Enter your name"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-semibold mb-1">Phone Number</label>
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className="border rounded-lg p-3 bg-amber-50"
              placeholder="Enter your phone"
            />
          </div>

          <div className="flex flex-col md:col-span-2">
            <label className="text-sm font-semibold mb-1">Message</label>
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              className="border rounded-lg p-3 bg-amber-50 h-32"
              placeholder="Write your message..."
            />
          </div>

          {/* 🛡️ CAPTCHA */}
          <div className="md:col-span-2">
            <Turnstile
              siteKey="0x4AAAAAACGmM0HxdRwa-hBy"
              onSuccess={(token) => setCaptchaToken(token)}
              onError={() => setCaptchaToken(null)}
              options={{ theme: "light" }}
            />
          </div>

          <button
            type="button"
            onClick={sendWhatsApp}
            className="md:col-span-2 bg-green-500 text-white font-semibold py-3 rounded-lg shadow hover:bg-green-600 transition"
          >
            Send on WhatsApp
          </button>

        </form>
      </div>
    </div>
  );
}
