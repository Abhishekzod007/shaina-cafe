export default function NotFound() {
return (
<div className="text-center py-32 text-amber-900 animate-fadeIn">
<h1 className="text-6xl font-bold">404</h1>
<p className="mt-4 text-xl">Oops! Page not found.</p>
<a href="/" className="mt-6 inline-block px-6 py-2 bg-amber-500 text-amber-900 rounded-xl shadow-md hover:scale-105 transition">
Go Home
</a>
</div>
);
}