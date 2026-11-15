"use client";

import { useEffect, useRef, useState } from "react";
import Icon from "@/components/Icon";
import { ControlButton, HomeIndicator, Island, Notes, Panel, Phone, SCREEN_H, SCREEN_W, Stage, StatusBar, Wallpaper } from "@/components/ios/Phone";

function LockClock() {
  return (
    <div className="pointer-events-none absolute inset-x-0 top-24 z-10 text-center text-white">
      <p className="text-sm font-medium opacity-90">Sunday, November 15</p>
      <p className="text-7xl font-semibold tracking-tight">9:41</p>
    </div>
  );
}

// --- Dynamic Island --------------------------------------------------------
const islandModes = {
  idle: { w: 92, h: 28, r: 14 },
  timer: { w: 200, h: 34, r: 17 },
  music: { w: 200, h: 34, r: 17 },
  expanded: { w: 252, h: 168, r: 44 },
  call: { w: 252, h: 76, r: 38 },
};

function WaveBars({ className = "bg-pink-400" }) {
  return (
    <span className="flex h-3.5 items-end gap-[2px]">
      {[0, 1, 2, 3].map((i) => (
        <span key={i} style={{ animationDelay: `${i * -0.25}s` }} className={`h-full w-[3px] origin-bottom animate-wave rounded-sm ${className}`} />
      ))}
    </span>
  );
}

export function DynamicIslandDemo() {
  const [mode, setMode] = useState("music");
  const [seconds, setSeconds] = useState(299);
  const { w, h, r } = islandModes[mode];

  useEffect(() => {
    if (mode !== "timer") return;
    const t = setInterval(() => setSeconds((s) => (s > 0 ? s - 1 : 299)), 1000);
    return () => clearInterval(t);
  }, [mode]);

  const timeLeft = `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;

  return (
    <Stage
      phone={
        <Phone screenClass="bg-black text-white">
          <Wallpaper />
          <StatusBar light />
          <LockClock />
          <button
            type="button"
            onClick={() => setMode((m) => (m === "music" ? "expanded" : m === "expanded" ? "music" : m))}
            aria-label="Dynamic Island"
            style={{ width: w, height: h, borderRadius: r }}
            className="absolute left-1/2 top-[10px] z-40 -translate-x-1/2 overflow-hidden bg-black text-left shadow-lg transition-all duration-500 ease-spring"
          >
            {/* Content fades in after the shape has mostly settled; key restarts it per mode */}
            <div key={mode} style={{ animationDelay: "180ms" }} className="h-full w-full animate-fade-in">
              {mode === "timer" && (
                <div className="flex h-full items-center justify-between px-3">
                  <Icon name="timer" className="h-5 w-5 text-orange-400" />
                  <span className="font-mono text-sm tabular-nums text-orange-400">{timeLeft}</span>
                </div>
              )}
              {mode === "music" && (
                <div className="flex h-full items-center justify-between px-2.5">
                  <span className="h-6 w-6 rounded-md bg-gradient-to-br from-pink-500 to-orange-400" />
                  <WaveBars />
                </div>
              )}
              {mode === "expanded" && (
                <div className="flex h-full flex-col justify-between p-5">
                  <div className="flex items-center gap-3">
                    <span className="h-12 w-12 animate-gradient-pan rounded-xl bg-gradient-to-br from-pink-500 via-fuchsia-500 to-orange-400 bg-[length:200%_200%]" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold">Latency Lullaby</p>
                      <p className="truncate text-xs text-white/60">The Load Balancers</p>
                    </div>
                    <WaveBars />
                  </div>
                  <div>
                    <div className="h-1 overflow-hidden rounded-full bg-white/20">
                      <div className="h-full w-2/5 rounded-full bg-white" />
                    </div>
                    <div className="mt-1 flex justify-between text-[10px] text-white/50">
                      <span>1:24</span>
                      <span>-2:07</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-center gap-8 text-white">
                    <Icon name="back" className="h-5 w-5" />
                    <Icon name="pause" className="h-6 w-6" />
                    <Icon name="chevron" className="h-5 w-5" />
                  </div>
                </div>
              )}
              {mode === "call" && (
                <div className="flex h-full items-center gap-3 px-4">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-gray-600 text-sm font-semibold">JR</span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] text-white/60">mobile</p>
                    <p className="truncate text-sm font-semibold">Jordan Rivera</p>
                  </div>
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-red-500">
                    <Icon name="call" className="h-5 w-5 rotate-[135deg]" />
                  </span>
                  <span className="flex h-10 w-10 animate-pulse items-center justify-center rounded-full bg-green-500">
                    <Icon name="call" className="h-5 w-5" />
                  </span>
                </div>
              )}
            </div>
          </button>
          <HomeIndicator light />
        </Phone>
      }
    >
      <Panel title="Live activity">
        <div className="flex flex-wrap gap-2">
          {[
            ["idle", "Idle"],
            ["timer", "Timer"],
            ["music", "Music"],
            ["expanded", "Music (expanded)"],
            ["call", "Incoming call"],
          ].map(([id, label]) => (
            <ControlButton key={id} active={mode === id} onClick={() => setMode(id)}>
              {label}
            </ControlButton>
          ))}
        </div>
        <p className="mt-3 text-sm text-gray-500">Tip: while music is playing, tap the island itself to expand or collapse it.</p>
      </Panel>
      <Notes
        items={[
          "The island is one element. Its width, height, and border-radius change per state, with transition-all duration-500.",
          "ease-spring (cubic-bezier(0.34, 1.56, 0.64, 1)) overshoots slightly, which gives the iOS 'blob' feel.",
          "Content is keyed by state and fades in after a 180 ms delay, so it appears once the shape has nearly settled.",
        ]}
      />
    </Stage>
  );
}

// --- Notification banners --------------------------------------------------
const sources = [
  { app: "Deploy Bot", icon: "bolt", color: "bg-blue-600", title: "web-frontend is live", body: "Revision 42 rolled out to 3 regions." },
  { app: "Calendar", icon: "calendar", color: "bg-red-500", title: "Design review in 10 minutes", body: "Room 4B · Motion Console v2" },
  { app: "Messages", icon: "chat", color: "bg-green-500", title: "Sam", body: "Those spring curves look great 🎉" },
  { app: "Weather", icon: "sun", color: "bg-sky-500", title: "Rain starting soon", body: "Light rain in about 20 minutes." },
  { app: "Wallet", icon: "wallet", color: "bg-gray-800", title: "Payment received", body: "$24.00 from Alex for lunch." },
];

function Banner({ n, compact }) {
  return (
    <div className="flex items-start gap-2.5 rounded-[20px] bg-white/75 p-3 text-gray-900 shadow-lg ring-1 ring-black/5 backdrop-blur-xl">
      <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-[9px] text-white ${n.color}`}>
        <Icon name={n.icon} className="h-4 w-4" />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex justify-between gap-2 text-[11px] text-gray-500">
          <span className="font-medium uppercase tracking-wide">{n.app}</span>
          <span>now</span>
        </div>
        <p className="truncate text-[13px] font-semibold">{n.title}</p>
        {!compact && <p className="line-clamp-2 text-[12px] text-gray-700">{n.body}</p>}
      </div>
    </div>
  );
}

export function NotificationsDemo() {
  const [banners, setBanners] = useState([]);
  const [stack, setStack] = useState([]);
  const [expanded, setExpanded] = useState(false);
  const next = useRef(0);
  const timers = useRef(new Set());

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  function later(fn, ms) {
    const t = setTimeout(() => {
      timers.current.delete(t);
      fn();
    }, ms);
    timers.current.add(t);
  }

  function send() {
    const id = next.current++;
    const n = { ...sources[id % sources.length], id, leaving: false };
    setBanners((b) => [n, ...b].slice(0, 3));
    // After a few seconds the banner slides away and joins the lock-screen stack
    later(() => setBanners((b) => b.map((x) => (x.id === id ? { ...x, leaving: true } : x))), 3500);
    later(() => {
      setBanners((b) => b.filter((x) => x.id !== id));
      setStack((s) => [n, ...s].slice(0, 6));
    }, 3850);
  }

  const visibleStack = expanded ? stack : stack.slice(0, 3);

  return (
    <Stage
      phone={
        <Phone screenClass="bg-black">
          <Wallpaper />
          <StatusBar light />
          <Island />
          <LockClock />
          <div className="absolute inset-x-2 top-12 z-30 space-y-2">
            {banners.map((n) => (
              <div
                key={n.id}
                className={`transition-all duration-300 ease-in ${n.leaving ? "-translate-y-6 opacity-0" : ""}`}
              >
                <div className="animate-banner-in">
                  <Banner n={n} />
                </div>
              </div>
            ))}
          </div>

          {/* Lock-screen stack: cards behind the first shrink and peek out below it */}
          {stack.length > 0 && (
            <button
              type="button"
              onClick={() => setExpanded((e) => !e)}
              className="absolute inset-x-3 bottom-12 z-20 text-left"
              aria-label={expanded ? "Collapse notifications" : "Expand notifications"}
            >
              <div className="relative" style={{ height: expanded ? visibleStack.length * 66 : 72 }}>
                {visibleStack.map((n, i) => (
                  <div
                    key={n.id}
                    className="absolute inset-x-0 bottom-0 transition-all duration-500 ease-ios"
                    style={{
                      transform: expanded
                        ? `translateY(${-i * 66}px)`
                        : `translateY(${i * 8}px) scale(${1 - i * 0.05})`,
                      zIndex: 10 - i,
                      opacity: expanded || i < 3 ? 1 - (expanded ? 0 : i * 0.15) : 0,
                    }}
                  >
                    <Banner n={n} compact />
                  </div>
                ))}
              </div>
            </button>
          )}
          <HomeIndicator light />
        </Phone>
      }
    >
      <Panel title="Notifications">
        <div className="flex flex-wrap gap-2">
          <ControlButton active onClick={send}>Send a notification</ControlButton>
          <ControlButton onClick={() => { send(); setTimeout(send, 250); setTimeout(send, 500); }}>Send three</ControlButton>
          <ControlButton onClick={() => setStack([])} disabled={!stack.length}>Clear stack</ControlButton>
        </div>
        <p className="mt-3 text-sm text-gray-500">Banners move to the stack at the bottom after a few seconds. Tap the stack to fan it out.</p>
      </Panel>
      <Notes
        items={[
          "New banners use animate-banner-in: they drop from above the screen with a slight spring overshoot.",
          "Leaving banners transition to -translate-y-6 and opacity-0, then are removed from state.",
          "The stack translates each card down 8 px and scales it 5% smaller; expanding transitions them into a list.",
        ]}
      />
    </Stage>
  );
}

// --- App launch & jiggle ---------------------------------------------------
const apps = [
  ["Mail", "mail", "from-sky-400 to-blue-600"],
  ["Calendar", "calendar", "from-white to-gray-100 text-red-500"],
  ["Photos", "photo", "from-amber-300 to-pink-500"],
  ["Camera", "camera", "from-gray-300 to-gray-500"],
  ["Maps", "map", "from-green-300 to-emerald-500"],
  ["Weather", "sun", "from-sky-300 to-blue-500"],
  ["Music", "music", "from-pink-500 to-rose-600"],
  ["Wallet", "wallet", "from-gray-800 to-black"],
  ["Messages", "chat", "from-lime-400 to-green-500"],
  ["Timer", "timer", "from-orange-400 to-amber-600"],
  ["Charts", "chart", "from-teal-400 to-cyan-600"],
  ["Settings", "settings", "from-gray-400 to-gray-600"],
];
const dock = [
  ["Phone", "call", "from-lime-400 to-green-500"],
  ["Mail", "mail", "from-sky-400 to-blue-600"],
  ["Browser", "orbit", "from-sky-300 to-indigo-500"],
  ["Music", "music", "from-pink-500 to-rose-600"],
];

function AppIcon({ app, jiggle, i, onOpen, label = true }) {
  const [name, icon, gradient] = app;
  return (
    <button
      type="button"
      data-app={name}
      onClick={(e) => onOpen(e.currentTarget.querySelector("[data-tile]"), app)}
      className="relative flex flex-col items-center gap-1"
      aria-label={`Open ${name}`}
    >
      <span
        data-tile
        style={{ animationDelay: `${(i % 3) * -0.09}s` }}
        className={`flex h-[52px] w-[52px] items-center justify-center rounded-[14px] bg-gradient-to-br text-white shadow-md transition-transform active:scale-90 ${gradient} ${
          jiggle ? "animate-jiggle" : ""
        }`}
      >
        <Icon name={icon} className="h-6 w-6" />
      </span>
      {jiggle && (
        <span className="absolute -left-1 -top-1 flex h-5 w-5 animate-hud-in items-center justify-center rounded-full bg-gray-300/90 text-gray-700 shadow">
          <Icon name="minus" className="h-3 w-3" />
        </span>
      )}
      {label && <span className="text-[11px] font-medium text-white drop-shadow">{name}</span>}
    </button>
  );
}

export function AppLaunchDemo() {
  const screenRef = useRef(null);
  const [jiggle, setJiggle] = useState(false);
  const [launch, setLaunch] = useState(null); // { app, from: rect, phase: "from" | "open" | "closing" }

  function open(tile, app) {
    if (jiggle || launch) return;
    const s = screenRef.current.getBoundingClientRect();
    const t = tile.getBoundingClientRect();
    setLaunch({ app, from: { left: t.left - s.left, top: t.top - s.top, width: t.width, height: t.height }, phase: "from" });
    // Two frames: render at the icon's rect first, then transition to full screen
    requestAnimationFrame(() => requestAnimationFrame(() => setLaunch((l) => l && { ...l, phase: "open" })));
  }

  const close = () => setLaunch((l) => l && { ...l, phase: "closing" });
  const isOpen = launch?.phase === "open";
  const rect = isOpen ? { left: 0, top: 0, width: SCREEN_W, height: SCREEN_H } : launch?.from;

  return (
    <Stage
      phone={
        <Phone screenClass="bg-black" screenRef={screenRef}>
          <Wallpaper />
          <StatusBar light />
          <Island />
          <div className={`absolute inset-0 transition-all duration-500 ease-ios ${isOpen ? "scale-[0.88] opacity-40 blur-[1px]" : ""}`}>
            {jiggle && (
              <button
                type="button"
                onClick={() => setJiggle(false)}
                className="absolute right-4 top-11 z-20 animate-hud-in rounded-full bg-white/30 px-3 py-0.5 text-xs font-semibold text-white backdrop-blur"
              >
                Done
              </button>
            )}
            <div className="grid grid-cols-4 gap-x-3 gap-y-4 px-5 pt-[72px]">
              {apps.map((a, i) => (
                <AppIcon key={a[0]} app={a} i={i} jiggle={jiggle} onOpen={open} />
              ))}
            </div>
            <div className="absolute inset-x-3 bottom-7 flex justify-around rounded-[28px] bg-white/25 px-2 py-3 backdrop-blur-xl">
              {dock.map((a, i) => (
                <AppIcon key={a[0]} app={a} i={i + 1} jiggle={jiggle} onOpen={open} label={false} />
              ))}
            </div>
          </div>

          {launch && (
            <div
              onTransitionEnd={(e) => {
                if (e.propertyName === "width" && launch.phase === "closing") setLaunch(null);
              }}
              style={{ ...rect, borderRadius: isOpen ? 42 : 14 }}
              className={`absolute z-30 overflow-hidden bg-gradient-to-br text-white shadow-2xl transition-all duration-500 ease-ios ${launch.app[2]}`}
            >
              <div className={`flex h-full flex-col items-center justify-center gap-3 transition-opacity duration-300 ${isOpen ? "opacity-100 delay-150" : "opacity-0"}`}>
                <Icon name={launch.app[1]} className="h-14 w-14" />
                <p className="text-xl font-semibold">{launch.app[0]}</p>
                <p className="text-xs opacity-80">Tap the home bar to go back</p>
              </div>
            </div>
          )}
          <HomeIndicator light onClick={launch ? close : undefined} />
        </Phone>
      }
    >
      <Panel title="Home screen">
        <div className="flex flex-wrap gap-2">
          <ControlButton active={jiggle} onClick={() => { setJiggle((j) => !j); close(); }}>
            {jiggle ? "Done editing" : "Edit home screen"}
          </ControlButton>
          <ControlButton onClick={close} disabled={!launch}>Go home</ControlButton>
        </div>
        <p className="mt-3 text-sm text-gray-500">Tap any app icon to launch it, then tap the home bar at the bottom to close it.</p>
      </Panel>
      <Notes
        items={[
          "Launch measures the tapped icon, renders the app at exactly that rectangle, then on the next frame transitions it to full screen.",
          "Closing reverses the transition and removes the app on transitionend, so it lands back on its icon.",
          "The home screen scales to 88% and dims behind the app. Edit mode adds animate-jiggle with alternating delays so icons don't move in sync.",
        ]}
      />
    </Stage>
  );
}

// --- Alerts, action sheets & HUDs -----------------------------------------
function SettingsList() {
  return (
    <div className="px-4 pt-14">
      <p className="mb-3 text-[28px] font-bold">Photos</p>
      <div className="grid grid-cols-3 gap-1">
        {Array.from({ length: 12 }, (_, i) => (
          <span
            key={i}
            className="aspect-square rounded-sm"
            style={{ background: `hsl(${(i * 37) % 360} 70% ${70 - (i % 3) * 8}%)` }}
          />
        ))}
      </div>
    </div>
  );
}

export function AlertsDemo() {
  const [alert, setAlert] = useState("hidden"); // hidden | shown | closing
  const [sheet, setSheet] = useState(false);
  const [hud, setHud] = useState(0);

  useEffect(() => {
    if (alert !== "closing") return;
    const t = setTimeout(() => setAlert("hidden"), 250);
    return () => clearTimeout(t);
  }, [alert]);

  useEffect(() => {
    if (!hud) return;
    const t = setTimeout(() => setHud(0), 1600);
    return () => clearTimeout(t);
  }, [hud]);

  const dim = alert === "shown" || sheet;
  const action = (fn) => () => {
    setSheet(false);
    setAlert((a) => (a === "shown" ? "closing" : a));
    fn?.();
  };

  return (
    <Stage
      phone={
        <Phone screenClass="bg-white text-gray-900">
          <StatusBar />
          <Island />
          <SettingsList />

          <div onClick={action()} className={`absolute inset-0 z-30 bg-black/40 transition-opacity duration-300 ${dim ? "opacity-100" : "pointer-events-none opacity-0"}`} />

          {/* Alert: scales down from 115% as it fades in */}
          <div
            role="alertdialog"
            aria-hidden={alert !== "shown"}
            className={`absolute left-1/2 top-1/2 z-40 w-[232px] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl bg-white/90 text-center backdrop-blur-xl transition-all duration-300 ease-out ${
              alert === "shown" ? "scale-100 opacity-100" : alert === "closing" ? "pointer-events-none scale-95 opacity-0" : "pointer-events-none scale-[1.15] opacity-0"
            }`}
          >
            <div className="px-4 pb-4 pt-5">
              <p className="text-[15px] font-semibold">Delete 12 photos?</p>
              <p className="mt-1 text-[12px] text-gray-600">These photos will be moved to Recently Deleted.</p>
            </div>
            <div className="grid grid-cols-2 border-t border-gray-300/70 text-[15px]">
              <button type="button" onClick={action()} className="border-r border-gray-300/70 py-2.5 text-blue-600 active:bg-gray-200">Cancel</button>
              <button type="button" onClick={action(() => setHud((n) => n + 1))} className="py-2.5 font-semibold text-red-600 active:bg-gray-200">Delete</button>
            </div>
          </div>

          {/* Action sheet: slides up from below the screen */}
          <div className={`absolute inset-x-2 bottom-2 z-40 space-y-2 transition-transform duration-500 ease-ios ${sheet ? "translate-y-0" : "translate-y-[calc(100%+16px)]"}`}>
            <div className="overflow-hidden rounded-2xl bg-white/90 text-center text-[17px] text-blue-600 backdrop-blur-xl">
              <p className="border-b border-gray-300/70 px-4 py-3 text-[12px] text-gray-500">Share 12 photos</p>
              {["Send to nearby device", "Copy link", "Save to Files"].map((label) => (
                <button key={label} type="button" onClick={action(() => setHud((n) => n + 1))} className="block w-full border-b border-gray-300/70 py-3 last:border-0 active:bg-gray-200">
                  {label}
                </button>
              ))}
            </div>
            <button type="button" onClick={action()} className="block w-full rounded-2xl bg-white py-3 text-[17px] font-semibold text-blue-600 active:bg-gray-200">
              Cancel
            </button>
          </div>

          {/* HUD: pops in, draws a checkmark, then fades */}
          {hud > 0 && (
            <div key={hud} className="pointer-events-none absolute left-1/2 top-1/2 z-50 -ml-[70px] -mt-[70px] flex h-[140px] w-[140px] animate-hud-in flex-col items-center justify-center gap-2 rounded-3xl bg-gray-900/80 text-white backdrop-blur-xl">
              <svg viewBox="0 0 24 24" className="h-14 w-14" aria-hidden="true">
                <path d="m5 12.5 4.5 4.5L19 7.5" pathLength="1" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ animationDelay: "120ms" }} className="animate-draw [stroke-dasharray:1]" />
              </svg>
              <p className="text-sm font-semibold">Done</p>
            </div>
          )}
          <HomeIndicator />
        </Phone>
      }
    >
      <Panel title="Show">
        <div className="flex flex-wrap gap-2">
          <ControlButton active={alert === "shown"} onClick={() => { setSheet(false); setAlert("shown"); }}>Alert</ControlButton>
          <ControlButton active={sheet} onClick={() => { setAlert("hidden"); setSheet(true); }}>Action sheet</ControlButton>
          <ControlButton onClick={() => setHud((n) => n + 1)}>HUD</ControlButton>
        </div>
        <p className="mt-3 text-sm text-gray-500">Choosing Delete or a share option shows the HUD. Tap the dimmed background to dismiss.</p>
      </Panel>
      <Notes
        items={[
          "Alerts enter from scale-[1.15] to scale-100 while fading in, and leave by shrinking to 95% as they fade out.",
          "The action sheet sits at translate-y-[calc(100%+16px)] and slides to 0 with ease-ios.",
          "The HUD pops in with a spring, and its checkmark draws using pathLength=1 and a stroke-dashoffset animation.",
        ]}
      />
    </Stage>
  );
}
