"use client";

import { useEffect, useRef, useState } from "react";
import Icon from "@/components/Icon";

// Layout, in px. Overlays (active cell, range, marching ants) are positioned from these.
const HEADER_W = 44;
const HEAD_H = 28;
const ROW_H = 32;
const COL_W = [150, 100, 100, 100, 100, 112];
const COL_X = COL_W.reduce((xs, w, i) => [...xs, xs[i] + w], [HEADER_W]);
const LETTERS = "ABCDEF";

const regions = [
  ["North America", 48200, 51900, 55300, 61800],
  ["South America", 12400, 13100, 12800, 14900],
  ["Western Europe", 39700, 41200, 40100, 45600],
  ["Eastern Europe", 9800, 10400, 11900, 12300],
  ["Middle East", 7200, 8100, 9400, 10200],
  ["Africa", 4100, 4600, 5200, 6100],
  ["East Asia", 33500, 36800, 38900, 42700],
  ["Oceania", 6900, 7300, 7100, 8400],
];
const ROWS = regions.length + 2; // header row + regions + total row

const ref = (r, c) => `${LETTERS[c]}${r + 1}`;
const sum = (xs) => xs.reduce((a, b) => a + b, 0);

// Returns { value, formula? } for a cell, computing the SUM formulas
function cell(r, c) {
  if (r === 0) return { value: ["Region", "Q1", "Q2", "Q3", "Q4", "Total"][c] };
  if (r <= regions.length) {
    const row = regions[r - 1];
    if (c === 0) return { value: row[0] };
    if (c <= 4) return { value: row[c] };
    return { value: sum(row.slice(1)), formula: `=SUM(B${r + 1}:E${r + 1})` };
  }
  if (c === 0) return { value: "Total" };
  const col = c <= 4 ? regions.map((row) => row[c]) : regions.map((row) => sum(row.slice(1)));
  return { value: sum(col), formula: `=SUM(${LETTERS[c]}2:${LETTERS[c]}${regions.length + 1})` };
}

const fmt = (v) => (typeof v === "number" ? v.toLocaleString() : v);
const clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, n));

function rangeOf(a, b) {
  return { r1: Math.min(a.r, b.r), r2: Math.max(a.r, b.r), c1: Math.min(a.c, b.c), c2: Math.max(a.c, b.c) };
}
function rectOf({ r1, r2, c1, c2 }) {
  return { left: COL_X[c1], top: HEAD_H + r1 * ROW_H, width: COL_X[c2 + 1] - COL_X[c1], height: (r2 - r1 + 1) * ROW_H };
}

export default function Spreadsheet() {
  const gridRef = useRef(null);
  const dragging = useRef(false);
  const [active, setActive] = useState({ r: 1, c: 1 });
  const [anchor, setAnchor] = useState({ r: 1, c: 1 });
  const [copied, setCopied] = useState(null);

  const range = rangeOf(anchor, active);
  const multi = range.r1 !== range.r2 || range.c1 !== range.c2;
  const label = multi ? `${ref(range.r1, range.c1)}:${ref(range.r2, range.c2)}` : ref(active.r, active.c);
  const current = cell(active.r, active.c);

  const nums = [];
  for (let r = range.r1; r <= range.r2; r++)
    for (let c = range.c1; c <= range.c2; c++) {
      const v = cell(r, c).value;
      if (typeof v === "number") nums.push(v);
    }

  useEffect(() => {
    const up = () => (dragging.current = false);
    window.addEventListener("mouseup", up);
    return () => window.removeEventListener("mouseup", up);
  }, []);

  function select(r, c, extend) {
    setActive({ r, c });
    if (!extend) setAnchor({ r, c });
  }

  async function copy() {
    setCopied(range);
    const tsv = [];
    for (let r = range.r1; r <= range.r2; r++) {
      const line = [];
      for (let c = range.c1; c <= range.c2; c++) line.push(cell(r, c).value);
      tsv.push(line.join("\t"));
    }
    try {
      await navigator.clipboard.writeText(tsv.join("\n")); // pastes straight into Excel or Sheets
    } catch {
      // Clipboard can be blocked (e.g. insecure context); the marching ants still show
    }
    gridRef.current?.focus();
  }

  function onKeyDown(e) {
    const moves = { ArrowUp: [-1, 0], ArrowDown: [1, 0], ArrowLeft: [0, -1], ArrowRight: [0, 1], Enter: [1, 0], Tab: [0, 1] };
    if (moves[e.key]) {
      e.preventDefault();
      const [dr, dc] = e.shiftKey && (e.key === "Tab" || e.key === "Enter") ? moves[e.key].map((n) => -n) : moves[e.key];
      const extend = e.shiftKey && e.key.startsWith("Arrow");
      select(clamp(active.r + dr, 0, ROWS - 1), clamp(active.c + dc, 0, LETTERS.length - 1), extend);
    } else if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "c") {
      e.preventDefault();
      copy();
    } else if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "a") {
      e.preventDefault();
      setAnchor({ r: 0, c: 0 });
      setActive({ r: ROWS - 1, c: LETTERS.length - 1 });
    } else if (e.key === "Escape") {
      setCopied(null);
    }
  }

  const activeRect = rectOf({ r1: active.r, r2: active.r, c1: active.c, c2: active.c });
  const rangeRect = rectOf(range);
  const copiedRect = copied && rectOf(copied);
  const inCols = (c) => c >= range.c1 && c <= range.c2;
  const inRows = (r) => r >= range.r1 && r <= range.r2;

  return (
    <section className="overflow-hidden rounded-lg border border-gray-200 bg-white">
      {/* Formula bar */}
      <div className="flex flex-wrap items-center gap-2 border-b border-gray-200 px-3 py-2">
        <span className="w-28 rounded border border-gray-300 px-2 py-1 font-mono text-sm text-gray-900">{label}</span>
        <span className="px-1 font-serif text-sm italic text-gray-500">fx</span>
        <span key={label} className="min-w-0 flex-1 animate-fade-in truncate rounded border border-gray-200 px-2 py-1 font-mono text-sm text-gray-800">
          {current.formula ?? fmt(current.value)}
        </span>
        <button
          type="button"
          onClick={copy}
          className="inline-flex items-center gap-1.5 rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 active:scale-95"
        >
          <Icon name="copy" className="h-4 w-4" />
          Copy
        </button>
      </div>

      <div className="overflow-x-auto">
        <div
          ref={gridRef}
          tabIndex={0}
          role="grid"
          aria-label="Regional revenue spreadsheet"
          onKeyDown={onKeyDown}
          className="relative select-none text-sm focus:outline-none"
          style={{ width: COL_X.at(-1), height: HEAD_H + ROWS * ROW_H }}
        >
          {/* Column letters */}
          <div className="absolute left-0 top-0 flex" style={{ height: HEAD_H }}>
            <div className="border-b border-r border-gray-300 bg-gray-100" style={{ width: HEADER_W }} />
            {COL_W.map((w, c) => (
              <div
                key={c}
                style={{ width: w }}
                className={`flex items-center justify-center border-b border-r border-gray-300 text-xs transition-colors duration-150 ${
                  inCols(c) ? "bg-blue-100 font-semibold text-blue-800" : "bg-gray-100 text-gray-600"
                }`}
              >
                {LETTERS[c]}
              </div>
            ))}
          </div>

          {/* Rows */}
          {Array.from({ length: ROWS }, (_, r) => (
            <div key={r} className="absolute left-0 flex" style={{ top: HEAD_H + r * ROW_H, height: ROW_H }}>
              <div
                style={{ width: HEADER_W }}
                className={`flex items-center justify-center border-b border-r border-gray-300 text-xs transition-colors duration-150 ${
                  inRows(r) ? "bg-blue-100 font-semibold text-blue-800" : "bg-gray-100 text-gray-600"
                }`}
              >
                {r + 1}
              </div>
              {COL_W.map((w, c) => {
                const { value } = cell(r, c);
                const header = r === 0;
                const total = r === ROWS - 1 || c === LETTERS.length - 1;
                return (
                  <div
                    key={c}
                    role="gridcell"
                    aria-selected={inRows(r) && inCols(c)}
                    style={{ width: w }}
                    onMouseDown={(e) => {
                      dragging.current = true;
                      select(r, c, e.shiftKey);
                    }}
                    onMouseEnter={() => dragging.current && select(r, c, true)}
                    className={`flex items-center truncate border-b border-r border-gray-200 px-2 ${
                      typeof value === "number" ? "justify-end tabular-nums" : ""
                    } ${header ? "bg-gray-50 font-semibold text-gray-900" : total ? "bg-gray-50/70 font-medium text-gray-900" : "text-gray-800"}`}
                  >
                    {fmt(value)}
                  </div>
                );
              })}
            </div>
          ))}

          {/* Range selection */}
          <div
            className={`pointer-events-none absolute border border-blue-600 bg-blue-600/10 transition-all duration-150 ease-out ${
              multi ? "opacity-100" : "opacity-0"
            }`}
            style={rangeRect}
          />
          {/* Active cell: glides between cells */}
          <div
            className="pointer-events-none absolute border-2 border-blue-600 transition-all duration-150 ease-out"
            style={activeRect}
          />
          {/* Fill handle */}
          <div
            className="pointer-events-none absolute h-2 w-2 border border-white bg-blue-600 transition-all duration-150 ease-out"
            style={{ left: rangeRect.left + rangeRect.width - 4, top: rangeRect.top + rangeRect.height - 4 }}
          />
          {/* Copied range: marching ants */}
          {copiedRect && (
            <svg className="pointer-events-none absolute" style={copiedRect} aria-hidden="true">
              <rect
                x="1"
                y="1"
                width={copiedRect.width - 2}
                height={copiedRect.height - 2}
                fill="none"
                strokeWidth="2"
                strokeDasharray="6 6"
                className="animate-march stroke-green-600"
              />
            </svg>
          )}
        </div>
      </div>

      {/* Status bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-gray-200 bg-gray-50 px-3 py-1.5 text-xs text-gray-600">
        <span>
          Click, drag, or Shift+arrow to select · <kbd className="font-mono">⌘/Ctrl+C</kbd> to copy · <kbd className="font-mono">Esc</kbd> to clear
        </span>
        {nums.length > 0 && (
          <span key={label} className="animate-fade-in space-x-4 tabular-nums">
            {nums.length > 1 && <span>Average: {Math.round(sum(nums) / nums.length).toLocaleString()}</span>}
            <span>Count: {nums.length}</span>
            <span className="font-medium text-gray-900">Sum: {sum(nums).toLocaleString()}</span>
          </span>
        )}
      </div>
    </section>
  );
}
