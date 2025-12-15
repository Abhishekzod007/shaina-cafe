import { useEffect } from "react";
import confetti from "canvas-confetti";

export default function ConfettiEffect() {
  useEffect(() => {
    const duration = 800; // only 0.8 sec
    const end = Date.now() + duration;

    (function frame() {
      confetti({
        particleCount: 8,
        spread: 80,
        origin: { y: 0.6 }
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  }, []);

  return null;
}
