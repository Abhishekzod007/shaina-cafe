import { Instagram, Phone, MapPin, Clock , Linkedin } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-[#f8f1e7] shadow-inner border-t border-amber-300 pt-12 pb-8 mt-16">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-8 text-amber-900">

        {/* Brand Section */}
        <div className="md:col-span-4">
          <h2 className="text-2xl font-bold mb-2">Shaina Café Rawatsar</h2>
          <p className="text-amber-700 leading-relaxed">
            Serving the best coffee and snacks to travelers on the 
            Ganganagar–Jaipur Highway, near Hanumangarh, Rajasthan, India. A perfect stop for freshness.
          </p>

          <div className="flex gap-4 mt-4 text-amber-900">
            <a href="https://www.instagram.com/shaina_cafe_rawatsar_/" className="hover:text-amber-600 transition">
              <Instagram size={26} />
            </a>
            <a href="#" className="hover:text-amber-600 transition">
              <Phone size={26} />
            </a>
            <a href="https://maps.app.goo.gl/Es6ZMbdEEy4yUjuV7" className="hover:text-amber-600 transition">
              <MapPin size={26} />
            </a>
          </div>
        </div>

        {/* Contact Section */}
        <div className="md:col-span-3">
          <h3 className="font-semibold text-lg mb-3">Contact</h3>

          <p className="flex items-center gap-2 text-amber-800">
            <MapPin size={18} /> Rawatsar, Rajasthan
          </p>
          <p className="flex items-center gap-2 text-amber-800">
            <Phone size={18} /> +91 92530-39964
          </p>
          <p className="flex items-center gap-2 text-amber-800">
            <Clock size={18} /> 10:00 AM – 10:00 PM
          </p>
        </div>

        {/* Quick Links */}
        <div className="md:col-span-2">
          <h3 className="font-semibold text-lg mb-3">Quick Links</h3>
          <div className="flex flex-col gap-1 text-amber-800">
            <Link to="/" className="hover:text-amber-900 transition">Home</Link>
    <Link to="/menu" className="hover:text-amber-900 transition">Menu</Link>
    <Link to="/gallery" className="hover:text-amber-900 transition">Gallery</Link>
    <Link to="/location" className="hover:text-amber-900 transition">Location</Link>
    <Link to="/contact" className="hover:text-amber-900 transition">Contact</Link>
            <Link to="/privacy-policy">Privacy Policy</Link>

          </div>
        </div>
 
        {/* Map */}
        <div className="md:col-span-3 md:pr-4">
          <h3 className="font-semibold text-lg mb-3">Find Us</h3>

          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13921.732033045508!2d74.41738735000001!3d29.269613049999993!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39169d4da6d0a821%3A0xc19c219019b67486!2sShaina%20cafe%20rawatsar%20(best%20cafe%20in%20Rawatsar)!5e0!3m2!1sen!2sin!4v1763387351636!5m2!1sen!2sin"
            className="w-full h-64 rounded-xl border shadow-sm mb-4"
            loading="lazy"
          />
        </div>

      </div>

      {/* COPYRIGHT + DEVELOPER CREDIT */}
      <div className="text-center mt-10 text-sm text-amber-800">
        © {new Date().getFullYear()} Shaina Café Rawatsar — All Rights Reserved
      </div>

      <div className="text-center mt-2 text-sm text-amber-700">
        Developed with ❤️ by 
        <a
    href="https://www.linkedin.com/in/abhishek-chaudhary-a25093229/"
    target="_blank"
    rel="noopener noreferrer"
    className="underline hover:text-amber-900 ml-1"
  >
    Abhishek Chaudhary
  </a>
      </div>
    </footer>
  );
}
