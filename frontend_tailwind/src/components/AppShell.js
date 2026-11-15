"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";

export default function AppShell({ children }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false); // desktop: icon-only rail
  const [mobileOpen, setMobileOpen] = useState(false); // mobile: slide-over drawer

  // Close the mobile drawer after navigating
  useEffect(() => setMobileOpen(false), [pathname]);

  function toggleMenu() {
    if (window.matchMedia("(min-width: 768px)").matches) setCollapsed((c) => !c);
    else setMobileOpen((o) => !o);
  }

  return (
    <>
      <Header onMenu={toggleMenu} />
      <Sidebar collapsed={collapsed} mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
      <main
        className={`min-h-screen pt-14 transition-[padding] duration-200 ease-out ${
          collapsed ? "md:pl-[72px]" : "md:pl-64"
        }`}
      >
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-8 sm:py-8">{children}</div>
      </main>
    </>
  );
}
