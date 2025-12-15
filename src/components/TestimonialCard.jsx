export default function TestimonialCard({ t }) {
return (
<div className="p-4 bg-amber-50 rounded-xl shadow-md hover:shadow-xl transition">
<p className="italic text-amber-900">"{t.text}"</p>
<p className="mt-2 text-sm text-amber-700">— {t.name}, {t.city}</p>
</div>
);
}