"use client";

import { useEffect, useRef, useState } from "react";
import Icon from "@/components/Icon";
import { MissingVideo, SAMPLE_SRC, formatTime, useSampleVideo } from "@/components/video/VideoKit";

const clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, n));
const SPEEDS = [0.5, 1, 1.25, 1.5, 2];

// Play ↔ pause morph: both shapes are two four-point paths, so CSS can interpolate `d`
const PLAY = ["M7,5 L13,8.8 L13,15.2 L7,19 Z", "M13,8.8 L19,12 L19,12 L13,15.2 Z"];
const PAUSE = ["M6,5 L10,5 L10,19 L6,19 Z", "M14,5 L18,5 L18,19 L14,19 Z"];

function PlayPauseIcon({ playing, className = "h-6 w-6" }) {
  const shape = playing ? PAUSE : PLAY;
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      {shape.map((d, i) => (
        <path key={i} d={d} style={{ d: `path("${d}")`, transition: "d 180ms ease" }} />
      ))}
    </svg>
  );
}

function ControlButton({ label, onClick, children, active }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      aria-pressed={active}
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white transition hover:bg-white/15 active:scale-90"
    >
      {children}
    </button>
  );
}

/**
 * A video player with custom controls around a real <video> element.
 * chapters: [{ start, title }] in seconds · captions: [{ start, end, text }]
 * compact: a minimal UI for small sizes (mini player) · extraControls: buttons added on the right
 */
export default function Player({ startAt = 0, autoPlay = false, loop = false, chapters, captions, compact = false, endScreen = true, onEnded, extraControls }) {
  const status = useSampleVideo();
  const boxRef = useRef(null);
  const videoRef = useRef(null);
  const previewRef = useRef(null);
  const barRef = useRef(null);
  const hideTimer = useRef(null);
  const clickTimer = useRef(null);

  const [t, setT] = useState(startAt);
  const [duration, setDuration] = useState(0);
  const [buffered, setBuffered] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [ended, setEnded] = useState(false);
  const [waiting, setWaiting] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [muted, setMuted] = useState(autoPlay); // browsers only autoplay muted video
  const [rate, setRate] = useState(1);
  const [menu, setMenu] = useState(false);
  const [cc, setCc] = useState(true);
  const [ui, setUi] = useState(true);
  const [flash, setFlash] = useState(null); // center play/pause pulse
  const [skip, setSkip] = useState(null); // double-click seek ripple
  const [hover, setHover] = useState(null); // scrubber hover: { ratio, t }
  const [scrubbing, setScrubbing] = useState(false);

  // While playing, read currentTime every frame so the progress bar moves smoothly
  useEffect(() => {
    if (!playing) return;
    let raf;
    const loopFrame = () => {
      if (videoRef.current) setT(videoRef.current.currentTime);
      raf = requestAnimationFrame(loopFrame);
    };
    raf = requestAnimationFrame(loopFrame);
    return () => cancelAnimationFrame(raf);
  }, [playing]);

  useEffect(
    () => () => {
      clearTimeout(hideTimer.current);
      clearTimeout(clickTimer.current);
    },
    [],
  );

  if (status !== "ok") {
    return <div className="h-full w-full bg-black">{status === "missing" && <MissingVideo compact={compact} />}</div>;
  }

  const showUi = ui || !playing || menu || scrubbing;

  function wake() {
    setUi(true);
    clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => setUi(false), 2500);
  }

  function togglePlay() {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused || v.ended) {
      v.play();
      setFlash({ id: Date.now(), icon: "play" });
    } else {
      v.pause();
      setFlash({ id: Date.now(), icon: "pause" });
    }
    wake();
  }

  function seek(to) {
    const v = videoRef.current;
    if (!v || !duration) return;
    const x = clamp(to, 0, duration);
    v.currentTime = x;
    setT(x);
    setEnded(false);
  }

  function changeVolume(next) {
    const v = videoRef.current;
    const vol = clamp(next, 0, 1);
    setVolume(vol);
    setMuted(vol === 0);
    if (v) {
      v.volume = vol;
      v.muted = vol === 0;
    }
  }

  function toggleMute() {
    const v = videoRef.current;
    const next = !muted;
    setMuted(next);
    if (v) v.muted = next;
  }

  function changeRate(r) {
    setRate(r);
    if (videoRef.current) videoRef.current.playbackRate = r;
    setMenu(false);
  }

  function toggleFullscreen() {
    if (document.fullscreenElement) document.exitFullscreen();
    else boxRef.current?.requestFullscreen?.();
  }

  // A single click toggles play; wait briefly so a double-click can skip instead
  function onSurfaceClick() {
    clearTimeout(clickTimer.current);
    clickTimer.current = setTimeout(togglePlay, 220);
  }
  function onSurfaceDoubleClick(e) {
    clearTimeout(clickTimer.current);
    const r = e.currentTarget.getBoundingClientRect();
    const side = e.clientX - r.left < r.width / 2 ? "back" : "forward";
    seek(t + (side === "back" ? -10 : 10));
    setSkip({ id: Date.now(), side });
    wake();
  }

  function onKeyDown(e) {
    const keys = {
      " ": togglePlay,
      k: togglePlay,
      j: () => seek(t - 10),
      l: () => seek(t + 10),
      ArrowLeft: () => seek(t - 5),
      ArrowRight: () => seek(t + 5),
      m: toggleMute,
      c: () => setCc((c) => !c),
      f: toggleFullscreen,
    };
    const fn = keys[e.key];
    if (fn) {
      e.preventDefault();
      fn();
      wake();
    }
  }

  const ratioAt = (e) => {
    const r = barRef.current.getBoundingClientRect();
    return clamp((e.clientX - r.left) / r.width, 0, 1);
  };
  function onBarMove(e) {
    const ratio = ratioAt(e);
    const ht = ratio * duration;
    setHover({ ratio, t: ht });
    // Seek the hidden preview video so the tooltip shows the frame under the pointer
    const p = previewRef.current;
    if (p && Math.abs(p.currentTime - ht) > 0.25) p.currentTime = ht;
    if (scrubbing) seek(ht);
  }
  function onBarDown(e) {
    e.currentTarget.setPointerCapture(e.pointerId);
    setScrubbing(true);
    seek(ratioAt(e) * duration);
  }

  const chapterList = chapters && duration ? chapters.map((c, i) => ({ ...c, end: chapters[i + 1]?.start ?? duration })) : null;
  const segments = chapterList ?? [{ start: 0, end: duration || 1 }];
  const currentChapter = chapterList?.find((c) => t >= c.start && t < c.end) ?? chapterList?.at(-1);
  const hoverChapter = hover && chapterList?.find((c) => hover.t >= c.start && hover.t < c.end);
  const caption = cc && captions?.find((c) => t >= c.start && t < c.end);
  const pct = (x) => (duration ? (x / duration) * 100 : 0);

  return (
    <div
      ref={boxRef}
      tabIndex={0}
      onMouseMove={wake}
      onMouseLeave={() => playing && setUi(false)}
      onKeyDown={onKeyDown}
      aria-label="Video player"
      className={`group/player relative h-full w-full select-none overflow-hidden bg-black text-white outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
        showUi ? "" : "cursor-none"
      }`}
    >
      <video
        ref={videoRef}
        src={SAMPLE_SRC}
        autoPlay={autoPlay}
        muted={muted}
        loop={loop}
        playsInline
        preload="auto"
        className="absolute inset-0 h-full w-full object-contain"
        onLoadedMetadata={(e) => {
          setDuration(e.currentTarget.duration);
          if (startAt) e.currentTarget.currentTime = startAt;
          e.currentTarget.volume = volume;
        }}
        onPlay={() => {
          setPlaying(true);
          setEnded(false);
        }}
        onPause={(e) => {
          setPlaying(false);
          setT(e.currentTarget.currentTime);
        }}
        onSeeked={(e) => setT(e.currentTarget.currentTime)}
        onWaiting={() => setWaiting(true)}
        onPlaying={() => setWaiting(false)}
        onCanPlay={() => setWaiting(false)}
        onProgress={(e) => {
          const v = e.currentTarget;
          for (let i = 0; i < v.buffered.length; i++) {
            if (v.buffered.start(i) <= v.currentTime + 0.5) setBuffered(v.buffered.end(i));
          }
        }}
        onEnded={() => {
          setPlaying(false);
          setEnded(true);
          onEnded?.();
        }}
      />

      {/* Click / double-click surface */}
      <div className="absolute inset-0" onClick={onSurfaceClick} onDoubleClick={onSurfaceDoubleClick} />

      {/* Center pulse after play/pause */}
      {flash && (
        <div key={flash.id} className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <span className="flex h-16 w-16 animate-flash-out items-center justify-center rounded-full bg-black/55">
            <PlayPauseIcon playing={flash.icon === "pause"} className="h-8 w-8" />
          </span>
        </div>
      )}

      {/* Double-click skip ripple */}
      {skip && (
        <div
          key={skip.id}
          onAnimationEnd={(e) => e.target === e.currentTarget.firstChild && setSkip(null)}
          className={`pointer-events-none absolute inset-y-0 flex w-1/2 items-center justify-center overflow-hidden ${skip.side === "back" ? "left-0 rounded-r-[50%]" : "right-0 rounded-l-[50%]"}`}
        >
          <span className="absolute h-40 w-40 animate-ripple rounded-full bg-white" />
          <span className="relative flex animate-fade-in flex-col items-center text-xs font-medium">
            <Icon name={skip.side === "back" ? "back" : "chevron"} className="h-6 w-6" />
            10 seconds
          </span>
        </div>
      )}

      {/* Buffering spinner */}
      {waiting && playing && (
        <span className="pointer-events-none absolute left-1/2 top-1/2 -ml-6 -mt-6 h-12 w-12 animate-spin rounded-full border-4 border-white/30 border-t-white" />
      )}

      {/* End screen: replay */}
      {ended && endScreen && (
        <button type="button" onClick={togglePlay} className="absolute left-1/2 top-1/2 -ml-8 -mt-8 flex h-16 w-16 animate-hud-in items-center justify-center rounded-full bg-black/60 transition hover:bg-black/80" aria-label="Replay">
          <Icon name="replay" className="h-8 w-8" />
        </button>
      )}

      {/* Captions sit higher while the controls are showing */}
      {caption && (
        <div className="pointer-events-none absolute inset-x-0 flex justify-center px-6 transition-[bottom] duration-300" style={{ bottom: showUi && !compact ? 72 : 20 }}>
          <span key={caption.start} className="animate-fade-up rounded-sm bg-black/75 px-2 py-0.5 text-center text-sm sm:text-base [animation-duration:250ms]">
            {caption.text}
          </span>
        </div>
      )}

      {compact ? (
        <>
          <div className={`absolute inset-0 flex items-center justify-center bg-black/30 transition-opacity duration-200 ${showUi ? "opacity-100" : "opacity-0"} pointer-events-none`}>
            <button type="button" onClick={togglePlay} className="pointer-events-auto flex h-10 w-10 items-center justify-center rounded-full bg-black/50" aria-label={playing ? "Pause" : "Play"}>
              <PlayPauseIcon playing={playing} />
            </button>
          </div>
          {extraControls && <div className={`absolute right-1 top-1 flex transition-opacity duration-200 ${showUi ? "opacity-100" : "opacity-0"}`}>{extraControls}</div>}
          <div className="absolute inset-x-0 bottom-0 h-[3px] bg-white/25">
            <div className="h-full bg-red-600" style={{ width: `${pct(t)}%` }} />
          </div>
        </>
      ) : (
        <div className={`absolute inset-x-0 bottom-0 transition-opacity duration-300 ${showUi ? "opacity-100" : "pointer-events-none opacity-0"}`}>
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-linear-to-t from-black/80 to-transparent" />

          {/* Scrubber */}
          <div
            ref={barRef}
            onPointerMove={onBarMove}
            onPointerDown={onBarDown}
            onPointerUp={() => setScrubbing(false)}
            onPointerLeave={() => !scrubbing && setHover(null)}
            className="group/bar relative mx-3 flex h-5 cursor-pointer touch-none items-center"
            role="slider"
            aria-label="Seek"
            aria-valuemin={0}
            aria-valuemax={Math.round(duration)}
            aria-valuenow={Math.round(t)}
            aria-valuetext={formatTime(t)}
          >
            {segments.map((s, i) => {
              const span = s.end - s.start || 1;
              const isHover = hover && hover.t >= s.start && hover.t < s.end;
              return (
                <div
                  key={i}
                  className="absolute top-1/2 h-1 -translate-y-1/2 transition-transform duration-150 group-hover/bar:h-1.5"
                  style={{ left: `${pct(s.start)}%`, width: `calc(${pct(s.end - s.start)}% - ${segments.length > 1 && i < segments.length - 1 ? 3 : 0}px)`, transform: `translateY(-50%) scaleY(${isHover && segments.length > 1 ? 1.7 : 1})` }}
                >
                  <div className="absolute inset-0 bg-white/25" />
                  <div className="absolute inset-y-0 left-0 bg-white/40" style={{ width: `${clamp((buffered - s.start) / span, 0, 1) * 100}%` }} />
                  {hover && <div className="absolute inset-y-0 left-0 bg-white/50" style={{ width: `${clamp((hover.t - s.start) / span, 0, 1) * 100}%` }} />}
                  <div className="absolute inset-y-0 left-0 bg-red-600" style={{ width: `${clamp((t - s.start) / span, 0, 1) * 100}%` }} />
                </div>
              );
            })}
            <span
              className={`pointer-events-none absolute top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-600 transition-transform duration-150 ${scrubbing ? "scale-100" : "scale-0 group-hover/bar:scale-100"}`}
              style={{ left: `${pct(t)}%` }}
            />

            {/* Hover preview: a second <video> seeked to the time under the pointer */}
            <div
              className={`pointer-events-none absolute bottom-full mb-3 flex -translate-x-1/2 flex-col items-center gap-1 transition-opacity duration-150 ${hover ? "opacity-100" : "opacity-0"}`}
              style={{ left: `${clamp((hover?.ratio ?? 0) * 100, 12, 88)}%` }}
            >
              <span className="block aspect-video w-40 overflow-hidden rounded-md border-2 border-white bg-black shadow-lg">
                <video ref={previewRef} src={SAMPLE_SRC} muted playsInline preload="auto" className="h-full w-full object-cover" />
              </span>
              {hoverChapter && <span className="max-w-40 truncate text-xs font-medium">{hoverChapter.title}</span>}
              <span className="rounded-sm bg-black/70 px-1.5 text-xs tabular-nums">{formatTime(hover?.t ?? 0)}</span>
            </div>
          </div>

          {/* Control row */}
          <div className="relative flex items-center gap-1 px-2 pb-2">
            <ControlButton label={playing ? "Pause (k)" : "Play (k)"} onClick={togglePlay}>
              <PlayPauseIcon playing={playing} />
            </ControlButton>
            <ControlButton label="Forward 10 seconds (l)" onClick={() => seek(t + 10)}>
              <Icon name="skip-next" className="h-5 w-5" />
            </ControlButton>

            {/* Volume: the slider slides open on hover */}
            <div className="group/vol flex items-center">
              <ControlButton label={muted ? "Unmute (m)" : "Mute (m)"} onClick={toggleMute}>
                <Icon name={muted || volume === 0 ? "mute" : "volume"} className="h-5 w-5" />
              </ControlButton>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={muted ? 0 : volume}
                onChange={(e) => changeVolume(+e.target.value)}
                aria-label="Volume"
                className="w-0 cursor-pointer accent-white opacity-0 transition-all duration-200 group-focus-within/vol:mr-2 group-focus-within/vol:w-16 group-focus-within/vol:opacity-100 group-hover/vol:mr-2 group-hover/vol:w-16 group-hover/vol:opacity-100"
              />
            </div>

            <span className="ml-1 whitespace-nowrap text-xs tabular-nums text-white/90 sm:text-sm">
              {formatTime(t)} / {formatTime(duration)}
            </span>
            {currentChapter && (
              <span key={currentChapter.title} className="ml-2 hidden animate-fade-in truncate text-sm text-white/90 sm:inline">
                · {currentChapter.title}
              </span>
            )}

            <span className="flex-1" />
            {extraControls}
            {captions && (
              <ControlButton label="Captions (c)" onClick={() => setCc((c) => !c)} active={cc}>
                <span className="relative">
                  <Icon name="cc" className="h-5 w-5" />
                  <span className={`absolute -bottom-1 left-0.5 right-0.5 h-0.5 rounded-full bg-red-600 transition-transform duration-200 ${cc ? "scale-x-100" : "scale-x-0"}`} />
                </span>
              </ControlButton>
            )}
            <div className="relative">
              <ControlButton label="Playback speed" onClick={() => setMenu((m) => !m)} active={menu}>
                <Icon name="settings" className={`h-5 w-5 transition-transform duration-300 ${menu ? "rotate-45" : ""}`} />
              </ControlButton>
              {menu && (
                <div role="menu" className="absolute bottom-11 right-0 w-36 origin-bottom-right animate-pop-in overflow-hidden rounded-lg bg-black/90 py-1 text-sm shadow-xl backdrop-blur">
                  <p className="px-3 py-1 text-xs text-white/60">Playback speed</p>
                  {SPEEDS.map((s) => (
                    <button key={s} type="button" role="menuitemradio" aria-checked={rate === s} onClick={() => changeRate(s)} className="flex w-full items-center justify-between px-3 py-1.5 text-left hover:bg-white/10">
                      {s === 1 ? "Normal" : `${s}×`}
                      {rate === s && <Icon name="check" className="h-4 w-4" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <ControlButton label="Full screen (f)" onClick={toggleFullscreen}>
              <Icon name="fullscreen" className="h-5 w-5" />
            </ControlButton>
          </div>
        </div>
      )}
    </div>
  );
}
