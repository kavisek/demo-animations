"use client";

// Shared building blocks for the iOS demos: a phone frame, its status bar,
// home indicator, and a two-column stage with controls beside the phone.
// The screen is 270 × 580 px; demos position things against that.
export const SCREEN_W = 270;
export const SCREEN_H = 580;

export function Phone({ children, screenClass = "bg-white text-gray-900", screenRef }) {
  return (
    <div className="relative mx-auto w-[290px] shrink-0 rounded-[52px] bg-gray-900 p-[10px] shadow-2xl ring-1 ring-gray-700">
      {/* Side buttons */}
      <span className="absolute left-[-3px] top-28 h-8 w-[3px] rounded-l bg-gray-700" />
      <span className="absolute left-[-3px] top-40 h-14 w-[3px] rounded-l bg-gray-700" />
      <span className="absolute right-[-3px] top-36 h-20 w-[3px] rounded-r bg-gray-700" />
      <div
        ref={screenRef}
        className={`relative isolate overflow-hidden rounded-[42px] font-sans ${screenClass}`}
        style={{ width: SCREEN_W, height: SCREEN_H }}
      >
        {children}
      </div>
    </div>
  );
}

export function StatusBar({ light = false }) {
  const tone = light ? "text-white" : "text-gray-900";
  const fill = light ? "bg-white" : "bg-gray-900";
  return (
    <div className={`pointer-events-none absolute inset-x-0 top-0 z-30 flex h-11 items-center justify-between px-7 pt-1 text-[13px] font-semibold ${tone}`}>
      <span>9:41</span>
      <span className="flex items-center gap-1.5">
        {/* Signal */}
        <span className="flex items-end gap-[2px]">
          {[4, 6, 8, 10].map((h) => (
            <span key={h} className={`w-[3px] rounded-xs ${fill}`} style={{ height: h }} />
          ))}
        </span>
        {/* Battery */}
        <span className={`relative h-[11px] w-[22px] rounded-[3px] border ${light ? "border-white/60" : "border-gray-900/50"} p-[1.5px]`}>
          <span className={`block h-full w-[75%] rounded-[1.5px] ${fill}`} />
        </span>
      </span>
    </div>
  );
}

// The resting Dynamic Island, for demos that don't animate it
export function Island() {
  return <span className="pointer-events-none absolute left-1/2 top-[10px] z-40 h-[28px] w-[92px] -translate-x-1/2 rounded-full bg-black" />;
}

export function HomeIndicator({ light = false, onClick, label = "Go home" }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!onClick}
      aria-label={label}
      className="absolute inset-x-0 bottom-0 z-40 flex h-6 items-center justify-center"
    >
      <span className={`h-[5px] w-28 rounded-full ${light ? "bg-white/90" : "bg-gray-900/80"}`} />
    </button>
  );
}

export function Wallpaper({ className = "" }) {
  return (
    <div
      className={`absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,#a78bfa,transparent_45%),radial-gradient(circle_at_80%_30%,#f472b6,transparent_40%),radial-gradient(circle_at_50%_90%,#38bdf8,transparent_50%)] bg-indigo-500 ${className}`}
    />
  );
}

// Phone on the left, controls and notes on the right
export function Stage({ phone, children }) {
  return (
    <div className="grid items-start gap-8 lg:grid-cols-[auto_minmax(0,1fr)]">
      <div className="rounded-xl bg-linear-to-b from-gray-100 to-gray-200/60 px-4 py-8">{phone}</div>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

export function Panel({ title, children }) {
  return (
    <section className="rounded-lg border border-gray-200 bg-white">
      <h2 className="border-b border-gray-100 px-5 py-3 text-sm font-medium text-gray-900">{title}</h2>
      <div className="p-5">{children}</div>
    </section>
  );
}

export function Notes({ items }) {
  return (
    <Panel title="How it works">
      <ul className="list-disc space-y-1.5 pl-5 text-sm text-gray-600">
        {items.map((t) => (
          <li key={t}>{t}</li>
        ))}
      </ul>
    </Panel>
  );
}

export function ControlButton({ active, onClick, children, disabled }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-pressed={active}
      className={`rounded-md border px-3 py-1.5 text-sm font-medium transition active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 ${
        active ? "border-blue-600 bg-blue-600 text-white" : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
      }`}
    >
      {children}
    </button>
  );
}
