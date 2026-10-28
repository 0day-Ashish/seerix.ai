"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import SettingsHeader from "@/components/settings/header";
import SettingsSidebar from "@/components/settings/sidebar";

/**
 * The settings frame: sidebar, top bar and the white panel, in the
 * dashboard's chrome. Owns the drawer the sidebar becomes below lg, so the
 * top bar's button and the sidebar's close agree; it closes on navigation,
 * Escape, a tap on the backdrop, or the window growing past lg.
 */
export default function SettingsShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [drawer, setDrawer] = useState(false);

  // Checked during render, as React recommends over an effect.
  const [drawerPath, setDrawerPath] = useState(pathname);
  if (drawerPath !== pathname) {
    setDrawerPath(pathname);
    setDrawer(false);
  }

  useEffect(() => {
    if (!drawer) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setDrawer(false);
    };
    const wide = window.matchMedia("(min-width: 1024px)");
    const onWide = () => wide.matches && setDrawer(false);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKey);
    wide.addEventListener("change", onWide);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", onKey);
      wide.removeEventListener("change", onWide);
    };
  }, [drawer]);

  return (
    <div data-app className="flex min-h-dvh flex-col bg-signal-ink lg:flex-row">
      {/* The drawer's backdrop, below lg only. */}
      <button
        type="button"
        aria-label="Close menu"
        tabIndex={drawer ? 0 : -1}
        onClick={() => setDrawer(false)}
        className={`fixed inset-0 z-40 bg-black/50 transition-opacity duration-200 lg:hidden ${
          drawer ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />
      <SettingsSidebar open={drawer} onClose={() => setDrawer(false)} />
      <div className="min-w-0 flex-1 bg-signal-ink">
        <SettingsHeader open={drawer} onOpen={() => setDrawer(true)} />
        <main className="min-h-[calc(100dvh-57px)] bg-white px-5 pb-20 pt-7 sm:px-8 lg:px-12 lg:pt-10">
          <div className="mx-auto max-w-4xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
