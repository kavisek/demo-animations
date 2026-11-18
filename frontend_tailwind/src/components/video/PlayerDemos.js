"use client";

import { useEffect, useState } from "react";
import Icon from "@/components/Icon";
import { Notes, Panel } from "@/components/ios/Phone";
import { useMounted, useWidth } from "@/components/charts/chartKit";
import Player from "@/components/video/Player";
import { Avatar, Credit, MissingVideo, SAMPLE_SRC, VIDEOS, formatViews, useSampleVideo } from "@/components/video/VideoKit";

function TryIt({ items }) {
  return (
    <Panel title="Try it">
      <ul className="list-disc space-y-1.5 pl-5 text-sm text-gray-600">
        {items.map((t) => (
          <li key={t}>{t}</li>
        ))}
      </ul>
    </Panel>
  );
}

// --- Video player ----------------------------------------------------------
export function VideoPlayerDemo() {
  return (
    <div className="space-y-4">
      <div className="mx-auto aspect-video max-w-3xl overflow-hidden rounded-xl shadow-lg">
        {/* The trailer opens on black frames; start where there's picture */}
        <Player startAt={6} />
      </div>
      <div className="mx-auto max-w-3xl">
        <Credit />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <TryIt
          items={[
            "Click the video to play or pause; a pulse confirms it in the center.",
            "Double-click the left or right half to skip 10 seconds.",
            "Hover the progress bar to preview frames, then click or drag to seek.",
            "Hover the speaker for the volume slider; the gear sets playback speed.",
            "Keyboard: k or Space, j and l, arrows, m to mute, f for full screen.",
          ]}
        />
        <Notes
          items={[
            "The controls drive a real <video>; currentTime is read every animation frame while playing for a smooth bar.",
            "Play and pause are two four-point paths, so the icon morphs by transitioning the CSS d property.",
            "The scrubber preview is a second, hidden <video> that seeks to the time under the pointer.",
            "Controls fade after 2.5 seconds without mouse movement, and the cursor hides with them.",
          ]}
        />
      </div>
    </div>
  );
}

// --- Chapters & captions ---------------------------------------------------
// Chapter and caption timings follow the trailer's actual scenes
const chapters = [
  { start: 0, title: "Snowy pass" },
  { start: 12, title: "The village" },
  { start: 24, title: "The dragon" },
  { start: 36, title: "Desert" },
  { start: 40, title: "Title and credits" },
];
const captionLines = [
  [1, "[Wind howling]"],
  [6, "[Footsteps crunching in snow]"],
  [12, "[Low voices]"],
  [18, "[Footsteps echo down the alley]"],
  [22, "[Fire crackling]"],
  [26, "[Wings beating]"],
  [30, "[Dragon roars]"],
  [36, "[Desert wind]"],
  [41, "♪ Orchestral finale ♪"],
];
const captions = captionLines.map(([start, text], i) => ({ start, end: (captionLines[i + 1]?.[0] ?? 53) - 0.5, text }));

export function ChaptersDemo() {
  return (
    <div className="space-y-4">
      <div className="mx-auto aspect-video max-w-3xl overflow-hidden rounded-xl shadow-lg">
        <Player startAt={6} chapters={chapters} captions={captions} />
      </div>
      <div className="mx-auto max-w-3xl">
        <Credit />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <TryIt
          items={[
            "Hover the progress bar: it's split into chapters, and the one under the pointer grows.",
            "The tooltip shows the chapter title above the frame preview.",
            "Captions fade in as the video plays. Toggle them with the CC button or the c key.",
          ]}
        />
        <Notes
          items={[
            "Each chapter is its own segment with a 3 px gap; played, buffered, and hover fills are clipped per segment.",
            "The hovered segment scales to 170% height with transition-transform.",
            "Each caption is keyed by its start time, so a new line remounts and replays animate-fade-up. Captions lift while the controls are visible.",
          ]}
        />
      </div>
    </div>
  );
}

// --- Mini player -----------------------------------------------------------
function WatchPageSkeleton() {
  return (
    <div className="space-y-4">
      <div>
        <p className="text-lg font-semibold text-gray-900">{VIDEOS[0].title}</p>
        <div className="mt-2 flex items-center gap-3">
          <Avatar name={VIDEOS[0].channel} />
          <div>
            <p className="text-sm font-medium text-gray-900">{VIDEOS[0].channel}</p>
            <p className="text-xs text-gray-500">482K subscribers</p>
          </div>
        </div>
      </div>
      <div className="rounded-lg bg-gray-100 p-3 text-sm text-gray-700">
        {formatViews(VIDEOS[0].views)} · {VIDEOS[0].age}
        <p className="mt-1 text-gray-600">Minimize the player and keep scrolling; the video keeps playing in the corner.</p>
      </div>
      {Array.from({ length: 4 }, (_, i) => (
        <div key={i} className="flex gap-3">
          <span className="h-9 w-9 shrink-0 rounded-full bg-gray-200" />
          <div className="flex-1 space-y-2 pt-1">
            <div className="h-3 w-1/3 rounded-sm bg-gray-200" />
            <div className="h-3 w-5/6 rounded-sm bg-gray-100" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function MiniPlayerDemo() {
  const [ref, width] = useWidth(720);
  const [mode, setMode] = useState("full"); // full | mini | closed
  const H = 560;
  const pad = 16;
  const fullW = width - pad * 2;
  const fullH = (fullW * 9) / 16;
  const miniW = Math.min(260, width * 0.6);
  const miniH = (miniW * 9) / 16;
  const rect =
    mode === "full"
      ? { left: pad, top: pad, width: fullW, height: fullH, borderRadius: 12 }
      : { left: width - miniW - pad, top: H - miniH - pad, width: miniW, height: miniH, borderRadius: 10 };

  const miniButtons = (
    <>
      <button type="button" onClick={() => setMode("full")} aria-label="Expand player" className="flex h-8 w-8 items-center justify-center rounded-full text-white hover:bg-white/15">
        <Icon name="fullscreen" className="h-4 w-4" />
      </button>
      <button type="button" onClick={() => setMode("closed")} aria-label="Close player" className="flex h-8 w-8 items-center justify-center rounded-full text-white hover:bg-white/15">
        <Icon name="close" className="h-4 w-4" />
      </button>
    </>
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        {["full", "mini"].map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setMode(m)}
            className={`rounded-md border px-3 py-1.5 text-sm font-medium transition active:scale-95 ${mode === m ? "border-blue-600 bg-blue-600 text-white" : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"}`}
          >
            {m === "full" ? "Full player" : "Mini player"}
          </button>
        ))}
        {mode === "closed" && <span className="animate-fade-in text-sm text-gray-500">Player closed. Choose one to bring it back.</span>}
      </div>

      <div ref={ref} className="relative overflow-hidden rounded-xl border border-gray-200 bg-white" style={{ height: H }}>
        {/* Page content moves up into the space the player leaves */}
        <div className="h-full overflow-y-auto px-4 pb-6 transition-[padding] duration-500 ease-ios" style={{ paddingTop: mode === "full" ? fullH + pad * 2 : pad }}>
          <WatchPageSkeleton />
        </div>

        {/* One player element: only its box changes, so playback never restarts */}
        <div
          className={`absolute z-10 overflow-hidden bg-black shadow-2xl transition-all duration-500 ease-ios ${mode === "closed" ? "pointer-events-none translate-x-8 opacity-0" : ""}`}
          style={rect}
        >
          <Player
            startAt={6}
            compact={mode !== "full"}
            extraControls={
              mode === "full" ? (
                <button type="button" onClick={() => setMode("mini")} aria-label="Mini player" title="Mini player" className="flex h-9 w-9 items-center justify-center rounded-full text-white hover:bg-white/15">
                  <Icon name="mini-player" className="h-5 w-5" />
                </button>
              ) : (
                miniButtons
              )
            }
          />
        </div>
      </div>
      <Credit />
      <Notes
        items={[
          "The player is one element that never unmounts. Only its left, top, width, height, and radius change, with transition-all and ease-ios.",
          "The page content's top padding transitions at the same time, so the text slides up into the space the player leaves.",
          "In mini mode the player switches to a compact UI: a center play button, expand and close buttons, and a thin progress line.",
        ]}
      />
    </div>
  );
}

// --- Autoplay next ---------------------------------------------------------
const COUNTDOWN = 6;

function UpNext({ next, onPlay, onCancel }) {
  const mounted = useMounted();
  const r = 26;
  const c = 2 * Math.PI * r;

  // Start the next video when the ring finishes
  useEffect(() => {
    const t = setTimeout(onPlay, COUNTDOWN * 1000);
    return () => clearTimeout(t);
  }, [onPlay]);

  return (
    <div className="absolute inset-0 z-20 flex animate-fade-in flex-col items-center justify-center gap-4 bg-black/80 p-4 text-white backdrop-blur-sm">
      <p className="text-sm text-white/70">Up next</p>
      <div className="flex animate-pop-in items-center gap-4">
        <span className="relative block aspect-video w-36 overflow-hidden rounded-lg bg-gray-800 sm:w-44">
          <video src={`${SAMPLE_SRC}#t=${next.start}`} muted playsInline preload="metadata" className="h-full w-full scale-[1.3] object-cover" />
          <span className="absolute bottom-1 right-1 rounded-sm bg-black/80 px-1 text-xs">{next.length}</span>
        </span>
        <div className="max-w-52">
          <p className="line-clamp-2 font-semibold">{next.title}</p>
          <p className="text-sm text-white/70">{next.channel}</p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <button type="button" onClick={onCancel} className="rounded-full px-4 py-2 text-sm font-medium transition hover:bg-white/10">
          Cancel
        </button>
        {/* The ring empties over the countdown with a single linear transition */}
        <button type="button" onClick={onPlay} aria-label="Play now" className="relative flex h-16 w-16 items-center justify-center">
          <svg viewBox="0 0 64 64" className="absolute inset-0 -rotate-90" aria-hidden="true">
            <circle cx="32" cy="32" r={r} fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="4" />
            <circle
              cx="32"
              cy="32"
              r={r}
              fill="none"
              stroke="white"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray={c}
              strokeDashoffset={mounted ? c : 0}
              style={{ transition: `stroke-dashoffset ${COUNTDOWN}s linear` }}
            />
          </svg>
          <Icon name="play" className="h-6 w-6" filled />
        </button>
      </div>
    </div>
  );
}

function AutoplayStage({ index, onNext }) {
  const [phase, setPhase] = useState("playing"); // playing | upnext | cancelled
  const next = VIDEOS[(index + 1) % VIDEOS.length];

  return (
    <div className="relative aspect-video overflow-hidden rounded-xl bg-black shadow-lg">
      {/* Each video starts near the end so the end screen arrives quickly */}
      <Player autoPlay startAt={44} endScreen={false} onEnded={() => setPhase("upnext")} />
      {phase === "upnext" && <UpNext next={next} onPlay={onNext} onCancel={() => setPhase("cancelled")} />}
      {phase === "cancelled" && (
        <div className="absolute inset-0 z-20 flex animate-fade-in flex-col items-center justify-center gap-3 bg-black/80 text-white">
          <p className="text-sm text-white/70">Autoplay canceled</p>
          <button type="button" onClick={onNext} className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-gray-900 transition hover:bg-gray-200 active:scale-95">
            <Icon name="play" className="h-4 w-4" filled />
            Play &ldquo;{next.title}&rdquo;
          </button>
        </div>
      )}
    </div>
  );
}

export function AutoplayDemo() {
  const status = useSampleVideo();
  const [index, setIndex] = useState(0);
  const video = VIDEOS[index];

  return (
    <div className="space-y-4">
      <div className="mx-auto max-w-3xl space-y-3">
        {status === "missing" ? (
          <div className="aspect-video overflow-hidden rounded-xl">
            <MissingVideo />
          </div>
        ) : (
          // Keyed by video, so each new video gets a fresh player and end screen
          <AutoplayStage key={video.id} index={index} onNext={() => setIndex((i) => (i + 1) % VIDEOS.length)} />
        )}
        <div key={`meta-${video.id}`} className="flex animate-fade-up items-start gap-3">
          <Avatar name={video.channel} />
          <div>
            <p className="font-semibold text-gray-900">{video.title}</p>
            <p className="text-sm text-gray-500">
              {video.channel} · {formatViews(video.views)}
            </p>
          </div>
        </div>
        <Credit />
      </div>
      <Notes
        items={[
          "When the video fires 'ended', an end screen fades in with the next video's card popping into place.",
          "The countdown ring is one stroke-dashoffset transition lasting 6 seconds with linear timing, started a frame after mounting.",
          "A timeout of the same length plays the next video. Cancel replaces the ring with a Play button.",
          "The demo starts each video 8 seconds from the end, so you don't wait long for the countdown.",
        ]}
      />
    </div>
  );
}
