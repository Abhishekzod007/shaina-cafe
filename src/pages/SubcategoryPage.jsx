import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import useCart from "../hooks/useCart";
import "../styles/components.css";

export default function SubcategoryPage() {
  const { mainCategory, subCategory } = useParams();
  const { addToCart, startFlyAnimation } = useCart();
  const [expanded, setExpanded] = useState({});

  const cartIconRef = useRef(null);

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showPopup, setShowPopup] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);

  // ⭐ Addons per item: { [itemId]: [addons...] }
  const [addonSelection, setAddonSelection] = useState({});

  const formattedMain = decodeURIComponent(mainCategory);
  const formattedSub = decodeURIComponent(subCategory);

  const openVariantPopup = (item) => {
    setSelectedItem(item);
    setSelectedVariant(null);
    setShowPopup(true);
  };

  const closePopup = () => setShowPopup(false);

  // ⭐ ADD TO CART
  const handleAdd = () => {
    if (!selectedItem || !selectedVariant) return;

    const selectedAddons = addonSelection[selectedItem._id] || [];
    const addonKey =
      selectedAddons
        .map((a) => a.name)
        .sort()
        .join("|") || "plain";

    const cartId = `${selectedItem._id}_${selectedVariant.name}_${addonKey}`;

    const basePrice = Number(selectedVariant.price);
    const addonTotal = selectedAddons.reduce(
      (sum, a) => sum + Number(a.price || 0),
      0
    );
    const finalPrice = basePrice + addonTotal;

    addToCart({
      id: cartId,
      name: selectedItem.name,
      variant: selectedVariant.name,
      basePrice,
      addonTotal,
      price: finalPrice,
      addons: selectedAddons,
      img: selectedItem.image,
    });

    const start = selectedItem._flyPos;
    const end = cartIconRef.current.getBoundingClientRect();
    startFlyAnimation(start, end, selectedItem.image);

    closePopup();
  };

  useEffect(() => {
    const loadItems = async () => {
      const res = await fetch(
        `http://localhost:5000/api/menu/${formattedMain}/${formattedSub}`
      );
      const data = await res.json();
      setItems(data || []);
      setLoading(false);
    };
    loadItems();
  }, [formattedMain, formattedSub]);

  if (loading) return <div className="p-10 text-xl">Loading...</div>;

  return (
    <>
      {/* Invisible cart icon target */}
      <div ref={cartIconRef} className="fixed top-4 right-6 w-8 h-8"></div>

      <div className="max-w-5xl mx-auto px-6 py-10 text-amber-900">
        <h1 className="text-3xl font-bold mb-8">
          {formattedMain} → {formattedSub}
        </h1>

        {/* ⭐ SWIGGY STYLE LIST */}
        <div className="space-y-10">
          {items.map((item) => {
            const selectedAddonsForItem = addonSelection[item._id] || [];

            return (
              <div
                key={item._id}
                className="flex justify-between items-start border-b pb-6 pt-4 gap-4"
                ref={(el) => {
                  if (el) {
                    const pos = el.getBoundingClientRect();
                    item._flyPos = { x: pos.x, y: pos.y };
                  }
                }}
              >
                {/* LEFT SIDE DETAILS */}
                <div className="flex-1 pr-2">
                  <div className="flex items-center gap-3">
  <h2 className="text-xl font-semibold text-amber-900">{item.name}</h2>

  {/* TAGS */}
  {Array.isArray(item.tags) && item.tags.length > 0 && (
    <div className="flex gap-2">
      {item.tags.map((tag, idx) => (
        <span
          key={idx}
          className="px-2 py-[2px]
    text-[10px] sm:text-xs
    font-semibold
    rounded-full
    bg-amber-100 text-amber-800
    whitespace-nowrap"
        >
          #{tag}
        </span>
      ))}
    </div>
  )}
</div>


                  {/* Price */}
                  <p className="text-md font-bold text-amber-800 mt-1">
                    ₹{item.variantCategory?.[0]?.price}
                  </p>

                  {/* Description */}
                  <p className="text-gray-600 text-sm mt-2 leading-relaxed">
                    {expanded[item._id]
                      ? item.description
                      : item.description?.substring(0, 120)}

                    {item.description?.length > 120 && (
                      <span
                        onClick={() =>
                          setExpanded((prev) => ({
                            ...prev,
                            [item._id]: !prev[item._id],
                          }))
                        }
                        className="text-amber-700 font-semibold cursor-pointer ml-1"
                      >
                        {expanded[item._id] ? "less" : "more"}
                      </span>
                    )}
                  </p>

                  {/* ⭐ Addons */}
                  {/* ⭐ TAGS under item description */}



                </div>

                {/* RIGHT SIDE: IMAGE + ADD BUTTON LIKE SWIGGY */}
                <div className="relative">
                  <img
                    loading="lazy"
                    src={item.image}
                    alt={item.name}
                    className="w-28 h-28 
    sm:w-36 sm:h-36 
    md:w-44 md:h-44
    rounded-xl object-cover shadow-md"
                  />

                  <button
                    onClick={() => openVariantPopup(item)}
                    className="  absolute bottom-[-14px] left-1/2 -translate-x-1/2
    bg-amber-700 text-white px-8 py-1.5 rounded-lg
    font-semibold shadow-md
    active:scale-95 transition
    hover:bg-amber-800"
                  >
                    ADD
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* POPUP */}
      {/* POPUP */}
{showPopup && selectedItem && (
   <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeBg">

    <div className=" bg-white rounded-2xl shadow-xl animate-softPopup
    w-[92vw] max-w-[360px]
    p-4 sm:p-6
    max-h-[85vh] overflow-y-auto">
      
      <h2 className="text-xl sm:text-2xl font-bold mb-3">{selectedItem.name}</h2>

      {/* Variant Selection */}
      {selectedItem.variantCategory?.length > 0 && (
        <div>
          <p className="font-semibold mb-2">Choose Variant:</p>

          {selectedItem.variantCategory.map((v, i) => (
            <label
              key={i}
              className="flex items-center gap-3 p-3 border rounded-lg mb-2 cursor-pointer hover:bg-amber-50 transition"
            >
              <input
                type="radio"
                checked={selectedVariant?.name === v.name}
                onChange={() => setSelectedVariant(v)}
              />
              {v.name}
              <span className="ml-auto font-semibold">₹{v.price}</span>
            </label>
          ))}
        </div>
      )}

      {/* Addons */}
      {/* Addons (Show ONLY if real addons exist) */}
{Array.isArray(selectedItem.addons) &&
  selectedItem.addons.some(a => a?.name && a?.price) && (
    <div className="mt-4">
      <p className="font-semibold mb-2">Customizations:</p>

      {selectedItem.addons
        .filter(a => a?.name && a?.price)
        .map((addon, idx) => {
          const isSelected =
            addonSelection[selectedItem._id]?.includes(addon);

          return (
            <label
              key={idx}
              className="flex items-center gap-3 p-3 border rounded-lg mb-2 cursor-pointer hover:bg-amber-50 transition"
            >
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => {
                  setAddonSelection((prev) => {
                    const existing = prev[selectedItem._id] || [];
                    return {
                      ...prev,
                      [selectedItem._id]: isSelected
                        ? existing.filter((x) => x !== addon)
                        : [...existing, addon],
                    };
                  });
                }}
              />
              {addon.name}
              <span className="ml-auto text-sm font-semibold">
                +₹{addon.price}
              </span>
            </label>
          );
        })}
    </div>
)}


      {/* Add to Cart */}
      <button
        disabled={!selectedVariant}
        onClick={handleAdd}
        className="w-full mt-4
  bg-amber-700 text-white
  py-2.5 sm:py-3
  rounded-xl font-semibold
  text-base sm:text-lg
  shadow-md hover:bg-amber-800 transition
  disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        Add to Cart
      </button>

      {/* Cancel */}
      <button
        onClick={closePopup}
        className="w-full mt-2 border py-2 rounded-lg font-medium hover:bg-gray-100 transition"
      >
        Cancel
      </button>
    </div>
  </div>
)}


    </>
  );
}
