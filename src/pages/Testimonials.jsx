import { useRef, useEffect, useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

export default function Testimonials() {
  const sliderRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [openFAQ, setOpenFAQ] = useState(null); // ⭐ for FAQ toggle

  const data = [
    {
      id: 1,
      name: "Aakash",
      city: "Rawatsar",
      rating: 5,
      text: "Great place to work and chill. Calm ambience, friendly staff, and perfect for meetings. I often bring my laptop and work for hours while enjoying their premium coffee.",
    },
    {
      id: 2,
      name: "Hina",
      city: "Ganganagar",
      rating: 5,
      text: "Beautiful ambience and excellent coffee. Perfect place for brunch or casual meetings. The café is hygienic and well-managed—highly recommended for families.",
    },
    {
      id: 3,
      name: "Rohit",
      city: "Hanumangarh",
      rating: 5,
      text: "Best café in Rawatsar! Amazing taste, fast service, and extremely comfortable seating. Their wraps and burgers are the best on the Jaipur–Ganganagar route.",
    },
    {
      id: 4,
      name: "Kajal",
      city: "Bhadra",
      rating: 4.8,
      text: "The wraps and shakes are must-try! Peaceful, cozy and the perfect place to hang out with friends. Love the quiet ambience.",
    },
    {
      id: 5,
      name: "Manoj",
      city: "Sadulpur",
      rating: 5,
      text: "A truly family-friendly café with great food and even games for kids. My children enjoyed the board games while we relaxed. Loved the service and warm hospitality!",
    },
    {
      id: 6,
      name: "Suman",
      city: "Rawatsar",
      rating: 4.9,
      text: "Amazing hospitality with the best taste. One of the best vegetarian cafés in Rawatsar. Perfect spot for birthday celebrations or family gatherings.",
    },
    {
      id: 7,
      name: "Priya",
      city: "Delhi",
      rating: 4.9,
      text: "Clean and spacious all-veg café. A perfect travel stop for long routes. Great hygiene, quick service, and tasty food!",
    },
  ];

  // ⭐ FAQ SECTION (Used by Google SEO + UI)
  const faq = [
    {
      q: "Is Shaina Café family-friendly?",
      a: "Yes! The café is fully family-friendly with indoor games, comfortable seating, and a safe environment for children.",
    },
    {
      q: "Do you provide parking?",
      a: "Yes, we have plenty of free parking space available for cars and bikes.",
    },
    {
      q: "What are the café timings?",
      a: "We are open every day from 10 AM to 10 PM.",
    },
    {
      q: "Is the café kid-friendly?",
      a: "Absolutely! We offer board games, comfortable seating, and a peaceful environment suitable for children.",
    },
    {
      q: "Is the menu vegetarian?",
      a: "Yes, Shaina Café is a 100% pure vegetarian café.",
    },
  ];

  // ⭐ FAQ Schema JSON-LD (Google reads this even if not on Home Page)
  const FAQ_SCHEMA = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.a,
      },
    })),
  };

  // ⭐ UI for Testimonials below (UNCHANGED)
  const scrollToIndex = (i) => {
    const slider = sliderRef.current;
    if (!slider) return;
    const child = slider.children[i];
    if (!child) return;
    const left =
      child.offsetLeft - (slider.clientWidth - child.clientWidth) / 2;
    slider.scrollTo({ left, behavior: "smooth" });
  };

  const scrollLeft = () => {
    const next = Math.max(0, activeIndex - 1);
    setActiveIndex(next);
    scrollToIndex(next);
  };

  const scrollRight = () => {
    const next = Math.min(data.length - 1, activeIndex + 1);
    setActiveIndex(next);
    scrollToIndex(next);
  };

  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    let rafId = null;
    const onScroll = () => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const center = slider.scrollLeft + slider.clientWidth / 2;
        let nearest = 0;
        let minDiff = Infinity;
        Array.from(slider.children).forEach((child, idx) => {
          const childCenter = child.offsetLeft + child.clientWidth / 2;
          const diff = Math.abs(childCenter - center);
          if (diff < minDiff) {
            minDiff = diff;
            nearest = idx;
          }
        });
        setActiveIndex(nearest);
      });
    };

    slider.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      slider.removeEventListener("scroll", onScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);
  const total = data.length;
  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => {
      setActiveIndex((prev) => {
        const next = prev >= total - 1 ? 0 : prev + 1;
        scrollToIndex(next);
        return next;
      });
    }, 4200);
    return () => clearInterval(id);
  }, [paused, total]);

  const gradientStyle = {
    backgroundImage:
      "linear-gradient(135deg, #48e0ebff 0%, #ffbcbcff 40%, #f06cffff 100%)",
    transition: "background-position 600ms ease",
    backgroundSize: "200% 200%",
    backgroundPosition: `${(activeIndex / (data.length - 1)) * 100}% 0%`,
  };

  return (
    <div
      className="w-full py-16"
      style={gradientStyle}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* ⭐ FAQ SCHEMA FOR GOOGLE */}
      <script type="application/ld+json">{JSON.stringify(FAQ_SCHEMA)}</script>

      <style>{`
        .testi-container { max-width: 1100px; margin: 0 auto; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .card-appear { animation: cardIn 420ms ease both; }
        @keyframes cardIn {
          from { transform: translateY(10px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .card-active {
          transform: translateY(-6px) scale(1.06);
          box-shadow: 0 18px 40px rgba(20,60,30,0.18);
        }
      `}</style>

      <div className="testi-container px-6">
        <h2 className="text-4xl font-extrabold text-center text-amber-900 mb-8">
          What Our Customers Say
        </h2>

        {/* ARROWS */}
        <div className="flex justify-end gap-3 mb-3 pr-2">
          <button
            onClick={scrollLeft}
            className="p-2 bg-white/70 hover:bg-white rounded-full shadow transition"
          >
            <FiChevronLeft size={20} className="text-amber-800" />
          </button>
          <button
            onClick={scrollRight}
            className="p-2 bg-white/70 hover:bg-white rounded-full shadow transition"
          >
            <FiChevronRight size={20} className="text-amber-800" />
          </button>
        </div>

        {/* SLIDER */}
        <div
          ref={sliderRef}
          className="flex gap-6 overflow-x-scroll no-scrollbar scroll-smooth snap-x py-4"
        >
          {data.map((t, i) => {
            const isActive = i === activeIndex;
            return (
              <div
                key={t.id}
                className="snap-start card-appear"
                style={{ minWidth: 300, maxWidth: 320 }}
              >
                <div
                  className={`bg-white/85 rounded-2xl p-5 border border-white/30 transition-transform ${
                    isActive ? "card-active" : ""
                  }`}
                >
                  <div className="text-amber-600 mb-3 text-lg">
                    {"★".repeat(Math.round(t.rating))}
                    <span className="text-amber-900 text-sm ml-2 font-medium">
                      {t.rating.toFixed(1)}
                    </span>
                  </div>

                  <p className="text-gray-800 italic text-sm leading-relaxed mb-4">
                    “{t.text}”
                  </p>

                  <div className="flex items-center gap-3">
                    <img
                      src={`https://api.dicebear.com/7.x/initials/svg?seed=${t.name}&backgroundColor=b1e6c9`}
                      className="w-12 h-12 rounded-full border"
                      alt={t.name}
                    />
                    <div>
                      <div className="text-amber-900 font-semibold">
                        {t.name}
                      </div>
                      <div className="text-xs text-gray-700">{t.city}</div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* DOTS */}
        <div className="flex justify-center gap-3 mt-6">
          {data.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setActiveIndex(i);
                scrollToIndex(i);
              }}
              className={`w-3 h-3 rounded-full ${
                i === activeIndex ? "bg-amber-800" : "bg-white/60"
              }`}
            />
          ))}
        </div>

        {/* ⭐ FAQ SECTION */}
        <h2 className="text-3xl font-bold text-center mt-16 mb-6 text-amber-900">
          Frequently Asked Questions
        </h2>

        <div className="max-w-2xl mx-auto space-y-4">
          {faq.map((f, i) => (
            <div
              key={i}
              className="bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-white/40 shadow-sm"
            >
              <button
                className="w-full text-left text-lg font-semibold text-amber-900"
                onClick={() => setOpenFAQ(openFAQ === i ? null : i)}
              >
                {f.q}
              </button>

              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openFAQ === i ? "max-h-40 mt-2" : "max-h-0"
                }`}
              >
                <p className="text-gray-800 text-sm leading-relaxed">{f.a}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
