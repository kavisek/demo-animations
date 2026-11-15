// Small inline icon set (24x24, stroke-based) so the app has no icon dependency.
const paths = {
  menu: "M4 6h16M4 12h16M4 18h16",
  search: "M11 19a8 8 0 1 1 0-16 8 8 0 0 1 0 16Zm10 2-4.35-4.35",
  close: "M6 6l12 12M18 6 6 18",
  home: "M3 11.5 12 4l9 7.5M5 10v10h5v-6h4v6h5V10",
  help: "M12 21a9 9 0 1 1 0-18 9 9 0 0 1 0 18Zm-2.5-11.5a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .9-1 1.6v.6M12 17h.01",
  bell: "M6 16V11a6 6 0 1 1 12 0v5l2 2H4l2-2Zm4 4h4",
  settings:
    "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm7.4-3a7.4 7.4 0 0 0-.1-1.2l2-1.6-2-3.4-2.4 1a7.6 7.6 0 0 0-2-1.2L14.5 3h-5l-.4 2.6a7.6 7.6 0 0 0-2 1.2l-2.4-1-2 3.4 2 1.6a7.4 7.4 0 0 0 0 2.4l-2 1.6 2 3.4 2.4-1a7.6 7.6 0 0 0 2 1.2l.4 2.6h5l.4-2.6a7.6 7.6 0 0 0 2-1.2l2.4 1 2-3.4-2-1.6c.1-.4.1-.8.1-1.2Z",
  replay: "M4 4v6h6M20 20v-6h-6M5.5 15a7 7 0 0 0 12.6 2M18.5 9A7 7 0 0 0 5.9 7",
  chevron: "m9 6 6 6-6 6",
  dropdown: "m7 10 5 5 5-5",
  arrow: "M5 12h14m-6-6 6 6-6 6",
  layers: "m12 3 9 5-9 5-9-5 9-5Zm-9 9 9 5 9-5M3 16l9 5 9-5",
  panel: "M4 4h16v16H4zM9 4v16",
  bounce: "M12 4a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm-7 16h14M8 14l-2 6m10-6 2 6",
  spinner: "M12 3a9 9 0 1 0 9 9",
  pulse: "M3 12h4l2-6 4 12 2-6h6",
  wave: "M4 10v4M8 6v12M12 3v18M16 7v10M20 10v4",
  flip: "M4 6h7v12H4zM13 6h7v12h-7M8 3l4 2-4 2",
  orbit: "M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm0 7a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm7-14.5h.01",
  terminal: "M4 5h16v14H4zM8 10l3 2-3 2m5 0h3",
  table: "M3 5h18v14H3zM3 10h18M3 15h18M9 10v9",
  grid: "M3 3h18v18H3zM3 9h18M3 15h18M9 3v18M15 3v18",
  sort: "M7 4v16m0 0-3-3m3 3 3-3M17 20V4m0 0-3 3m3-3 3 3",
  bolt: "M13 2 4 14h7l-1 8 9-12h-7l1-8Z",
  filter: "M3 5h18l-7 8v6l-4 2v-8L3 5Z",
  chart: "M3 20h18M6 16v-5m5 5V6m5 10V9",
  rows: "M4 6h16M4 12h16M4 18h9m5-3v6m-3-3h6",
  expand: "M4 6h16M4 10h16M8 14h12M8 18h12",
  loader: "M4 6h16M4 12h10M4 18h13",
  check: "m5 12 5 5 9-10",
  download: "M12 4v11m0 0-4-4m4 4 4-4M5 20h14",
  copy:"M8 8h12v12H8zM4 16V4h12",
  plus: "M12 5v14M5 12h14",
  trash: "M4 7h16M10 11v6m4-6v6M6 7l1 13h10l1-13M9 7V4h6v3",
  up: "m6 15 6-6 6 6",
  pause: "M8 5v14m8-14v14",
  play: "M7 4v16l13-8L7 4Z",
  sparkle:"M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Zm7 12 .8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8L19 15Z",
};

export default function Icon({ name, className = "h-5 w-5" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d={paths[name] ?? paths.sparkle} />
    </svg>
  );
}
