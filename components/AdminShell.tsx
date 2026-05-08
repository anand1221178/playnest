"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Package, ShoppingCart, BarChart3, LogOut, Home } from "lucide-react";

const NAV = [
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { href: "/admin/stock", label: "Stock", icon: BarChart3 },
];

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const logout = () => {
    document.cookie = "playnest_admin=; max-age=0; path=/";
    router.push("/admin");
  };

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: "#F8F7FA" }}>
      {/* Sidebar */}
      <aside className="w-56 flex-shrink-0 bg-white border-r flex flex-col" style={{ borderColor: "rgba(26,26,46,0.08)" }}>
        <div className="p-5 border-b" style={{ borderColor: "rgba(26,26,46,0.08)" }}>
          <h1 className="font-extrabold text-lg" style={{ fontFamily: "var(--font-fredoka)", color: "var(--navy)" }}>
            PlayNest
          </h1>
          <p className="text-xs font-semibold" style={{ color: "var(--slate)" }}>Admin Panel</p>
        </div>

        <nav className="flex-1 p-3 flex flex-col gap-1">
          {NAV.map(({ href, label, icon: Icon }) => {
            const active = pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors"
                style={active
                  ? { backgroundColor: "var(--coral)", color: "white" }
                  : { color: "var(--slate)" }
                }
              >
                <Icon size={18} />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t flex flex-col gap-1" style={{ borderColor: "rgba(26,26,46,0.08)" }}>
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors"
            style={{ color: "var(--slate)" }}
          >
            <Home size={18} /> View Store
          </Link>
          <button
            onClick={logout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors text-left w-full"
            style={{ color: "var(--coral)" }}
          >
            <LogOut size={18} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto p-6 md:p-8">
        {children}
      </main>
    </div>
  );
}
