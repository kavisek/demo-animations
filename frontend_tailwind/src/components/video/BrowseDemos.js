"use client";

import { useEffect, useRef, useState } from "react";
import Icon from "@/components/Icon";
import { Notes } from "@/components/ios/Phone";
import { Avatar, Credit, MissingVideo, Odometer, SAMPLE_SRC, VIDEOS, formatViews, useSampleVideo } from "@/components/video/VideoKit";

const PREVIEW_SECONDS = 6;
const shimmer = "animate-shimmer bg-linear-to-r from-gray-100 via-gray-200 to-gray-100 bg-size-[200%_100%]";

// --- Shared: a video card with a hover preview -----------------------------
function VideoCard({ video, delay = 0, available }) {
  const videoRef = useRef(null);
  const timer = useRef(null);
  const [state, setState] = useState("idle"); // idle | waiting | playing
  const [progress, setProgress] = useState(0);

  useEffect(() => () => clearTimeout(timer.current), []);

  // Hovering briefly does nothing; keep hovering and a muted preview starts
  function enter() {
    if (!available) return;
    setState("waiting");
    timer.current = setTimeout(() => {
      const v = videoRef.current;
      if (!v) return;
      v.currentTime = video.start;
      v.play().catch(() => {});
      setState("playing");
    }, 650);
  }
  function leave() {
    clearTimeout(timer.current);
    const v = videoRef.current;
    if (v) {
      v.pause();
      v.currentTime = video.start;
    }
    setState("idle");
    setProgress(0);
  }

  const playing = state === "playing";

  return (
    <article style={{ animationDelay: `${delay}ms` }} className="group animate-fade-up" onPointerEnter={enter} onPointerLeave={leave}>
      <div className={`relative aspect-video overflow-hidden bg-gray-200 transition-all duration-300 ${playing ? "rounded-none shadow-xl" : "rounded-xl"}`}>
        {available ? (
          <video
            ref={videoRef}
            src={`${SAMPLE_SRC}#t=${video.start}`}
            muted
            playsInline
            preload="metadata"
            className={`h-full w-full scale-[1.3] object-cover transition-transform duration-500 ${playing ? "" : "group-hover:scale-[1.35]"}`}
            onTimeUpdate={(e) => {
              if (!playing) return;
              const v = e.currentTarget;
              const p = (v.currentTime - video.start) / PREVIEW_SECONDS;
              if (p >= 1) v.currentTime = video.start; // loop the preview
              setProgress(Math.min(1, Math.max(0, p)));
            }}
          />
        ) : (
          <MissingVideo compact />
        )}

        {/* Length badge turns into a hint while you hover, and hides during the preview */}
        <span
          key={state}
          className={`absolute bottom-1.5 right-1.5 animate-fade-in rounded-md bg-black/80 px-1.5 py-0.5 text-xs font-medium text-white ${playing ? "hidden" : ""}`}
        >
          {state === "waiting" ? "Keep hovering to play" : video.length}
        </span>
        {playing && (
          <span className="absolute right-1.5 top-1.5 flex h-7 w-7 animate-fade-in items-center justify-center rounded-full bg-black/60 text-white">
            <Icon name="mute" className="h-4 w-4" />
          </span>
        )}
        {/* Watched progress, or the preview's progress while it plays */}
        {(playing || video.watched) && (
          <span className="absolute inset-x-0 bottom-0 h-1 bg-gray-400/60">
            <span className="block h-full bg-red-600 transition-[width] duration-200 ease-linear" style={{ width: `${(playing ? progress : video.watched) * 100}%` }} />
          </span>
        )}
      </div>
      <div className="mt-3 flex gap-3">
        <Avatar name={video.channel} />
        <div className="min-w-0 flex-1">
          <p className="line-clamp-2 text-sm font-semibold leading-snug text-gray-900">{video.title}</p>
          <p className="mt-1 text-xs text-gray-600">{video.channel}</p>
          <p className="text-xs text-gray-600">
            {formatViews(video.views)} · {video.age}
          </p>
        </div>
        <button type="button" aria-label="More actions" className="h-8 w-8 shrink-0 rounded-full text-gray-600 opacity-0 transition hover:bg-gray-100 group-hover:opacity-100 focus-visible:opacity-100">
          <Icon name="more" className="mx-auto h-5 w-5 rotate-90" />
        </button>
      </div>
    </article>
  );
}

function SkeletonCard() {
  return (
    <div>
      <div className={`aspect-video rounded-xl ${shimmer}`} />
      <div className="mt-3 flex gap-3">
        <span className={`h-9 w-9 shrink-0 rounded-full ${shimmer}`} />
        <div className="flex-1 space-y-2 pt-1">
          <div className={`h-3 w-11/12 rounded-sm ${shimmer}`} />
          <div className={`h-3 w-2/3 rounded-sm ${shimmer}`} />
          <div className={`h-3 w-1/2 rounded-sm ${shimmer}`} />
        </div>
      </div>
    </div>
  );
}

// --- Hover previews --------------------------------------------------------
export function VideoGridDemo() {
  const status = useSampleVideo();
  const [loading, setLoading] = useState(true);
  const [run, setRun] = useState(0);

  useEffect(() => {
    if (!loading) return;
    const t = setTimeout(() => setLoading(false), 1400);
    return () => clearTimeout(t);
  }, [loading, run]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">Hover a card and keep the pointer still for a moment.</p>
        <button
          type="button"
          onClick={() => {
            setLoading(true);
            setRun((n) => n + 1);
          }}
          className="inline-flex items-center gap-1.5 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 active:scale-95"
        >
          <Icon name="replay" className="h-4 w-4" />
          Reload
        </button>
      </div>
      <div className="grid gap-x-4 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {loading
          ? VIDEOS.map((v) => <SkeletonCard key={v.id} />)
          : VIDEOS.map((v, i) => <VideoCard key={v.id} video={v} delay={i * 60} available={status === "ok"} />)}
      </div>
      <Credit />
      <Notes
        items={[
          "While loading, skeleton cards shimmer in the same layout, then real cards fade up 60 ms apart.",
          "Each thumbnail is a <video> showing the frame at its start time (#t=). Hovering waits 650 ms before playing, so passing over cards doesn't start them.",
          "During the preview the card squares off its corners and lifts, the length badge hides, and a red line tracks the 6-second preview loop.",
        ]}
      />
    </div>
  );
}

// --- Filter chips ----------------------------------------------------------
const chipFilters = {
  All: () => true,
  Travel: (v) => v.category === "Travel",
  Music: (v) => v.category === "Music",
  Design: (v) => v.category === "Design",
  Gaming: (v) => v.category === "Gaming",
  Coding: (v) => v.category === "Coding",
  News: (v) => v.category === "News",
  "Recently uploaded": (v) => /hour|day/.test(v.age),
  "Continue watching": (v) => Boolean(v.watched),
  "New to you": (v) => !v.watched,
};
const chips = Object.keys(chipFilters);

export function FilterChipsDemo() {
  const status = useSampleVideo();
  const [active, setActive] = useState("All");
  const [pill, setPill] = useState(null); // { left, width } of the active chip
  const [edges, setEdges] = useState({ left: false, right: true });
  const rowRef = useRef(null);

  // Measure the active chip as it renders, so the highlight can slide to it
  const measureActive = (el) => {
    if (!el) return;
    const next = { left: el.offsetLeft, width: el.offsetWidth };
    setPill((p) => (p && p.left === next.left && p.width === next.width ? p : next));
  };
  const updateEdges = (el) => {
    const next = { left: el.scrollLeft > 4, right: el.scrollLeft + el.clientWidth < el.scrollWidth - 4 };
    setEdges((e) => (e.left === next.left && e.right === next.right ? e : next));
  };
  const scroll = (dir) => rowRef.current?.scrollBy({ left: dir * 240, behavior: "smooth" });
  const results = VIDEOS.filter(chipFilters[active]);

  return (
    <div className="space-y-5">
      <div className="relative">
        {/* Edge fades and arrows appear only when there's more to scroll */}
        <div className={`pointer-events-none absolute inset-y-0 left-0 z-10 flex w-20 items-center bg-linear-to-r from-gray-50 via-gray-50 to-transparent transition-opacity duration-200 ${edges.left ? "opacity-100" : "opacity-0"}`}>
          <button type="button" onClick={() => scroll(-1)} aria-label="Scroll chips left" className="pointer-events-auto flex h-8 w-8 items-center justify-center rounded-full hover:bg-gray-200">
            <Icon name="back" className="h-5 w-5" />
          </button>
        </div>
        <div
          ref={rowRef}
          onScroll={(e) => updateEdges(e.currentTarget)}
          className="relative flex gap-3 overflow-x-auto scroll-smooth py-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {pill && (
            <span className="absolute top-1 h-8 rounded-lg bg-gray-900 transition-all duration-300 ease-ios" style={{ left: pill.left, width: pill.width }} />
          )}
          {chips.map((c) => {
            const on = c === active;
            return (
              <button
                key={c}
                ref={on ? measureActive : undefined}
                type="button"
                onClick={() => setActive(c)}
                aria-pressed={on}
                className={`relative h-8 shrink-0 whitespace-nowrap rounded-lg px-3 text-sm font-medium transition-colors duration-300 ${
                  on ? `text-white ${pill ? "" : "bg-gray-900"}` : "bg-gray-200/80 text-gray-900 hover:bg-gray-300"
                }`}
              >
                {c}
              </button>
            );
          })}
        </div>
        <div className={`pointer-events-none absolute inset-y-0 right-0 z-10 flex w-20 items-center justify-end bg-linear-to-l from-gray-50 via-gray-50 to-transparent transition-opacity duration-200 ${edges.right ? "opacity-100" : "opacity-0"}`}>
          <button type="button" onClick={() => scroll(1)} aria-label="Scroll chips right" className="pointer-events-auto flex h-8 w-8 items-center justify-center rounded-full hover:bg-gray-200">
            <Icon name="chevron" className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Keyed by filter: the grid remounts and its cards fade up again */}
      <div key={active}>
        <p className="mb-3 animate-fade-in text-sm text-gray-500">
          {results.length} {results.length === 1 ? "video" : "videos"}
        </p>
        {results.length ? (
          <div className="grid gap-x-4 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {results.map((v, i) => (
              <VideoCard key={v.id} video={v} delay={i * 50} available={status === "ok"} />
            ))}
          </div>
        ) : (
          <p className="animate-fade-in py-12 text-center text-sm text-gray-500">Nothing here yet.</p>
        )}
      </div>
      <Credit />
      <Notes
        items={[
          "The dark highlight is one element. The active chip measures itself (offsetLeft and offsetWidth) and the highlight transitions its left and width.",
          "The chip row scrolls sideways with a hidden scrollbar. Fades and arrow buttons appear at each edge only when there's more to scroll.",
          "Changing the filter re-keys the results, so the count and the cards fade up again with a stagger.",
        ]}
      />
    </div>
  );
}

// --- Vertical clip feed ----------------------------------------------------
const CLIP_SECONDS = 8;
const clipCaptions = [
  "Golden light on the pass 🏔️ #travel",
  "How we animated this scene, frame by frame",
  "Turn the sound up for this one 🎻",
  "Blocking out the fight choreography",
  "That moment when the boss appears 🐉",
];

function Burst({ id }) {
  // Eight particles fly out in a ring; --dx and --dy give each its direction
  return (
    <span key={id} className="pointer-events-none absolute inset-0">
      {Array.from({ length: 8 }, (_, i) => {
        const a = (i / 8) * Math.PI * 2;
        return (
          <span
            key={i}
            className="absolute left-1/2 top-1/2 -ml-1 -mt-1 h-2 w-2 animate-burst rounded-full bg-rose-500"
            style={{ "--dx": `${Math.cos(a) * 26}px`, "--dy": `${Math.sin(a) * 26}px` }}
          />
        );
      })}
    </span>
  );
}

function Clip({ clip, caption, active, muted, index }) {
  const videoRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(1200 + index * 3471);
  const [hearts, setHearts] = useState([]); // big hearts from double-clicks
  const [burst, setBurst] = useState(null);

  // Only the clip in view plays; the rest pause and rewind
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (active) {
      v.currentTime = clip.start;
      v.play().catch(() => {});
    } else {
      v.pause();
    }
  }, [active, clip.start]);

  useEffect(() => {
    if (videoRef.current) videoRef.current.muted = muted;
  }, [muted]);

  function like() {
    if (!liked) {
      setLikes((n) => n + 1);
      setBurst(Date.now());
    } else setLikes((n) => n - 1);
    setLiked(!liked);
  }
  function onDoubleClick(e) {
    const r = e.currentTarget.getBoundingClientRect();
    setHearts((h) => [...h, { id: Date.now(), x: e.clientX - r.left, y: e.clientY - r.top }]);
    if (!liked) {
      setLiked(true);
      setLikes((n) => n + 1);
      setBurst(Date.now());
    }
  }

  return (
    <section data-index={index} className="relative h-full w-full shrink-0 snap-start snap-always overflow-hidden bg-black">
      <video
        ref={videoRef}
        src={`${SAMPLE_SRC}#t=${clip.start}`}
        muted
        playsInline
        preload="metadata"
        className="absolute inset-0 h-full w-full scale-[1.3] object-cover"
        onTimeUpdate={(e) => {
          const v = e.currentTarget;
          const p = (v.currentTime - clip.start) / CLIP_SECONDS;
          if (p >= 1) v.currentTime = clip.start; // each clip loops an 8-second window
          setProgress(Math.min(1, Math.max(0, p)));
        }}
      />
      <div className="absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-black/20" onDoubleClick={onDoubleClick} />

      {hearts.map((h) => (
        <span
          key={h.id}
          onAnimationEnd={() => setHearts((list) => list.filter((x) => x.id !== h.id))}
          className="pointer-events-none absolute -ml-12 -mt-12 animate-heart-pop text-rose-500 drop-shadow-lg"
          style={{ left: h.x, top: h.y }}
        >
          <Icon name="heart" filled className="h-24 w-24" />
        </span>
      ))}

      {/* Action rail */}
      <div className="absolute bottom-16 right-2 flex flex-col items-center gap-4 text-white">
        <button type="button" onClick={like} aria-pressed={liked} aria-label="Like" className="relative flex flex-col items-center gap-1">
          <span key={liked ? "on" : "off"} className={`relative flex h-11 w-11 items-center justify-center rounded-full bg-white/15 backdrop-blur ${liked ? "animate-hud-in text-rose-500" : ""}`}>
            <Icon name="heart" filled={liked} className="h-6 w-6" />
            {burst && liked && <Burst id={burst} />}
          </span>
          <Odometer value={likes} className="text-xs font-semibold" />
        </button>
        <span className="flex flex-col items-center gap-1">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/15 backdrop-blur">
            <Icon name="chat" className="h-6 w-6" />
          </span>
          <span className="text-xs font-semibold">{84 + index * 17}</span>
        </span>
        <span className="flex flex-col items-center gap-1">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/15 backdrop-blur">
            <Icon name="share" className="h-6 w-6" />
          </span>
          <span className="text-xs font-semibold">Share</span>
        </span>
      </div>

      <div className="pointer-events-none absolute bottom-4 left-3 right-16 text-white">
        <div className="flex items-center gap-2">
          <Avatar name={clip.channel} className="h-8 w-8 text-xs" />
          <span className="text-sm font-semibold">@{clip.channel.toLowerCase().replace(/[^a-z]+/g, "")}</span>
          <span className="pointer-events-auto rounded-full bg-white px-2.5 py-0.5 text-xs font-semibold text-gray-900">Follow</span>
        </div>
        <p className="mt-2 line-clamp-2 text-sm">{caption}</p>
      </div>
      <span className="absolute inset-x-0 bottom-0 h-0.5 bg-white/30">
        <span className="block h-full bg-white" style={{ width: `${progress * 100}%` }} />
      </span>
    </section>
  );
}

export function VerticalFeedDemo() {
  const status = useSampleVideo();
  const scrollRef = useRef(null);
  const [active, setActive] = useState(0);
  const [muted, setMuted] = useState(true);
  const clips = VIDEOS.slice(0, 5);

  // Whichever clip is mostly in view becomes the active (playing) one
  useEffect(() => {
    const root = scrollRef.current;
    if (!root) return;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(+e.target.dataset.index)),
      { root, threshold: 0.6 },
    );
    root.querySelectorAll("[data-index]").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [status]);

  const go = (dir) => scrollRef.current?.scrollBy({ top: dir * scrollRef.current.clientHeight, behavior: "smooth" });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-center gap-6 rounded-xl bg-linear-to-b from-gray-100 to-gray-200/60 py-8">
        <div className="relative h-[560px] w-[315px] overflow-hidden rounded-[32px] bg-black shadow-2xl ring-8 ring-gray-900">
          {status === "missing" ? (
            <MissingVideo />
          ) : (
            <div ref={scrollRef} className="h-full snap-y snap-mandatory overflow-y-scroll overscroll-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {clips.map((c, i) => (
                <Clip key={c.id} clip={c} caption={clipCaptions[i]} index={i} active={i === active} muted={muted} />
              ))}
            </div>
          )}
          <button type="button" onClick={() => setMuted((m) => !m)} aria-label={muted ? "Unmute" : "Mute"} className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur">
            <Icon name={muted ? "mute" : "volume"} className="h-5 w-5" />
          </button>
        </div>
        <div className="flex flex-col gap-3">
          <button type="button" onClick={() => go(-1)} disabled={active === 0} aria-label="Previous clip" className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow transition hover:bg-gray-50 active:scale-90 disabled:opacity-40">
            <Icon name="up" className="h-6 w-6" />
          </button>
          <span className="text-center text-xs tabular-nums text-gray-500">
            {active + 1} / {clips.length}
          </span>
          <button type="button" onClick={() => go(1)} disabled={active === clips.length - 1} aria-label="Next clip" className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow transition hover:bg-gray-50 active:scale-90 disabled:opacity-40">
            <Icon name="up" className="h-6 w-6 rotate-180" />
          </button>
        </div>
      </div>
      <Credit />
      <Notes
        items={[
          "The feed is a scroll container with snap-y snap-mandatory, so each scroll lands exactly on one clip. An IntersectionObserver plays the clip that's 60% in view and pauses the rest.",
          "Double-clicking a clip drops a heart where you clicked: animate-heart-pop overshoots, settles, then floats up and fades. It's removed on animationend.",
          "Liking bursts eight particles outward (each with its own --dx and --dy) while the count rolls like an odometer.",
        ]}
      />
    </div>
  );
}
