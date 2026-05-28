"use client";
import { useState } from "react";
import { X } from "lucide-react";

export default function AnnouncementBar() {
  const [visible, setVisible] = useState(true);
  if (!visible) return null;
  return (
    <div
      className="relative flex items-center justify-center px-4 py-2 text-white text-sm font-semibold"
      style={{ backgroundColor: "var(--coral)" }}
    >
      <p className="text-center">
        🚚 Free delivery on orders over R500 &nbsp;|&nbsp; Safe, tested &amp; loved by SA families
      </p>
      <button
        onClick={() => setVisible(false)}
        aria-label="Dismiss announcement"
        className="absolute right-3 p-1 rounded hover:opacity-70 transition-opacity"
      >
        <X size={16} />
      </button>
    </div>
  );
}
