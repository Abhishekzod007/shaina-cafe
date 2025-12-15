// CartItem.jsx
export default function CartItem({ item }) {
  const imgSrc = item.img || "/assets/placeholder.png"; // change placeholder path if needed
  const price = typeof item.price === "number" ? item.price : Number(String(item.price).replace(/[^0-9.-]/g, ""));

  return (
    <div className="flex justify-between items-center p-4 bg-amber-50 rounded-xl shadow-md mb-3">
      <div className="flex items-center gap-3">
        <img
          src={imgSrc}
          alt={item.name}
          className="w-14 h-14 rounded-md object-cover"
        />
        <div>
          <p className="font-semibold text-amber-900">{item.name}</p>
          <p className="text-amber-700 text-sm">Variant: {item.variant}</p>
          <p className="text-amber-700 text-sm">₹{price} x {item.qty} = <span className="font-bold">₹{price * item.qty}</span></p>
        </div>
      </div>

      <p className="text-amber-900 font-bold">x{item.qty}</p>
    </div>
  );
}
