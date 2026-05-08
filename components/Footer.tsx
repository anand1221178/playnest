import Link from "next/link";

const SHOP_LINKS = [
  { label: "All Toys", href: "/products" },
  { label: "Baby & Toddler", href: "/products?category=baby-toddler" },
  { label: "Arts & Crafts", href: "/products?category=arts-crafts" },
  { label: "Puzzles & Games", href: "/products?category=puzzles-games" },
];

const HELP_LINKS = [
  { label: "Returns & Refunds", href: "/returns" },
  { label: "Shipping Info", href: "/terms" },
  { label: "Contact Us", href: "mailto:hello@playnest.co.za" },
];

const COMPANY_LINKS = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms & Conditions", href: "/terms" },
  { label: "Return Policy", href: "/returns" },
];

const SOCIAL = [
  { label: "Facebook",  icon: "f" },
  { label: "Instagram", icon: "in" },
  { label: "TikTok",    icon: "tt" },
];

export default function Footer() {
  return (
    <footer style={{ backgroundColor: "var(--navy-dark)", color: "#9090AA" }}>
      <div className="max-w-[1280px] mx-auto px-5 md:px-10 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Col 1 — Brand */}
          <div className="flex flex-col gap-4">
            <div className="text-2xl font-black" style={{ fontFamily: "var(--font-fredoka)" }}>
              <span style={{ color: "var(--coral)" }}>Play</span>
              <span className="text-white">Nest</span>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: "#9090AA" }}>
              Where Wonder Lives — curating joy for little ones since 2025.
            </p>
            <div className="flex gap-3 mt-2">
              {SOCIAL.map(({ label, icon }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="w-9 h-9 rounded-full border flex items-center justify-center text-xs font-extrabold transition-colors hover:border-[var(--coral)] hover:text-[var(--coral)]"
                  style={{ borderColor: "#3A3A5A", color: "#9090AA" }}
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Col 2 — Shop */}
          <div className="flex flex-col gap-3">
            <h4 className="text-white font-extrabold text-sm mb-1">Shop</h4>
            {SHOP_LINKS.map(({ label, href }) => (
              <Link key={label} href={href} className="text-sm transition-colors hover:text-[var(--coral)]" style={{ color: "#9090AA" }}>
                {label}
              </Link>
            ))}
          </div>

          {/* Col 3 — Help */}
          <div className="flex flex-col gap-3">
            <h4 className="text-white font-extrabold text-sm mb-1">Help</h4>
            {HELP_LINKS.map(({ label, href }) => (
              <Link key={label} href={href} className="text-sm transition-colors hover:text-[var(--coral)]" style={{ color: "#9090AA" }}>
                {label}
              </Link>
            ))}
          </div>

          {/* Col 4 — Legal */}
          <div className="flex flex-col gap-3">
            <h4 className="text-white font-extrabold text-sm mb-1">Legal</h4>
            {COMPANY_LINKS.map(({ label, href }) => (
              <Link key={label} href={href} className="text-sm transition-colors hover:text-[var(--coral)]" style={{ color: "#9090AA" }}>
                {label}
              </Link>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs border-t"
          style={{ borderColor: "#2A2A4A" }}
        >
          <p style={{ color: "#9090AA" }}>© 2025 PlayNest. All rights reserved.</p>
          <div className="flex items-center gap-3">
            {["Visa", "Mastercard", "Instant EFT", "PayFast"].map((p) => (
              <span
                key={p}
                className="px-2 py-1 rounded text-xs font-bold border"
                style={{ borderColor: "#3A3A5A", color: "#9090AA" }}
              >
                {p}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
