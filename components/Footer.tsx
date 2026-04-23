const SHOP_LINKS   = ["All Toys", "Best Sellers", "New Arrivals", "Sale", "Gift Ideas"];
const HELP_LINKS   = ["FAQ", "Shipping Info", "Returns", "Track My Order", "Contact Us"];
const COMPANY_LINKS = ["About PlayNest", "Our Blog", "Careers", "Privacy Policy", "Terms of Service"];

const SOCIAL = [
  { label: "Facebook",  icon: "f" },
  { label: "Instagram", icon: "in" },
  { label: "TikTok",    icon: "tt" },
  { label: "Pinterest", icon: "p" },
];

function FooterLink({ href = "#", children }: { href?: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      className="text-sm transition-colors hover:text-[var(--coral)]"
      style={{ color: "#9090AA" }}
    >
      {children}
    </a>
  );
}

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
              Where Wonder Lives — curating joy for little ones since 2022.
            </p>
            {/* Social */}
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
            {SHOP_LINKS.map((l) => <FooterLink key={l}>{l}</FooterLink>)}
          </div>

          {/* Col 3 — Help */}
          <div className="flex flex-col gap-3">
            <h4 className="text-white font-extrabold text-sm mb-1">Help</h4>
            {HELP_LINKS.map((l) => <FooterLink key={l}>{l}</FooterLink>)}
          </div>

          {/* Col 4 — Company */}
          <div className="flex flex-col gap-3">
            <h4 className="text-white font-extrabold text-sm mb-1">Company</h4>
            {COMPANY_LINKS.map((l) => <FooterLink key={l}>{l}</FooterLink>)}
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs border-t"
          style={{ borderColor: "#2A2A4A" }}
        >
          <p style={{ color: "#9090AA" }}>© 2026 PlayNest. All rights reserved. Made with 💛 for little ones.</p>
          <div className="flex items-center gap-3">
            {["Visa", "Mastercard", "PayFast", "Yoco"].map((p) => (
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
