"use client";

import { useEffect, useRef, useState } from "react";
import Icon from "@/components/Icon";
import { ControlButton, HomeIndicator, Island, Notes, Panel, Phone, Stage, StatusBar } from "@/components/ios/Phone";

function LargeTitle({ children, trailing }) {
  return (
    <div className="flex items-end justify-between px-4 pb-2 pt-14">
      <h3 className="text-[30px] font-bold">{children}</h3>
      {trailing}
    </div>
  );
}

// --- Swipe actions ---------------------------------------------------------
const emails = [
  { id: 1, from: "Deploy Bot", subject: "web-frontend deployed", preview: "Revision 42 is live in 3 regions. No errors in the first 5 minutes.", time: "9:38" },
  { id: 2, from: "Priya Shah", subject: "Motion review notes", preview: "Loved the spring on the island. Can we try it on the tab bar?", time: "9:12" },
  { id: 3, from: "Billing", subject: "Your November invoice", preview: "Compute was 12% lower than October thanks to autoscaling.", time: "Yesterday" },
  { id: 4, from: "Sam Lee", subject: "Lunch Friday?", preview: "There's a new ramen place near the office. 12:30 work?", time: "Yesterday" },
  { id: 5, from: "Design Weekly", subject: "Easing curves, explained", preview: "Why cubic-bezier(0.32, 0.72, 0, 1) feels so natural on iOS.", time: "Mon" },
  { id: 6, from: "Alex Kim", subject: "Re: chart colors", preview: "The validated palette passed every check. Shipping it!", time: "Sun" },
];
const ACTIONS_W = 156;

function SwipeRow({ mail, open, onOpen, onToggleRead, onDelete }) {
  const [x, setX] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [removing, setRemoving] = useState(false);
  const drag = useRef(null);

  // When another row opens, this one is no longer `open`, so it shows at 0 and slides closed
  const shownX = dragging || open || removing ? x : 0;

  function down(e) {
    if (removing) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = { startX: e.clientX, base: shownX, moved: false };
    setDragging(true);
  }
  function move(e) {
    const d = drag.current;
    if (!d) return;
    const dx = e.clientX - d.startX;
    if (Math.abs(dx) > 4) d.moved = true;
    let next = d.base + dx;
    if (next < -ACTIONS_W) next = -ACTIONS_W + (next + ACTIONS_W) * 0.35; // rubber band
    setX(Math.max(-260, Math.min(next, 110)));
  }
  function up() {
    const d = drag.current;
    drag.current = null;
    setDragging(false);
    if (!d) return;
    if (x < -230) return remove(); // full swipe deletes
    if (x < -60) {
      setX(-ACTIONS_W);
      onOpen(mail.id);
    } else {
      if (x > 70) onToggleRead(mail.id);
      setX(0);
      if (open) onOpen(null);
    }
  }
  function remove() {
    setX(-300);
    setRemoving(true);
  }

  const reveal = Math.min(1, Math.max(0, shownX / 70));

  return (
    <div
      onTransitionEnd={(e) => removing && e.propertyName === "grid-template-rows" && onDelete(mail.id)}
      className={`grid transition-[grid-template-rows] duration-300 ease-ios ${removing ? "grid-rows-[0fr]" : "grid-rows-[1fr]"}`}
    >
      <div className="relative overflow-hidden">
        {/* Left-swipe actions, under the row */}
        <div className="absolute inset-y-0 right-0 flex" style={{ width: Math.max(ACTIONS_W, -shownX) }}>
          <span className="flex flex-1 flex-col items-center justify-center bg-gray-400 text-[11px] text-white">
            <Icon name="more" className="h-5 w-5" />More
          </span>
          <span className="flex flex-1 flex-col items-center justify-center bg-orange-500 text-[11px] text-white">
            <Icon name="flag" className="h-5 w-5" />Flag
          </span>
          <button type="button" onClick={remove} className="flex flex-1 flex-col items-center justify-center bg-red-500 text-[11px] text-white" aria-label={`Delete ${mail.subject}`}>
            <Icon name="trash" className="h-5 w-5" />Trash
          </button>
        </div>
        {/* Right-swipe action */}
        <div className="absolute inset-y-0 left-0 flex items-center bg-blue-500 pl-5 text-white" style={{ width: Math.max(0, shownX) }}>
          <span className="flex flex-col items-center text-[11px] transition-transform duration-150" style={{ transform: `scale(${0.6 + reveal * 0.4})`, opacity: reveal }}>
            <Icon name="mail" className="h-5 w-5" />
            {mail.unread ? "Read" : "Unread"}
          </span>
        </div>

        <div
          onPointerDown={down}
          onPointerMove={move}
          onPointerUp={up}
          onPointerCancel={up}
          style={{ transform: `translateX(${shownX}px)` }}
          className={`relative flex touch-pan-y select-none gap-2 bg-white py-2.5 pl-2 pr-4 ${dragging ? "" : "transition-transform duration-300 ease-ios"}`}
        >
          <span className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full transition-all duration-300 ${mail.unread ? "scale-100 bg-blue-500" : "scale-0 bg-transparent"}`} />
          <div className="min-w-0 flex-1 border-b border-gray-200 pb-2.5">
            <div className="flex justify-between gap-2">
              <span className="truncate text-[15px] font-semibold">{mail.from}</span>
              <span className="shrink-0 text-[12px] text-gray-400">{mail.time}</span>
            </div>
            <p className="truncate text-[13px]">{mail.subject}</p>
            <p className="line-clamp-2 text-[12px] leading-snug text-gray-500">{mail.preview}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function SwipeActionsDemo() {
  const [list, setList] = useState(emails.map((m, i) => ({ ...m, unread: i < 3 })));
  const [openId, setOpenId] = useState(null);

  return (
    <Stage
      phone={
        <Phone screenClass="bg-white text-gray-900">
          <StatusBar />
          <Island />
          <div className="h-full overflow-y-auto pb-8">
            <LargeTitle trailing={<span className="mb-2 text-[13px] text-gray-500">{list.filter((m) => m.unread).length} unread</span>}>Inbox</LargeTitle>
            {list.map((m) => (
              <SwipeRow
                key={m.id}
                mail={m}
                open={openId === m.id}
                onOpen={setOpenId}
                onToggleRead={(id) => setList((l) => l.map((x) => (x.id === id ? { ...x, unread: !x.unread } : x)))}
                onDelete={(id) => setList((l) => l.filter((x) => x.id !== id))}
              />
            ))}
            {list.length === 0 && <p className="animate-fade-in px-4 py-16 text-center text-sm text-gray-400">No mail</p>}
          </div>
          <HomeIndicator />
        </Phone>
      }
    >
      <Panel title="Try it">
        <ul className="list-disc space-y-1 pl-5 text-sm text-gray-600">
          <li>Drag a row <strong>left</strong> to reveal More, Flag, and Trash. Keep going for a full-swipe delete.</li>
          <li>Drag a row <strong>right</strong> to toggle read and unread.</li>
        </ul>
        <div className="mt-3">
          <ControlButton onClick={() => { setList(emails.map((m, i) => ({ ...m, unread: i < 3 }))); setOpenId(null); }}>Reset inbox</ControlButton>
        </div>
      </Panel>
      <Notes
        items={[
          "The row follows the pointer with translateX while transitions are off, then snaps open (−156 px) or closed with ease-ios.",
          "Pulling past the actions rubber-bands at 35% speed, and the action area stretches to fill the gap.",
          "Deleting slides the row away, then collapses its height with grid-rows-[1fr] → grid-rows-[0fr] before removing it.",
        ]}
      />
    </Stage>
  );
}

// --- Pull to refresh -------------------------------------------------------
const feedSeed = [
  ["Build #1283 passed", "main · 2m 14s", "bg-green-500", "check"],
  ["New sign-up spike", "+38% in the last hour", "bg-blue-500", "chart"],
  ["Error rate normal", "0.4% across all services", "bg-gray-400", "pulse"],
  ["Weekly report ready", "Usage, costs, and latency", "bg-violet-500", "layers"],
  ["Cache warmed", "us-central1 · 12k keys", "bg-amber-500", "bolt"],
  ["Backup completed", "Nightly snapshot · 48 GB", "bg-teal-500", "check"],
];
const fresh = [
  ["Deploy finished", "web-frontend · revision 43", "bg-green-500", "bolt"],
  ["New comment", "Priya on 'Motion review'", "bg-pink-500", "chat"],
  ["Alert resolved", "Latency back under 150 ms", "bg-blue-500", "check"],
];
const PULL_TRIGGER = 70;

function Spinner({ progress, spinning }) {
  // Eight spokes appear one by one as you pull, then rotate in steps while loading
  const shown = spinning ? 8 : Math.round(progress * 8);
  return (
    <span className={`relative block h-6 w-6 ${spinning ? "animate-spin [animation-duration:0.8s] [animation-timing-function:steps(8)]" : ""}`}>
      {Array.from({ length: 8 }, (_, i) => (
        <span
          key={i}
          className="absolute left-1/2 top-0 -ml-[1.25px] h-[7px] w-[2.5px] origin-[50%_12px] rounded-full bg-gray-500 transition-opacity duration-100"
          style={{ transform: `rotate(${i * 45}deg)`, opacity: i < shown ? 1 - i * 0.09 : 0 }}
        />
      ))}
    </span>
  );
}

export function PullToRefreshDemo() {
  const [items, setItems] = useState(feedSeed.map((f, i) => ({ id: `s${i}`, f, fresh: false })));
  const [pull, setPull] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [dragging, setDragging] = useState(false);
  const listRef = useRef(null);
  const drag = useRef(null);
  const count = useRef(0);

  function refresh() {
    if (refreshing) return;
    setRefreshing(true);
    setPull(56);
    setTimeout(() => {
      const f = fresh[count.current % fresh.length];
      setItems((list) => [{ id: `f${count.current++}`, f, fresh: true }, ...list]);
      setRefreshing(false);
      setPull(0);
    }, 1400);
  }

  function down(e) {
    if (refreshing || listRef.current.scrollTop > 0) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = { startY: e.clientY };
    setDragging(true);
  }
  function move(e) {
    if (!drag.current) return;
    const dy = e.clientY - drag.current.startY;
    setPull(Math.max(0, dy * 0.5)); // resistance: the list moves half as far as your finger
  }
  function up() {
    if (!drag.current) return;
    drag.current = null;
    setDragging(false);
    if (pull >= PULL_TRIGGER) refresh();
    else setPull(0);
  }

  return (
    <Stage
      phone={
        <Phone screenClass="bg-white text-gray-900">
          <StatusBar />
          <Island />
          <LargeTitle>Activity</LargeTitle>
          <div className="absolute inset-x-0 top-[104px] flex justify-center" style={{ opacity: refreshing ? 1 : Math.min(1, pull / PULL_TRIGGER) }}>
            <span className="pt-3">
              <Spinner progress={Math.min(1, pull / PULL_TRIGGER)} spinning={refreshing} />
            </span>
          </div>
          <div
            ref={listRef}
            onPointerDown={down}
            onPointerMove={move}
            onPointerUp={up}
            onPointerCancel={up}
            style={{ transform: `translateY(${pull}px)` }}
            className={`absolute inset-x-0 bottom-0 top-[104px] touch-none select-none overflow-y-auto bg-white ${dragging ? "" : "transition-transform duration-500 ease-ios"}`}
          >
            {items.map(({ id, f: [title, meta, color, icon], fresh: isNew }) => (
              <div key={id} className={`flex items-center gap-3 px-4 py-2.5 ${isNew ? "animate-row-insert" : ""}`}>
                <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white ${color}`}>
                  <Icon name={icon} className="h-4 w-4" />
                </span>
                <span className="min-w-0 flex-1 border-b border-gray-200 pb-2.5">
                  <span className="block truncate text-[15px] font-medium">{title}</span>
                  <span className="block truncate text-[12px] text-gray-500">{meta}</span>
                </span>
              </div>
            ))}
          </div>
          <HomeIndicator />
        </Phone>
      }
    >
      <Panel title="Refresh">
        <div className="flex flex-wrap items-center gap-2">
          <ControlButton active onClick={refresh} disabled={refreshing}>{refreshing ? "Refreshing…" : "Pull to refresh"}</ControlButton>
          <span className="text-sm text-gray-500">or drag the list down in the phone</span>
        </div>
      </Panel>
      <Notes
        items={[
          "While you pull, the list moves at half your finger's speed, and the spinner's eight spokes appear one by one as you near the trigger.",
          "Past 70 px it refreshes: the list holds open and the spinner rotates with steps(8), so it ticks spoke by spoke like iOS.",
          "New rows enter with animate-row-insert: a fade in plus a highlight that settles.",
        ]}
      />
    </Stage>
  );
}

// --- Switches & controls ---------------------------------------------------
function Switch({ on, onChange, label }) {
  return (
    <button type="button" role="switch" aria-checked={on} aria-label={label} onClick={() => onChange(!on)} className="group relative h-[31px] w-[51px] shrink-0">
      <span className={`absolute inset-0 rounded-full transition-colors duration-300 ${on ? "bg-green-500" : "bg-gray-200"}`} />
      {/* The knob stretches while pressed, then springs across */}
      <span
        className={`absolute left-[2px] top-[2px] h-[27px] w-[27px] rounded-full bg-white shadow-[0_3px_8px_rgba(0,0,0,0.15),0_1px_1px_rgba(0,0,0,0.1)] transition-all duration-300 ease-spring group-active:w-[33px] ${
          on ? "translate-x-5 group-active:translate-x-[14px]" : ""
        }`}
      />
    </button>
  );
}

const ranges = ["Day", "Week", "Month"];
const usage = {
  Day: [3, 5, 2, 6, 8, 4, 7],
  Week: [6, 4, 7, 9, 5, 8, 6],
  Month: [8, 9, 6, 7, 10, 9, 8],
};

export function ControlsDemo() {
  const [toggles, setToggles] = useState({ dark: false, notify: true, low: false });
  const [range, setRange] = useState(1);
  const [size, setSize] = useState(17);
  const set = (k) => (v) => setToggles((t) => ({ ...t, [k]: v }));
  const bars = usage[ranges[range]];

  return (
    <Stage
      phone={
        <Phone screenClass={`transition-colors duration-500 ${toggles.dark ? "bg-black text-white" : "bg-gray-100 text-gray-900"}`}>
          <StatusBar light={toggles.dark} />
          <Island />
          <div className="h-full overflow-y-auto pb-8">
            <LargeTitle>Screen Time</LargeTitle>

            <div className={`mx-4 rounded-xl p-3 transition-colors duration-500 ${toggles.dark ? "bg-gray-900" : "bg-white"}`}>
              {/* Segmented control: the white pill slides under the selected label */}
              <div className={`relative grid grid-cols-3 rounded-[9px] p-[2px] text-[13px] font-medium ${toggles.dark ? "bg-gray-800" : "bg-gray-200/80"}`}>
                <span
                  className={`absolute bottom-[2px] left-[2px] top-[2px] w-[calc((100%-4px)/3)] rounded-[7px] shadow transition-transform duration-300 ease-ios ${toggles.dark ? "bg-gray-600" : "bg-white"}`}
                  style={{ transform: `translateX(${range * 100}%)` }}
                />
                {ranges.map((r, i) => (
                  <button key={r} type="button" onClick={() => setRange(i)} className="relative z-10 py-1">
                    {r}
                  </button>
                ))}
              </div>
              <div className="mt-4 flex h-24 items-end justify-between gap-1.5 px-1">
                {bars.map((v, i) => (
                  <span key={i} className="flex-1 rounded-t-[4px] bg-blue-500 transition-[height] duration-500 ease-spring" style={{ height: `${v * 10}%`, transitionDelay: `${i * 30}ms` }} />
                ))}
              </div>
              <div className="mt-1 flex justify-between px-1 text-[10px] text-gray-400">
                {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => <span key={i} className="flex-1 text-center">{d}</span>)}
              </div>
            </div>

            <div className={`mx-4 mt-5 overflow-hidden rounded-xl transition-colors duration-500 ${toggles.dark ? "bg-gray-900" : "bg-white"}`}>
              {[
                ["dark", "Dark Mode"],
                ["notify", "Notifications"],
                ["low", "Low Power Mode"],
              ].map(([k, label]) => (
                <div key={k} className={`flex items-center justify-between border-b px-3 py-2 text-[15px] last:border-0 ${toggles.dark ? "border-gray-800" : "border-gray-200"}`}>
                  {label}
                  <Switch on={toggles[k]} onChange={set(k)} label={label} />
                </div>
              ))}
              <div className="flex items-center justify-between px-3 py-2 text-[15px]">
                <span>
                  Text Size <span key={size} className="inline-block animate-hud-in font-semibold tabular-nums">{size}</span>
                </span>
                <span className={`flex overflow-hidden rounded-lg ${toggles.dark ? "bg-gray-800" : "bg-gray-200/80"}`}>
                  <button type="button" onClick={() => setSize((s) => Math.max(12, s - 1))} className="px-3 py-1 active:bg-black/10" aria-label="Smaller">
                    <Icon name="minus" className="h-4 w-4" />
                  </button>
                  <span className={`w-px ${toggles.dark ? "bg-gray-700" : "bg-gray-300"}`} />
                  <button type="button" onClick={() => setSize((s) => Math.min(28, s + 1))} className="px-3 py-1 active:bg-black/10" aria-label="Larger">
                    <Icon name="plus" className="h-4 w-4" />
                  </button>
                </span>
              </div>
            </div>
            <p className="mx-4 mt-3 text-gray-500 transition-all duration-300" style={{ fontSize: size * 0.8 }}>
              Preview text grows and shrinks with the stepper.
            </p>
          </div>
          <HomeIndicator light={toggles.dark} />
        </Phone>
      }
    >
      <Panel title="Try it">
        <p className="text-sm text-gray-600">
          Use the controls in the phone. Press and hold a switch to see the knob stretch before it springs across. Dark Mode recolors the whole screen.
        </p>
      </Panel>
      <Notes
        items={[
          "Switch knob: translate-x-5 with ease-spring; while pressed, group-active:w-[33px] stretches it like the real control.",
          "The segmented control's pill moves with translateX(index × 100%), while the labels sit above it.",
          "Chart bars spring to new heights with a 30 ms stagger when the range changes. The stepper value pops with a keyed animation.",
        ]}
      />
    </Stage>
  );
}

// --- Chat bubbles ----------------------------------------------------------
const script = [
  ["Did the new animations ship?", "Yes! The spring curves are live 🎉"],
  ["How does the island morph?", "One element; width, height, and radius all transition together."],
  ["And the typing dots?", "Three bounces offset by 150 ms each. Like these!"],
  ["Nice. Lunch?", "Ramen at 12:30 👍"],
];

export function ChatDemo() {
  const [messages, setMessages] = useState([{ id: 0, me: false, text: "Hey! Want a tour of the motion demos?" }]);
  const [typing, setTyping] = useState(false);
  const [step, setStep] = useState(0);
  const [delivered, setDelivered] = useState(null);
  const scrollRef = useRef(null);
  const timers = useRef([]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, typing]);

  const busy = typing || step >= script.length;
  const after = (ms, fn) => timers.current.push(setTimeout(fn, ms));

  function send() {
    if (busy) return;
    const [mine, reply] = script[step];
    const id = Date.now();
    setMessages((m) => [...m, { id, me: true, text: mine }]);
    setDelivered(id);
    setStep((s) => s + 1);
    after(700, () => setTyping(true));
    after(2100, () => {
      setTyping(false);
      setMessages((m) => [...m, { id: id + 1, me: false, text: reply }]);
    });
  }

  function reset() {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setMessages([{ id: 0, me: false, text: "Hey! Want a tour of the motion demos?" }]);
    setTyping(false);
    setStep(0);
    setDelivered(null);
  }

  return (
    <Stage
      phone={
        <Phone screenClass="bg-white text-gray-900">
          <StatusBar />
          <Island />
          <div className="absolute inset-x-0 top-0 z-10 flex flex-col items-center border-b border-gray-200 bg-gray-50/90 pb-2 pt-12 backdrop-blur">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-gray-300 to-gray-500 text-xs font-semibold text-white">MC</span>
            <span className="text-[11px] text-gray-600">Motion Crew</span>
          </div>
          <div ref={scrollRef} className="absolute inset-x-0 bottom-14 top-[104px] space-y-1.5 overflow-y-auto px-3 py-3">
            {messages.map((m) => (
              <div key={m.id} className={`flex flex-col ${m.me ? "items-end" : "items-start"}`}>
                <p
                  className={`max-w-[75%] animate-bubble-in rounded-[18px] px-3 py-1.5 text-[15px] leading-snug ${
                    m.me ? "origin-bottom-right rounded-br-[6px] bg-blue-500 text-white" : "origin-bottom-left rounded-bl-[6px] bg-gray-200 text-gray-900"
                  }`}
                >
                  {m.text}
                </p>
                {m.me && delivered === m.id && (
                  <span style={{ animationDelay: "400ms" }} className="mr-1 mt-0.5 animate-fade-in text-[10px] text-gray-400">Delivered</span>
                )}
              </div>
            ))}
            {typing && (
              <div className="flex">
                <span className="flex origin-bottom-left animate-bubble-in items-center gap-1 rounded-[18px] rounded-bl-[6px] bg-gray-200 px-3.5 py-3">
                  {[0, 1, 2].map((i) => (
                    <span key={i} style={{ animationDelay: `${i * 150}ms` }} className="h-2 w-2 animate-bounce rounded-full bg-gray-400" />
                  ))}
                </span>
              </div>
            )}
          </div>
          <div className="absolute inset-x-0 bottom-0 flex items-center gap-2 border-t border-gray-200 bg-white px-3 pb-6 pt-2">
            <span className="flex-1 truncate rounded-full border border-gray-300 px-3 py-1.5 text-[14px] text-gray-500">
              {step < script.length ? script[step][0] : "Message"}
            </span>
            <button
              type="button"
              onClick={send}
              disabled={busy}
              aria-label="Send"
              className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 text-white transition active:scale-90 disabled:bg-gray-300"
            >
              <Icon name="send" className="h-4 w-4" />
            </button>
          </div>
          <HomeIndicator />
        </Phone>
      }
    >
      <Panel title="Conversation">
        <div className="flex flex-wrap gap-2">
          <ControlButton active onClick={send} disabled={busy}>Send next message</ControlButton>
          <ControlButton onClick={reset}>Restart</ControlButton>
        </div>
        <p className="mt-3 text-sm text-gray-500">Or tap the blue send button in the phone.</p>
      </Panel>
      <Notes
        items={[
          "Bubbles use animate-bubble-in: they rise 18 px and scale up from 85% with a spring, anchored at their tail corner (origin-bottom-right or bottom-left).",
          "The typing indicator is three animate-bounce dots offset by 150 ms, in a bubble that pops in the same way.",
          "'Delivered' fades in 400 ms after the bubble, and the thread scrolls with behavior: smooth.",
        ]}
      />
    </Stage>
  );
}
