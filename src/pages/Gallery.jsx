// Import images
import g1 from "../assets/cafeimg.jpg";
import g2 from "../assets/gallery2.jpg";
import g3 from "../assets/gallery3.jpg";
import g4 from "../assets/gallery4.jpg";
import g5 from "../assets/gallery5.jpg";
import g6 from "../assets/gallery6.jpg";
import g7 from "../assets/gallery7.jpg";
import g8 from "../assets/gallery8.jpg";

import  "../styles/components.css";


import { motion } from "framer-motion";
export default function Gallery() {
  const images = [g1, g2, g3, g4, g5, g6, g7, g8];

  return (
    <div className="min-h-screen gradient-animated-bg py-16 px-6">
      <h1 className="text-center text-4xl font-bold text-amber-900 mb-10">
        Our Café Gallery
      </h1>

      {/* Masonry Grid */}
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-5 space-y-5">
        {images.map((img, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            whileHover={{ scale: 1.05 }}
            className="overflow-hidden rounded-xl shadow-lg cursor-pointer"
          >
            <img 
              loading="lazy"
              src={img}
              className="w-full rounded-xl hover:scale-110 transition-all duration-500"
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
