"use client";
import { useState, useEffect, useCallback } from "react";
import AdminShell from "@/components/AdminShell";
import { Eye, X } from "lucide-react";

type OrderItem = { slug: string; name: string; qty: number; price: number; image: string };
type Order = {
  id: string;
  order_number: string;
  status: string;
  first_name: string;
  last_name: string;
  email: string;
  address: string;
  city: string;
  province: string;
  postal_code: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  payment_id: string | null;
  payment_status: string;
  created_at: string;
};

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  pending:    { bg: "#FFF5CC", text: "#B8860B" },
  paid:       { bg: "#DAEEFF", text: "#2A98DF" },
  processing: { bg: "#EDE9FF", text: "#7B6FD5" },
  shipped:    { bg: "#E8FFF5", text: "#2AB89A" },
  delivered:  { bg: "#E8FFF5", text: "#1A7A5A" },
  cancelled:  { bg: "#FFE5E5", text: "#E04B3B" },
};

const STATUSES = ["pending", "paid", "processing", "shipped", "delivered", "cancelled"];

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewing, setViewing] = useState<Order | null>(null);
  const [filter, setFilter] = useState("all");

  const fetchOrders = useCallback(async () => {
    const res = await fetch("/api/admin/orders");
    if (res.ok) setOrders(await res.json());
    setLoading(false);
  }, []);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const updateStatus = async (id: string, status: string) => {
    await fetch("/api/admin/orders", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    await fetchOrders();
    if (viewing?.id === id) setViewing((v) => v ? { ...v, status } : null);
  };

  const filtered = filter === "all" ? orders : orders.filter((o) => o.status === filter);

  const stats = {
    total: orders.length,
    pending: orders.filter((o) => o.status === "pending").length,
    processing: orders.filter((o) => ["paid", "processing"].includes(o.status)).length,
    shipped: orders.filter((o) => o.status === "shipped").length,
    revenue: orders.filter((o) => o.status !== "cancelled").reduce((s, o) => s + Number(o.total), 0),
  };

  return (
    <AdminShell>
      <h1 className="font-extrabold text-2xl mb-6" style={{ color: "var(--navy)" }}>Orders</h1>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Orders", value: stats.total, color: "var(--navy)" },
          { label: "Pending", value: stats.pending, color: "#B8860B" },
          { label: "Processing", value: stats.processing, color: "var(--lavender)" },
          { label: "Revenue", value: `R${stats.revenue.toFixed(2)}`, color: "var(--coral)" },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-white rounded-xl p-4 border" style={{ borderColor: "rgba(26,26,46,0.08)" }}>
            <p className="text-xs font-semibold mb-1" style={{ color: "var(--slate)" }}>{label}</p>
            <p className="text-xl font-extrabold" style={{ color }}>{value}</p>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {["all", ...STATUSES].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className="px-3 py-1.5 rounded-full text-xs font-bold border transition-colors capitalize"
            style={filter === s
              ? { backgroundColor: "var(--navy)", color: "white", borderColor: "var(--navy)" }
              : { borderColor: "rgba(26,26,46,0.15)", color: "var(--slate)" }
            }
          >
            {s}
          </button>
        ))}
      </div>

      {/* Orders table */}
      {loading ? (
        <div className="text-center py-20" style={{ color: "var(--slate)" }}>Loading...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20" style={{ color: "var(--slate)" }}>No orders found</div>
      ) : (
        <div className="bg-white rounded-2xl border overflow-hidden" style={{ borderColor: "rgba(26,26,46,0.08)" }}>
          <table className="w-full">
            <thead>
              <tr className="border-b text-left text-xs font-bold" style={{ borderColor: "rgba(26,26,46,0.08)", color: "var(--slate)" }}>
                <th className="px-4 py-3">Order</th>
                <th className="px-4 py-3 hidden md:table-cell">Customer</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 hidden md:table-cell">Date</th>
                <th className="px-4 py-3 w-16">View</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((o) => {
                const colors = STATUS_COLORS[o.status] || STATUS_COLORS.pending;
                return (
                  <tr key={o.id} className="border-b last:border-0 hover:bg-gray-50" style={{ borderColor: "rgba(26,26,46,0.05)" }}>
                    <td className="px-4 py-3">
                      <p className="text-sm font-bold" style={{ color: "var(--coral)" }}>#{o.order_number}</p>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <p className="text-sm font-semibold" style={{ color: "var(--navy)" }}>{o.first_name} {o.last_name}</p>
                      <p className="text-xs" style={{ color: "var(--slate)" }}>{o.email}</p>
                    </td>
                    <td className="px-4 py-3 text-sm font-bold" style={{ color: "var(--navy)" }}>R{Number(o.total).toFixed(2)}</td>
                    <td className="px-4 py-3">
                      <select
                        value={o.status}
                        onChange={(e) => updateStatus(o.id, e.target.value)}
                        className="text-xs font-bold px-2 py-1 rounded-full border-0 cursor-pointer"
                        style={{ backgroundColor: colors.bg, color: colors.text }}
                      >
                        {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                    <td className="px-4 py-3 text-xs hidden md:table-cell" style={{ color: "var(--slate)" }}>
                      {new Date(o.created_at).toLocaleDateString("en-ZA")}
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => setViewing(o)} className="p-1.5 rounded-lg hover:bg-gray-100">
                        <Eye size={15} style={{ color: "var(--slate)" }} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Order detail modal */}
      {viewing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setViewing(null)} />
          <div className="relative bg-white rounded-2xl w-full max-w-lg max-h-[80vh] overflow-y-auto border" style={{ borderColor: "rgba(26,26,46,0.08)" }}>
            <div className="flex items-center justify-between p-5 border-b" style={{ borderColor: "rgba(26,26,46,0.08)" }}>
              <h2 className="font-extrabold" style={{ color: "var(--navy)" }}>Order #{viewing.order_number}</h2>
              <button onClick={() => setViewing(null)}><X size={20} /></button>
            </div>
            <div className="p-5 flex flex-col gap-4">
              {/* Customer */}
              <div>
                <p className="text-xs font-bold mb-1" style={{ color: "var(--slate)" }}>Customer</p>
                <p className="text-sm font-semibold" style={{ color: "var(--navy)" }}>{viewing.first_name} {viewing.last_name}</p>
                <p className="text-sm" style={{ color: "var(--slate)" }}>{viewing.email}</p>
              </div>
              {/* Address */}
              <div>
                <p className="text-xs font-bold mb-1" style={{ color: "var(--slate)" }}>Shipping Address</p>
                <p className="text-sm" style={{ color: "var(--navy)" }}>
                  {viewing.address}<br />
                  {viewing.city}, {viewing.province} {viewing.postal_code}
                </p>
              </div>
              {/* Items */}
              <div>
                <p className="text-xs font-bold mb-2" style={{ color: "var(--slate)" }}>Items</p>
                {viewing.items.map((item, i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b last:border-0" style={{ borderColor: "rgba(26,26,46,0.05)" }}>
                    <div>
                      <p className="text-sm font-semibold" style={{ color: "var(--navy)" }}>{item.name}</p>
                      <p className="text-xs" style={{ color: "var(--slate)" }}>Qty: {item.qty}</p>
                    </div>
                    <span className="text-sm font-bold" style={{ color: "var(--navy)" }}>R{(item.price * item.qty).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              {/* Totals */}
              <div className="border-t pt-3" style={{ borderColor: "rgba(26,26,46,0.08)" }}>
                <div className="flex justify-between text-sm"><span style={{ color: "var(--slate)" }}>Subtotal</span><span style={{ color: "var(--navy)" }}>R{Number(viewing.subtotal).toFixed(2)}</span></div>
                <div className="flex justify-between text-sm mt-1"><span style={{ color: "var(--slate)" }}>Shipping</span><span style={{ color: "var(--navy)" }}>{Number(viewing.shipping) === 0 ? "FREE" : `R${Number(viewing.shipping).toFixed(2)}`}</span></div>
                <div className="flex justify-between text-base font-extrabold mt-2 pt-2 border-t" style={{ borderColor: "rgba(26,26,46,0.08)" }}>
                  <span style={{ color: "var(--navy)" }}>Total</span>
                  <span style={{ color: "var(--coral)" }}>R{Number(viewing.total).toFixed(2)}</span>
                </div>
              </div>
              {/* Payment info */}
              <div>
                <p className="text-xs font-bold mb-1" style={{ color: "var(--slate)" }}>Payment</p>
                <p className="text-sm" style={{ color: "var(--navy)" }}>
                  Status: <span className="font-bold capitalize">{viewing.payment_status}</span>
                  {viewing.payment_id && <span className="ml-2 text-xs" style={{ color: "var(--slate)" }}>ID: {viewing.payment_id}</span>}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
