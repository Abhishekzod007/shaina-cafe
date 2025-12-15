import { Link } from "react-router-dom";

export default function AdminDashboard() {
return (
<div className="max-w-6xl mx-auto px-4 py-10 text-amber-900 animate-fadeIn">
<h1 className="text-4xl font-bold mb-4">Admin Dashboard</h1>
<p className="text-lg">Manage menu items, orders</p>
<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">


<Link to="/admin/menu">
  <div className="p-8 bg-amber-100 rounded-xl shadow-md hover:bg-amber-200">Menu Management</div>
</Link>
<Link to="/admin/orders">
  <div className="p-8 bg-amber-100 rounded-xl shadow-md  hover:bg-amber-200">
    Orders
  </div>
</Link>

</div>
</div>
);
}