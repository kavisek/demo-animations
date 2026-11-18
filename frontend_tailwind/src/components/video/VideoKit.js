"use client";

import { useEffect, useState } from "react";
import Icon from "@/components/Icon";

// The sample video is downloaded by `make start` (see the Makefile) and is gitignored.
// It's the Sintel trailer, © Blender Foundation, licensed CC BY 3.0 (durian.blender.org).
// The trailer is letterboxed, so cropped previews use scale-[1.3] to hide the black bands.
export const SAMPLE_SRC = "/videos/sample.mp4";
export const SAMPLE_CREDIT = "Video: Sintel trailer © Blender Foundation, CC BY 3.0";

// One check per page load, shared by every component that shows the video
let availability;
function checkSample() {
  availability ??= fetch(SAMPLE_SRC, { method: "HEAD" })
    .then((r) => r.ok)
    .catch(() => false);
  return availability;
}

// "checking" until the HEAD request returns, then "ok" or "missing"
export function useSampleVideo() {
  const [status, setStatus] = useState("checking");
  useEffect(() => {
    let alive = true;
    checkSample().then((ok) => alive && setStatus(ok ? "ok" : "missing"));
    return () => {
      alive = false;
    };
  }, []);
  return status;
}

// Shown in place of the video when sample.mp4 hasn't been downloaded (e.g. in CI)
export function MissingVideo({ compact = false }) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-gray-900 p-4 text-center text-gray-300">
      <Icon name="video" className={compact ? "h-6 w-6" : "h-10 w-10"} />
      {!compact && (
        <>
          <p className="text-sm font-medium text-white">Sample video not downloaded</p>
          <p className="max-w-xs text-xs text-gray-400">
            Run <code className="rounded-sm bg-white/10 px-1 font-mono">make start</code> (or{" "}
            <code className="rounded-sm bg-white/10 px-1 font-mono">make fetch-video</code>) to download it into{" "}
            <code className="font-mono">public/videos/</code>.
          </p>
        </>
      )}
    </div>
  );
}

// Fictional catalog. Every entry plays a different part of the same sample video:
// `start` is where its thumbnail and hover preview begin, in seconds.
export const VIDEOS = [
  { id: "v1", title: "Golden hour over the mountain pass", channel: "Northlight Studio", views: 1284000, age: "3 days ago", length: "12:04", start: 6, category: "Travel", watched: 0.4 },
  { id: "v2", title: "Building a spring animation from scratch", channel: "Motion Lab", views: 86400, age: "1 week ago", length: "18:32", start: 14, category: "Coding" },
  { id: "v3", title: "Orchestral score: behind the soundtrack", channel: "Tape Hiss Radio", views: 3120000, age: "2 months ago", length: "1:02:10", start: 18, category: "Music" },
  { id: "v4", title: "Storyboarding an action scene", channel: "Frame by Frame", views: 452000, age: "5 days ago", length: "21:08", start: 22, category: "Design" },
  { id: "v5", title: "Every boss fight, no damage", channel: "Pixel Sprint", views: 2210000, age: "1 day ago", length: "40:05", start: 30, category: "Gaming", watched: 0.85 },
  { id: "v6", title: "Lighting a snowy scene in 3D", channel: "Grid & Glyph", views: 64000, age: "2 weeks ago", length: "15:32", start: 26, category: "Design" },
  { id: "v7", title: "This week in open-source film", channel: "Daily Brief", views: 912000, age: "8 hours ago", length: "10:00", start: 32, category: "News" },
  { id: "v8", title: "Ambient walk through the old city", channel: "Quiet Streets", views: 540000, age: "4 weeks ago", length: "33:00", start: 36, category: "Travel" },
];

export function formatViews(n) {
  if (n >= 1e6) return `${+(n / 1e6).toFixed(1)}M views`;
  if (n >= 1e3) return `${Math.round(n / 1e3)}K views`;
  return `${n} views`;
}

export function formatTime(s) {
  if (!Number.isFinite(s)) return "0:00";
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${String(sec).padStart(2, "0")}`;
}

const avatarColors = ["bg-rose-500", "bg-amber-500", "bg-emerald-500", "bg-sky-500", "bg-violet-500", "bg-pink-500", "bg-teal-500", "bg-indigo-500"];
export function Avatar({ name, className = "h-9 w-9 text-sm" }) {
  const hash = [...name].reduce((a, c) => a + c.charCodeAt(0), 0);
  const initials = name.split(/\s+/).map((w) => w[0]).slice(0, 2).join("");
  return (
    <span className={`flex shrink-0 items-center justify-center rounded-full font-semibold text-white ${avatarColors[hash % avatarColors.length]} ${className}`}>
      {initials}
    </span>
  );
}

// A number whose digits roll to their new values like an odometer
const DIGITS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
export function Odometer({ value, className = "" }) {
  const chars = value.toLocaleString("en-US").split("");
  return (
    <span className={`inline-flex tabular-nums ${className}`} aria-label={value.toLocaleString("en-US")}>
      {chars.map((c, i) => {
        const key = chars.length - i; // keyed from the right, so columns keep their place as digits are added
        if (!/\d/.test(c)) return <span key={`s${key}`} aria-hidden="true">{c}</span>;
        return (
          <span key={key} aria-hidden="true" className="relative inline-block h-[1.2em] overflow-hidden leading-[1.2em]">
            <span className="flex flex-col transition-transform duration-500 ease-ios" style={{ transform: `translateY(-${+c * 10}%)` }}>
              {DIGITS.map((d) => (
                <span key={d} className="h-[1.2em]">{d}</span>
              ))}
            </span>
          </span>
        );
      })}
    </span>
  );
}

export function Credit() {
  return (
    <p className="text-xs text-gray-500">
      {SAMPLE_CREDIT} ·{" "}
      <a href="https://durian.blender.org/" className="text-blue-700 hover:underline" target="_blank" rel="noreferrer">
        durian.blender.org
      </a>
    </p>
  );
}
