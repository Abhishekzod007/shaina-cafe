import { motion } from "framer-motion";

export default function FlyToCart({ start, end, img, onComplete }) {
  if (!start || !end) return null;

  return (
    <motion.img
      src={img}
      initial={{
        position: "fixed",
        top: start.y,
        left: start.x,
        width: 80,
        height: 80,
        borderRadius: "50%",
        zIndex: 999999,
      }}
      animate={{
        top: end.y,
        left: end.x,
        width: 20,
        height: 20,
        opacity: 0,
      }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      onAnimationComplete={onComplete}
    />
  );
}
