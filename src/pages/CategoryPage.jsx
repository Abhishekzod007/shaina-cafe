import { useParams, Link } from "react-router-dom";
import { useEffect, useState, useRef } from "react";

import useCart from "../hooks/useCart";
import { cartIconRef } from "../utils/globalRefs";

export default function CategoryPage() {
  const { main, sub } = useParams();
  const { addToCart, startFlyAnimation } = useCart();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // -------------------------------
  // FETCH REAL ITEMS FROM BACKEND
  // -------------------------------
  useEffect(() => {
    const loadItems = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/menu/${main}/${sub}`
        );

        const data = await res.json();

        if (Array.isArray(data)) {
          setItems(data);
        } else {
          setItems([]);
        }
      } catch (err) {
        console.error("Category load error:", err);
      } finally {
        setLoading(false);
      }
    };

    loadItems();
  }, [main, sub]);

  if (loading) return <p className="p-6">Loading...</p>;
  if (!items.length) return <p className="p-6 text-red-600">No items found</p>;

  // -------------------------------------
  // SMALL CARD COMPONENT
  // -------------------------------------
  function ItemCard({ item }) {
    const imgRef = useRef(null);

    const handleAdd = () => {
      const imgNode = imgRef.current;
      const cartNode = cartIconRef.current;

      if (imgNode && cartNode) {
        const start = imgNode.getBoundingClientRect();
        const end = cartNode.getBoundingClientRect();

        startFlyAnimation(
          { x: start.left, y: start.top },
          { x: end.left, y: end.top },
          item.image
        );
      }

      addToCart(item);
    };

    return (
      <div className="flex flex-col items-center text-center hover:bg-amber-50 p-4 rounded-xl transition">
        <img
          ref={imgRef}
          src={item.image}
          className="w-32 h-32 rounded-full object-cover border-4 border-amber-300"
          alt={item.name}
        />

        <h3 className="mt-4 text-xl font-semibold">{item.name}</h3>

        {/* Variant price */}
        {item.variantCategory?.length > 0 && (
          <p className="text-amber-700">
            From ₹{Math.min(...item.variantCategory.map(v => v.price))}
          </p>
        )}

        {/* Add-ons */}
        {item.addons?.length > 0 && (
          <div className="mt-2">
            <p className="font-semibold text-sm text-gray-700">
              Available Add-ons:
            </p>

            {item.addons.map((a, idx) => (
              <p key={idx} className="text-gray-600 text-sm">
                ➕ {a.name} (+₹{a.price})
              </p>
            ))}
          </div>
        )}

        <button
          onClick={handleAdd}
          className="mt-3 px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition"
        >
          Add to Cart
        </button>
      </div>
    );
  }

  // -------------------------------------
  // RENDER PAGE
  // -------------------------------------
  return (
    <div className="max-w-6xl mx-auto px-6 py-10 text-amber-900">
      <p className="text-sm mb-4">
        <Link to="/menu" className="text-amber-600">
          Menu
        </Link>{" "}
        / {sub}
      </p>

      <h1 className="text-4xl font-bold mb-6">{sub}</h1>

      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {items.map((item) => (
          <ItemCard key={item._id} item={item} />
        ))}
      </div>
    </div>
  );
}
