"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";

// Validated categorical palette (light mode), in fixed slot order. Checked with the
// dataviz palette validator: all slots pass adjacent CVD/normal-vision checks, and the
// first three pass all-pairs (used for the scatter plot). Aqua, yellow, and magenta are
// under 3:1 contrast on white, so every chart has direct labels or a table view.
export const SERIES = ["#2a78d6", "#eb6834", "#1baf7a", "#eda100", "#e87ba4", "#008300"];
export const GRID = "#e1e0d9";
export const BASELINE = "#c3c2b7";
export const STATUS = { good: "#0ca30c", critical: "#d03b3b" };

export function compact(n) {
  const abs = Math.abs(n);
  if (abs >= 1e6) return `${+(n / 1e6).toFixed(abs >= 1e7 ? 0 : 1)}M`;
  if (abs >= 1e4) return `${+(n / 1e3).toFixed(0)}K`;
  return n.toLocaleString();
}

// A "nice" axis: round max and evenly spaced ticks (0, 2,500, 5,000, …)
export function niceScale(max, count = 4) {
  const raw = max / count || 1;
  const mag = 10 ** Math.floor(Math.log10(raw));
  const step = [1, 2, 2.5, 5, 10].map((m) => m * mag).find((s) => s >= raw);
  const top = step * Math.ceil(max / step);
  return { max: top, ticks: Array.from({ length: Math.round(top / step) + 1 }, (_, i) => i * step) };
}

// Animates a number from its previous value to `target` (ease-out cubic)
export function useCountUp(target, duration = 1100) {
  const [value, setValue] = useState(0);
  const from = useRef(0);
  useEffect(() => {
    const start = performance.now();
    const begin = from.current;
    let raf;
    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration);
      const v = begin + (target - begin) * (1 - (1 - t) ** 3);
      setValue(v);
      from.current = v;
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return value;
}

// True one frame after mount: lets marks render at zero, then transition to their values
export function useMounted() {
  const [m, setM] = useState(false);
  useEffect(() => {
    const r = requestAnimationFrame(() => requestAnimationFrame(() => setM(true)));
    return () => cancelAnimationFrame(r);
  }, []);
  return m;
}

// Width of an element, kept up to date (SVG charts draw in real pixels so text never stretches)
export function useWidth(fallback = 640) {
  const ref = useRef(null);
  const [width, setWidth] = useState(fallback);
  useLayoutEffect(() => {
    if (!ref.current) return;
    const ro = new ResizeObserver(([e]) => setWidth(Math.max(280, Math.round(e.contentRect.width))));
    ro.observe(ref.current);
    return () => ro.disconnect();
  }, []);
  return [ref, width];
}

export function Legend({ items, onToggle, hidden = new Set() }) {
  return (
    <ul className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-600">
      {items.map(({ label, color }) => {
        const off = hidden.has(label);
        const Tag = onToggle ? "button" : "span";
        return (
          <li key={label}>
            <Tag
              {...(onToggle ? { type: "button", onClick: () => onToggle(label), "aria-pressed": !off } : {})}
              className={`flex items-center gap-1.5 transition-opacity ${off ? "opacity-40" : ""} ${onToggle ? "rounded-sm px-1 hover:bg-gray-100" : ""}`}
            >
              <span className="h-2.5 w-2.5 rounded-xs" style={{ background: color }} />
              {label}
            </Tag>
          </li>
        );
      })}
    </ul>
  );
}

export function Tooltip({ x, y, show, children, align = "center" }) {
  return (
    <div
      role="status"
      className={`pointer-events-none absolute z-20 min-w-28 rounded-md bg-white px-2.5 py-1.5 text-xs text-gray-700 shadow-lg ring-1 ring-black/10 transition-opacity duration-150 ${
        show ? "opacity-100" : "opacity-0"
      }`}
      style={{ left: x, top: y, transform: `translate(${align === "center" ? "-50%" : align === "left" ? "8px" : "calc(-100% - 8px)"}, calc(-100% - 8px))` }}
    >
      {children}
    </div>
  );
}

export function TooltipRow({ color, label, value }) {
  return (
    <div className="flex items-center justify-between gap-3 whitespace-nowrap">
      <span className="flex items-center gap-1.5">
        {color && <span className="h-2 w-2 rounded-xs" style={{ background: color }} />}
        {label}
      </span>
      <span className="font-medium tabular-nums text-gray-900">{value}</span>
    </div>
  );
}

// Card with title, optional controls and legend, and a Chart / Table switch
export function ChartCard({ title, subtitle, controls, legend, table, children }) {
  const [view, setView] = useState("chart");
  return (
    <section className="rounded-lg border border-gray-200 bg-white">
      <header className="flex flex-wrap items-start justify-between gap-3 border-b border-gray-100 px-5 py-3">
        <div>
          <h2 className="text-sm font-medium text-gray-900">{title}</h2>
          {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
        </div>
        {table && (
          <div role="tablist" className="flex rounded-md bg-gray-100 p-0.5 text-xs font-medium">
            {["chart", "table"].map((v) => (
              <button
                key={v}
                type="button"
                role="tab"
                aria-selected={view === v}
                onClick={() => setView(v)}
                className={`rounded-sm px-2.5 py-1 capitalize transition ${view === v ? "bg-white text-gray-900 shadow-xs" : "text-gray-500 hover:text-gray-800"}`}
              >
                {v}
              </button>
            ))}
          </div>
        )}
      </header>
      {(controls || legend) && (
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 pt-4">
          {controls}
          {legend}
        </div>
      )}
      <div className="p-5">
        {view === "chart" ? (
          children
        ) : (
          <div className="animate-fade-in overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-left text-xs uppercase tracking-wide text-gray-500">
                  {table.columns.map((c, i) => (
                    <th key={c} className={`py-2 pr-4 font-medium ${i > 0 ? "text-right" : ""}`}>{c}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {table.rows.map((r) => (
                  <tr key={r[0]}>
                    {r.map((cell, i) => (
                      <td key={i} className={`py-2 pr-4 ${i > 0 ? "text-right tabular-nums" : "text-gray-900"}`}>{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}

export function Pills({ options, value, onChange, label }) {
  return (
    <div role="radiogroup" aria-label={label} className="relative flex rounded-md bg-gray-100 p-0.5 text-xs font-medium">
      {options.map((o) => (
        <button
          key={o}
          type="button"
          role="radio"
          aria-checked={value === o}
          onClick={() => onChange(o)}
          className={`rounded-sm px-2.5 py-1 transition ${value === o ? "bg-white text-gray-900 shadow-xs" : "text-gray-500 hover:text-gray-800"}`}
        >
          {o}
        </button>
      ))}
    </div>
  );
}

// Deterministic pseudo-random numbers, so server and client render the same data
export function seeded(seed) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}
