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
  phone: "M8 2h8a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Zm3 17h2",
  island: "M7 9h10a3 3 0 0 1 0 6H7a3 3 0 0 1 0-6Z",
  sheet: "M4 4h16v16H4zM4 12h16m-10 2h4",
  swipe: "M4 8h11M4 12h8M4 16h11m2-7 3 3-3 3",
  stack: "M8 4h12v14H8zM4 8v12h12",
  apps: "M4 4h6v6H4zm10 0h6v6h-6zM4 14h6v6H4zm10 0h6v6h-6z",
  toggle: "M7 7h10a5 5 0 0 1 0 10H7A5 5 0 0 1 7 7Zm10 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z",
  alert: "M5 5h14v10H9l-4 4V5Zm7 3v3m0 2.5h.01",
  chat: "M4 5h16v11H9l-5 4V5Z",
  refresh: "M20 11a8 8 0 1 0-2.3 5.7M20 4v7h-7",
  back: "m15 5-7 7 7 7",
  send: "M12 19V5m0 0-6 6m6-6 6 6",
  music: "M9 18V6l10-2v12M9 18a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm10-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z",
  timer: "M12 21a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm0-12v4l2 2M10 2h4",
  call: "M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z",
  map: "M9 4 3 6v14l6-2 6 2 6-2V4l-6 2-6-2Zm0 0v14m6-12v14",
  pin: "M12 21s-7-6.2-7-11a7 7 0 1 1 14 0c0 4.8-7 11-7 11Zm0-8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z",
  mail: "M3 6h18v12H3zM3 6l9 7 9-7",
  flag: "M5 21V4h11l-2 4 2 4H5",
  more: "M5 12h.01M12 12h.01M19 12h.01",
  camera: "M4 8h3l2-3h6l2 3h3v11H4zM12 17a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z",
  calendar: "M4 6h16v14H4zM4 10h16M8 3v4m8-4v4",
  sun: "M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm0-15v2m0 16v2M2 12h2m16 0h2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4",
  photo: "M4 5h16v14H4zm0 11 5-5 4 4 3-3 4 4M15 9h.01",
  wallet: "M4 7h16v12H4zM4 7l12-3v3m0 6h.01",
  minus: "M5 12h14",
  check:"m5 12 5 5 9-10",
  download: "M12 4v11m0 0-4-4m4 4 4-4M5 20h14",
  copy:"M8 8h12v12H8zM4 16V4h12",
  plus: "M12 5v14M5 12h14",
  trash: "M4 7h16M10 11v6m4-6v6M6 7l1 13h10l1-13M9 7V4h6v3",
  up: "m6 15 6-6 6 6",
  pause: "M8 5v14m8-14v14",
  play: "M7 4v16l13-8L7 4Z",
  sparkle:"M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Zm7 12 .8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8L19 15Z",
};

export default function Icon({ name, className = "h-5 w-5", style }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={style}
      aria-hidden="true"
    >
      <path d={paths[name] ?? paths.sparkle} />
    </svg>
  );
}
