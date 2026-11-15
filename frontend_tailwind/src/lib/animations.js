// Every animation page in the app. The sidebar, search bar, overview grid,
// and /animations/[slug] routes are all generated from this list.
export const animations = [
  {
    group: "Motion basics",
    slug: "fade",
    title: "Fade & stagger",
    icon: "layers",
    description: "Cards fade up into place one after another, like a list loading in.",
    tags: ["opacity", "entrance", "stagger", "list"],
    classes: "animate-fade-up [animation-delay:120ms]",
  },
  {
    group: "Motion basics",
    slug: "slide",
    title: "Slide-in panels",
    icon: "panel",
    description: "Panels slide in from either side of the screen as they enter.",
    tags: ["translate", "entrance", "drawer"],
    classes: "animate-slide-in-left · animate-slide-in-right",
  },
  {
    group: "Motion basics",
    slug: "bounce",
    title: "Bounce",
    icon: "bounce",
    description: "Tailwind's built-in bounce, offset across elements to build a rhythm.",
    tags: ["built-in", "attention", "loading"],
    classes: "animate-bounce [animation-delay:-150ms]",
  },
  {
    group: "Motion basics",
    slug: "spinners",
    title: "Loaders & spinners",
    icon: "spinner",
    description: "Rings, dots, and progress indicators for work that's in flight.",
    tags: ["built-in", "spin", "loading", "progress"],
    classes: "animate-spin border-t-transparent",
  },
  {
    group: "Motion basics",
    slug: "pulse",
    title: "Pulse & ping",
    icon: "pulse",
    description: "Status lights and skeleton screens that breathe while data loads.",
    tags: ["built-in", "status", "skeleton", "notification"],
    classes: "animate-ping · animate-pulse",
  },
  {
    group: "Motion basics",
    slug: "wave",
    title: "Audio wave",
    icon: "wave",
    description: "Bars scale up and down with staggered delays to make an equalizer.",
    tags: ["scale", "music", "keyframes"],
    classes: "animate-wave origin-bottom",
  },
  {
    group: "Motion basics",
    slug: "flip",
    title: "3D flip cards",
    icon: "flip",
    description: "Hover or focus a card to rotate it in 3D and show its back face.",
    tags: ["transform", "3d", "hover", "transition"],
    classes: "[transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]",
  },
  {
    group: "Motion basics",
    slug: "orbit",
    title: "Orbit",
    icon: "orbit",
    description: "Nodes orbit a core at different speeds and directions.",
    tags: ["spin", "rotate", "network"],
    classes: "animate-spin-slow · animate-spin-reverse",
  },
  {
    group: "Motion basics",
    slug: "typewriter",
    title: "Typewriter",
    icon: "terminal",
    description: "Text types itself out behind a blinking caret, like a terminal.",
    tags: ["text", "steps", "terminal", "caret"],
    classes: "animate-typing overflow-hidden whitespace-nowrap border-r-2",
  },
  {
    group: "Motion basics",
    slug: "gradient",
    title: "Gradient & shimmer",
    icon: "sparkle",
    description: "Moving gradients for hero banners, and shimmer for loading content.",
    tags: ["background", "gradient", "skeleton", "hero"],
    classes: "animate-gradient-pan bg-[length:200%_200%]",
  },
  {
    group: "Tables & data",
    slug: "table-rows",
    title: "Row add & remove",
    icon: "rows",
    description: "New rows fade in with a highlight that settles; deleted rows slide out before they're removed.",
    tags: ["table", "insert", "delete", "highlight", "crud"],
    classes: "animate-row-insert · animate-fade-out (then remove on animationend)",
  },
  {
    group: "Tables & data",
    slug: "table-sort",
    title: "Sort & reorder",
    icon: "sort",
    description: "Click a column header and rows glide to their new positions instead of jumping.",
    tags: ["table", "sort", "flip", "reorder", "columns"],
    classes: "FLIP: transform: translateY(Δ) → transition-transform duration-500",
  },
  {
    group: "Tables & data",
    slug: "live-cells",
    title: "Live cell updates",
    icon: "bolt",
    description: "Cells flash green or red when a value changes, like a trading screen or live metrics.",
    tags: ["table", "realtime", "streaming", "flash", "ticker", "metrics"],
    classes: "animate-flash-up · animate-flash-down (key change restarts it)",
  },
  {
    group: "Tables & data",
    slug: "spreadsheet",
    title: "Spreadsheet grid",
    icon: "grid",
    description: "An Excel-style sheet: the active cell glides, ranges select by dragging, and copy shows marching ants.",
    tags: ["excel", "sheet", "cells", "selection", "copy", "formula", "keyboard"],
    classes: "transition-all duration-150 · stroke-dasharray + animate-march",
  },
  {
    group: "Tables & data",
    slug: "table-expand",
    title: "Expandable rows",
    icon: "expand",
    description: "Rows open to show details with a smooth height transition and a rotating chevron.",
    tags: ["table", "accordion", "details", "collapse", "height"],
    classes: "grid-rows-[0fr] → grid-rows-[1fr] transition-[grid-template-rows]",
  },
  {
    group: "Tables & data",
    slug: "table-loading",
    title: "Table loading",
    icon: "loader",
    description: "Shimmering skeleton rows hold the layout, then real data fades in row by row.",
    tags: ["table", "skeleton", "shimmer", "loading", "fetch"],
    classes: "animate-shimmer → animate-fade-up [animation-delay]",
  },
  {
    group: "Tables & data",
    slug: "data-bars",
    title: "Data bars & heatmap",
    icon: "chart",
    description: "Conditional formatting in motion: in-cell bars grow, sparklines draw, and a heatmap fills in.",
    tags: ["excel", "conditional formatting", "chart", "sparkline", "heatmap", "bars"],
    classes: "origin-left animate-grow-x · [stroke-dasharray:1] animate-draw",
  },
  {
    group: "Tables & data",
    slug: "table-filter",
    title: "Filter & search",
    icon: "filter",
    description: "Type to filter: rows that don't match collapse away and matching text is highlighted.",
    tags: ["table", "filter", "search", "collapse", "highlight"],
    classes: "grid-rows-[1fr] → grid-rows-[0fr] opacity-0 transition-all",
  },
];

// Sidebar sections and overview groups, in display order
export const groups = [...new Set(animations.map((a) => a.group))];

export function getAnimation(slug) {
  return animations.find((a) => a.slug === slug);
}

export function searchAnimations(query) {
  const q = query.trim().toLowerCase();
  if (!q) return animations;
  return animations.filter((a) =>
    [a.title, a.description, a.slug, ...a.tags].some((field) =>
      field.toLowerCase().includes(q),
    ),
  );
}
