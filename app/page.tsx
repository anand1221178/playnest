export const dynamic = "force-dynamic";

import AnnouncementBar from "@/components/AnnouncementBar";
import Navbar         from "@/components/Navbar";
import Hero           from "@/components/Hero";
import BestSellers    from "@/components/BestSellers";
import AgeSection     from "@/components/AgeSection";
import TrustSection   from "@/components/TrustSection";
import NewArrivals    from "@/components/NewArrivals";
import GiftFinder     from "@/components/GiftFinder";
import Newsletter     from "@/components/Newsletter";
import Footer         from "@/components/Footer";
import ScrollAnimator from "@/components/ScrollAnimator";

export default function Home() {
  return (
    <main className="flex flex-col">
      <AnnouncementBar />
      <Navbar />
      <Hero />
      <BestSellers />
      <AgeSection />
      <TrustSection />
      <NewArrivals />
      <GiftFinder />
      <Newsletter />
      <Footer />
      <ScrollAnimator />
    </main>
  );
}
