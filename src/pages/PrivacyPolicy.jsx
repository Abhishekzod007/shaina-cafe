import { Helmet } from "react-helmet";
import {  useState } from "react";
import { useNavigate } from "react-router-dom";

export default function PrivacyPolicy() {
  const [agreed, setAgreed] = useState(false);
  const navigate = useNavigate();

  // If already accepted, redirect automatically
  

  const handleAgree = () => {
    localStorage.setItem("privacyAccepted", "true");
    navigate("/"); // redirect to home or any page you want
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center py-10 px-3">
      <Helmet>
        <title>Privacy Policy | Shaina Café Rawatsar</title>
        <meta
          name="description"
          content="Privacy Policy of Shaina Café Rawatsar explaining data collection, cookies, security, and user rights."
        />
        <link
          rel="canonical"
          href="https://shainacafe-rawatsar.com/privacy-policy"
        />
      </Helmet>

      {/* White paper container */}
      <div className="bg-white w-full max-w-4xl rounded-xl shadow-lg p-8 overflow-y-auto max-h-[88vh]">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Privacy Policy
        </h1>
        <p className="text-sm text-gray-500 mb-6">
          Last updated: 16 December 2025
        </p>

        <div className="space-y-6 text-gray-700 text-sm leading-relaxed">
          <p>
            Shaina Café Rawatsar (“we”, “our”, “us”) is committed to protecting
            your privacy. This Privacy Policy explains how we collect, use, and
            protect your information when you visit our website.
          </p>

          <h2 className="font-semibold text-gray-900 text-lg">
            1. Information We Collect
          </h2>
          <ul className="list-disc list-inside space-y-1">
            <li>Name, phone number, email (if you contact us)</li>
            <li>Device and browser information</li>
            <li>IP address for security and analytics</li>
            <li>Pages visited and time spent on the website</li>
          </ul>

          <h2 className="font-semibold text-gray-900 text-lg">
            2. How We Use Your Information
          </h2>
          <ul className="list-disc list-inside space-y-1">
            <li>Respond to inquiries and customer requests</li>
            <li>Improve website performance and services</li>
            <li>Maintain security and prevent misuse</li>
            <li>Comply with legal obligations</li>
          </ul>

          <h2 className="font-semibold text-gray-900 text-lg">
            3. Cookies & Tracking
          </h2>
          <p>
            We use cookies and similar technologies to analyze traffic and
            improve user experience. You can disable cookies in your browser
            settings, but some features may not work properly.
          </p>

          <h2 className="font-semibold text-gray-900 text-lg">
            4. Third-Party Services
          </h2>
          <p>
            We may use third-party tools such as Google Analytics, Cloudflare,
            and Razorpay (if payments are enabled). These services have their
            own privacy policies.
          </p>

          <h2 className="font-semibold text-gray-900 text-lg">
            5. Data Security
          </h2>
          <p>
            We implement reasonable security measures to protect your data.
            However, no online system is 100% secure.
          </p>

          <h2 className="font-semibold text-gray-900 text-lg">
            6. External Links
          </h2>
          <p>
            Our website may contain links to external websites. We are not
            responsible for their privacy practices or content.
          </p>

          <h2 className="font-semibold text-gray-900 text-lg">
            7. Children’s Privacy
          </h2>
          <p>
            This website is not intended for children under the age of 13. We do
            not knowingly collect personal data from children.
          </p>

          <h2 className="font-semibold text-gray-900 text-lg">
            8. Changes to This Policy
          </h2>
          <p>
            We may update this Privacy Policy from time to time. Any changes
            will be posted on this page.
          </p>

          <h2 className="font-semibold text-gray-900 text-lg">
            9. Contact Information
          </h2>
          <p>
            <strong>Shaina Café Rawatsar</strong><br />
            Sri Ganganagar–Jaipur Highway<br />
            Near Hanumangarh, Rajasthan, India<br />
            Phone: +91-9253039964
          </p>
        </div>

        {/* Consent section */}
        <div className="mt-8 border-t pt-5">
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="w-4 h-4"
            />
            I have read and agree to the Privacy Policy
          </label>

          <button
            onClick={handleAgree}
            disabled={!agreed}
            className={`mt-4 w-full py-2 rounded-lg text-white font-semibold
              ${
                agreed
                  ? "bg-amber-700 hover:bg-amber-800"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
          >
            Continue to Website
          </button>
        </div>
      </div>
    </div>
  );
}
