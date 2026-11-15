"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import Icon from "@/components/Icon";
import {
  BASELINE,
  ChartCard,
  GRID,
  Legend,
  Pills,
  SERIES,
  STATUS,
  Tooltip,
  TooltipRow,
  compact,
  niceScale,
  seeded,
  useCountUp,
  useMounted,
  useWidth,
} from "@/components/charts/chartKit";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const EASE_IOS = "cubic-bezier(0.32, 0.72, 0, 1)";

// HTML y-axis + gridlines shared by the column charts
function YAxis({ ticks, max, format }) {
  return (
    <div className="relative w-12 shrink-0">
      {ticks.map((t) => (
        <span key={t} className="absolute right-2 translate-y-1/2 text-[11px] tabular-nums text-gray-500 transition-all duration-500" style={{ bottom: `${(t / max) * 100}%` }}>
          {format(t)}
        </span>
      ))}
    </div>
  );
}
function Gridlines({ ticks, max }) {
  return ticks.map((t) => (
    <span key={t} className="absolute inset-x-0 h-px transition-all duration-500" style={{ bottom: `${(t / max) * 100}%`, background: t === 0 ? BASELINE : GRID }} />
  ));
}

// --- Morphing columns ------------------------------------------------------
const columnMetrics = {
  Revenue: { format: (v) => `$${compact(v)}`, values: [182e3, 195e3, 210e3, 204e3, 238e3, 251e3, 247e3, 266e3, 289e3, 301e3, 322e3, 348e3] },
  "Active users": { format: compact, values: [21e3, 22.4e3, 24.1e3, 26e3, 25.2e3, 27.8e3, 31e3, 33.5e3, 32.1e3, 35.6e3, 38.2e3, 41e3] },
  Orders: { format: compact, values: [4100, 3900, 4600, 5200, 5800, 5400, 6100, 6900, 6400, 7200, 8100, 9300] },
};

export function ColumnsDemo() {
  const [metric, setMetric] = useState("Revenue");
  const [hover, setHover] = useState(null);
  const mounted = useMounted();
  const { values, format } = columnMetrics[metric];
  const { max, ticks } = niceScale(Math.max(...values));
  const peak = values.indexOf(Math.max(...values));
  const H = 240;

  return (
    <ChartCard
      title={`${metric} by month`}
      subtitle="2026 · switch metrics to see columns spring to new values"
      controls={<Pills label="Metric" options={Object.keys(columnMetrics)} value={metric} onChange={setMetric} />}
      table={{ columns: ["Month", metric], rows: MONTHS.map((m, i) => [m, format(values[i])]) }}
    >
      <div className="flex" style={{ height: H }}>
        <YAxis ticks={ticks} max={max} format={format} />
        <div className="relative flex-1">
          <Gridlines ticks={ticks} max={max} />
          <div className="absolute inset-0 flex items-end">
            {values.map((v, i) => {
              const pct = mounted ? (v / max) * 100 : 0;
              const labelled = i === peak || i === values.length - 1;
              return (
                <div
                  key={i}
                  onPointerEnter={() => setHover(i)}
                  onPointerLeave={() => setHover(null)}
                  className={`relative flex h-full flex-1 items-end justify-center rounded-sm transition-colors ${hover === i ? "bg-gray-100/70" : ""}`}
                >
                  <div
                    className="w-full max-w-[24px] rounded-t-[4px] transition-[height,opacity] duration-700 ease-spring"
                    style={{ height: `${pct}%`, transitionDelay: `${i * 35}ms`, background: SERIES[0], opacity: hover === null || hover === i ? 1 : 0.45 }}
                  />
                  {labelled && (
                    <span
                      className="absolute left-1/2 -translate-x-1/2 whitespace-nowrap text-[11px] font-medium tabular-nums text-gray-700 transition-all duration-700 ease-spring"
                      style={{ bottom: `calc(${pct}% + 4px)`, transitionDelay: `${i * 35}ms`, opacity: mounted ? 1 : 0 }}
                    >
                      {format(v)}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
          <Tooltip show={hover !== null} x={`${((hover ?? 0) + 0.5) / 12 * 100}%`} y={`${100 - ((values[hover ?? 0] / max) * 100)}%`}>
            <p className="mb-0.5 font-medium text-gray-900">{MONTHS[hover ?? 0]} 2026</p>
            <TooltipRow color={SERIES[0]} label={metric} value={format(values[hover ?? 0])} />
          </Tooltip>
        </div>
      </div>
      <div className="ml-12 mt-2 flex">
        {MONTHS.map((m) => (
          <span key={m} className="flex-1 text-center text-[11px] text-gray-500">{m}</span>
        ))}
      </div>
    </ChartCard>
  );
}

// --- Stacked ↔ grouped -----------------------------------------------------
const stackSeries = ["Compute", "Storage", "Networking"];
const quarters = ["Q1", "Q2", "Q3", "Q4"];
const stackData = [
  [42, 18, 11],
  [48, 21, 14],
  [45, 27, 16],
  [57, 29, 21],
]; // $K per quarter, per series

export function StackedDemo() {
  const [mode, setMode] = useState("Stacked");
  const [hover, setHover] = useState(null);
  const mounted = useMounted();
  const stacked = mode === "Stacked";
  const totals = stackData.map((q) => q.reduce((a, b) => a + b, 0));
  const { max, ticks } = niceScale(stacked ? Math.max(...totals) : Math.max(...stackData.flat()));
  const H = 240;
  const px = (v) => (mounted ? (v / max) * H : 0);
  const fmt = (v) => `$${v}K`;

  return (
    <ChartCard
      title="Cloud spend by quarter"
      subtitle="Stack to compare totals; group to compare services"
      controls={<Pills label="Layout" options={["Stacked", "Grouped"]} value={mode} onChange={setMode} />}
      legend={<Legend items={stackSeries.map((s, i) => ({ label: s, color: SERIES[i] }))} />}
      table={{ columns: ["Quarter", ...stackSeries, "Total"], rows: quarters.map((q, i) => [q, ...stackData[i].map(fmt), fmt(totals[i])]) }}
    >
      <div className="flex" style={{ height: H }}>
        <YAxis ticks={ticks} max={max} format={fmt} />
        <div className="relative flex-1">
          <Gridlines ticks={ticks} max={max} />
          {stackData.map((q, qi) => {
            const center = ((qi + 0.5) / quarters.length) * 100;
            let cum = 0;
            return (
              <div key={qi}>
                {q.map((v, s) => {
                  // Stacked: one 24px column, 2px surface gap between segments.
                  // Grouped: three 18px bars side by side, 2px apart.
                  const bottom = stacked ? px(cum) + (s > 0 ? 2 : 0) : 0;
                  const height = stacked ? Math.max(0, px(v) - (s > 0 ? 2 : 0)) : px(v);
                  const left = stacked ? `calc(${center}% - 12px)` : `calc(${center}% - 29px + ${s * 20}px)`;
                  const top = !stacked || s === q.length - 1;
                  cum += v;
                  const active = !hover || (hover.q === qi && hover.s === s);
                  return (
                    <div
                      key={s}
                      onPointerEnter={() => setHover({ q: qi, s })}
                      onPointerLeave={() => setHover(null)}
                      className="absolute"
                      style={{
                        left,
                        bottom,
                        height,
                        width: stacked ? 24 : 18,
                        background: SERIES[s],
                        borderRadius: top ? "4px 4px 0 0" : 0,
                        opacity: active ? 1 : 0.4,
                        transition: `all 700ms ${EASE_IOS} ${s * 60}ms, opacity 150ms`,
                      }}
                    />
                  );
                })}
                <span
                  className="absolute -translate-x-1/2 text-[11px] font-medium tabular-nums text-gray-700"
                  style={{ left: `${center}%`, bottom: px(totals[qi]) + 6, opacity: stacked && mounted ? 1 : 0, transition: `all 700ms ${EASE_IOS}` }}
                >
                  {fmt(totals[qi])}
                </span>
              </div>
            );
          })}
          {hover && (
            <Tooltip show x={`${((hover.q + 0.5) / quarters.length) * 100}%`} y={H - px(stacked ? totals[hover.q] : stackData[hover.q][hover.s]) - 4}>
              <p className="mb-0.5 font-medium text-gray-900">{quarters[hover.q]} 2026</p>
              <TooltipRow color={SERIES[hover.s]} label={stackSeries[hover.s]} value={fmt(stackData[hover.q][hover.s])} />
              <TooltipRow label="Quarter total" value={fmt(totals[hover.q])} />
            </Tooltip>
          )}
        </div>
      </div>
      <div className="ml-12 mt-2 flex">
        {quarters.map((q) => (
          <span key={q} className="flex-1 text-center text-[11px] text-gray-500">{q}</span>
        ))}
      </div>
    </ChartCard>
  );
}

// --- Bar chart race --------------------------------------------------------
const raceYears = [2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026];
const raceData = {
  "North America": [52, 61, 70, 78, 84, 90, 95, 99],
  Europe: [44, 55, 68, 74, 83, 92, 101, 108],
  Asia: [30, 41, 57, 72, 90, 108, 124, 141],
  "South America": [12, 15, 21, 29, 38, 47, 55, 66],
  Africa: [6, 9, 14, 21, 30, 41, 54, 70],
  Oceania: [14, 17, 20, 24, 27, 31, 34, 38],
};
const regions = Object.keys(raceData);
const ROW = 40;

function RaceValue({ value }) {
  return <>{Math.round(useCountUp(value, 700))}M</>;
}

export function RaceDemo() {
  const [year, setYear] = useState(0);
  const [playing, setPlaying] = useState(true);

  useEffect(() => {
    if (!playing) return;
    if (year >= raceYears.length - 1) {
      setPlaying(false);
      return;
    }
    const t = setTimeout(() => setYear((y) => y + 1), 1300);
    return () => clearTimeout(t);
  }, [playing, year]);

  const ranked = [...regions].sort((a, b) => raceData[b][year] - raceData[a][year]);
  const leader = raceData[ranked[0]][year];

  return (
    <ChartCard
      title="Monthly active users by region"
      subtitle="Each region keeps its color as the ranking changes"
      controls={
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => {
              if (year >= raceYears.length - 1) setYear(0);
              setPlaying((p) => !p || year >= raceYears.length - 1);
            }}
            className="inline-flex items-center gap-1.5 rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-blue-700 active:scale-95"
          >
            <Icon name={playing ? "pause" : "play"} className="h-4 w-4" />
            {playing ? "Pause" : year >= raceYears.length - 1 ? "Replay" : "Play"}
          </button>
          <label className="flex items-center gap-2 text-xs text-gray-500">
            Year
            <input
              type="range"
              min={0}
              max={raceYears.length - 1}
              value={year}
              onChange={(e) => {
                setPlaying(false);
                setYear(+e.target.value);
              }}
              className="w-40 accent-blue-600"
              aria-label="Year"
            />
          </label>
        </div>
      }
      table={{ columns: ["Region", ...raceYears.map(String)], rows: regions.map((r) => [r, ...raceData[r].map((v) => `${v}M`)]) }}
    >
      <div className="relative" style={{ height: regions.length * ROW }}>
        <span key={year} className="absolute bottom-0 right-0 animate-fade-in text-6xl font-semibold tabular-nums text-gray-200">
          {raceYears[year]}
        </span>
        {regions.map((r, i) => {
          const rank = ranked.indexOf(r);
          const v = raceData[r][year];
          return (
            <div key={r} className="absolute inset-x-0 flex items-center transition-all duration-700 ease-in-out" style={{ top: rank * ROW, height: ROW }}>
              <span className="w-28 shrink-0 pr-3 text-right text-xs text-gray-700">{r}</span>
              <div className="relative flex h-full flex-1 items-center border-l" style={{ borderColor: BASELINE }}>
                <span
                  className="h-[22px] rounded-r-[4px] transition-[width] duration-700 ease-in-out"
                  style={{ width: `${(v / leader) * 82}%`, background: SERIES[i] }}
                />
                <span className="pl-2 text-xs font-medium tabular-nums text-gray-700">
                  <RaceValue value={v} />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </ChartCard>
  );
}

// --- Line draw & crosshair -------------------------------------------------
const lineSeries = [
  { label: "2026", color: SERIES[0], values: [41, 44, 52, 49, 58, 63, 61, 70, 76, 74, 83, 91] },
  { label: "2025", color: SERIES[1], values: [38, 40, 43, 45, 47, 46, 51, 54, 53, 58, 60, 64] },
];

export function LineDemo() {
  const [ref, width] = useWidth();
  const [hover, setHover] = useState(null);
  const H = 280;
  const m = { l: 48, r: 72, t: 16, b: 28 };
  const { max, ticks } = niceScale(Math.max(...lineSeries.flatMap((s) => s.values)));
  const step = (width - m.l - m.r) / 11;
  const x = (i) => m.l + i * step;
  const y = (v) => m.t + (1 - v / max) * (H - m.t - m.b);
  const path = (vals) => vals.map((v, i) => `${i ? "L" : "M"}${x(i)},${y(v)}`).join(" ");
  const base = y(0);
  const ends = lineSeries.map((s) => y(s.values[11]));
  // Nudge end labels apart if they would collide
  if (Math.abs(ends[0] - ends[1]) < 16) ends[1] = ends[0] + 16;

  function onMove(e) {
    const rect = e.currentTarget.getBoundingClientRect();
    const i = Math.round((e.clientX - rect.left - m.l) / step);
    setHover(Math.max(0, Math.min(11, i)));
  }

  return (
    <ChartCard
      title="Weekly active users (thousands)"
      subtitle="Hover the chart for a crosshair"
      legend={<Legend items={lineSeries} />}
      table={{ columns: ["Month", ...lineSeries.map((s) => s.label)], rows: MONTHS.map((mo, i) => [mo, ...lineSeries.map((s) => `${s.values[i]}K`)]) }}
    >
      <div ref={ref} className="relative">
        <svg width={width} height={H} className="block touch-none" onPointerMove={onMove} onPointerLeave={() => setHover(null)} role="img" aria-label="Line chart of weekly active users, 2026 versus 2025">
          {ticks.map((t) => (
            <g key={t}>
              <line x1={m.l} x2={width - m.r} y1={y(t)} y2={y(t)} stroke={t === 0 ? BASELINE : GRID} />
              <text x={m.l - 8} y={y(t)} dy="0.32em" textAnchor="end" className="fill-gray-500 text-[11px] tabular-nums">{t}K</text>
            </g>
          ))}
          {MONTHS.map((mo, i) =>
            width < 520 && i % 2 ? null : (
              <text key={mo} x={x(i)} y={H - 8} textAnchor="middle" className="fill-gray-500 text-[11px]">{mo}</text>
            ),
          )}
          {/* Area wash (10% opacity) fades in after the line has drawn */}
          <path d={`${path(lineSeries[0].values)} L${x(11)},${base} L${x(0)},${base} Z`} fill={lineSeries[0].color} fillOpacity="0.1" style={{ animationDelay: "900ms" }} className="animate-fade-in" />
          {lineSeries.map((s, si) => (
            <path key={s.label} d={path(s.values)} pathLength="1" fill="none" stroke={s.color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" style={{ animationDelay: `${si * 250}ms` }} className="animate-draw [stroke-dasharray:1]" />
          ))}
          {lineSeries.map((s, si) => (
            <g key={s.label}>
              <circle cx={x(11)} cy={y(s.values[11])} r="4" fill={s.color} stroke="#fff" strokeWidth="2" style={{ animationDelay: `${1300 + si * 150}ms`, transformBox: "fill-box", transformOrigin: "center" }} className="animate-hud-in" />
              <text x={x(11) + 10} y={ends[si]} dy="0.32em" style={{ animationDelay: `${1300 + si * 150}ms` }} className="animate-fade-in fill-gray-700 text-[11px]">
                <tspan className="font-medium">{s.label}</tspan> {s.values[11]}K
              </text>
            </g>
          ))}
          {hover !== null && (
            <g className="pointer-events-none">
              <line x1={x(hover)} x2={x(hover)} y1={m.t} y2={base} stroke={BASELINE} />
              {lineSeries.map((s) => (
                <circle key={s.label} cx={x(hover)} cy={y(s.values[hover])} r="4" fill={s.color} stroke="#fff" strokeWidth="2" />
              ))}
            </g>
          )}
        </svg>
        <Tooltip show={hover !== null} x={x(hover ?? 0)} y={Math.min(...lineSeries.map((s) => y(s.values[hover ?? 0])))} align={hover !== null && hover > 8 ? "right" : "left"}>
          <p className="mb-0.5 font-medium text-gray-900">{MONTHS[hover ?? 0]}</p>
          {lineSeries.map((s) => (
            <TooltipRow key={s.label} color={s.color} label={s.label} value={`${s.values[hover ?? 0]}K`} />
          ))}
        </Tooltip>
      </div>
    </ChartCard>
  );
}

// --- Live streaming line ---------------------------------------------------
const LIVE_N = 40;

export function LiveDemo() {
  const [ref, width] = useWidth();
  const [data, setData] = useState(() => {
    const rand = seeded(7);
    const out = [55];
    for (let i = 1; i < LIVE_N; i++) out.push(Math.max(12, Math.min(92, out[i - 1] + (rand() - 0.5) * 14)));
    return out;
  });
  const [paused, setPaused] = useState(false);
  const [hover, setHover] = useState(null);
  const gRef = useRef(null);
  const first = useRef(true);
  const rand = useRef(seeded(99));

  const H = 240;
  const m = { l: 40, r: 16, t: 12, b: 24 };
  const plotW = width - m.l - m.r;
  const step = plotW / (LIVE_N - 1);
  const x = (i) => m.l + i * step;
  const y = (v) => m.t + (1 - v / 100) * (H - m.t - m.b);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => {
      setData((d) => [...d.slice(1), Math.max(8, Math.min(95, d[d.length - 1] + (rand.current() - 0.5) * 16))]);
    }, 1000);
    return () => clearInterval(t);
  }, [paused]);

  // Each new point: start the line one step to the right (where it was), then slide left
  useLayoutEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    const g = gRef.current;
    g.style.transition = "none";
    g.style.transform = `translateX(${step}px)`;
    g.getBoundingClientRect();
    g.style.transition = "transform 1000ms linear";
    g.style.transform = "translateX(0)";
  }, [data, step]);

  const line = data.map((v, i) => `${i ? "L" : "M"}${x(i)},${y(v)}`).join(" ");
  const current = useCountUp(data[data.length - 1], 600);

  return (
    <ChartCard
      title="Requests per second"
      subtitle="A new reading arrives every second"
      controls={
        <div className="flex items-center gap-4">
          <button type="button" onClick={() => setPaused((p) => !p)} className="inline-flex items-center gap-1.5 rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 active:scale-95">
            <Icon name={paused ? "play" : "pause"} className="h-4 w-4" />
            {paused ? "Resume" : "Pause"}
          </button>
          <span className="flex items-center gap-2 text-sm text-gray-600">
            <span className="relative flex h-2.5 w-2.5">
              {!paused && <span className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75" style={{ background: STATUS.good }} />}
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full" style={{ background: paused ? BASELINE : STATUS.good }} />
            </span>
            {paused ? "Paused" : "Live"} · now <span className="font-semibold tabular-nums text-gray-900">{current.toFixed(1)}K</span>
          </span>
        </div>
      }
      table={{ columns: ["Seconds ago", "Requests/s"], rows: data.slice(-10).reverse().map((v, i) => [`${i}s`, `${v.toFixed(1)}K`]) }}
    >
      <div ref={ref} className="relative">
        <svg
          width={width}
          height={H}
          className="block touch-none"
          onPointerMove={(e) => {
            const i = Math.round((e.clientX - e.currentTarget.getBoundingClientRect().left - m.l) / step);
            setHover(Math.max(0, Math.min(LIVE_N - 1, i)));
          }}
          onPointerLeave={() => setHover(null)}
          role="img"
          aria-label="Live line chart of requests per second"
        >
          <defs>
            <clipPath id="live-clip">
              <rect x={m.l} y={0} width={plotW + 6} height={H} />
            </clipPath>
          </defs>
          {[0, 25, 50, 75, 100].map((t) => (
            <g key={t}>
              <line x1={m.l} x2={width - m.r} y1={y(t)} y2={y(t)} stroke={t === 0 ? BASELINE : GRID} />
              <text x={m.l - 8} y={y(t)} dy="0.32em" textAnchor="end" className="fill-gray-500 text-[11px] tabular-nums">{t}K</text>
            </g>
          ))}
          <text x={m.l} y={H - 6} className="fill-gray-500 text-[11px]">−{LIVE_N - 1}s</text>
          <text x={width - m.r} y={H - 6} textAnchor="end" className="fill-gray-500 text-[11px]">now</text>
          <g clipPath="url(#live-clip)">
            <g ref={gRef}>
              <path d={`${line} L${x(LIVE_N - 1)},${y(0)} L${x(0)},${y(0)} Z`} fill={SERIES[0]} fillOpacity="0.1" />
              <path d={line} fill="none" stroke={SERIES[0]} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
              <circle cx={x(LIVE_N - 1)} cy={y(data[LIVE_N - 1])} r="4" fill={SERIES[0]} stroke="#fff" strokeWidth="2" />
            </g>
          </g>
          {hover !== null && (
            <g className="pointer-events-none">
              <line x1={x(hover)} x2={x(hover)} y1={m.t} y2={y(0)} stroke={BASELINE} />
              <circle cx={x(hover)} cy={y(data[hover])} r="4" fill={SERIES[0]} stroke="#fff" strokeWidth="2" />
            </g>
          )}
        </svg>
        <Tooltip show={hover !== null} x={x(hover ?? 0)} y={y(data[hover ?? 0])} align={hover !== null && hover > LIVE_N - 8 ? "right" : "left"}>
          <TooltipRow color={SERIES[0]} label={`${LIVE_N - 1 - (hover ?? 0)}s ago`} value={`${(data[hover ?? 0] ?? 0).toFixed(1)}K`} />
        </Tooltip>
      </div>
    </ChartCard>
  );
}

// --- Donut sweep -----------------------------------------------------------
const donutSets = {
  "Spend by service": { unit: "$", items: [["Compute", 4200], ["Storage", 2600], ["Networking", 1800], ["Databases", 1500], ["Other", 900]] },
  "Users by platform": { unit: "", items: [["iOS", 5200], ["Android", 4100], ["Web", 3600], ["Desktop", 1300], ["Other", 600]] },
};
const R = 84;
const C = 2 * Math.PI * R;

export function DonutDemo() {
  const [setName, setSetName] = useState("Spend by service");
  const [hover, setHover] = useState(null);
  const mounted = useMounted();
  const { unit, items } = donutSets[setName];
  const total = items.reduce((a, [, v]) => a + v, 0);
  const shown = useCountUp(hover === null ? total : items[hover][1], 600);
  const fmt = (v) => `${unit}${Math.round(v).toLocaleString()}`;

  let start = 0;
  const segs = items.map(([label, v], i) => {
    const len = (v / total) * C;
    const seg = { label, v, i, len, start };
    start += len;
    return seg;
  });

  return (
    <ChartCard
      title={setName}
      subtitle="Segments sweep in one after another; hover a segment or legend row"
      controls={<Pills label="Dataset" options={Object.keys(donutSets)} value={setName} onChange={setSetName} />}
      table={{ columns: ["Category", "Value", "Share"], rows: items.map(([l, v]) => [l, fmt(v), `${((v / total) * 100).toFixed(1)}%`]) }}
    >
      <div className="flex flex-col items-center gap-8 sm:flex-row sm:justify-center">
        <div className="relative h-[220px] w-[220px] shrink-0">
          <svg viewBox="0 0 220 220" className="h-full w-full -rotate-90" role="img" aria-label={`Donut chart: ${setName}`}>
            <circle cx="110" cy="110" r={R} fill="none" stroke="#f3f4f6" strokeWidth="26" />
            {segs.map((s) => (
              <circle
                key={s.label}
                cx="110"
                cy="110"
                r={R}
                fill="none"
                stroke={SERIES[s.i]}
                strokeWidth={hover === s.i ? 32 : 26}
                // 2px surface gap between segments
                strokeDasharray={`${mounted ? Math.max(0, s.len - 2) : 0} ${C}`}
                strokeDashoffset={-s.start}
                onPointerEnter={() => setHover(s.i)}
                onPointerLeave={() => setHover(null)}
                style={{
                  transition: `stroke-dasharray 900ms ${EASE_IOS} ${s.i * 110}ms, stroke-dashoffset 900ms ${EASE_IOS}, stroke-width 200ms, opacity 200ms`,
                  opacity: hover === null || hover === s.i ? 1 : 0.45,
                }}
              />
            ))}
          </svg>
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <span key={hover ?? "total"} className="animate-fade-in text-xs text-gray-500">{hover === null ? "Total" : items[hover][0]}</span>
            <span className="text-2xl font-semibold tabular-nums text-gray-900">{fmt(shown)}</span>
            {hover !== null && <span className="text-xs tabular-nums text-gray-500">{((items[hover][1] / total) * 100).toFixed(1)}%</span>}
          </div>
        </div>
        <ul className="w-full max-w-xs space-y-1">
          {segs.map((s) => (
            <li key={s.label}>
              <button
                type="button"
                onPointerEnter={() => setHover(s.i)}
                onPointerLeave={() => setHover(null)}
                onFocus={() => setHover(s.i)}
                onBlur={() => setHover(null)}
                className={`flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm transition ${hover === s.i ? "bg-gray-100" : ""}`}
              >
                <span className="h-2.5 w-2.5 rounded-sm" style={{ background: SERIES[s.i] }} />
                <span className="flex-1 text-left text-gray-700">{s.label}</span>
                <span className="tabular-nums text-gray-900">{fmt(s.v)}</span>
                <span className="w-12 text-right tabular-nums text-gray-500">{((s.v / total) * 100).toFixed(0)}%</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </ChartCard>
  );
}

// --- Scatter transitions ---------------------------------------------------
const scatterGroups = ["Web", "Mobile", "Batch"];
const scatterPoints = (() => {
  const rand = seeded(42);
  return scatterGroups.flatMap((g, gi) =>
    Array.from({ length: 15 }, (_, i) => {
      const latency = [80, 160, 260][gi] + rand() * 110;
      const cost = [20, 45, 70][gi] + rand() * 40 + (latency / 400) * 10;
      const rps = Math.round(4800 - latency * 7 - rand() * 900 + gi * 300);
      return { id: `${g}-${i}`, group: gi, latency: Math.round(latency), cost: Math.round(cost), rps: Math.max(300, rps) };
    }),
  );
})();
const xMetrics = {
  "Latency (ms)": { key: "latency", fmt: (v) => `${v} ms` },
  "Cost ($/day)": { key: "cost", fmt: (v) => `$${v}` },
};

export function ScatterDemo() {
  const [ref, width] = useWidth();
  const [xName, setXName] = useState("Latency (ms)");
  const [hidden, setHidden] = useState(new Set());
  const [hover, setHover] = useState(null);
  const mounted = useMounted();
  const H = 300;
  const m = { l: 52, r: 16, t: 16, b: 40 };
  const { key, fmt } = xMetrics[xName];
  const xs = useMemo(() => niceScale(Math.max(...scatterPoints.map((p) => p[key]))), [key]);
  const ys = niceScale(Math.max(...scatterPoints.map((p) => p.rps)));
  const x = (v) => m.l + (v / xs.max) * (width - m.l - m.r);
  const y = (v) => m.t + (1 - v / ys.max) * (H - m.t - m.b);
  const toggle = (label) =>
    setHidden((h) => {
      const n = new Set(h);
      n.has(label) ? n.delete(label) : n.add(label);
      return n;
    });
  const hp = hover && scatterPoints.find((p) => p.id === hover);

  return (
    <ChartCard
      title="Services: throughput vs. latency or cost"
      subtitle="Change the x-axis to watch points glide; click the legend to filter"
      controls={<Pills label="X axis" options={Object.keys(xMetrics)} value={xName} onChange={setXName} />}
      legend={<Legend items={scatterGroups.map((g, i) => ({ label: g, color: SERIES[i] }))} onToggle={toggle} hidden={hidden} />}
      table={{ columns: ["Service", "Group", "Latency", "Cost", "Requests/s"], rows: scatterPoints.map((p) => [p.id, scatterGroups[p.group], `${p.latency} ms`, `$${p.cost}`, p.rps.toLocaleString()]) }}
    >
      <div ref={ref} className="relative">
        <svg width={width} height={H} className="block" role="img" aria-label={`Scatter plot of requests per second against ${xName}`}>
          {ys.ticks.map((t) => (
            <g key={`y${t}`}>
              <line x1={m.l} x2={width - m.r} y1={y(t)} y2={y(t)} stroke={t === 0 ? BASELINE : GRID} />
              <text x={m.l - 8} y={y(t)} dy="0.32em" textAnchor="end" className="fill-gray-500 text-[11px] tabular-nums">{compact(t)}</text>
            </g>
          ))}
          {xs.ticks.map((t) => (
            <text key={`x${key}${t}`} x={x(t)} y={H - m.b + 16} textAnchor="middle" className="animate-fade-in fill-gray-500 text-[11px] tabular-nums">{fmt(t)}</text>
          ))}
          <text x={(width + m.l) / 2} y={H - 4} textAnchor="middle" className="fill-gray-600 text-[11px]">{xName}</text>
          <text x={m.l} y={10} className="fill-gray-600 text-[11px]">Requests/s</text>
          {scatterPoints.map((p, i) => {
            const off = hidden.has(scatterGroups[p.group]);
            const active = hover === p.id;
            return (
              <g
                key={p.id}
                onPointerEnter={() => !off && setHover(p.id)}
                onPointerLeave={() => setHover(null)}
                style={{
                  transform: `translate(${x(p[key])}px, ${mounted ? y(p.rps) : y(0)}px)`,
                  opacity: mounted ? (off ? 0.12 : 1) : 0,
                  transition: `transform 800ms ${EASE_IOS} ${i * 12}ms, opacity 300ms`,
                }}
              >
                <circle r="11" fill="transparent" />
                <circle r={active ? 7 : 5} fill={SERIES[p.group]} stroke="#fff" strokeWidth="2" style={{ transition: "r 150ms" }} />
              </g>
            );
          })}
        </svg>
        {hp && (
          <Tooltip show x={x(hp[key])} y={y(hp.rps) - 6}>
            <p className="mb-0.5 font-medium text-gray-900">{hp.id}</p>
            <TooltipRow color={SERIES[hp.group]} label="Group" value={scatterGroups[hp.group]} />
            <TooltipRow label={xName} value={fmt(hp[key])} />
            <TooltipRow label="Requests/s" value={hp.rps.toLocaleString()} />
          </Tooltip>
        )}
      </div>
    </ChartCard>
  );
}

// --- KPI tiles & gauges ----------------------------------------------------
const kpiSets = [
  { revenue: 1.24e6, users: 48210, conversion: 3.8, latency: 142 },
  { revenue: 1.31e6, users: 51480, conversion: 4.1, latency: 128 },
  { revenue: 1.19e6, users: 46900, conversion: 3.5, latency: 161 },
];
const kpiDefs = [
  { key: "revenue", label: "Revenue", fmt: (v) => `$${(v / 1e6).toFixed(2)}M`, goodUp: true, spark: [8, 9, 8, 10, 11, 10, 12, 13, 12, 14] },
  { key: "users", label: "Active users", fmt: (v) => Math.round(v).toLocaleString(), goodUp: true, spark: [30, 32, 31, 35, 38, 37, 41, 44, 46, 48] },
  { key: "conversion", label: "Conversion", fmt: (v) => `${v.toFixed(1)}%`, goodUp: true, spark: [3.1, 3.3, 3.2, 3.5, 3.4, 3.6, 3.7, 3.5, 3.9, 3.8] },
  { key: "latency", label: "p95 latency", fmt: (v) => `${Math.round(v)} ms`, goodUp: false, spark: [170, 165, 168, 158, 160, 151, 149, 152, 145, 142] },
];
const gaugeSets = [
  [72, 40, 63],
  [81, 35, 68],
  [64, 52, 71],
];
const gaugeDefs = ["Quarterly revenue target", "Error budget used", "Storage capacity"];

function Sparkline({ values, run }) {
  const min = Math.min(...values);
  const max = Math.max(...values);
  // Uniform scaling only: a stretched viewBox breaks the pathLength-based draw animation
  const pts = values.map((v, i) => `${2 + (i / (values.length - 1)) * 196},${36 - ((v - min) / (max - min || 1)) * 32}`).join(" ");
  return (
    <svg key={run} viewBox="0 0 200 40" className="h-10 w-full" aria-hidden="true">
      <polyline points={pts} pathLength="1" fill="none" stroke={SERIES[0]} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" className="animate-draw [stroke-dasharray:1]" />
    </svg>
  );
}

function KpiTile({ def, value, previous, run, i }) {
  const shown = useCountUp(value);
  const delta = previous ? ((value - previous) / previous) * 100 : 0;
  const good = def.goodUp ? delta >= 0 : delta <= 0;
  return (
    <div style={{ animationDelay: `${i * 80}ms` }} className="animate-fade-up rounded-lg border border-gray-200 bg-white p-4">
      <p className="text-sm text-gray-500">{def.label}</p>
      <p className="mt-1 text-3xl font-normal text-gray-900">{def.fmt(shown)}</p>
      {previous ? (
        <p key={run} className="mt-1 flex animate-fade-in items-center gap-1 text-xs text-gray-600">
          {/* Status color on the icon only, with a text label: never color alone */}
          <Icon name="up" className={`h-3.5 w-3.5 ${delta < 0 ? "rotate-180" : ""}`} style={{ color: good ? STATUS.good : STATUS.critical }} />
          <span className="tabular-nums">{`${delta >= 0 ? "+" : ""}${delta.toFixed(1)}%`}</span>
          <span className="text-gray-400">vs. last refresh · {good ? "better" : "worse"}</span>
        </p>
      ) : (
        <p className="mt-1 text-xs text-gray-400">Refresh to compare</p>
      )}
      <div className="mt-3">
        <Sparkline values={def.spark} run={run} />
      </div>
    </div>
  );
}

function Gauge({ label, value, i }) {
  const mounted = useMounted();
  const shown = useCountUp(value, 1200);
  const r = 46;
  const c = 2 * Math.PI * r;
  return (
    <div className="flex flex-col items-center gap-2 rounded-lg border border-gray-200 bg-white p-4">
      <div className="relative h-32 w-32">
        <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90" aria-hidden="true">
          <circle cx="60" cy="60" r={r} fill="none" stroke="#f3f4f6" strokeWidth="10" />
          <circle
            cx="60"
            cy="60"
            r={r}
            fill="none"
            stroke={SERIES[0]}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={c}
            strokeDashoffset={mounted ? c * (1 - value / 100) : c}
            style={{ transition: `stroke-dashoffset 1200ms ${EASE_IOS} ${i * 120}ms` }}
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-2xl font-normal tabular-nums text-gray-900">{Math.round(shown)}%</span>
      </div>
      <p className="text-center text-sm text-gray-600">{label}</p>
    </div>
  );
}

export function KpiDemo() {
  const [run, setRun] = useState(0);
  const set = kpiSets[run % kpiSets.length];
  const prev = run > 0 ? kpiSets[(run - 1) % kpiSets.length] : null;
  const gauges = gaugeSets[run % gaugeSets.length];

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button type="button" onClick={() => setRun((r) => r + 1)} className="inline-flex items-center gap-1.5 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 active:scale-95">
          <Icon name="refresh" className="h-4 w-4" />
          Refresh data
        </button>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpiDefs.map((d, i) => (
          <KpiTile key={d.key} def={d} value={set[d.key]} previous={prev?.[d.key]} run={run} i={i} />
        ))}
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        {gaugeDefs.map((label, i) => (
          <Gauge key={label} label={label} value={gauges[i]} i={i} />
        ))}
      </div>
    </div>
  );
}
