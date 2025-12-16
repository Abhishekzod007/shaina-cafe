// Import images

import g2 from "../assets/gallery1.webp";
import g3 from "../assets/gallery2.webp";
import g4 from "../assets/gallery3.webp";
import g5 from "../assets/gallery4.webp";
import g1 from "../assets/cafeimg.webp";
import g6 from "../assets/gallery5.webp";
import g7 from "../assets/gallery6.webp";
import g8 from "../assets/gallery7.webp";
import g9 from "../assets/gallery8.webp";
import g10 from "../assets/gallery9.webp";
import g11 from "../assets/gallery10.webp";
import g12 from "../assets/gallery11.webp";
import g13 from "../assets/gallery12.webp";
import g14 from "../assets/gallery13.webp";
import g15 from "../assets/gallery14.webp";
import g16 from "../assets/gallery15.webp";
import g17 from "../assets/gallery16.webp";
import g18 from "../assets/gallery17.webp";
import g19 from "../assets/gallery18.webp";
import g20 from "../assets/gallery19.webp";
import g21 from "../assets/gallery20.webp";
import g22 from "../assets/gallery21.webp";
import g23 from "../assets/gallery22.webp";
import g24 from "../assets/gallery23.webp";


import  "../styles/components.css";


import { motion } from "framer-motion";
export default function Gallery() {
  const images = [ g2, g3, g4, g5, g1, g6, g7, g8 , g9 , g10 , g11 , g12 , g13, g14, g15, g16 , g17 , g18 , g19, g20, g21 , g22, g23 , g24];
const altTexts = [
  "Shaina Café Rawatsar parking area for cars and bikes",
  "Family-friendly seating at Shaina Café Rawatsar",
  "Children playing indoor games at Shaina Café Rawatsar",
  "Café ambience and seating at Shaina Café Rawatsar",
  "Birthday celebration at Shaina Café Rawatsar",
];

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
              decoding="async"
  alt={altTexts[i % altTexts.length]}
              className="w-full rounded-xl hover:scale-110 transition-all duration-500"
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
