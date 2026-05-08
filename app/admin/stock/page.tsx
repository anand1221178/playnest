"use client";
import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import AdminShell from "@/components/AdminShell";
import { AlertTriangle, Check, Minus, Plus } from "lucide-react";

type Product = {
  id: string;
  name: string;
  brand: string;
  category: string;
  images: string[];
  stock: number;
  price: number;
  active: boolean;
};

export default function AdminStock() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "low" | "out">("all");

  const fetchProducts = useCallback(async () => {
    const res = await fetch("/api/admin/products");
    if (res.ok) setProducts(await res.json());
    setLoading(false);
  }, []);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const updateStock = async (id: string, stock: number) => {
    if (stock < 0) return;
    setSaving(id);
    await fetch("/api/admin/products", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, stock }),
    });
    setProducts((prev) => prev.map((p) => p.id === id ? { ...p, stock } : p));
    setSaving(null);
  };

  const filtered = products.filter((p) => {
    if (filter === "low") return p.stock > 0 && p.stock <= 5;
    if (filter === "out") return p.stock === 0;
    return true;
  });

  const outOfStock = products.filter((p) => p.stock === 0).length;
  const lowStock = products.filter((p) => p.stock > 0 && p.stock <= 5).length;
  const totalValue = products.reduce((s, p) => s + p.price * p.stock, 0);

  return (
    <AdminShell>
      <h1 className="font-extrabold text-2xl mb-6" style={{ color: "var(--navy)" }}>Stock Management</h1>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 border" style={{ borderColor: "rgba(26,26,46,0.08)" }}>
          <p className="text-xs font-semibold mb-1" style={{ color: "var(--slate)" }}>Total Products</p>
          <p className="text-xl font-extrabold" style={{ color: "var(--navy)" }}>{products.length}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border" style={{ borderColor: "rgba(26,26,46,0.08)" }}>
          <p className="text-xs font-semibold mb-1" style={{ color: "var(--slate)" }}>Out of Stock</p>
          <p className="text-xl font-extrabold" style={{ color: outOfStock > 0 ? "#E04B3B" : "var(--mint)" }}>{outOfStock}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border" style={{ borderColor: "rgba(26,26,46,0.08)" }}>
          <p className="text-xs font-semibold mb-1" style={{ color: "var(--slate)" }}>Low Stock</p>
          <p className="text-xl font-extrabold" style={{ color: lowStock > 0 ? "#B8860B" : "var(--mint)" }}>{lowStock}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border" style={{ borderColor: "rgba(26,26,46,0.08)" }}>
          <p className="text-xs font-semibold mb-1" style={{ color: "var(--slate)" }}>Inventory Value</p>
          <p className="text-xl font-extrabold" style={{ color: "var(--navy)" }}>R{totalValue.toFixed(2)}</p>
        </div>
      </div>

      {/* Filter */}
      <div className="flex gap-2 mb-4">
        {[
          { key: "all" as const, label: "All" },
          { key: "low" as const, label: `Low Stock (${lowStock})` },
          { key: "out" as const, label: `Out of Stock (${outOfStock})` },
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className="px-3 py-1.5 rounded-full text-xs font-bold border transition-colors"
            style={filter === key
              ? { backgroundColor: "var(--navy)", color: "white", borderColor: "var(--navy)" }
              : { borderColor: "rgba(26,26,46,0.15)", color: "var(--slate)" }
            }
          >
            {label}
          </button>
        ))}
      </div>

      {/* Stock table */}
      {loading ? (
        <div className="text-center py-20" style={{ color: "var(--slate)" }}>Loading...</div>
      ) : (
        <div className="bg-white rounded-2xl border overflow-hidden" style={{ borderColor: "rgba(26,26,46,0.08)" }}>
          <table className="w-full">
            <thead>
              <tr className="border-b text-left text-xs font-bold" style={{ borderColor: "rgba(26,26,46,0.08)", color: "var(--slate)" }}>
                <th className="px-4 py-3">Product</th>
                <th className="px-4 py-3 hidden md:table-cell">Category</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Stock</th>
                <th className="px-4 py-3 w-40">Adjust</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id} className="border-b last:border-0 hover:bg-gray-50" style={{ borderColor: "rgba(26,26,46,0.05)" }}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0 relative">
                        {p.images[0] && <Image src={p.images[0]} alt="" fill className="object-contain p-1" sizes="40px" />}
                      </div>
                      <div>
                        <p className="font-bold text-sm" style={{ color: "var(--navy)" }}>{p.name}</p>
                        <p className="text-xs" style={{ color: "var(--slate)" }}>{p.brand}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm hidden md:table-cell" style={{ color: "var(--slate)" }}>{p.category}</td>
                  <td className="px-4 py-3">
                    {p.stock === 0 ? (
                      <span className="flex items-center gap-1 text-xs font-bold" style={{ color: "#E04B3B" }}>
                        <AlertTriangle size={12} /> Out of stock
                      </span>
                    ) : p.stock <= 5 ? (
                      <span className="flex items-center gap-1 text-xs font-bold" style={{ color: "#B8860B" }}>
                        <AlertTriangle size={12} /> Low stock
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-xs font-bold" style={{ color: "#2AB89A" }}>
                        <Check size={12} /> In stock
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-lg font-extrabold" style={{ color: "var(--navy)" }}>{p.stock}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateStock(p.id, p.stock - 1)}
                        disabled={saving === p.id || p.stock === 0}
                        className="w-8 h-8 rounded-lg border flex items-center justify-center hover:bg-gray-50 disabled:opacity-30"
                        style={{ borderColor: "rgba(26,26,46,0.15)" }}
                      >
                        <Minus size={14} />
                      </button>
                      <input
                        type="number"
                        min={0}
                        value={p.stock}
                        onChange={(e) => {
                          const val = parseInt(e.target.value);
                          if (!isNaN(val)) updateStock(p.id, val);
                        }}
                        className="w-16 text-center px-2 py-1.5 rounded-lg border text-sm font-bold"
                        style={{ borderColor: "rgba(26,26,46,0.15)", color: "var(--navy)" }}
                      />
                      <button
                        onClick={() => updateStock(p.id, p.stock + 1)}
                        disabled={saving === p.id}
                        className="w-8 h-8 rounded-lg border flex items-center justify-center hover:bg-gray-50 disabled:opacity-30"
                        style={{ borderColor: "rgba(26,26,46,0.15)" }}
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminShell>
  );
}
