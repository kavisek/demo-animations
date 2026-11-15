"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Icon from "@/components/Icon";
import { animations, getProject, projects } from "@/lib/animations";

// The project is the first path segment: /web/fade → "web"
export function useCurrentProject() {
  const pathname = usePathname();
  return getProject(pathname.split("/")[1]) ?? projects[0];
}

export default function ProjectPicker() {
  const current = useCurrentProject();
  const pathname = usePathname();
  // The menu is open only on the page it was opened on, so navigating closes it
  const [openPath, setOpenPath] = useState(null);
  const open = openPath === pathname;
  const setOpen = (value) => setOpenPath(value ? pathname : null);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e) => !ref.current?.contains(e.target) && setOpenPath(null);
    const onKey = (e) => e.key === "Escape" && setOpenPath(null);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative hidden shrink-0 md:block">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-haspopup="menu"
        aria-expanded={open}
        className={`flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-sm text-gray-700 transition hover:bg-gray-50 ${
          open ? "border-blue-500 ring-2 ring-blue-100" : "border-gray-300"
        }`}
      >
        <Icon name={current.icon} className="h-4 w-4 text-gray-500" />
        <span key={current.id} className="animate-fade-in">{current.name}</span>
        <Icon name="dropdown" className={`h-4 w-4 text-gray-500 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div role="menu" className="absolute left-0 top-11 z-50 w-80 origin-top-left animate-pop-in overflow-hidden rounded-lg border border-gray-200 bg-white shadow-xl">
          <p className="border-b border-gray-100 px-4 py-2 text-xs font-medium uppercase tracking-wide text-gray-500">
            Select a project
          </p>
          <ul className="py-1">
            {projects.map((p, i) => {
              const active = p.id === current.id;
              const count = animations.filter((a) => a.project === p.id).length;
              return (
                <li key={p.id} style={{ animationDelay: `${i * 40}ms` }} className="animate-fade-up">
                  <Link
                    href={`/${p.id}`}
                    role="menuitem"
                    className={`flex items-start gap-3 px-4 py-3 transition-colors hover:bg-gray-50 ${active ? "bg-blue-50/60" : ""}`}
                  >
                    <span
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                        active ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      <Icon name={p.icon} className="h-5 w-5" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center justify-between gap-2">
                        <span className={`text-sm font-medium ${active ? "text-blue-700" : "text-gray-900"}`}>{p.name}</span>
                        {active && <Icon name="check" className="h-4 w-4 text-blue-700" />}
                      </span>
                      <span className="block text-xs text-gray-500">{p.tagline}</span>
                      <span className="mt-0.5 block text-xs text-gray-400">{count} animations</span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
