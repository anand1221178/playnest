import Navbar from "@/components/Navbar";
import AnnouncementBar from "@/components/AnnouncementBar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export default function TermsPage() {
  return (
    <main>
      <AnnouncementBar />
      <Navbar />
      <div className="max-w-[800px] mx-auto px-5 md:px-10 py-10">
        <div className="flex items-center gap-2 text-sm mb-8" style={{ color: "var(--slate)" }}>
          <Link href="/" className="hover:underline">Home</Link>
          <ChevronRight size={14} />
          <span style={{ color: "var(--navy)" }}>Terms & Conditions</span>
        </div>

        <h1 className="mb-8" style={{ fontFamily: "var(--font-fredoka)", fontSize: "clamp(28px, 4vw, 44px)", color: "var(--navy)" }}>
          Terms & Conditions
        </h1>

        <div className="prose-sm flex flex-col gap-6" style={{ color: "var(--slate)", lineHeight: 1.8 }}>
          <section>
            <h2 className="font-extrabold text-lg mb-2" style={{ color: "var(--navy)" }}>1. Introduction</h2>
            <p>
              Welcome to PlayNest. These terms and conditions govern your use of our website and the purchase of products from our online store. By placing an order, you agree to be bound by these terms.
            </p>
          </section>

          <section>
            <h2 className="font-extrabold text-lg mb-2" style={{ color: "var(--navy)" }}>2. Products & Pricing</h2>
            <p>
              All prices are displayed in South African Rand (ZAR) and include VAT where applicable. We reserve the right to change prices at any time without prior notice. Prices at the time of order placement will be honoured.
            </p>
          </section>

          <section>
            <h2 className="font-extrabold text-lg mb-2" style={{ color: "var(--navy)" }}>3. Orders & Payment</h2>
            <ul className="list-disc pl-5 flex flex-col gap-2">
              <li>All orders are subject to product availability.</li>
              <li>Payments are processed securely through PayFast. We accept Visa, Mastercard, and instant EFT.</li>
              <li>An order confirmation email will be sent once payment is received.</li>
              <li>We reserve the right to cancel any order due to stock issues, pricing errors, or suspected fraud.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-extrabold text-lg mb-2" style={{ color: "var(--navy)" }}>4. Delivery</h2>
            <ul className="list-disc pl-5 flex flex-col gap-2">
              <li>We deliver throughout South Africa.</li>
              <li>Orders are dispatched within 1-2 business days.</li>
              <li>Standard delivery takes 3-5 business days (major cities) and 5-7 business days (other areas).</li>
              <li>Free delivery on orders over R500. Standard shipping is R75 for orders under R500.</li>
              <li>A tracking number will be emailed once your order ships.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-extrabold text-lg mb-2" style={{ color: "var(--navy)" }}>5. Returns & Refunds</h2>
            <p>
              Please refer to our <Link href="/returns" className="font-bold underline" style={{ color: "var(--coral)" }}>Return Policy</Link> for full details on returns, exchanges, and refunds.
            </p>
          </section>

          <section>
            <h2 className="font-extrabold text-lg mb-2" style={{ color: "var(--navy)" }}>6. Product Safety</h2>
            <p>
              All toys sold on PlayNest comply with applicable safety standards. Age recommendations are provided for each product. Adult supervision is recommended for children under the specified age. Please read all product warnings and instructions before use.
            </p>
          </section>

          <section>
            <h2 className="font-extrabold text-lg mb-2" style={{ color: "var(--navy)" }}>7. Intellectual Property</h2>
            <p>
              All content on this website, including text, images, logos, and design, is the property of PlayNest and is protected by South African copyright law. You may not reproduce, distribute, or use any content without our written permission.
            </p>
          </section>

          <section>
            <h2 className="font-extrabold text-lg mb-2" style={{ color: "var(--navy)" }}>8. Limitation of Liability</h2>
            <p>
              PlayNest shall not be liable for any indirect, incidental, or consequential damages arising from the use of our website or products. Our total liability is limited to the amount paid for the specific order in question.
            </p>
          </section>

          <section>
            <h2 className="font-extrabold text-lg mb-2" style={{ color: "var(--navy)" }}>9. Governing Law</h2>
            <p>
              These terms are governed by the laws of the Republic of South Africa. Any disputes shall be resolved in the courts of South Africa.
            </p>
          </section>

          <section>
            <h2 className="font-extrabold text-lg mb-2" style={{ color: "var(--navy)" }}>10. Contact</h2>
            <p>
              For any questions regarding these terms, please contact us at <strong style={{ color: "var(--coral)" }}>hello@playnest.co.za</strong>.
            </p>
          </section>
        </div>
      </div>
      <Footer />
    </main>
  );
}
