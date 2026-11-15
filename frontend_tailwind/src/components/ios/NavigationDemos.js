"use client";

import { useRef, useState } from "react";
import Icon from "@/components/Icon";
import { ControlButton, HomeIndicator, Island, Notes, Panel, Phone, SCREEN_H, Stage, StatusBar } from "@/components/ios/Phone";

// --- Push navigation -------------------------------------------------------
const screens = [
  {
    title: "Settings",
    sections: [
      [
        { label: "Wi-Fi", value: "Office", icon: "orbit", color: "bg-blue-500" },
        { label: "Notifications", icon: "bell", color: "bg-red-500" },
        { label: "General", icon: "settings", color: "bg-gray-500", push: true },
        { label: "Display & Brightness", icon: "sun", color: "bg-blue-600" },
      ],
      [
        { label: "Wallpaper", icon: "photo", color: "bg-cyan-500" },
        { label: "Privacy & Security", icon: "toggle", color: "bg-blue-700" },
        { label: "Battery", icon: "bolt", color: "bg-green-500" },
      ],
    ],
  },
  {
    title: "General",
    sections: [
      [
        { label: "About", push: true },
        { label: "Software Update", value: "1" },
      ],
      [{ label: "Storage" }, { label: "Background Refresh" }, { label: "Date & Time" }, { label: "Keyboard" }, { label: "Language & Region" }],
    ],
  },
  {
    title: "About",
    sections: [
      [
        { label: "Name", value: "Motion Phone" },
        { label: "Software Version", value: "26.1" },
        { label: "Model Name", value: "Demo Pro" },
      ],
      [{ label: "Songs", value: "1,204" }, { label: "Photos", value: "8,317" }, { label: "Capacity", value: "256 GB" }],
    ],
  },
];

function NavScreen({ screen, index, depth, onPush, onBack }) {
  const [scrolled, setScrolled] = useState(false);
  // Screens below the top shift 30% left; screens above it wait off to the right
  const x = index < depth ? "-30%" : index === depth ? "0%" : "100%";

  return (
    <div
      aria-hidden={index !== depth}
      style={{ transform: `translateX(${x})` }}
      className={`absolute inset-0 bg-gray-100 transition-transform duration-500 ease-ios ${index > 0 ? "shadow-[-10px_0_30px_rgba(0,0,0,0.12)]" : ""}`}
    >
      {/* Nav bar: the small centered title fades in once the large title scrolls away */}
      <div className={`absolute inset-x-0 top-0 z-20 flex h-[88px] items-end px-3 pb-2 transition-colors duration-200 ${scrolled ? "border-b border-gray-300/70 bg-gray-100/90 backdrop-blur" : ""}`}>
        {index > 0 && (
          <button type="button" onClick={onBack} className="flex items-center text-[17px] text-blue-600 active:opacity-50">
            <Icon name="back" className="-ml-1 h-6 w-6" />
            {screens[index - 1].title}
          </button>
        )}
        <span className={`pointer-events-none absolute inset-x-0 bottom-2.5 text-center text-[17px] font-semibold transition-opacity duration-200 ${scrolled ? "opacity-100" : "opacity-0"}`}>
          {screen.title}
        </span>
      </div>

      <div onScroll={(e) => setScrolled(e.currentTarget.scrollTop > 36)} className="h-full overflow-y-auto pb-10 pt-[88px]">
        <h3 className={`px-4 pb-2 text-[30px] font-bold transition-opacity duration-200 ${scrolled ? "opacity-0" : "opacity-100"}`}>{screen.title}</h3>
        {screen.sections.map((rows, s) => (
          <div key={s} className="mx-4 mb-6 overflow-hidden rounded-xl bg-white">
            {rows.map((row) => (
              <button
                key={row.label}
                type="button"
                onClick={row.push ? onPush : undefined}
                className={`flex w-full items-center gap-3 px-3 py-2.5 text-left text-[15px] ${row.push ? "active:bg-gray-200" : "cursor-default"}`}
              >
                {row.icon && (
                  <span className={`flex h-7 w-7 items-center justify-center rounded-[7px] text-white ${row.color}`}>
                    <Icon name={row.icon} className="h-4 w-4" />
                  </span>
                )}
                <span className="flex flex-1 items-center justify-between border-b border-gray-200 pb-2.5 -mb-2.5">
                  <span>{row.label}</span>
                  <span className="flex items-center gap-1 text-gray-400">
                    {row.value && <span className="text-[15px]">{row.value}</span>}
                    {row.push && <Icon name="chevron" className="h-4 w-4" />}
                  </span>
                </span>
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function PushNavigationDemo() {
  const [depth, setDepth] = useState(0);
  const push = () => setDepth((d) => Math.min(d + 1, screens.length - 1));
  const back = () => setDepth((d) => Math.max(d - 1, 0));

  return (
    <Stage
      phone={
        <Phone screenClass="bg-gray-100 text-gray-900">
          <StatusBar />
          <Island />
          {screens.map((s, i) => (
            <NavScreen key={s.title} screen={s} index={i} depth={depth} onPush={push} onBack={back} />
          ))}
          <HomeIndicator />
        </Phone>
      }
    >
      <Panel title="Navigation stack">
        <div className="flex flex-wrap items-center gap-2">
          <ControlButton onClick={back} disabled={depth === 0}>Back</ControlButton>
          <ControlButton onClick={push} disabled={depth === screens.length - 1}>Push next screen</ControlButton>
          <span className="text-sm text-gray-500">
            {screens.slice(0, depth + 1).map((s) => s.title).join(" › ")}
          </span>
        </div>
        <p className="mt-3 text-sm text-gray-500">In the phone, tap General, then About. Scroll a screen to see its large title collapse into the bar.</p>
      </Panel>
      <Notes
        items={[
          "Every screen in the stack is always mounted. Only its translateX changes: 100% waiting, 0 on top, −30% underneath.",
          "The underneath screen moving less than the top one gives the parallax depth iOS uses, and the top screen casts a shadow to the left.",
          "The large title fades out on scroll and a small centered title fades into a blurred bar.",
        ]}
      />
    </Stage>
  );
}

// --- Bottom sheet ----------------------------------------------------------
const detents = { large: 56, medium: 300, peek: 480 }; // sheet top, in px from the screen's top
const places = [
  ["Corner Coffee", "Café · 0.2 mi", "bg-amber-500"],
  ["Riverside Park", "Park · 1.4 mi", "bg-green-600"],
  ["Harbor Market", "Market · 2.1 mi", "bg-blue-500"],
  ["Paper Lantern Books", "Bookstore · 2.6 mi", "bg-rose-500"],
  ["Sunrise Bakery", "Bakery · 3.0 mi", "bg-orange-500"],
  ["Science Museum", "Museum · 3.3 mi", "bg-violet-500"],
];

function FakeMap() {
  return (
    <div className="absolute inset-0 bg-[#e9efe6]">
      {/* Blocks and roads */}
      <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_46px,#fff_46px,#fff_54px,transparent_54px),linear-gradient(0deg,transparent_62px,#fff_62px,#fff_70px,transparent_70px)] bg-[length:100px_110px]" />
      <div className="absolute -left-10 top-40 h-6 w-[400px] rotate-[24deg] bg-amber-200" />
      <div className="absolute left-12 top-24 h-24 w-28 rounded-2xl bg-green-200/80" />
      <div className="absolute bottom-0 right-0 h-40 w-40 rounded-tl-[60px] bg-sky-200" />
      <span className="absolute left-[126px] top-[180px] text-red-500">
        <Icon name="pin" className="h-8 w-8 animate-bounce drop-shadow" />
      </span>
    </div>
  );
}

export function BottomSheetDemo() {
  const [top, setTop] = useState(detents.medium);
  const [dragging, setDragging] = useState(false);
  const drag = useRef(null);

  function onPointerDown(e) {
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = { startY: e.clientY, startTop: top, lastY: e.clientY, lastT: performance.now(), v: 0 };
    setDragging(true);
  }
  function onPointerMove(e) {
    const d = drag.current;
    if (!d) return;
    const now = performance.now();
    d.v = (e.clientY - d.lastY) / Math.max(1, now - d.lastT); // px per ms
    d.lastY = e.clientY;
    d.lastT = now;
    let next = d.startTop + (e.clientY - d.startY);
    // Rubber-band past the large detent
    if (next < detents.large) next = detents.large - (detents.large - next) * 0.3;
    setTop(Math.min(next, SCREEN_H - 60));
  }
  function onPointerUp() {
    const d = drag.current;
    drag.current = null;
    setDragging(false);
    if (!d) return;
    // Project where a flick would land, then snap to the nearest detent
    const projected = top + d.v * 180;
    const nearest = Object.values(detents).reduce((a, b) => (Math.abs(b - projected) < Math.abs(a - projected) ? b : a));
    setTop(nearest);
  }

  const dim = Math.max(0, Math.min(1, (detents.medium - top) / (detents.medium - detents.large)));
  const current = Object.entries(detents).find(([, v]) => v === top)?.[0];

  return (
    <Stage
      phone={
        <Phone screenClass="bg-white text-gray-900">
          <FakeMap />
          <StatusBar />
          <Island />
          <div className="pointer-events-none absolute inset-0 z-10 bg-black" style={{ opacity: dim * 0.25 }} />
          <div
            style={{ transform: `translateY(${top}px)` }}
            className={`absolute inset-x-0 top-0 z-20 h-full rounded-t-[14px] bg-white/95 shadow-[0_-4px_24px_rgba(0,0,0,0.15)] backdrop-blur-xl ${
              dragging ? "" : "transition-transform duration-500 ease-ios"
            }`}
          >
            <div
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerCancel={onPointerUp}
              className="cursor-grab touch-none select-none px-4 pb-3 pt-2 active:cursor-grabbing"
            >
              <span className="mx-auto mb-3 block h-[5px] w-9 rounded-full bg-gray-300" />
              <div className="flex items-center gap-2 rounded-xl bg-gray-200/70 px-3 py-2 text-[15px] text-gray-500">
                <Icon name="search" className="h-4 w-4" />
                Search places
              </div>
            </div>
            <div className="h-[calc(100%-140px)] overflow-y-auto px-4">
              <p className="pb-2 text-[13px] font-semibold text-gray-500">Nearby</p>
              {places.map(([name, meta, color]) => (
                <div key={name} className="flex items-center gap-3 border-b border-gray-200 py-2.5">
                  <span className={`flex h-9 w-9 items-center justify-center rounded-full text-white ${color}`}>
                    <Icon name="pin" className="h-4 w-4" />
                  </span>
                  <span>
                    <span className="block text-[15px] font-medium">{name}</span>
                    <span className="block text-[12px] text-gray-500">{meta}</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
          <HomeIndicator />
        </Phone>
      }
    >
      <Panel title="Detents">
        <div className="flex flex-wrap gap-2">
          {Object.entries(detents).map(([name, value]) => (
            <ControlButton key={name} active={current === name} onClick={() => setTop(value)}>
              {name[0].toUpperCase() + name.slice(1)}
            </ControlButton>
          ))}
        </div>
        <p className="mt-3 text-sm text-gray-500">Drag the sheet by its handle or search bar. A quick flick carries it to the next height.</p>
      </Panel>
      <Notes
        items={[
          "The sheet is positioned with translateY. While you drag, transitions are off so it follows the pointer exactly.",
          "On release, the drag velocity projects where the sheet would land, and it snaps to the nearest detent with ease-ios.",
          "Pulling above the top detent rubber-bands at 30% speed, and the map dims as the sheet rises.",
        ]}
      />
    </Stage>
  );
}
