"use client";
import { useState, useEffect, useRef } from "react";
import { Search, Heart, ShoppingCart, Menu, X } from "lucide-react";
import { useCart } from "@/lib/cart";
import CartDrawer from "./CartDrawer";

const NAV_LINKS = [
  { label: "Shop",           href: "/products" },
  { label: "Baby & Toddler", href: "/products?category=baby-toddler" },
  { label: "Arts & Crafts",  href: "/products?category=arts-crafts" },
  { label: "Games",          href: "/products?category=puzzles-games" },
  { label: "Gift Ideas",     href: "/products" },
];

export default function Navbar() {
  const { count, openDrawer } = useCart();
  const [scrolled, setScrolled]     = useState(false);
  const [menuOpen, setMenuOpen]     = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (searchOpen) searchRef.current?.focus();
  }, [searchOpen]);

  return (
    <>
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? "shadow-md" : ""}`}
        style={{ background: "rgba(255,255,255,0.92)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)" }}
      >
        <div className="max-w-[1280px] mx-auto px-5 md:px-10 flex items-center gap-6 h-[68px]">
          {/* Logo */}
          <a href="/" className="flex-shrink-0 text-2xl font-black tracking-tight select-none" style={{ fontFamily: "var(--font-fredoka)" }}>
            <span style={{ color: "var(--coral)" }}>Play</span>
            <span style={{ color: "var(--navy)" }}>Nest</span>
          </a>

          {/* Nav links — desktop */}
          <nav className="hidden md:flex items-center gap-6 flex-1 justify-center">
            {NAV_LINKS.map((link) => (
              <a key={link.label} href={link.href} className="text-sm font-bold transition-colors hover:text-[var(--coral)]" style={{ color: "var(--navy)" }}>
                {link.label}
              </a>
            ))}
          </nav>

          {/* Right icons */}
          <div className="flex items-center gap-2 ml-auto">
            {/* Search */}
            <div className="flex items-center">
              {searchOpen && (
                <input
                  ref={searchRef}
                  type="text"
                  placeholder="Search toys..."
                  onBlur={() => setSearchOpen(false)}
                  className="border rounded-full px-3 py-1 text-sm outline-none mr-2 w-40"
                  style={{ borderColor: "var(--coral)" }}
                />
              )}
              <button onClick={() => setSearchOpen(!searchOpen)} aria-label="Search" className="p-2 rounded-full hover:bg-gray-100 transition-colors" style={{ color: "var(--navy)" }}>
                <Search size={20} />
              </button>
            </div>

            <button aria-label="Wishlist" className="p-2 rounded-full hover:bg-gray-100 transition-colors hidden sm:block" style={{ color: "var(--navy)" }}>
              <Heart size={20} />
            </button>

            {/* Cart */}
            <button
              onClick={openDrawer}
              aria-label="Open cart"
              className="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
              style={{ color: "var(--navy)" }}
            >
              <ShoppingCart size={20} />
              {count > 0 && (
                <span className="absolute -top-0.5 -right-0.5 text-white text-[10px] font-black w-4 h-4 flex items-center justify-center rounded-full" style={{ backgroundColor: "var(--coral)" }}>
                  {count}
                </span>
              )}
            </button>

            {/* Hamburger */}
            <button className="md:hidden p-2 rounded-full hover:bg-gray-100 transition-colors" style={{ color: "var(--navy)" }} onClick={() => setMenuOpen(true)} aria-label="Open menu">
              <Menu size={22} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      {menuOpen && (
        <div className="fixed inset-0 z-[100] flex md:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMenuOpen(false)} />
          <div className="relative ml-auto h-full w-4/5 max-w-xs flex flex-col p-6 gap-6" style={{ background: "var(--cream)" }}>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-black" style={{ fontFamily: "var(--font-fredoka)", color: "var(--navy)" }}>
                <span style={{ color: "var(--coral)" }}>Play</span>Nest
              </span>
              <button onClick={() => setMenuOpen(false)} aria-label="Close menu"><X size={24} style={{ color: "var(--navy)" }} /></button>
            </div>
            <nav className="flex flex-col gap-4 mt-4">
              {NAV_LINKS.map((link) => (
                <a key={link.label} href={link.href} className="text-lg font-bold py-2 border-b" style={{ color: "var(--navy)", borderColor: "rgba(26,26,46,0.08)" }} onClick={() => setMenuOpen(false)}>
                  {link.label}
                </a>
              ))}
            </nav>
          </div>
        </div>
      )}

      <CartDrawer />
    </>
  );
}
