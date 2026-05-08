import Navbar from "@/components/Navbar";
import AnnouncementBar from "@/components/AnnouncementBar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export default function PrivacyPage() {
  return (
    <main>
      <AnnouncementBar />
      <Navbar />
      <div className="max-w-[800px] mx-auto px-5 md:px-10 py-10">
        <div className="flex items-center gap-2 text-sm mb-8" style={{ color: "var(--slate)" }}>
          <Link href="/" className="hover:underline">Home</Link>
          <ChevronRight size={14} />
          <span style={{ color: "var(--navy)" }}>Privacy Policy</span>
        </div>

        <h1 className="mb-8" style={{ fontFamily: "var(--font-fredoka)", fontSize: "clamp(28px, 4vw, 44px)", color: "var(--navy)" }}>
          Privacy Policy
        </h1>

        <div className="prose-sm flex flex-col gap-6" style={{ color: "var(--slate)", lineHeight: 1.8 }}>
          <section>
            <h2 className="font-extrabold text-lg mb-2" style={{ color: "var(--navy)" }}>Introduction</h2>
            <p>
              PlayNest is committed to protecting your privacy in accordance with the Protection of Personal Information Act (POPIA) of South Africa. This policy explains how we collect, use, and protect your personal information.
            </p>
          </section>

          <section>
            <h2 className="font-extrabold text-lg mb-2" style={{ color: "var(--navy)" }}>Information We Collect</h2>
            <ul className="list-disc pl-5 flex flex-col gap-2">
              <li><strong style={{ color: "var(--navy)" }}>Contact information:</strong> name, email address when you place an order.</li>
              <li><strong style={{ color: "var(--navy)" }}>Delivery information:</strong> street address, city, province, and postal code.</li>
              <li><strong style={{ color: "var(--navy)" }}>Payment information:</strong> processed securely through PayFast — we never store your card details.</li>
              <li><strong style={{ color: "var(--navy)" }}>Order history:</strong> items purchased, order values, and dates.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-extrabold text-lg mb-2" style={{ color: "var(--navy)" }}>How We Use Your Information</h2>
            <ul className="list-disc pl-5 flex flex-col gap-2">
              <li>To process and fulfil your orders.</li>
              <li>To send order confirmations, shipping updates, and delivery notifications.</li>
              <li>To communicate with you about your order if needed.</li>
              <li>To improve our website and product offerings.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-extrabold text-lg mb-2" style={{ color: "var(--navy)" }}>Information Sharing</h2>
            <p>
              We do not sell, trade, or rent your personal information. We only share your information with:
            </p>
            <ul className="list-disc pl-5 flex flex-col gap-2 mt-2">
              <li><strong style={{ color: "var(--navy)" }}>Courier partners:</strong> your name, address, and phone number for delivery purposes.</li>
              <li><strong style={{ color: "var(--navy)" }}>PayFast:</strong> payment processing (they have their own privacy policy).</li>
            </ul>
          </section>

          <section>
            <h2 className="font-extrabold text-lg mb-2" style={{ color: "var(--navy)" }}>Data Security</h2>
            <p>
              We implement appropriate technical and organisational measures to protect your personal information. All payment transactions are encrypted and processed through PayFast's secure payment gateway. We do not store any credit card or banking details on our servers.
            </p>
          </section>

          <section>
            <h2 className="font-extrabold text-lg mb-2" style={{ color: "var(--navy)" }}>Your Rights (POPIA)</h2>
            <p>Under POPIA, you have the right to:</p>
            <ul className="list-disc pl-5 flex flex-col gap-2 mt-2">
              <li>Access the personal information we hold about you.</li>
              <li>Request correction of inaccurate information.</li>
              <li>Request deletion of your personal information.</li>
              <li>Object to the processing of your personal information.</li>
              <li>Lodge a complaint with the Information Regulator.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-extrabold text-lg mb-2" style={{ color: "var(--navy)" }}>Cookies</h2>
            <p>
              Our website uses essential cookies for cart functionality and admin authentication. We do not use tracking cookies or share data with advertising networks.
            </p>
          </section>

          <section>
            <h2 className="font-extrabold text-lg mb-2" style={{ color: "var(--navy)" }}>Contact</h2>
            <p>
              For any privacy-related queries or to exercise your rights, please contact us at <strong style={{ color: "var(--coral)" }}>hello@playnest.co.za</strong>.
            </p>
          </section>
        </div>
      </div>
      <Footer />
    </main>
  );
}
