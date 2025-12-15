import { motion, AnimatePresence } from "framer-motion";
import useCart from "../hooks/useCart";

export default function Toast() {
  const { toast } = useCart();

  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 30 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-6 right-6 bg-amber-600 text-white px-5 py-3 rounded-lg shadow-lg z-50"
        >
          {toast}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
