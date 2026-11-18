"use client";

import { useEffect, useRef, useState } from "react";
import Icon from "@/components/Icon";
import { Notes } from "@/components/ios/Phone";
import { Avatar, Credit, MissingVideo, Odometer, SAMPLE_SRC, VIDEOS, formatViews, useSampleVideo } from "@/components/video/VideoKit";

function Burst({ color = "bg-blue-600" }) {
  return (
    <span className="pointer-events-none absolute inset-0">
      {Array.from({ length: 8 }, (_, i) => {
        const a = (i / 8) * Math.PI * 2;
        return (
          <span
            key={i}
            className={`absolute left-1/2 top-1/2 -ml-[3px] -mt-[3px] h-1.5 w-1.5 animate-burst rounded-full ${color}`}
            style={{ "--dx": `${Math.cos(a) * 22}px`, "--dy": `${Math.sin(a) * 22}px` }}
          />
        );
      })}
    </span>
  );
}

function Toast({ toast, onUndo }) {
  if (!toast) return null;
  return (
    <div key={toast.id} role="status" className="absolute bottom-4 left-4 z-20 flex animate-fade-up items-center gap-4 rounded-lg bg-gray-900 px-4 py-3 text-sm text-white shadow-xl">
      {toast.text}
      {toast.undo && (
        <button type="button" onClick={onUndo} className="font-semibold text-sky-300 hover:text-sky-200">
          Undo
        </button>
      )}
    </div>
  );
}

// --- Like & subscribe ------------------------------------------------------
export function LikeSubscribeDemo() {
  const status = useSampleVideo();
  const video = VIDEOS[1];
  const [vote, setVote] = useState(null); // "up" | "down" | null
  const [likes, setLikes] = useState(12480);
  const [burstId, setBurstId] = useState(0);
  const [subscribed, setSubscribed] = useState(false);
  const [subs, setSubs] = useState(482391);
  const [bell, setBell] = useState("all"); // all | personalized | none
  const [ringId, setRingId] = useState(0);
  const [menu, setMenu] = useState(false);
  const [saved, setSaved] = useState(false);
  const [toast, setToast] = useState(null);
  const seq = useRef(0); // unique keys for replaying animations
  const nextId = () => ++seq.current;

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3200);
    return () => clearTimeout(t);
  }, [toast]);

  const show = (text, undo) => setToast({ id: nextId(), text, undo });

  function voteUp() {
    if (vote === "up") {
      setVote(null);
      setLikes((n) => n - 1);
    } else {
      setVote("up");
      setLikes((n) => n + 1);
      setBurstId(nextId());
    }
  }
  function voteDown() {
    if (vote === "up") setLikes((n) => n - 1);
    setVote(vote === "down" ? null : "down");
  }
  function subscribe() {
    if (subscribed) return setMenu((m) => !m);
    setSubscribed(true);
    setSubs((n) => n + 1);
    setBell("all");
    setRingId(nextId());
    show(`Subscribed to ${video.channel}`);
  }
  function chooseBell(value) {
    setBell(value);
    setMenu(false);
    if (value !== "none") setRingId(nextId());
  }
  function unsubscribe() {
    setSubscribed(false);
    setSubs((n) => n - 1);
    setMenu(false);
    show(`Unsubscribed from ${video.channel}`);
  }
  function toggleSave() {
    const next = !saved;
    setSaved(next);
    show(next ? "Saved to Watch later" : "Removed from Watch later", next);
  }

  return (
    <div className="space-y-4">
      <div className="relative mx-auto max-w-3xl space-y-3 rounded-xl border border-gray-200 bg-white p-4">
        <div className="aspect-video overflow-hidden rounded-xl bg-black">
          {status === "missing" ? <MissingVideo /> : <video src={`${SAMPLE_SRC}#t=${video.start}`} muted playsInline preload="metadata" className="h-full w-full scale-[1.3] object-cover" />}
        </div>
        <p className="text-lg font-semibold text-gray-900">{video.title}</p>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Avatar name={video.channel} className="h-10 w-10 text-sm" />
            <div>
              <p className="text-sm font-semibold text-gray-900">{video.channel}</p>
              <p className="text-xs text-gray-500">
                <Odometer value={subs} /> subscribers
              </p>
            </div>
            <div className="relative ml-2">
              <button
                type="button"
                onClick={subscribe}
                aria-expanded={subscribed ? menu : undefined}
                className={`inline-flex h-9 items-center gap-1.5 rounded-full px-4 text-sm font-medium transition-colors duration-300 active:scale-95 ${
                  subscribed ? "bg-gray-100 text-gray-900 hover:bg-gray-200" : "bg-gray-900 text-white hover:bg-gray-700"
                }`}
              >
                {subscribed && (
                  <span key={ringId} className="origin-top animate-ring">
                    <Icon name={bell === "none" ? "bell-off" : "bell"} filled={bell === "all"} className="h-5 w-5" />
                  </span>
                )}
                <span key={subscribed ? "yes" : "no"} className="animate-fade-in">
                  {subscribed ? "Subscribed" : "Subscribe"}
                </span>
                {subscribed && <Icon name="dropdown" className={`h-4 w-4 transition-transform duration-200 ${menu ? "rotate-180" : ""}`} />}
              </button>
              {menu && (
                <div role="menu" className="absolute left-0 top-11 z-10 w-52 origin-top-left animate-pop-in overflow-hidden rounded-xl bg-white py-2 text-sm shadow-xl ring-1 ring-black/10">
                  {[
                    ["all", "bell", "All"],
                    ["personalized", "bell", "Personalized"],
                    ["none", "bell-off", "None"],
                  ].map(([value, icon, label]) => (
                    <button key={value} type="button" role="menuitemradio" aria-checked={bell === value} onClick={() => chooseBell(value)} className="flex w-full items-center gap-3 px-4 py-2 text-left hover:bg-gray-100">
                      <Icon name={icon} filled={value === "all"} className="h-5 w-5 text-gray-700" />
                      <span className="flex-1">{label}</span>
                      {bell === value && <Icon name="check" className="h-4 w-4 text-blue-700" />}
                    </button>
                  ))}
                  <hr className="my-1 border-gray-200" />
                  <button type="button" role="menuitem" onClick={unsubscribe} className="flex w-full items-center gap-3 px-4 py-2 text-left hover:bg-gray-100">
                    <Icon name="close" className="h-5 w-5 text-gray-700" />
                    Unsubscribe
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex h-9 items-center rounded-full bg-gray-100">
              <button type="button" onClick={voteUp} aria-pressed={vote === "up"} aria-label="Like" className="relative flex h-full items-center gap-2 rounded-l-full pl-3 pr-3 text-sm font-medium transition hover:bg-gray-200 active:scale-95">
                <span key={vote === "up" ? "on" : "off"} className={`relative ${vote === "up" ? "animate-hud-in text-blue-700" : ""}`}>
                  <Icon name="thumb-up" filled={vote === "up"} className="h-5 w-5" />
                  {vote === "up" && burstId > 0 && <Burst key={burstId} />}
                </span>
                <Odometer value={likes} />
              </button>
              <span className="h-5 w-px bg-gray-300" />
              <button type="button" onClick={voteDown} aria-pressed={vote === "down"} aria-label="Dislike" className="flex h-full items-center rounded-r-full px-3 transition hover:bg-gray-200 active:scale-95">
                <span key={vote === "down" ? "on" : "off"} className={vote === "down" ? "animate-hud-in" : ""}>
                  <Icon name="thumb-down" filled={vote === "down"} className="h-5 w-5" />
                </span>
              </button>
            </div>
            <button type="button" onClick={() => show("Link copied")} className="inline-flex h-9 items-center gap-2 rounded-full bg-gray-100 px-3 text-sm font-medium transition hover:bg-gray-200 active:scale-95">
              <Icon name="share" className="h-5 w-5" />
              Share
            </button>
            <button type="button" onClick={toggleSave} aria-pressed={saved} className="inline-flex h-9 items-center gap-2 rounded-full bg-gray-100 px-3 text-sm font-medium transition hover:bg-gray-200 active:scale-95">
              <span key={saved ? "on" : "off"} className={saved ? "animate-hud-in" : ""}>
                <Icon name="bookmark" filled={saved} className="h-5 w-5" />
              </span>
              {saved ? "Saved" : "Save"}
            </button>
          </div>
        </div>
        <p className="text-xs text-gray-500">{formatViews(video.views)} · {video.age}</p>
        <Toast toast={toast} onUndo={toggleSave} />
      </div>
      <div className="mx-auto max-w-3xl">
        <Credit />
      </div>
      <Notes
        items={[
          "Liking pops the thumb (animate-hud-in) and bursts eight particles outward, each with its own --dx and --dy, while the count rolls like an odometer.",
          "Subscribe turns into 'Subscribed' with a bell that rings (animate-ring) and a menu for notification settings. The subscriber count rolls too.",
          "Toasts slide up from the corner and dismiss themselves after 3 seconds; Save's toast has Undo.",
        ]}
      />
    </div>
  );
}

// --- Live chat -------------------------------------------------------------
const chatNames = ["Ava", "Kenji", "Priya", "Mateo", "Zoe", "Liam", "Nora", "Sam", "Ivy", "Omar", "Lena", "Theo"];
const chatLines = [
  "This scene is unreal 🔥",
  "The music in this part 😭",
  "Hello from Lisbon!",
  "Who else is here early?",
  "THAT DRAGON 🐉",
  "First time catching this live",
  "The lighting in this shot…",
  "Chat is moving fast today",
  "LET'S GO",
  "How long did this take to animate?",
  "🎻🎻🎻",
  "Rewatching this all week",
];
const nameColors = ["text-rose-600", "text-amber-600", "text-emerald-600", "text-sky-600", "text-violet-600", "text-pink-600"];
const REACTIONS = ["❤️", "😂", "🎉", "🔥"];

export function LiveChatDemo() {
  const status = useSampleVideo();
  const [messages, setMessages] = useState([]);
  const [viewers, setViewers] = useState(18342);
  const [atBottom, setAtBottom] = useState(true);
  const [unread, setUnread] = useState(0);
  const [reactions, setReactions] = useState([]);
  const [draft, setDraft] = useState("");
  const listRef = useRef(null);
  const count = useRef(0);
  const seq = useRef(0); // unique keys for reactions and your messages
  const nextId = () => ++seq.current;

  // A new chat message roughly every second; every ninth one is a highlighted tip
  useEffect(() => {
    const t = setInterval(() => {
      const n = count.current++;
      const name = chatNames[Math.floor(Math.random() * chatNames.length)];
      const msg = { id: `m${n}`, name, text: chatLines[Math.floor(Math.random() * chatLines.length)], tip: n % 9 === 8 ? [2, 5, 10, 20][n % 4] : null };
      setMessages((m) => [...m.slice(-80), msg]);
      setUnread((u) => u + 1);
    }, 950);
    const v = setInterval(() => setViewers((x) => x + Math.round((Math.random() - 0.4) * 40)), 2000);
    return () => {
      clearInterval(t);
      clearInterval(v);
    };
  }, []);

  // Stick to the bottom unless the reader has scrolled up
  useEffect(() => {
    const el = listRef.current;
    if (el && atBottom) el.scrollTop = el.scrollHeight;
  }, [messages, atBottom]);

  function onScroll(e) {
    const el = e.currentTarget;
    const bottom = el.scrollHeight - el.scrollTop - el.clientHeight < 24;
    setAtBottom(bottom);
    if (bottom) setUnread(0);
  }
  function jumpToLatest() {
    const el = listRef.current;
    el?.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
    setAtBottom(true);
    setUnread(0);
  }
  function react(emoji) {
    const id = nextId();
    setReactions((r) => [
      ...r,
      ...[0, 1, 2].map((i) => ({ id: `${id}-${i}`, emoji, drift: Math.round((Math.random() - 0.5) * 90), delay: i * 140, x: Math.round(Math.random() * 30) })),
    ]);
  }
  function send(e) {
    e.preventDefault();
    const text = draft.trim();
    if (!text) return;
    setMessages((m) => [...m.slice(-80), { id: `you${nextId()}`, name: "You", text, you: true }]);
    setDraft("");
    jumpToLatest();
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="relative aspect-video overflow-hidden rounded-xl bg-black shadow-lg lg:aspect-auto lg:h-[460px]">
          {status === "missing" ? <MissingVideo /> : <video src={SAMPLE_SRC} autoPlay muted loop playsInline className="h-full w-full scale-[1.3] object-cover" />}
          <div className="absolute left-3 top-3 flex items-center gap-2 text-xs font-semibold text-white">
            <span className="flex items-center gap-1.5 rounded-sm bg-red-600 px-2 py-0.5">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
              </span>
              LIVE
            </span>
            <span className="rounded-sm bg-black/60 px-2 py-0.5">
              <Odometer value={viewers} /> watching
            </span>
          </div>
          {/* Reactions float up from the bottom-right corner */}
          <div className="pointer-events-none absolute bottom-4 right-6 h-0 w-0">
            {reactions.map((r) => (
              <span
                key={r.id}
                onAnimationEnd={() => setReactions((list) => list.filter((x) => x.id !== r.id))}
                className="absolute bottom-0 animate-float-up text-3xl"
                style={{ "--drift": `${r.drift}px`, right: r.x, animationDelay: `${r.delay}ms` }}
              >
                {r.emoji}
              </span>
            ))}
          </div>
        </div>

        <section className="relative flex h-[460px] flex-col overflow-hidden rounded-xl border border-gray-200 bg-white">
          <header className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
            <h2 className="text-sm font-semibold text-gray-900">Live chat</h2>
            <span className="text-xs text-gray-500">Top messages</span>
          </header>
          <div ref={listRef} onScroll={onScroll} className="flex-1 space-y-1 overflow-y-auto px-3 py-2">
            {messages.map((m) =>
              m.tip ? (
                <div key={m.id} className="my-2 origin-left animate-pop-in overflow-hidden rounded-lg bg-amber-400 text-sm text-gray-900 shadow-sm">
                  <div className="flex items-center gap-2 bg-amber-500/60 px-3 py-1.5">
                    <Avatar name={m.name} className="h-6 w-6 text-[10px]" />
                    <span className="font-semibold">{m.name}</span>
                    <span className="ml-auto font-bold">${m.tip}.00</span>
                  </div>
                  <p className="px-3 py-1.5">{m.text}</p>
                </div>
              ) : (
                <p key={m.id} className={`flex animate-fade-up items-start gap-2 rounded-md px-1 py-0.5 text-sm [animation-duration:250ms] ${m.you ? "bg-blue-50" : ""}`}>
                  <Avatar name={m.name} className="mt-0.5 h-6 w-6 text-[10px]" />
                  <span>
                    <span className={`mr-1.5 font-medium ${m.you ? "text-blue-700" : nameColors[m.name.length % nameColors.length]}`}>{m.name}</span>
                    <span className="text-gray-800">{m.text}</span>
                  </span>
                </p>
              ),
            )}
          </div>
          {!atBottom && unread > 0 && (
            <button type="button" onClick={jumpToLatest} className="absolute bottom-28 left-1/2 flex -translate-x-1/2 animate-fade-up items-center gap-1 rounded-full bg-gray-900 px-3 py-1.5 text-xs font-medium text-white shadow-lg">
              <Icon name="up" className="h-3.5 w-3.5 rotate-180" />
              {unread} new {unread === 1 ? "message" : "messages"}
            </button>
          )}
          <div className="space-y-2 border-t border-gray-200 p-3">
            <div className="flex gap-1">
              {REACTIONS.map((e) => (
                <button key={e} type="button" onClick={() => react(e)} aria-label={`React with ${e}`} className="flex h-9 w-9 items-center justify-center rounded-full text-lg transition hover:bg-gray-100 active:scale-75">
                  {e}
                </button>
              ))}
            </div>
            <form onSubmit={send} className="flex gap-2">
              <input value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Say something…" aria-label="Chat message" className="min-w-0 flex-1 rounded-full bg-gray-100 px-3 py-1.5 text-sm outline-hidden focus:ring-2 focus:ring-blue-500" />
              <button type="submit" disabled={!draft.trim()} aria-label="Send" className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white transition active:scale-90 disabled:bg-gray-300">
                <Icon name="send" className="h-4 w-4 rotate-90" />
              </button>
            </form>
          </div>
        </section>
      </div>
      <Credit />
      <Notes
        items={[
          "Messages arrive about once a second and slide in with a short animate-fade-up. Every ninth one is a highlighted tip that pops in.",
          "The list sticks to the bottom until you scroll up; then a '3 new messages' button appears to jump back down.",
          "Each reaction spawns three emoji that float up with animate-float-up. A random --drift bends each one's path, and they're removed on animationend.",
          "The LIVE dot pings, and the viewer count rolls like an odometer.",
        ]}
      />
    </div>
  );
}
