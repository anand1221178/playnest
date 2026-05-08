"use client";
import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import AdminShell from "@/components/AdminShell";
import { Plus, Pencil, Trash2, X, GripVertical, Upload, ChevronUp, ChevronDown } from "lucide-react";

type Product = {
  id: string;
  slug: string;
  name: string;
  brand: string;
  category: string;
  category_slug: string;
  age_range: string;
  price: number;
  sale_price: number | null;
  badge: string | null;
  rating: number;
  reviews: number;
  description: string;
  features: string[];
  images: string[];
  stock: number;
  active: boolean;
};

const CATEGORIES = [
  { slug: "baby-toddler", label: "Baby & Toddler" },
  { slug: "arts-crafts", label: "Arts & Crafts" },
  { slug: "puzzles-games", label: "Puzzles & Games" },
];

const EMPTY_PRODUCT: Omit<Product, "id"> = {
  slug: "",
  name: "",
  brand: "",
  category: "",
  category_slug: "",
  age_range: "",
  price: 0,
  sale_price: null,
  badge: null,
  rating: 0,
  reviews: 0,
  description: "",
  features: [],
  images: [],
  stock: 0,
  active: true,
};

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Product | null>(null);
  const [creating, setCreating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [featureInput, setFeatureInput] = useState("");

  const fetchProducts = useCallback(async () => {
    const res = await fetch("/api/admin/products");
    if (res.ok) {
      setProducts(await res.json());
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const openCreate = () => {
    setEditing({ id: "", ...EMPTY_PRODUCT } as Product);
    setCreating(true);
  };

  const openEdit = (p: Product) => {
    setEditing({ ...p });
    setCreating(false);
  };

  const closeEditor = () => {
    setEditing(null);
    setCreating(false);
    setFeatureInput("");
  };

  const updateField = (field: keyof Product, value: unknown) => {
    setEditing((prev) => prev ? { ...prev, [field]: value } : prev);
  };

  const selectCategory = (slug: string) => {
    const cat = CATEGORIES.find((c) => c.slug === slug);
    if (cat && editing) {
      setEditing({ ...editing, category_slug: slug, category: cat.label });
    }
  };

  const addFeature = () => {
    if (featureInput.trim() && editing) {
      updateField("features", [...editing.features, featureInput.trim()]);
      setFeatureInput("");
    }
  };

  const removeFeature = (idx: number) => {
    if (editing) updateField("features", editing.features.filter((_, i) => i !== idx));
  };

  // Image reorder
  const moveImage = (idx: number, dir: -1 | 1) => {
    if (!editing) return;
    const imgs = [...editing.images];
    const newIdx = idx + dir;
    if (newIdx < 0 || newIdx >= imgs.length) return;
    [imgs[idx], imgs[newIdx]] = [imgs[newIdx], imgs[idx]];
    updateField("images", imgs);
  };

  const removeImage = (idx: number) => {
    if (editing) updateField("images", editing.images.filter((_, i) => i !== idx));
  };

  const uploadImage = async (file: File) => {
    if (!editing) return;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", editing.slug || "new-product");
    const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
    if (res.ok) {
      const { url } = await res.json();
      updateField("images", [...editing.images, url]);
    }
  };

  const handleSave = async () => {
    if (!editing) return;
    setSaving(true);

    // Auto-generate slug if empty
    if (!editing.slug) {
      editing.slug = editing.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
    }
    if (!editing.id) editing.id = editing.slug;

    const method = creating ? "POST" : "PUT";
    const res = await fetch("/api/admin/products", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editing),
    });

    if (res.ok) {
      await fetchProducts();
      closeEditor();
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to remove this product?")) return;
    await fetch("/api/admin/products", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    await fetchProducts();
  };

  return (
    <AdminShell>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-extrabold text-2xl" style={{ color: "var(--navy)" }}>Products</h1>
          <p className="text-sm" style={{ color: "var(--slate)" }}>{products.length} products</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full text-white font-bold text-sm transition-transform hover:scale-105"
          style={{ backgroundColor: "var(--coral)" }}
        >
          <Plus size={16} /> Add Product
        </button>
      </div>

      {/* Product list */}
      {loading ? (
        <div className="text-center py-20" style={{ color: "var(--slate)" }}>Loading...</div>
      ) : (
        <div className="bg-white rounded-2xl border overflow-hidden" style={{ borderColor: "rgba(26,26,46,0.08)" }}>
          <table className="w-full">
            <thead>
              <tr className="border-b text-left text-xs font-bold" style={{ borderColor: "rgba(26,26,46,0.08)", color: "var(--slate)" }}>
                <th className="px-4 py-3">Product</th>
                <th className="px-4 py-3 hidden md:table-cell">Category</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Stock</th>
                <th className="px-4 py-3 hidden md:table-cell">Status</th>
                <th className="px-4 py-3 w-20">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-b last:border-0 hover:bg-gray-50 transition-colors" style={{ borderColor: "rgba(26,26,46,0.05)" }}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0 relative">
                        {p.images[0] && <Image src={p.images[0]} alt="" fill className="object-contain p-1" sizes="40px" />}
                      </div>
                      <div>
                        <p className="font-bold text-sm leading-tight" style={{ color: "var(--navy)" }}>{p.name}</p>
                        <p className="text-xs" style={{ color: "var(--slate)" }}>{p.brand}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm hidden md:table-cell" style={{ color: "var(--slate)" }}>{p.category}</td>
                  <td className="px-4 py-3 text-sm font-bold" style={{ color: "var(--navy)" }}>R{p.price.toFixed(2)}</td>
                  <td className="px-4 py-3">
                    <span
                      className="text-xs font-bold px-2 py-1 rounded-full"
                      style={p.stock > 5
                        ? { backgroundColor: "#E8FFF5", color: "#2AB89A" }
                        : p.stock > 0
                        ? { backgroundColor: "#FFF5CC", color: "#B8860B" }
                        : { backgroundColor: "#FFE5E5", color: "#E04B3B" }
                      }
                    >
                      {p.stock}
                    </span>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span
                      className="text-xs font-bold px-2 py-1 rounded-full"
                      style={p.active
                        ? { backgroundColor: "#E8FFF5", color: "#2AB89A" }
                        : { backgroundColor: "#FFE5E5", color: "#E04B3B" }
                      }
                    >
                      {p.active ? "Active" : "Hidden"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button onClick={() => openEdit(p)} className="p-1.5 rounded-lg hover:bg-gray-100" title="Edit">
                        <Pencil size={15} style={{ color: "var(--slate)" }} />
                      </button>
                      <button onClick={() => handleDelete(p.id)} className="p-1.5 rounded-lg hover:bg-red-50" title="Delete">
                        <Trash2 size={15} style={{ color: "#E04B3B" }} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ─── Editor Modal ─── */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto p-4 md:p-8">
          <div className="absolute inset-0 bg-black/40" onClick={closeEditor} />
          <div className="relative bg-white rounded-2xl w-full max-w-2xl my-8 border" style={{ borderColor: "rgba(26,26,46,0.08)" }}>
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b" style={{ borderColor: "rgba(26,26,46,0.08)" }}>
              <h2 className="font-extrabold text-lg" style={{ color: "var(--navy)" }}>
                {creating ? "New Product" : "Edit Product"}
              </h2>
              <button onClick={closeEditor}><X size={20} /></button>
            </div>

            <div className="p-5 flex flex-col gap-5 max-h-[70vh] overflow-y-auto">
              {/* Name & Brand */}
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-xs font-bold mb-1" style={{ color: "var(--navy)" }}>Name</label>
                  <input value={editing.name} onChange={(e) => updateField("name", e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border text-sm" style={{ borderColor: "rgba(26,26,46,0.15)" }} />
                </div>
                <div className="w-40">
                  <label className="block text-xs font-bold mb-1" style={{ color: "var(--navy)" }}>Brand</label>
                  <input value={editing.brand} onChange={(e) => updateField("brand", e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border text-sm" style={{ borderColor: "rgba(26,26,46,0.15)" }} />
                </div>
              </div>

              {/* Category & Age */}
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-xs font-bold mb-1" style={{ color: "var(--navy)" }}>Category</label>
                  <select value={editing.category_slug} onChange={(e) => selectCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border text-sm" style={{ borderColor: "rgba(26,26,46,0.15)" }}>
                    <option value="">Select...</option>
                    {CATEGORIES.map((c) => <option key={c.slug} value={c.slug}>{c.label}</option>)}
                  </select>
                </div>
                <div className="w-32">
                  <label className="block text-xs font-bold mb-1" style={{ color: "var(--navy)" }}>Age Range</label>
                  <input value={editing.age_range} onChange={(e) => updateField("age_range", e.target.value)}
                    placeholder="3+ years" className="w-full px-3 py-2 rounded-lg border text-sm" style={{ borderColor: "rgba(26,26,46,0.15)" }} />
                </div>
              </div>

              {/* Price, Sale, Badge, Stock */}
              <div className="flex gap-4 flex-wrap">
                <div className="w-28">
                  <label className="block text-xs font-bold mb-1" style={{ color: "var(--navy)" }}>Price (R)</label>
                  <input type="number" step="0.01" value={editing.price}
                    onChange={(e) => updateField("price", parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-lg border text-sm" style={{ borderColor: "rgba(26,26,46,0.15)" }} />
                </div>
                <div className="w-28">
                  <label className="block text-xs font-bold mb-1" style={{ color: "var(--navy)" }}>Sale Price</label>
                  <input type="number" step="0.01" value={editing.sale_price ?? ""}
                    onChange={(e) => updateField("sale_price", e.target.value ? parseFloat(e.target.value) : null)}
                    placeholder="Optional" className="w-full px-3 py-2 rounded-lg border text-sm" style={{ borderColor: "rgba(26,26,46,0.15)" }} />
                </div>
                <div className="w-28">
                  <label className="block text-xs font-bold mb-1" style={{ color: "var(--navy)" }}>Badge</label>
                  <select value={editing.badge ?? ""} onChange={(e) => updateField("badge", e.target.value || null)}
                    className="w-full px-3 py-2 rounded-lg border text-sm" style={{ borderColor: "rgba(26,26,46,0.15)" }}>
                    <option value="">None</option>
                    <option value="NEW">NEW</option>
                    <option value="SALE">SALE</option>
                  </select>
                </div>
                <div className="w-24">
                  <label className="block text-xs font-bold mb-1" style={{ color: "var(--navy)" }}>Stock</label>
                  <input type="number" value={editing.stock}
                    onChange={(e) => updateField("stock", parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-lg border text-sm" style={{ borderColor: "rgba(26,26,46,0.15)" }} />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold mb-1" style={{ color: "var(--navy)" }}>Description</label>
                <textarea value={editing.description} onChange={(e) => updateField("description", e.target.value)}
                  rows={3} className="w-full px-3 py-2 rounded-lg border text-sm resize-none" style={{ borderColor: "rgba(26,26,46,0.15)" }} />
              </div>

              {/* Features */}
              <div>
                <label className="block text-xs font-bold mb-1" style={{ color: "var(--navy)" }}>Features</label>
                <div className="flex flex-col gap-1.5 mb-2">
                  {editing.features.map((f, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm">
                      <span className="flex-1 px-3 py-1.5 rounded-lg bg-gray-50">{f}</span>
                      <button onClick={() => removeFeature(i)} className="text-red-400 hover:text-red-600"><X size={14} /></button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input value={featureInput} onChange={(e) => setFeatureInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addFeature())}
                    placeholder="Add a feature..." className="flex-1 px-3 py-2 rounded-lg border text-sm" style={{ borderColor: "rgba(26,26,46,0.15)" }} />
                  <button onClick={addFeature} className="px-3 py-2 rounded-lg text-sm font-bold text-white" style={{ backgroundColor: "var(--navy)" }}>Add</button>
                </div>
              </div>

              {/* Images — reorderable */}
              <div>
                <label className="block text-xs font-bold mb-2" style={{ color: "var(--navy)" }}>
                  Images <span className="font-normal" style={{ color: "var(--slate)" }}>(first image = main photo, drag to reorder)</span>
                </label>
                <div className="flex flex-wrap gap-3 mb-3">
                  {editing.images.map((img, i) => (
                    <div key={img + i} className="relative group">
                      <div className="w-20 h-20 rounded-lg border overflow-hidden bg-gray-50 relative" style={{ borderColor: i === 0 ? "var(--coral)" : "rgba(26,26,46,0.1)" }}>
                        <Image src={img} alt="" fill className="object-contain p-1" sizes="80px" />
                        {i === 0 && (
                          <span className="absolute top-0.5 left-0.5 text-[9px] font-bold px-1 rounded text-white" style={{ backgroundColor: "var(--coral)" }}>MAIN</span>
                        )}
                      </div>
                      <div className="absolute -top-1 -right-1 flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => removeImage(i)} className="w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center">
                          <X size={10} />
                        </button>
                      </div>
                      <div className="flex justify-center gap-0.5 mt-1">
                        <button onClick={() => moveImage(i, -1)} disabled={i === 0} className="p-0.5 rounded hover:bg-gray-100 disabled:opacity-30">
                          <ChevronUp size={12} />
                        </button>
                        <GripVertical size={12} className="opacity-30" />
                        <button onClick={() => moveImage(i, 1)} disabled={i === editing.images.length - 1} className="p-0.5 rounded hover:bg-gray-100 disabled:opacity-30">
                          <ChevronDown size={12} />
                        </button>
                      </div>
                    </div>
                  ))}

                  {/* Upload button */}
                  <label className="w-20 h-20 rounded-lg border-2 border-dashed flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors" style={{ borderColor: "rgba(26,26,46,0.15)" }}>
                    <Upload size={16} style={{ color: "var(--slate)" }} />
                    <span className="text-[10px] mt-1" style={{ color: "var(--slate)" }}>Upload</span>
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                      if (e.target.files?.[0]) uploadImage(e.target.files[0]);
                      e.target.value = "";
                    }} />
                  </label>
                </div>
                {/* Manual URL add */}
                <div className="flex gap-2">
                  <input
                    placeholder="Or paste image URL..."
                    className="flex-1 px-3 py-2 rounded-lg border text-sm"
                    style={{ borderColor: "rgba(26,26,46,0.15)" }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        const url = (e.target as HTMLInputElement).value.trim();
                        if (url) {
                          updateField("images", [...editing.images, url]);
                          (e.target as HTMLInputElement).value = "";
                        }
                      }
                    }}
                  />
                </div>
              </div>

              {/* Active toggle */}
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={editing.active} onChange={(e) => updateField("active", e.target.checked)}
                  className="w-4 h-4 rounded" />
                <span className="text-sm font-semibold" style={{ color: "var(--navy)" }}>Active (visible in store)</span>
              </label>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 p-5 border-t" style={{ borderColor: "rgba(26,26,46,0.08)" }}>
              <button onClick={closeEditor} className="px-5 py-2 rounded-full text-sm font-bold border" style={{ borderColor: "rgba(26,26,46,0.15)", color: "var(--slate)" }}>
                Cancel
              </button>
              <button onClick={handleSave} disabled={saving}
                className="px-5 py-2 rounded-full text-sm font-bold text-white disabled:opacity-60"
                style={{ backgroundColor: "var(--coral)" }}>
                {saving ? "Saving..." : creating ? "Create Product" : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
