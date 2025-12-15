export default function OrderSummary({ total }) {
return (
<div className="p-4 bg-amber-100 rounded-xl shadow-md">
<h3 className="font-bold text-amber-900 text-lg">Order Summary</h3>
<p className="text-amber-800 mt-2">Total: ₹{total}</p>
<button className="mt-4 w-full px-4 py-2 bg-amber-500 text-amber-900 rounded-xl shadow-md hover:shadow-amber-400/50">
Checkout
</button>
</div>
);
}