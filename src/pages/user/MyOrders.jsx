
import { useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth";
import useCart from "../../hooks/useCart";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function MyOrders() {
  const { token } = useAuth();
  const { addToCart } = useCart();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedOrder, setSelectedOrder] = useState(null);

  const [page, setPage] = useState(1);
  const perPage = 5;

  // ---------------- LOAD ORDERS ----------------
  const loadOrders = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/orders/my-orders", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (res.ok) setOrders(data.orders || []);
    } catch (err) {
      console.error("Orders load error:", err);
    }
    setLoading(false);
  };

  // Refresh every 2 seconds
  useEffect(() => {
    if (!token) return;

    loadOrders();
    const interval = setInterval(loadOrders, 2000);
    return () => clearInterval(interval);
  }, [token]);

  if (loading) return <p>Loading orders...</p>;
  if (orders.length === 0) return <p>No past orders found.</p>;

  // ---------------- STATUS ANIMATION ----------------
  const statusBadge = (status) => {
    if (status === "pending")
      return (
        <div className="flex items-center gap-1 text-yellow-600 animate-pulse">
          <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
          Pending
        </div>
      );

    if (status === "preparing")
      return (
        <div className="flex items-center gap-1 text-blue-600 animate-pulse">
          🔵 Preparing...
        </div>
      );

    if (status === "ready")
      return (
        <div className="flex items-center gap-1 text-green-600 animate-bounce">
          🟢 Ready
        </div>
      );

    if (status === "completed")
      return <span className="text-green-700">Completed</span>;

    if (status === "cancelled")
      return <span className="text-red-600">Cancelled</span>;

    return status;
  };

  // ---------------- PDF INVOICE ----------------
 



// ---------------- PDF INVOICE (Swiggy/Zomato Modern Style) ----------------
const downloadInvoice = (order) => {
  const doc = new jsPDF();

  // --- HEADER: Shaina Café ---
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.setTextColor(255, 87, 34); // Swiggy orange
  doc.text("Shaina Café", 14, 20);

  doc.setFontSize(14);
  doc.setTextColor(40);
  doc.text(`Invoice - ${order.orderId}`, 14, 35);

  // --- Order Details ---
  doc.setFontSize(11);
  doc.setTextColor(60);
  doc.text(`Date: ${new Date(order.createdAt).toLocaleString()}`, 14, 50);
  doc.text(`Status: ${order.status}`, 14, 65);
  doc.text(`Customer: ${order.customer?.name || "-"}`, 14, 80);
  doc.text(`Phone: ${order.customer?.phone || "-"}`, 14, 95);

  // ---------------- ITEMS TABLE ----------------
  const tableData = [];

  order.items.forEach((item) => {
    const price = item.price * item.qty;

    tableData.push([
      item.name + (item.variant ? ` (${item.variant})` : ""),
      item.qty,
      `₹${price}`,
    ]);

    // Add-ons (indented rows)
    if (item.addons?.length > 0) {
      item.addons.forEach((a) => {
        tableData.push([
          `   • ${a.name} (+₹${a.price})`,
          "",
          "",
        ]);
      });
    }
  });

  autoTable(doc, {
    startY: 115,
    head: [["Item", "Qty", "Price"]],
    body: tableData,
    theme: "grid",
    styles: { fontSize: 11, cellPadding: 4 },
    headStyles: {
      fillColor: [255, 87, 34],
      textColor: 255,
      halign: "center",
    },
    columnStyles: {
      0: { cellWidth: 110 },
      1: { cellWidth: 20, halign: "center" },
      2: { cellWidth: 30, halign: "right" },
    },
  });

  // ---------------- TOTAL ----------------
  const finalY = doc.lastAutoTable.finalY + 15;
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text(`Total: ₹${order.total}`, 14, finalY);

  // ---------------- FOOTER ----------------
  doc.setFontSize(12);
  doc.setTextColor(120);
  doc.text("Thank you for ordering from Shaina Café ❤️", 14, finalY + 20);

  doc.save(`Invoice-${order.orderId}.pdf`);
};



  // ---------------- GROUP BY DATE ----------------
  const groupByDate = (orders) => {
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();

    const groups = { Today: [], Yesterday: [], Older: [] };

    orders.forEach((o) => {
      const d = new Date(o.createdAt).toDateString();
      if (d === today) groups.Today.push(o);
      else if (d === yesterday) groups.Yesterday.push(o);
      else groups.Older.push(o);
    });

    return groups;
  };

  const groupedOrders = groupByDate(orders);

  // ---------------- PAGINATION ----------------
  const paginated = (list) =>
    list.slice((page - 1) * perPage, page * perPage);

  // ---------------- REORDER ----------------
  const reorder = (order) => {
    order.items.forEach((i) => {
      const addonKey =
        (i.addons || [])
          .map((a) => a.name)
          .sort()
          .join("|") || "plain";

      const cartId = `${i.itemId}_${i.variant}_${addonKey}`;

      addToCart({
        id: cartId,
        name: i.name,
        variant: i.variant,
        img: i.image,
        addons: i.addons || [],
        basePrice: i.basePrice,
        addonTotal: i.addonTotal,
        price: i.price,
      });
    });

    alert("Items added to cart!");
  };

  return (
    <div className="space-y-10">
      {Object.entries(groupedOrders).map(([label, list]) =>
        list.length > 0 ? (
          <div key={label}>
            <h2 className="text-2xl font-bold mb-4">{label}</h2>

            {paginated(list).map((order) => (
              <div
                key={order._id}
                className="p-5 bg-white rounded-xl shadow border border-amber-200"
              >
                <div className="flex justify-between items-center">
                  <p className="text-xl font-bold">
                    Order #{order.orderId}
                  </p>

                  {/* Status Animation */}
                  {statusBadge(order.status)}
                </div>

                <p className="text-gray-600 text-sm">
                  {new Date(order.createdAt).toLocaleString()}
                </p>

                {/* BUTTONS */}
                <div className="flex gap-3 mt-4">
                  <button
                    onClick={() => setSelectedOrder(order)}
                    className="px-4 py-2 bg-amber-600 text-white rounded-lg"
                  >
                    View Details
                  </button>

                  <button
                    onClick={() => reorder(order)}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg"
                  >
                    Reorder
                  </button>

                  <button
                    onClick={() => downloadInvoice(order)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                  >
                    Download Invoice
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : null
      )}

      {/* PAGINATION */}
      <div className="flex justify-center gap-4 mt-6">
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
          className="px-4 py-2 border rounded disabled:opacity-50"
        >
          Prev
        </button>

        <button
          disabled={page * perPage >= orders.length}
          onClick={() => setPage((p) => p + 1)}
          className="px-4 py-2 border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {/* DETAILS MODAL (unchanged) */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-start pt-20 z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-lg shadow-xl max-h-[90vh] overflow-y-auto relative">
            <button
              className="absolute top-3 right-3 text-xl"
              onClick={() => setSelectedOrder(null)}
            >
              ✖
            </button>

            <h1 className="text-2xl font-bold mb-3">
              Order #{selectedOrder.orderId}
            </h1>

            <p className="text-sm text-gray-600 mb-3">
              {new Date(selectedOrder.createdAt).toLocaleString()}
            </p>

            <h3 className="font-semibold text-lg mb-2">Items:</h3>

            {selectedOrder.items.map((it, i) => (
              <div
                key={i}
                className="border-b pb-3 mb-3 flex justify-between"
              >
                <div>
                  <p className="font-semibold">{it.name} × {it.qty}</p>
                  {it.variant && (
                    <p className="text-xs text-gray-600">
                      Variant: {it.variant}
                    </p>
                  )}

                  {it.addons?.length > 0 ? (
                    <div className="text-xs mt-1">
                      <p className="font-semibold">Add-ons:</p>
                      {it.addons.map((a, j) => (
                        <p key={j}>➕ {a.name} (+₹{a.price})</p>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-gray-500">No add-ons</p>
                  )}
                </div>

                <div className="text-right">
                  <p className="text-sm font-semibold text-amber-700">
                    ₹{it.price} × {it.qty}
                  </p>
                  <p className="font-bold">₹{it.price * it.qty}</p>
                </div>
              </div>
            ))}

            <h2 className="text-xl font-bold mt-4">
              Total: ₹{selectedOrder.total}
            </h2>
          </div>
        </div>
      )}
    </div>
  );
}

