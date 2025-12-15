import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Menu() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const loadItems = async () => {
      try {
        const res = await fetch("https://shaina-cafe-backend.onrender.com/api/menu");
        const data = await res.json();
        setItems(data.items || []);
      } catch (err) {
        console.error("Menu fetch error:", err);
      }
    };

    loadItems();
  }, []);

  // Build dynamic category/subcategory structure
  const dynamicMenu = {};

  items.forEach((item) => {
    const main = item.mainCategory;
    const sub = item.subCategory;

    if (!dynamicMenu[main]) {
      dynamicMenu[main] = { title: main, subcategories: {} };
    }

    if (!dynamicMenu[main].subcategories[sub]) {
      dynamicMenu[main].subcategories[sub] = {
        title: sub,
        img: item.image || "https://via.placeholder.com/150",
      };
    }
  });

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 text-amber-900">
      <h1 className="text-4xl font-bold mb-10">Menu</h1>

      {Object.keys(dynamicMenu).map((main) => (
        <div key={main} className="mb-14">
          <h2 className="text-3xl font-semibold mb-6">
            {dynamicMenu[main].title}
          </h2>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
            {Object.keys(dynamicMenu[main].subcategories).map((sub) => {
              const subCat = dynamicMenu[main].subcategories[sub];

              return (
                // inside your Menu component where you render subcategory Link
<Link
  to={`/menu/${encodeURIComponent(main)}/${encodeURIComponent(sub)}`}
  key={sub}
  className="flex flex-col items-center text-center p-4 rounded-xl transition hover:scale-105"
>
  <img
    loading="lazy"
    src={subCat.img || "https://via.placeholder.com/200"}
    alt={subCat.title}
    className="w-32 h-32 rounded-full object-cover shadow-md"
  />

  <h3 className="mt-4 text-xl font-semibold text-amber-900">
    {subCat.title}
  </h3>
</Link>


              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
