import { io } from "socket.io-client";

import { useEffect, useState, useCallback, useRef } from "react";

const statusColors = {
  placed: "bg-yellow-200 text-yellow-800",
  pending: "bg-yellow-200 text-yellow-800",
  preparing: "bg-blue-200 text-blue-800",
  ready: "bg-indigo-200 text-indigo-800",
  completed: "bg-green-200 text-green-800",
  cancelled: "bg-red-200 text-red-800",
};

// small beep audio (very short). Works without external file.
const BEEP_BASE64 =
  "UklGRhQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YRAAAAAA"; // tiny silent-ish placeholder
// NOTE: If you want a real beep, replace BEEP_BASE64 with an actual short beep WAV base64.
const socket = io("https://shaina-cafe-backend.onrender.com", {
  withCredentials: true,
  transports: ["websocket"], // 👈 IMPORTANT
});
export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [sortType, setSortType] = useState("newest");
  const [selectedOrder, setSelectedOrder] = useState(null);
const [hasNewOrderAlert, setHasNewOrderAlert] = useState(false);

  // Pagination
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(6);

  // For polling & notifications
  const prevOrdersRef = useRef([]);
  const pollingRef = useRef(null);
  const audioRef = useRef(null);
const alarmIntervalRef = useRef(null);

const startAlarm = () => {
  if (alarmIntervalRef.current) return;

  audioRef.current?.play().catch(() => {});
  alarmIntervalRef.current = setInterval(() => {
    audioRef.current?.play().catch(() => {});
  }, 10000);
};

const stopAlarm = () => {
  if (alarmIntervalRef.current) {
    clearInterval(alarmIntervalRef.current);
    alarmIntervalRef.current = null;
  }
};


  // init audio
  useEffect(() => {
    try {
      audioRef.current = new Audio("/bell-notification-337658.mp3");
    } catch (e) {
      audioRef.current = null;
    }
  }, []);

  // fetch orders from backend
  const fetchOrders = useCallback(async () => {
    try {
      const res = await fetch("https://shaina-cafe-backend.onrender.com/api/orders");
      if (!res.ok) {
        console.error("Fetch orders failed:", await res.text());
        return;
      }
      const data = await res.json();
      const list = data.orders || [];

      // If new orders arrived (length increased OR new id not present), play sound
      // const prev = prevOrdersRef.current || [];
      // if (list.length > prev.length) {
      //   // simple check — play sound once
      //   if (audioRef.current) {
      //     // try to play; browsers may block autoplay depending on user interaction
      //     audioRef.current.currentTime = 0;
      //     audioRef.current.play().catch(() => {});
      //   }
      // } else {
      //   // also check for any completely new order IDs not present in prev
      //   const prevIds = new Set(prev.map((o) => String(o._id)));
      //   const hasNew = list.some((o) => !prevIds.has(String(o._id)));
      //   if (hasNew && audioRef.current) {
      //     audioRef.current.currentTime = 0;
      //     audioRef.current.play().catch(() => {});
      //   }
      // }

      prevOrdersRef.current = list;
      setOrders(list);
      const hasPending = list.some(o => o.status === "pending");
setHasNewOrderAlert(hasPending);
if (hasPending) {
  startAlarm();
} else {
  stopAlarm();
}

    } catch (err) {
      console.error("Fetch Orders Error:", err);
    }
  }, []);

  // initial fetch + start polling
  useEffect(() => {
    fetchOrders();

    // poll every 5s
    pollingRef.current = setInterval(fetchOrders, 5000);

    return () => {
      clearInterval(pollingRef.current);
    };
  }, [fetchOrders]);


  useEffect(() => {
  socket.on("new-order", () => {
    // play alarm immediately
    // if (audioRef.current) {
    //   audioRef.current.currentTime = 0;
    //   audioRef.current.play().catch(() => {});
    // }

    // // repeat every 10 seconds
    // if (!alarmIntervalRef.current) {
    //   alarmIntervalRef.current = setInterval(() => {
    //     audioRef.current?.play().catch(() => {});
    //   }, 10000);
    // }

    // refresh orders instantly
    fetchOrders();
  });

  return () => {
    socket.off("new-order");
  };
}, [fetchOrders]);

  // update a single order's status on backend
  const updateStatus = async (id, newStatus) => {
    try {
      const res = await fetch(`https://shaina-cafe-backend.onrender.com/api/orders/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) {
        console.error("Status update failed:", await res.text());
        return;
      }
      await fetchOrders();
//       if (alarmIntervalRef.current) {
//   clearInterval(alarmIntervalRef.current);
//   alarmIntervalRef.current = null;
// }

      setSelectedOrder((prev) =>
        prev && prev._id === id ? { ...prev, status: newStatus } : prev
      );
    } catch (err) {
      console.error("Update Status Error:", err);
    }
  };

  // delete order
  const deleteOrder = async (id) => {
    if (!window.confirm("Delete this order?")) return;
    try {
      const res = await fetch(`https://shaina-cafe-backend.onrender.com/api/orders/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        console.error("Delete failed:", await res.text());
        return;
      }
      await fetchOrders();
      setSelectedOrder(null);
    } catch (err) {
      console.error("Delete Error:", err);
    }
  };

  // Sorting + filtering
  const sortedOrders = [...orders].sort((a, b) => {
    if (sortType === "newest")
      return new Date(b.createdAt) - new Date(a.createdAt);
    if (sortType === "oldest")
      return new Date(a.createdAt) - new Date(b.createdAt);
    if (sortType === "high") return b.total - a.total;
    if (sortType === "low") return a.total - b.total;
    return 0;
  });

  const filtered = sortedOrders.filter((o) =>
    [
      String(o._id),
      o.orderId,
      o.customer?.name,
      o.customer?.phone,
      String(o.total),
    ]
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  // Pagination calc
  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const pageData = filtered.slice((page - 1) * perPage, page * perPage);

  useEffect(() => {
    // if current page > totalPages because list changed, clamp it
    if (page > totalPages) setPage(totalPages);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalPages]);

  return (
    <div className={`max-w-6xl mx-auto px-6 py-10 ${
    hasNewOrderAlert ? "border-4 border-red-600 animate-pulse" : ""
  }`}>
     <div className="flex items-center gap-3 mb-6">
  <h1 className="text-3xl font-bold">Orders</h1>

  {hasNewOrderAlert && (
    <span className="px-3 py-1 text-sm font-bold text-white bg-red-600 rounded-full animate-pulse">
      NEW ORDER
    </span>
  )}
</div>
      {/* Search + Sort + Per page */}
      <div className="flex flex-col md:flex-row gap-4 mb-6 items-center">
        <input
          type="text"
          placeholder="Search ID, Name, Phone, Total..."
          className="flex-1 p-3 border rounded-lg"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />

        <select
          className="p-3 border rounded-lg"
          value={sortType}
          onChange={(e) => setSortType(e.target.value)}
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="high">High Amount First</option>
          <option value="low">Low Amount First</option>
        </select>

        <select
          className="p-3 border rounded-lg"
          value={perPage}
          onChange={(e) => {
            setPerPage(Number(e.target.value));
            setPage(1);
          }}
        >
          <option value={5}>5 / page</option>
          <option value={6}>6 / page</option>
          <option value={10}>10 / page</option>
          <option value={20}>20 / page</option>
        </select>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {pageData.map((order) => (
          <div
            key={order._id}
            className="p-5 border rounded-xl shadow bg-white cursor-pointer hover:shadow-lg transition"
            onClick={() => setSelectedOrder(order)}
          >
            <h2 className="font-bold">
              Order ID: {order.orderId || order._id}
            </h2>
            <p className="text-sm text-gray-600">
              {new Date(order.createdAt).toLocaleString()}
            </p>

            <div className="mt-2">
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  statusColors[order.status] || "bg-gray-200 text-gray-800"
                }`}
              >
                {String(order.status || "placed").toUpperCase()}
              </span>
            </div>

            <p className="mt-2">
              <b>Name:</b> {order.customer?.name || "—"}
              
            </p>
            <p className="mt-2">
              <b>Number:</b> {order.customer?.phone || "—"}
              
            </p>
             <p className="mt-2">
               <b>Address:</b> {order.customer?.address || "—"}
              
            </p>
           
            <p className="mt-2">
              <b>Total:</b> ₹{order.total}
            </p>
          </div>
        ))}

        {pageData.length === 0 && (
          <p className="text-center text-gray-500 py-8">No orders found.</p>
        )}
      </div>

      {/* Pagination controls */}
      <div className="flex items-center justify-between mt-6 gap-4">
        <div>
          Page {page} of {totalPages}
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="px-3 py-2 border rounded"
            disabled={page === 1}
          >
            Prev
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .slice(0, 10)
            .map((pNum) => (
              <button
                key={pNum}
                onClick={() => setPage(pNum)}
                className={`px-3 py-2 border rounded ${
                  pNum === page ? "bg-amber-600 text-white" : ""
                }`}
              >
                {pNum}
              </button>
            ))}

          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            className="px-3 py-2 border rounded"
            disabled={page === totalPages}
          >
            Next
          </button>
        </div>
      </div>


      {/* Modal: Selected Order */}
     {selectedOrder && (
  <div className="fixed inset-0 bg-black/40 flex justify-center items-start pt-20 z-50">
    <div className="bg-white rounded-xl max-w-lg w-full relative shadow-lg animate-fadeIn 
                    max-h-[90vh] flex flex-col">

      {/* HEADER (fixed) */}
      <div className="p-6 pb-3 border-b">
        <button
          className="absolute top-3 right-3 text-xl"
          onClick={() => setSelectedOrder(null)}
        >
          ✖
        </button>

        <h1 className="text-2xl font-bold mb-3">Order Details</h1>

        <p className="text-sm mb-1">
          <b>Order ID:</b> {selectedOrder.orderId || selectedOrder._id}
        </p>

        <p className="text-sm mb-3">
          <b>Date:</b> {new Date(selectedOrder.createdAt).toLocaleString()}
        </p>

        <div className="mb-2">
          <label className="font-semibold">Update Status:</label>
          <select
            className="ml-2 p-2 border rounded-lg"
            value={selectedOrder.status}
            onChange={(e) => updateStatus(selectedOrder._id, e.target.value)}
          >
            <option value="placed">Placed</option>
            <option value="pending">Pending</option>
            <option value="preparing">Preparing</option>
            <option value="ready">Ready</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* BODY (scrollable content) */}
      <div className="overflow-y-auto px-6 py-4 space-y-4 flex-1">
        <h2 className="font-semibold mb-2">Items:</h2>

        {selectedOrder.items?.map((it, idx) => {
          const base = it.basePrice ?? it.price ?? 0;
          const addonTotal = it.addonTotal ?? 0;
          const perUnit = it.price ?? base + addonTotal;

          return (
            <div key={idx} className="mb-3 pb-3 border-b last:border-b-0">
              <div className="flex justify-between">
                <div>
                  <p className="font-semibold text-lg">{it.name}</p>

                  {it.variant && (
                    <p className="text-xs text-gray-600 mb-1">
                      Variant: <span className="font-medium">{it.variant}</span>
                    </p>
                  )}

                  {it.addons?.length > 0 ? (
                    <div className="text-xs mt-1">
                      <p className="font-semibold text-gray-700">
                        Add-ons:
                      </p>
                      {it.addons.map((ad, i) => (
                        <p key={i} className="text-gray-600">
                          ➕ {ad.name} (+₹{ad.price})
                        </p>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-gray-500">No add-ons</p>
                  )}

                  <p className="text-xs text-gray-700 mt-1">
                    Base: ₹{base}{" "}
                    {addonTotal > 0 && <>| Add-ons: ₹{addonTotal}</>}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-sm font-semibold text-amber-700">
                    ₹{perUnit} × {it.qty}
                  </p>
                  <p className="font-bold text-lg">₹{perUnit * it.qty}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* FOOTER (fixed) */}
      <div className="border-t p-6 flex gap-3">
        <button
          onClick={() => deleteOrder(selectedOrder._id)}
          className="flex-1 bg-red-600 text-white p-3 rounded-lg hover:bg-red-700"
        >
          Delete Order
        </button>
        <button
          onClick={() => setSelectedOrder(null)}
          className="flex-1 bg-gray-500 text-white p-3 rounded-lg hover:bg-gray-600"
        >
          Close
        </button>
      </div>
    </div>
  </div>
)}

      <style>{`
        .animate-fadeIn { animation: fadeIn .25s ease-out; }
        @keyframes fadeIn { from { opacity:0; transform:scale(.98); } to { opacity:1; transform:scale(1);} }
      `}</style>
    </div>
  );
}
