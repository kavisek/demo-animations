"use client";

// Table- and data-focused demos. These need state (sorting, live updates,
// filtering), so unlike Demos.js this is a client module. Each demo is a named
// export: a server component can render client exports, but can't read
// properties off an object exported from a client module.
import { Fragment, useEffect, useLayoutEffect, useRef, useState } from "react";
import Icon from "@/components/Icon";

const th = "px-4 py-2.5 text-left text-xs font-medium uppercase tracking-wide text-gray-500";
const td = "px-4 py-2.5 text-sm";

function Card({ title, subtitle, actions, children }) {
  return (
    <section className="overflow-hidden rounded-lg border border-gray-200 bg-white">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 px-5 py-3">
        <div>
          <h2 className="text-sm font-medium text-gray-900">{title}</h2>
          {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </header>
      <div className="overflow-x-auto">{children}</div>
    </section>
  );
}

function Button({ icon, children, onClick, primary }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition active:scale-95 ${
        primary ? "bg-blue-600 text-white hover:bg-blue-700" : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
      }`}
    >
      {icon && <Icon name={icon} className="h-4 w-4" />}
      {children}
    </button>
  );
}

const instances = [
  { id: 1, name: "web-frontend-1", region: "us-central1", cpu: 72, memory: 3.8, cost: 41.2 },
  { id: 2, name: "api-gateway-1", region: "europe-west1", cpu: 38, memory: 1.9, cost: 18.75 },
  { id: 3, name: "batch-worker-3", region: "asia-east1", cpu: 95, memory: 7.6, cost: 88.1 },
  { id: 4, name: "auth-service-2", region: "us-east4", cpu: 21, memory: 0.9, cost: 9.4 },
  { id: 5, name: "search-indexer", region: "europe-west4", cpu: 64, memory: 5.2, cost: 52.3 },
  { id: 6, name: "image-resizer", region: "us-west1", cpu: 47, memory: 2.4, cost: 23.6 },
  { id: 7, name: "billing-cron", region: "us-central1", cpu: 12, memory: 0.5, cost: 4.15 },
];

const money = (n) => `$${n.toFixed(2)}`;
const delay = (ms) => ({ animationDelay: `${ms}ms` });

function StatusPill({ cpu }) {
  const [label, cls] =
    cpu >= 90 ? ["Hot", "bg-red-100 text-red-700"] : cpu >= 60 ? ["Busy", "bg-amber-100 text-amber-700"] : ["Healthy", "bg-green-100 text-green-700"];
  return <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${cls}`}>{label}</span>;
}

// --- Row add & remove ------------------------------------------------------
const newNames = ["cache-node", "queue-worker", "ml-inference", "log-shipper", "edge-proxy", "report-builder"];
const regions = ["us-central1", "europe-west1", "asia-east1", "us-east4", "australia-southeast1"];

export function RowsDemo() {
  const [rows, setRows] = useState(instances.slice(0, 5).map((r) => ({ ...r, state: "initial" })));
  const nextId = useRef(100);

  function addRow() {
    const id = nextId.current++;
    const row = {
      id,
      name: `${newNames[id % newNames.length]}-${id - 99}`,
      region: regions[id % regions.length],
      cpu: Math.round(10 + Math.random() * 85),
      memory: +(0.5 + Math.random() * 7).toFixed(1),
      cost: +(4 + Math.random() * 80).toFixed(2),
      state: "new",
    };
    setRows((r) => [row, ...r]);
  }

  const remove = (id) => setRows((r) => r.map((row) => (row.id === id ? { ...row, state: "removing" } : row)));

  return (
    <Card
      title="Instances"
      subtitle={`${rows.filter((r) => r.state !== "removing").length} rows`}
      actions={<Button icon="plus" primary onClick={addRow}>Add row</Button>}
    >
      <table className="w-full min-w-[640px]">
        <thead className="bg-gray-50">
          <tr>
            <th className={th}>Name</th>
            <th className={th}>Region</th>
            <th className={th}>CPU</th>
            <th className={th}>Cost / day</th>
            <th className={th}><span className="sr-only">Actions</span></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {rows.map((r, i) => (
            <tr
              key={r.id}
              style={r.state === "initial" ? delay(i * 80) : undefined}
              onAnimationEnd={(e) => {
                if (e.target === e.currentTarget && r.state === "removing") {
                  setRows((rs) => rs.filter((x) => x.id !== r.id));
                }
              }}
              className={
                r.state === "removing" ? "animate-fade-out" : r.state === "new" ? "animate-row-insert" : "animate-fade-up"
              }
            >
              <td className={`${td} font-mono text-gray-900`}>{r.name}</td>
              <td className={`${td} text-gray-600`}>{r.region}</td>
              <td className={td}><StatusPill cpu={r.cpu} /> <span className="ml-1 tabular-nums text-gray-600">{r.cpu}%</span></td>
              <td className={`${td} tabular-nums text-gray-900`}>{money(r.cost)}</td>
              <td className={`${td} text-right`}>
                <button
                  type="button"
                  onClick={() => remove(r.id)}
                  aria-label={`Delete ${r.name}`}
                  className="rounded-full p-1.5 text-gray-400 transition hover:bg-red-50 hover:text-red-600"
                >
                  <Icon name="trash" className="h-4 w-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}

// --- Sort & reorder (FLIP) -------------------------------------------------
const sortColumns = [
  { key: "name", label: "Name" },
  { key: "region", label: "Region" },
  { key: "cpu", label: "CPU %" },
  { key: "memory", label: "Memory (GB)" },
  { key: "cost", label: "Cost / day" },
];

export function SortDemo() {
  const [sort, setSort] = useState({ key: "cost", dir: "desc" });
  const rowEls = useRef(new Map());
  const before = useRef(new Map());

  const sorted = [...instances].sort((a, b) => {
    const cmp = typeof a[sort.key] === "string" ? a[sort.key].localeCompare(b[sort.key]) : a[sort.key] - b[sort.key];
    return sort.dir === "asc" ? cmp : -cmp;
  });

  function sortBy(key) {
    // First: remember where every row is before React reorders them
    rowEls.current.forEach((el, id) => before.current.set(id, el.getBoundingClientRect().top));
    setSort((s) => ({ key, dir: s.key === key && s.dir === "asc" ? "desc" : "asc" }));
  }

  // Last, Invert, Play: offset each row back to where it was, then animate to 0
  useLayoutEffect(() => {
    rowEls.current.forEach((el, id) => {
      const prev = before.current.get(id);
      if (prev == null) return;
      const dy = prev - el.getBoundingClientRect().top;
      if (!dy) return;
      el.style.transition = "none";
      el.style.transform = `translateY(${dy}px)`;
      el.getBoundingClientRect(); // force a reflow so the offset is applied first
      el.style.transition = "transform 500ms cubic-bezier(0.2, 0.8, 0.2, 1)";
      el.style.transform = "";
    });
    before.current.clear();
  }, [sort]);

  return (
    <Card title="Click a column to sort" subtitle={`Sorted by ${sort.key}, ${sort.dir === "asc" ? "ascending" : "descending"}`}>
      <table className="w-full min-w-[640px]">
        <thead className="bg-gray-50">
          <tr>
            {sortColumns.map((c) => {
              const active = sort.key === c.key;
              return (
                <th key={c.key} className={th} aria-sort={active ? (sort.dir === "asc" ? "ascending" : "descending") : "none"}>
                  <button
                    type="button"
                    onClick={() => sortBy(c.key)}
                    className={`group inline-flex items-center gap-1 uppercase transition-colors hover:text-gray-900 ${active ? "text-blue-700" : ""}`}
                  >
                    {c.label}
                    <Icon
                      name="up"
                      className={`h-3.5 w-3.5 transition-all duration-300 ${active ? "opacity-100" : "opacity-0 group-hover:opacity-40"} ${
                        active && sort.dir === "desc" ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {sorted.map((r) => (
            <tr
              key={r.id}
              ref={(el) => (el ? rowEls.current.set(r.id, el) : rowEls.current.delete(r.id))}
              className="relative border-t border-gray-100 bg-white"
            >
              <td className={`${td} font-mono text-gray-900`}>{r.name}</td>
              <td className={`${td} text-gray-600`}>{r.region}</td>
              <td className={`${td} tabular-nums`}>{r.cpu}</td>
              <td className={`${td} tabular-nums`}>{r.memory.toFixed(1)}</td>
              <td className={`${td} tabular-nums font-medium`}>{money(r.cost)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}

// --- Live cell updates -----------------------------------------------------
const tickerStart = [
  { id: "compute", name: "Compute", unit: "$/hr", value: 412.5, decimals: 2 },
  { id: "storage", name: "Storage", unit: "TB", value: 38.42, decimals: 2 },
  { id: "egress", name: "Network egress", unit: "GB/s", value: 2.81, decimals: 2 },
  { id: "rps", name: "Requests", unit: "req/s", value: 18240, decimals: 0 },
  { id: "latency", name: "p95 latency", unit: "ms", value: 142, decimals: 0 },
  { id: "errors", name: "Error rate", unit: "%", value: 0.42, decimals: 2 },
];

export function LiveDemo() {
  const [rows, setRows] = useState(tickerStart.map((r) => ({ ...r, open: r.value, dir: 0, tick: 0 })));
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => {
      setRows((rs) =>
        rs.map((r) => {
          if (Math.random() > 0.45) return r; // only some cells change each tick
          const next = +(r.value * (1 + (Math.random() - 0.5) * 0.06)).toFixed(r.decimals);
          return next === r.value ? r : { ...r, value: next, dir: next > r.value ? 1 : -1, tick: r.tick + 1 };
        }),
      );
    }, 1000);
    return () => clearInterval(t);
  }, [paused]);

  return (
    <Card
      title="Live metrics"
      subtitle="A few cells update every second"
      actions={
        <Button icon={paused ? "play" : "pause"} onClick={() => setPaused((p) => !p)}>
          {paused ? "Resume" : "Pause"}
        </Button>
      }
    >
      <table className="w-full min-w-[560px]">
        <thead className="bg-gray-50">
          <tr>
            <th className={th}>Metric</th>
            <th className={`${th} text-right`}>Value</th>
            <th className={`${th} text-right`}>Change</th>
            <th className={th}>Unit</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {rows.map((r) => {
            const change = ((r.value - r.open) / r.open) * 100;
            const flash = r.dir > 0 ? "animate-flash-up" : r.dir < 0 ? "animate-flash-down" : "";
            return (
              <tr key={r.id}>
                <td className={`${td} font-medium text-gray-900`}>{r.name}</td>
                {/* A new key remounts the cell, which restarts its flash animation */}
                <td key={`v${r.tick}`} className={`${td} text-right font-mono tabular-nums ${flash}`}>
                  <span className="inline-flex items-center gap-1">
                    {r.dir !== 0 && (
                      <Icon name="up" className={`h-3.5 w-3.5 ${r.dir > 0 ? "text-green-600" : "rotate-180 text-red-600"}`} />
                    )}
                    {r.value.toLocaleString(undefined, { minimumFractionDigits: r.decimals, maximumFractionDigits: r.decimals })}
                  </span>
                </td>
                <td
                  key={`c${r.tick}`}
                  className={`${td} text-right font-mono tabular-nums ${change > 0 ? "text-green-700" : change < 0 ? "text-red-700" : "text-gray-500"} ${flash}`}
                >
                  {change > 0 ? "+" : ""}
                  {change.toFixed(2)}%
                </td>
                <td className={`${td} text-gray-500`}>{r.unit}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </Card>
  );
}

// --- Expandable rows -------------------------------------------------------
const deployments = [
  { id: "d-1042", service: "web-frontend", status: "Succeeded", when: "2 min ago", commit: "a1f9c3e", duration: "1m 48s", steps: ["Build image", "Run tests", "Roll out 3/3 instances"] },
  { id: "d-1041", service: "api-gateway", status: "Rolling out", when: "6 min ago", commit: "77be210", duration: "—", steps: ["Build image", "Run tests", "Roll out 1/4 instances"] },
  { id: "d-1040", service: "batch-worker", status: "Failed", when: "21 min ago", commit: "c40d9aa", duration: "3m 02s", steps: ["Build image", "Run tests: 2 failed"] },
  { id: "d-1039", service: "auth-service", status: "Succeeded", when: "1 hr ago", commit: "5e8f0b1", duration: "58s", steps: ["Build image", "Run tests", "Roll out 2/2 instances"] },
];
const statusTone = {
  Succeeded: "bg-green-100 text-green-700",
  "Rolling out": "bg-blue-100 text-blue-700",
  Failed: "bg-red-100 text-red-700",
};

export function ExpandDemo() {
  const [open, setOpen] = useState(new Set(["d-1041"]));
  const toggle = (id) =>
    setOpen((s) => {
      const n = new Set(s);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });

  return (
    <Card title="Deployments" subtitle="Click a row to see its details">
      <table className="w-full min-w-[600px]">
        <thead className="bg-gray-50">
          <tr>
            <th className={`${th} w-10`}><span className="sr-only">Expand</span></th>
            <th className={th}>ID</th>
            <th className={th}>Service</th>
            <th className={th}>Status</th>
            <th className={th}>Started</th>
          </tr>
        </thead>
        <tbody>
          {deployments.map((d) => {
            const isOpen = open.has(d.id);
            return (
              <Fragment key={d.id}>
                <tr
                  onClick={() => toggle(d.id)}
                  className={`cursor-pointer border-t border-gray-100 transition-colors hover:bg-gray-50 ${isOpen ? "bg-blue-50/50" : ""}`}
                >
                  <td className="pl-4">
                    <button type="button" aria-expanded={isOpen} aria-label={`Toggle ${d.id} details`} className="flex items-center text-gray-500">
                      <Icon name="chevron" className={`h-4 w-4 transition-transform duration-300 ${isOpen ? "rotate-90 text-blue-700" : ""}`} />
                    </button>
                  </td>
                  <td className={`${td} font-mono text-gray-900`}>{d.id}</td>
                  <td className={`${td} text-gray-700`}>{d.service}</td>
                  <td className={td}>
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusTone[d.status]}`}>{d.status}</span>
                  </td>
                  <td className={`${td} text-gray-500`}>{d.when}</td>
                </tr>
                <tr>
                  <td colSpan={5} className="p-0">
                    {/* Animating grid rows from 0fr to 1fr transitions to the content's natural height */}
                    <div className={`grid transition-[grid-template-rows] duration-300 ease-out ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                      <div className="overflow-hidden">
                        <div className={`grid gap-4 bg-gray-50 px-14 py-4 text-sm transition-opacity duration-300 sm:grid-cols-3 ${isOpen ? "opacity-100" : "opacity-0"}`}>
                          <div>
                            <p className="text-xs uppercase tracking-wide text-gray-500">Commit</p>
                            <p className="font-mono text-gray-900">{d.commit}</p>
                          </div>
                          <div>
                            <p className="text-xs uppercase tracking-wide text-gray-500">Duration</p>
                            <p className="text-gray-900">{d.duration}</p>
                          </div>
                          <div>
                            <p className="text-xs uppercase tracking-wide text-gray-500">Steps</p>
                            <ol className="list-inside list-decimal text-gray-700">
                              {d.steps.map((s) => <li key={s}>{s}</li>)}
                            </ol>
                          </div>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              </Fragment>
            );
          })}
        </tbody>
      </table>
    </Card>
  );
}

// --- Table loading ---------------------------------------------------------
const shimmer = "animate-shimmer rounded-sm bg-linear-to-r from-gray-100 via-gray-200 to-gray-100 bg-size-[200%_100%]";

export function LoadingDemo() {
  const [loading, setLoading] = useState(true);
  const [run, setRun] = useState(0);

  useEffect(() => {
    if (!loading) return;
    const t = setTimeout(() => setLoading(false), 1800);
    return () => clearTimeout(t);
  }, [loading, run]);

  function reload() {
    setLoading(true);
    setRun((n) => n + 1); // restarts the timer even if a load is already in progress
  }

  return (
    <Card
      title="Billing by service"
      subtitle={loading ? "Loading…" : `${instances.length} rows`}
      actions={<Button icon="replay" onClick={reload}>Reload</Button>}
    >
      <table className="w-full min-w-[600px]">
        <thead className="bg-gray-50">
          <tr>
            <th className={th}>Name</th>
            <th className={th}>Region</th>
            <th className={th}>Status</th>
            <th className={`${th} text-right`}>Cost / day</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {loading
            ? instances.map((r, i) => (
                <tr key={`s${r.id}`}>
                  <td className={td}><div className={`h-4 ${shimmer}`} style={{ width: `${55 + ((i * 17) % 35)}%` }} /></td>
                  <td className={td}><div className={`h-4 w-24 ${shimmer}`} /></td>
                  <td className={td}><div className={`h-5 w-16 rounded-full ${shimmer}`} /></td>
                  <td className={td}><div className={`ml-auto h-4 w-16 ${shimmer}`} /></td>
                </tr>
              ))
            : instances.map((r, i) => (
                <tr key={r.id} style={delay(i * 70)} className="animate-fade-up">
                  <td className={`${td} font-mono text-gray-900`}>{r.name}</td>
                  <td className={`${td} text-gray-600`}>{r.region}</td>
                  <td className={td}><StatusPill cpu={r.cpu} /></td>
                  <td className={`${td} text-right tabular-nums`}>{money(r.cost)}</td>
                </tr>
              ))}
        </tbody>
      </table>
    </Card>
  );
}

// --- Data bars, sparklines & heatmap --------------------------------------
const usage = [
  { service: "Compute", value: 8420, trend: [4, 6, 5, 7, 9, 8, 11, 10, 13] },
  { service: "Storage", value: 5130, trend: [6, 6, 7, 7, 8, 8, 8, 9, 9] },
  { service: "Networking", value: 3270, trend: [9, 7, 8, 6, 7, 5, 6, 4, 5] },
  { service: "Databases", value: 6890, trend: [3, 5, 4, 6, 8, 7, 9, 12, 11] },
  { service: "Functions", value: 1450, trend: [2, 3, 2, 4, 3, 5, 4, 6, 7] },
];
const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
// Deterministic "traffic" so server and client render the same heatmap
const heat = days.map((_, d) =>
  Array.from({ length: 12 }, (_, h) => {
    const daytime = Math.sin(((h - 2) / 11) * Math.PI);
    const weekday = d < 5 ? 1 : 0.45;
    return Math.max(0.06, Math.min(1, daytime * weekday * (0.75 + ((d * 7 + h * 3) % 5) * 0.07)));
  }),
);

function Sparkline({ points, delayMs }) {
  const max = Math.max(...points);
  const min = Math.min(...points);
  // viewBox matches the rendered size (112 × 32) so the pathLength draw animation isn't distorted
  const d = points.map((p, i) => `${2 + (i / (points.length - 1)) * 108},${28 - ((p - min) / (max - min || 1)) * 24}`).join(" ");
  const up = points.at(-1) >= points[0];
  return (
    <svg viewBox="0 0 112 32" className="h-8 w-28" aria-hidden="true">
      <polyline
        points={d}
        pathLength="1"
        fill="none"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={delay(delayMs)}
        className={`animate-draw [stroke-dasharray:1] ${up ? "stroke-green-600" : "stroke-red-500"}`}
      />
    </svg>
  );
}

export function DataBarsDemo() {
  const max = Math.max(...usage.map((u) => u.value));
  return (
    <div className="grid gap-6">
      <Card title="Monthly usage" subtitle="In-cell data bars and sparklines, like Excel conditional formatting">
        <table className="w-full min-w-[600px]">
          <thead className="bg-gray-50">
            <tr>
              <th className={th}>Service</th>
              <th className={`${th} w-1/2`}>Spend</th>
              <th className={th}>9-month trend</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {usage.map((u, i) => (
              <tr key={u.service}>
                <td className={`${td} font-medium text-gray-900`}>{u.service}</td>
                <td className={td}>
                  <div className="relative h-6 rounded-sm bg-gray-50">
                    <div
                      style={{ width: `${(u.value / max) * 100}%`, ...delay(i * 100) }}
                      className="absolute inset-y-0 left-0 origin-left animate-grow-x rounded-sm bg-linear-to-r from-blue-200 to-blue-500"
                    />
                    <span className="relative flex h-full items-center px-2 text-xs font-medium tabular-nums text-gray-900">
                      ${u.value.toLocaleString()}
                    </span>
                  </div>
                </td>
                <td className={td}><Sparkline points={u.trend} delayMs={300 + i * 120} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <Card title="Requests by day and hour" subtitle="A colour scale that fills in diagonally">
        <div className="min-w-[560px] p-5">
          <div className="grid grid-cols-[40px_repeat(12,minmax(0,1fr))] gap-1">
            <span />
            {Array.from({ length: 12 }, (_, h) => (
              <span key={h} className="text-center text-[10px] text-gray-500">{String(h * 2).padStart(2, "0")}</span>
            ))}
            {days.map((day, d) => (
              <Fragment key={day}>
                <span className="flex items-center text-xs text-gray-500">{day}</span>
                {heat[d].map((v, h) => (
                  <span
                    key={h}
                    title={`${day} ${String(h * 2).padStart(2, "0")}:00 · ${Math.round(v * 1000)} req/s`}
                    style={{ backgroundColor: `rgba(37, 99, 235, ${v})`, ...delay((d + h) * 35) }}
                    className="h-7 animate-fade-in rounded-xs transition-transform hover:scale-110 hover:ring-2 hover:ring-blue-900/30"
                  />
                ))}
              </Fragment>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}

// --- Filter & search -------------------------------------------------------
const files = [
  { name: "q3-revenue.xlsx", owner: "finance", size: "2.4 MB", modified: "Today" },
  { name: "headcount-plan.xlsx", owner: "people-ops", size: "860 KB", modified: "Yesterday" },
  { name: "infra-costs.csv", owner: "platform", size: "12.1 MB", modified: "Mon" },
  { name: "customer-churn.parquet", owner: "analytics", size: "48.0 MB", modified: "Mon" },
  { name: "marketing-spend.xlsx", owner: "marketing", size: "1.1 MB", modified: "Last week" },
  { name: "latency-report.csv", owner: "platform", size: "5.6 MB", modified: "Last week" },
  { name: "q2-revenue.xlsx", owner: "finance", size: "2.2 MB", modified: "Jul 2" },
  { name: "survey-results.csv", owner: "research", size: "740 KB", modified: "Jun 18" },
];

function Highlight({ text, query }) {
  const i = query ? text.toLowerCase().indexOf(query.toLowerCase()) : -1;
  if (i < 0) return text;
  return (
    <>
      {text.slice(0, i)}
      <mark className="rounded-xs bg-yellow-200 px-0.5 text-gray-900">{text.slice(i, i + query.length)}</mark>
      {text.slice(i + query.length)}
    </>
  );
}

export function FilterDemo() {
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();
  const matches = (f) => !q || [f.name, f.owner].some((s) => s.toLowerCase().includes(q));
  const count = files.filter(matches).length;
  const cols = "grid grid-cols-[minmax(0,2fr)_minmax(0,1fr)_90px_100px] gap-4 px-4";

  return (
    <Card
      title="Shared datasets"
      subtitle={`Showing ${count} of ${files.length}`}
      actions={
        <label className="flex h-9 items-center gap-2 rounded-md border border-gray-300 px-2.5 transition focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100">
          <Icon name="filter" className="h-4 w-4 text-gray-500" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter, e.g. revenue or csv"
            aria-label="Filter datasets"
            className="w-48 bg-transparent text-sm focus:outline-hidden"
          />
        </label>
      }
    >
      <div className="min-w-[560px]">
        <div className={`${cols} bg-gray-50 py-2.5 text-xs font-medium uppercase tracking-wide text-gray-500`}>
          <span>Name</span><span>Owner</span><span>Size</span><span>Modified</span>
        </div>
        {files.map((f) => {
          const show = matches(f);
          return (
            // Each row collapses its height (grid 1fr → 0fr) and fades when filtered out
            <div
              key={f.name}
              aria-hidden={!show}
              className={`grid transition-all duration-300 ease-out ${show ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
            >
              <div className="overflow-hidden">
                <div className={`${cols} border-t border-gray-100 py-2.5 text-sm`}>
                  <span className="truncate font-mono text-gray-900"><Highlight text={f.name} query={q} /></span>
                  <span className="text-gray-600"><Highlight text={f.owner} query={q} /></span>
                  <span className="tabular-nums text-gray-600">{f.size}</span>
                  <span className="text-gray-500">{f.modified}</span>
                </div>
              </div>
            </div>
          );
        })}
        <div className={`grid transition-all duration-300 ${count === 0 ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
          <p className="overflow-hidden text-center text-sm text-gray-500">
            <span className="block py-8">No datasets match “{query}”.</span>
          </p>
        </div>
      </div>
    </Card>
  );
}

