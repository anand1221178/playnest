"use client";
import { useEffect } from "react";
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

export default function Home() {
  useEffect(() => {
    const els = document.querySelectorAll(".fade-in-up");
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("visible"); }),
      { threshold: 0.12 }
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

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
    </main>
  );
}
