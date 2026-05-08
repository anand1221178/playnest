"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock } from "lucide-react";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      router.push("/admin/products");
    } else {
      setError("Incorrect password");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-5" style={{ backgroundColor: "var(--cream)" }}>
      <form onSubmit={handleLogin} className="bg-white rounded-2xl p-8 w-full max-w-sm border" style={{ borderColor: "rgba(26,26,46,0.08)" }}>
        <div className="flex items-center justify-center w-14 h-14 rounded-full mx-auto mb-6" style={{ backgroundColor: "#EDE9FF" }}>
          <Lock size={24} style={{ color: "var(--lavender)" }} />
        </div>

        <h1 className="text-center mb-1" style={{ fontFamily: "var(--font-fredoka)", fontSize: "28px", color: "var(--navy)" }}>
          PlayNest Admin
        </h1>
        <p className="text-center text-sm mb-6" style={{ color: "var(--slate)" }}>
          Enter your admin password to continue
        </p>

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full px-4 py-3 rounded-xl border text-sm outline-none mb-4 focus:border-[var(--coral)]"
          style={{ borderColor: "rgba(26,26,46,0.15)", color: "var(--navy)" }}
          autoFocus
        />

        {error && <p className="text-red-500 text-sm mb-3 text-center">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-full text-white font-extrabold transition-transform hover:scale-[1.02] disabled:opacity-60"
          style={{ backgroundColor: "var(--coral)" }}
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>
    </div>
  );
}
