import { useState, useEffect } from "react";
import useAuth from "../hooks/useAuth";

export default function AdminMenu() {
  const { token } = useAuth();

  // -------------------------------------------
  // FORM STATES
  // -------------------------------------------
  const [form, setForm] = useState({
    name: "",
    mainCategory: "Drinks",
    subCategory: "",
    // now an array of { name, price }
    variantCategory: [],
    description: "",
    tags: "",
    addons: "",
  });

  const [addons, setAddons] = useState([{ name: "", price: "" }]);

  const addAddonField = () => {
    setAddons([...addons, { name: "", price: "" }]);
  };

  const updateAddon = (i, field, value) => {
    const copy = [...addons];
    copy[i][field] = value;
    setAddons(copy);
  };

  // Fields for adding a new variant
  const [newVariantName, setNewVariantName] = useState("");
  const [newVariantPrice, setNewVariantPrice] = useState("");

  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const [editingId, setEditingId] = useState(null);

  // ITEMS
  const [items, setItems] = useState([]);

  // FILTERS
  const [search, setSearch] = useState("");
  const [filterMain, setFilterMain] = useState("All");
  const [filterSub, setFilterSub] = useState("All");

  // SORTING
  const [sortType, setSortType] = useState("");

  // Zomato-like Chips
  const [activeChip, setActiveChip] = useState("All");

  // PAGINATION
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // -------------------------------------------
  // FILE PICKER
  // -------------------------------------------
  const onFile = (e) => {
    const f = e.target.files[0];
    if (!f) return;

    setImageFile(f);
    setPreview(URL.createObjectURL(f));
  };

  // -------------------------------------------
  // FETCH ITEMS
  // -------------------------------------------
  const fetchItems = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/menu/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) setItems(data.items || []);
    } catch (err) {
      console.error("Fetch menu error:", err);
    }
  };

  useEffect(() => {
    if (token) fetchItems();
  }, [token]);

  // -------------------------------------------
  // HELPER: get display price (min variant) for list
  // -------------------------------------------
  const getDisplayPrice = (item) => {
    const variants = item?.variantCategory || [];
    if (!variants || !variants.length) return item.price || "—";
    const prices = variants.map((v) => Number(v.price || 0)).filter(Boolean);
    if (!prices.length) return "—";
    return `From ₹${Math.min(...prices)}`;
  };

  // -------------------------------------------
  // VARIANT HANDLERS (add / remove / edit)
  // -------------------------------------------
  const addVariant = () => {
    const name = newVariantName.trim();
    const price = Number(newVariantPrice);

    if (!name) return alert("Variant name required");
    if (!price || price <= 0) return alert("Valid variant price required");

    setForm((prev) => ({
      ...prev,
      variantCategory: [...(prev.variantCategory || []), { name, price }],
    }));

    setNewVariantName("");
    setNewVariantPrice("");
  };

  const removeVariant = (index) => {
    setForm((prev) => {
      const copy = [...(prev.variantCategory || [])];
      copy.splice(index, 1);
      return { ...prev, variantCategory: copy };
    });
  };

  const updateVariant = (index, key, value) => {
    setForm((prev) => {
      const copy = [...(prev.variantCategory || [])];
      copy[index] = {
        ...copy[index],
        [key]: key === "price" ? Number(value) : value,
      };
      return { ...prev, variantCategory: copy };
    });
  };

  // -------------------------------------------
  // SUBMIT NEW ITEM
  // -------------------------------------------
  const submit = async () => {
    if (!form.name || !form.subCategory || !form.variantCategory?.length)
      return alert("Name, Sub Category & at least one Variant are required!");

    const fd = new FormData();
    fd.append("name", form.name);
    fd.append("mainCategory", form.mainCategory);
    fd.append("subCategory", form.subCategory);
    fd.append("description", form.description);
    fd.append("tags", form.tags);
    // send variantCategory as JSON string - backend should parse it
    fd.append("variantCategory", JSON.stringify(form.variantCategory));
    fd.append("addons", JSON.stringify(addons));


    if (imageFile) fd.append("image", imageFile);

    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/menu", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });

      const data = await res.json();
      if (!res.ok) return alert(data.msg || "Save failed!");

      alert("Item saved!");
      resetForm();
      fetchItems();
    } catch (err) {
      alert("Server error");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // -------------------------------------------
  // RESET FORM
  // -------------------------------------------
  const resetForm = () => {
    setForm({
      name: "",
      mainCategory: "Drinks",
      subCategory: "",
      variantCategory: [],
      description: "",
      tags: "",
    });
    setNewVariantName("");
    setNewVariantPrice("");
    setImageFile(null);
    setPreview(null);
    setEditingId(null);
  };

  // -------------------------------------------
  // START EDITING
  // -------------------------------------------
  const startEdit = (item) => {
    setEditingId(item._id);

    // If backend still returns old price/variantCategory as string for some items,
    // try to normalize to an array.
    setAddons(item.addons && item.addons.length > 0 
    ? item.addons 
    : [{ name: "", price: "" }]
  );

    let variants = [];
    if (Array.isArray(item.variantCategory)) {
      variants = item.variantCategory;
    } else if (
      typeof item.variantCategory === "string" &&
      item.variantCategory.trim()
    ) {
      try {
        variants = JSON.parse(item.variantCategory);
        if (!Array.isArray(variants)) variants = [];
      } catch {
        // fallback: if string single variant name exists, keep it as single variant with price fallback
        variants = [{ name: item.variantCategory, price: item.price || 0 }];
      }
    } else if (item.price) {
      // backward-compatibility: single price -> create one variant
      variants = [{ name: "default", price: item.price }];
    }

    setForm({
      name: item.name,
      mainCategory: item.mainCategory,
      subCategory: item.subCategory,
      variantCategory: variants,
      description: item.description,
      tags: item.tags ? item.tags.join(", ") : "",
    });

    setPreview(item.image || null);
    setImageFile(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // -------------------------------------------
  // UPDATE ITEM
  // -------------------------------------------
  const updateItem = async () => {
    if (!editingId) return;
    if (!form.name || !form.subCategory || !form.variantCategory?.length)
      return alert("Name, Sub Category & at least one Variant are required!");

    const fd = new FormData();
    fd.append("name", form.name);
    fd.append("mainCategory", form.mainCategory);
    fd.append("subCategory", form.subCategory);
    fd.append("description", form.description);
    fd.append("tags", form.tags);
    fd.append("variantCategory", JSON.stringify(form.variantCategory));
    fd.append("addons", JSON.stringify(addons));

    if (imageFile) fd.append("image", imageFile);

    setLoading(true);

    try {
      const res = await fetch(`http://localhost:5000/api/menu/${editingId}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });

      const data = await res.json();
      if (!res.ok) return alert(data.msg || "Update failed!");

      alert("Item updated!");
      resetForm();
      fetchItems();
    } catch (err) {
      alert("Server error");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // -------------------------------------------
  // DELETE ITEM
  // -------------------------------------------
  const deleteItem = async (id) => {
    if (!window.confirm("Delete this item?")) return;

    try {
      const res = await fetch(`http://localhost:5000/api/menu/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) return alert("Delete failed");

      alert("Item deleted");
      fetchItems();
    } catch (err) {
      console.error(err);
    }
  };

  // -------------------------------------------
  // FILTER CHIPS (Dynamic)
  // -------------------------------------------
  const chipOptions = [
    "All",
    ...new Set(items.map((i) => i.mainCategory)),
    ...new Set(items.map((i) => i.subCategory)),
  ];

  // -------------------------------------------
  // FILTERING LOGIC
  // -------------------------------------------
  let filteredItems = items;

  if (filterMain !== "All") {
    filteredItems = filteredItems.filter(
      (item) => item.mainCategory === filterMain
    );
  }

  if (filterSub !== "All") {
    filteredItems = filteredItems.filter(
      (item) => item.subCategory === filterSub
    );
  }

  if (activeChip !== "All") {
    filteredItems = filteredItems.filter(
      (item) =>
        item.mainCategory === activeChip || item.subCategory === activeChip
    );
  }

  if (search.trim() !== "") {
    filteredItems = filteredItems.filter((item) =>
      item.name.toLowerCase().includes(search.toLowerCase())
    );
  }

  // -------------------------------------------
  // SORTING
  // -------------------------------------------
  if (sortType === "priceLow") {
    filteredItems.sort((a, b) => {
      const aMin =
        a.variantCategory && a.variantCategory.length
          ? Math.min(...a.variantCategory.map((v) => Number(v.price || 0)))
          : Number(a.price || 0);
      const bMin =
        b.variantCategory && b.variantCategory.length
          ? Math.min(...b.variantCategory.map((v) => Number(v.price || 0)))
          : Number(b.price || 0);
      return aMin - bMin;
    });
  }
  if (sortType === "priceHigh") {
    filteredItems.sort((a, b) => {
      const aMax =
        a.variantCategory && a.variantCategory.length
          ? Math.max(...a.variantCategory.map((v) => Number(v.price || 0)))
          : Number(a.price || 0);
      const bMax =
        b.variantCategory && b.variantCategory.length
          ? Math.max(...b.variantCategory.map((v) => Number(v.price || 0)))
          : Number(b.price || 0);
      return bMax - aMax;
    });
  }
  if (sortType === "nameAZ") {
    filteredItems.sort((a, b) => a.name.localeCompare(b.name));
  }
  if (sortType === "nameZA") {
    filteredItems.sort((a, b) => b.name.localeCompare(a.name));
  }

  // -------------------------------------------
  // PAGINATION
  // -------------------------------------------
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedItems = filteredItems.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // -------------------------------------------
  // UI STARTS HERE
  // -------------------------------------------
  return (
    <div className="max-w-3xl mx-auto p-6">
      {/* PAGE TITLE */}
      <h2 className="text-3xl font-bold mb-6 text-amber-700">
        {editingId ? "Edit Menu Item" : "Add Menu Item"}
      </h2>

      {/* -------------------------------------------
          FORM STARTS
      ------------------------------------------- */}
      <div className="bg-white shadow-xl rounded-xl p-6 border border-amber-200">
        {/* Item Name */}
        <label className="block mb-2 font-semibold">Item Name</label>
        <input
          className="w-full p-3 mb-4 border rounded-lg bg-amber-50"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        {/* Main Category */}
        <label className="block mb-2 font-semibold">Main Category</label>
        <select
          className="w-full p-3 mb-4 border rounded-lg bg-amber-50"
          value={form.mainCategory}
          onChange={(e) => setForm({ ...form, mainCategory: e.target.value })}
        >
          <option>Drinks</option>
          <option>Food</option>
        </select>

        {/* Sub Category */}
        <label className="block mb-2 font-semibold">Sub Category</label>
        <input
          className="w-full p-3 mb-4 border rounded-lg bg-amber-50"
          value={form.subCategory}
          onChange={(e) => setForm({ ...form, subCategory: e.target.value })}
        />

        {/* --------------------------
            VARIANTS UI
        --------------------------- */}
        <label className="block mb-2 font-semibold">Variants</label>

        <div className="mb-3">
          {form.variantCategory && form.variantCategory.length > 0 ? (
            <div className="space-y-2 mb-3">
              {form.variantCategory.map((v, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    className="p-2 border rounded w-1/2"
                    value={v.name}
                    onChange={(e) => updateVariant(idx, "name", e.target.value)}
                  />
                  <input
                    className="p-2 border rounded w-1/2"
                    type="number"
                    value={v.price}
                    onChange={(e) =>
                      updateVariant(idx, "price", e.target.value)
                    }
                  />
                  <button
                    onClick={() => removeVariant(idx)}
                    className="px-3 py-1 bg-red-600 text-white rounded"
                    type="button"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 mb-3">No variants added yet.</p>
          )}

          <div className="flex gap-2 items-center">
            <input
              placeholder="Variant name (e.g. small)"
              className="p-2 border rounded w-1/2"
              value={newVariantName}
              onChange={(e) => setNewVariantName(e.target.value)}
            />
            <input
              placeholder="Price"
              className="p-2 border rounded w-1/2"
              type="number"
              value={newVariantPrice}
              onChange={(e) => setNewVariantPrice(e.target.value)}
            />
          </div>

          <div className="mt-2">
            <button
              onClick={addVariant}
              type="button"
              className="px-4 py-2 bg-amber-600 text-white rounded"
            >
              Add Variant
            </button>
          </div>
        </div>

        {/* Description */}
        <label className="block mb-2 font-semibold">Description</label>
        <textarea
          className="w-full p-3 mb-4 border rounded-lg bg-amber-50 min-h-[80px]"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />

        {/* Tags */}
        <label className="block mb-2 font-semibold">Tags</label>
        <input
          className="w-full p-3 mb-4 border rounded-lg bg-amber-50"
          value={form.tags}
          onChange={(e) => setForm({ ...form, tags: e.target.value })}
        />

        <h3 className="font-bold mt-4">Add-ons (Optional)</h3>

        {addons.map((a, i) => (
          <div key={i} className="flex gap-3 mt-2">
            <input
              placeholder="Addon name"
              className="border p-2"
              value={a.name}
              onChange={(e) => updateAddon(i, "name", e.target.value)}
            />
            <input
              placeholder="Price"
              className="border p-2"
              value={a.price}
              onChange={(e) => updateAddon(i, "price", e.target.value)}
            />
          </div>
        ))}

        <button onClick={addAddonField} className="mt-2 text-sm text-blue-700">
          + Add More
        </button>

        {/* Image */}
        <label className="block mb-2 font-semibold">Upload Image</label>
        <input type="file" accept="image/*" onChange={onFile} />

        {preview && (
          <img
            src={preview}
            className="w-40 h-40 mt-4 object-cover rounded shadow"
          />
        )}

        {/* Submit / Update Button */}
        <button
          onClick={editingId ? updateItem : submit}
          className="w-full mt-5 py-3 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-lg"
          disabled={loading}
        >
          {loading
            ? "Saving..."
            : editingId
            ? "Update Menu Item"
            : "Save Menu Item"}
        </button>

        {editingId && (
          <button
            onClick={resetForm}
            className="w-full mt-3 py-2 border border-gray-400 rounded"
          >
            Cancel Editing
          </button>
        )}
      </div>

      {/* -------------------------------------------
          FILTERS + SORTING
      ------------------------------------------- */}
      <div className="mt-10 p-4 bg-white rounded-lg shadow border">
        <h3 className="text-xl font-semibold mb-4 text-amber-700">Filters</h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <input
            type="text"
            placeholder="Search..."
            className="p-2 border rounded"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
          />

          {/* Main Category */}
          <select
            className="p-2 border rounded"
            value={filterMain}
            onChange={(e) => {
              setFilterMain(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="All">All</option>
            <option value="Drinks">Drinks</option>
            <option value="Food">Food</option>
          </select>

          {/* Sub Category */}
          <select
            className="p-2 border rounded"
            value={filterSub}
            onChange={(e) => {
              setFilterSub(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="All">All Sub Categories</option>
            {[...new Set(items.map((i) => i.subCategory))].map((sub) => (
              <option key={sub}>{sub}</option>
            ))}
          </select>

          {/* Sorting Dropdown */}
          <select
            className="p-2 border rounded"
            value={sortType}
            onChange={(e) => {
              setSortType(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="">Sort By</option>
            <option value="priceLow">Price Low → High</option>
            <option value="priceHigh">Price High → Low</option>
            <option value="nameAZ">Name A → Z</option>
            <option value="nameZA">Name Z → A</option>
          </select>
        </div>
      </div>

      {/* -------------------------------------------
          FILTER CHIPS (Zomato Style)
      ------------------------------------------- */}
      <div className="flex flex-wrap gap-2 mt-5 mb-5">
        {chipOptions.map((chip) => (
          <button
            key={chip}
            onClick={() => {
              setActiveChip(chip);
              setCurrentPage(1);
            }}
            className={`px-4 py-2 rounded-full border transition ${
              activeChip === chip
                ? "bg-amber-600 text-white border-amber-600"
                : "bg-white text-gray-600 border-gray-300"
            }`}
          >
            {chip}
          </button>
        ))}
      </div>

      {/* -------------------------------------------
          MENU ITEMS LIST
      ------------------------------------------- */}
      <h2 className="text-2xl font-bold mt-10 mb-4 text-amber-700">
        Menu Items
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {paginatedItems.map((item) => (
          <div key={item._id} className="p-4 border rounded-lg bg-white shadow">
            {item.image ? (
              <img
                loading="lazy"
                src={item.image.replace("/upload/", "/upload/f_auto,q_auto/")}
                className="w-full h-40 object-cover rounded"
                alt={item.name}
              />
            ) : (
              <div className="w-full h-40 bg-gray-200 rounded flex items-center justify-center">
                No Image
              </div>
            )}

            <h3 className="font-bold mt-2">{item.name}</h3>
            <p className="text-gray-600">{item.subCategory}</p>
            <p className="font-semibold">{getDisplayPrice(item)}</p>
            {/* Show Addons ONLY if valid addons exist */}
{Array.isArray(item.addons) &&
 item.addons.some(a => a?.name && a?.price) && (
  <div className="mt-2">
    <p className="font-semibold text-sm text-amber-700">Available Add-ons:</p>

    <ul className="text-sm text-gray-600 ml-2 list-disc">
      {item.addons
        .filter(a => a?.name && a?.price)
        .map((a, idx) => (
          <li key={idx}>
            {a.name} — ₹{a.price}
          </li>
        ))}
    </ul>
  </div>
)}



            <div className="flex gap-2 mt-4">
              <button
                onClick={() => startEdit(item)}
                className="px-3 py-2 bg-yellow-500 text-white rounded"
              >
                Edit
              </button>

              <button
                onClick={() => deleteItem(item._id)}
                className="px-3 py-2 bg-red-600 text-white rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* -------------------------------------------
          PAGINATION
      ------------------------------------------- */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6 gap-2">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Prev
          </button>

          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 border rounded ${
                currentPage === i + 1 ? "bg-amber-600 text-white" : "bg-white"
              }`}
            >
              {i + 1}
            </button>
          ))}

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
