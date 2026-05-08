import Navbar from "@/components/Navbar";
import AnnouncementBar from "@/components/AnnouncementBar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export default function ReturnsPage() {
  return (
    <main>
      <AnnouncementBar />
      <Navbar />
      <div className="max-w-[800px] mx-auto px-5 md:px-10 py-10">
        <div className="flex items-center gap-2 text-sm mb-8" style={{ color: "var(--slate)" }}>
          <Link href="/" className="hover:underline">Home</Link>
          <ChevronRight size={14} />
          <span style={{ color: "var(--navy)" }}>Return Policy</span>
        </div>

        <h1 className="mb-8" style={{ fontFamily: "var(--font-fredoka)", fontSize: "clamp(28px, 4vw, 44px)", color: "var(--navy)" }}>
          Return & Refund Policy
        </h1>

        <div className="prose-sm flex flex-col gap-6" style={{ color: "var(--slate)", lineHeight: 1.8 }}>
          <section>
            <h2 className="font-extrabold text-lg mb-2" style={{ color: "var(--navy)" }}>30-Day Returns</h2>
            <p>
              At PlayNest, we want you and your little ones to be 100% happy with every purchase. If for any reason you're not satisfied, you may return your item(s) within <strong style={{ color: "var(--navy)" }}>30 days</strong> of delivery for a full refund or exchange.
            </p>
          </section>

          <section>
            <h2 className="font-extrabold text-lg mb-2" style={{ color: "var(--navy)" }}>Conditions for Returns</h2>
            <ul className="list-disc pl-5 flex flex-col gap-2">
              <li>Items must be unused, in their original packaging, and in the same condition you received them.</li>
              <li>Items that have been opened, played with, or show signs of use cannot be returned unless they are defective.</li>
              <li>Proof of purchase (order confirmation email or order number) is required for all returns.</li>
              <li>Sale and clearance items are final sale and cannot be returned unless defective.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-extrabold text-lg mb-2" style={{ color: "var(--navy)" }}>Defective or Damaged Items</h2>
            <p>
              If you receive a defective or damaged item, please contact us within <strong style={{ color: "var(--navy)" }}>7 days</strong> of delivery. We will arrange a free return and send you a replacement or full refund. Please include photos of the damage when contacting us.
            </p>
          </section>

          <section>
            <h2 className="font-extrabold text-lg mb-2" style={{ color: "var(--navy)" }}>How to Return</h2>
            <ol className="list-decimal pl-5 flex flex-col gap-2">
              <li>Email us at <strong style={{ color: "var(--coral)" }}>hello@playnest.co.za</strong> with your order number and reason for return.</li>
              <li>We'll send you return instructions and a shipping label (if applicable).</li>
              <li>Pack the item(s) securely in the original packaging.</li>
              <li>Drop off the parcel at your nearest courier collection point.</li>
            </ol>
          </section>

          <section>
            <h2 className="font-extrabold text-lg mb-2" style={{ color: "var(--navy)" }}>Refund Processing</h2>
            <p>
              Once we receive and inspect your return, we'll notify you by email. Approved refunds are processed within <strong style={{ color: "var(--navy)" }}>5-7 business days</strong> and credited back to your original payment method. Please note that your bank may take an additional 3-5 business days to reflect the refund.
            </p>
          </section>

          <section>
            <h2 className="font-extrabold text-lg mb-2" style={{ color: "var(--navy)" }}>Exchanges</h2>
            <p>
              Want a different item instead? We're happy to exchange! Simply follow the return process above and let us know what you'd like instead. Exchanges are subject to stock availability.
            </p>
          </section>

          <section>
            <h2 className="font-extrabold text-lg mb-2" style={{ color: "var(--navy)" }}>Shipping Costs</h2>
            <p>
              Return shipping costs are the responsibility of the buyer unless the item is defective or we made an error with your order. We recommend using a tracked shipping service to ensure your return reaches us safely.
            </p>
          </section>

          <section>
            <h2 className="font-extrabold text-lg mb-2" style={{ color: "var(--navy)" }}>Contact Us</h2>
            <p>
              If you have any questions about our return policy, please email us at <strong style={{ color: "var(--coral)" }}>hello@playnest.co.za</strong>. We're here to help!
            </p>
          </section>
        </div>
      </div>
      <Footer />
    </main>
  );
}
