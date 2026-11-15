// One demo per animation page, keyed by slug (see src/lib/animations.js).
// Tailwind only generates classes it can find as complete strings in the source,
// so class names are written out in full and per-item delays use inline styles.
import Icon from "@/components/Icon";

function Panel({ title, subtitle, children, className = "" }) {
  return (
    <section className={`rounded-lg border border-gray-200 bg-white ${className}`}>
      <header className="border-b border-gray-100 px-5 py-3">
        <h2 className="text-sm font-medium text-gray-900">{title}</h2>
        {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
      </header>
      <div className="p-5">{children}</div>
    </section>
  );
}

const delay = (ms) => ({ animationDelay: `${ms}ms` });

const services = [
  { name: "Compute", icon: "layers", color: "bg-blue-100 text-blue-700", stat: "12 instances" },
  { name: "Storage", icon: "panel", color: "bg-emerald-100 text-emerald-700", stat: "3.2 TB" },
  { name: "Networking", icon: "orbit", color: "bg-violet-100 text-violet-700", stat: "4 VPCs" },
  { name: "Functions", icon: "terminal", color: "bg-amber-100 text-amber-700", stat: "28 deployed" },
  { name: "Monitoring", icon: "pulse", color: "bg-rose-100 text-rose-700", stat: "99.98% uptime" },
  { name: "Messaging", icon: "bell", color: "bg-cyan-100 text-cyan-700", stat: "1.4M msgs/day" },
];

function FadeDemo() {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <Panel title="Staggered cards" subtitle="Each card waits 120 ms longer than the last" className="lg:col-span-2">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {services.map((s, i) => (
            <div
              key={s.name}
              style={delay(i * 120)}
              className="animate-fade-up rounded-lg border border-gray-200 p-4 shadow-xs"
            >
              <span className={`mb-3 flex h-9 w-9 items-center justify-center rounded-md ${s.color}`}>
                <Icon name={s.icon} className="h-5 w-5" />
              </span>
              <p className="font-medium text-gray-900">{s.name}</p>
              <p className="text-sm text-gray-500">{s.stat}</p>
            </div>
          ))}
        </div>
      </Panel>
      <Panel title="List rows" subtitle="Faster stagger for dense lists">
        <ul className="divide-y divide-gray-100">
          {["api-gateway", "auth-service", "billing-worker", "image-resizer", "search-indexer", "web-frontend"].map(
            (name, i) => (
              <li key={name} style={delay(300 + i * 70)} className="flex animate-fade-up items-center justify-between py-2.5">
                <span className="font-mono text-sm text-gray-800">{name}</span>
                <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-700">Running</span>
              </li>
            ),
          )}
        </ul>
      </Panel>
    </div>
  );
}

function SlideDemo() {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="animate-slide-in-left">
        <Panel title="From the left" subtitle="animate-slide-in-left">
          <div className="space-y-3">
            {["Create a bucket", "Upload your files", "Set access permissions"].map((step, i) => (
              <div key={step} style={delay(200 + i * 120)} className="flex animate-slide-in-left items-center gap-3 rounded-md bg-gray-50 p-3">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-sm font-medium text-white">
                  {i + 1}
                </span>
                <span className="text-sm text-gray-800">{step}</span>
              </div>
            ))}
          </div>
        </Panel>
      </div>
      <div className="animate-slide-in-right" style={delay(150)}>
        <Panel title="From the right" subtitle="Toast notifications stacking in">
          <div className="space-y-3">
            {[
              { text: "Deployment web-frontend succeeded", tone: "border-green-500" },
              { text: "Autoscaler added 2 instances", tone: "border-blue-500" },
              { text: "Budget alert: 80% of monthly spend", tone: "border-amber-500" },
            ].map((t, i) => (
              <div
                key={t.text}
                style={delay(400 + i * 200)}
                className={`flex animate-slide-in-right items-center justify-between rounded-md border-l-4 bg-white p-3 shadow-md ring-1 ring-gray-100 ${t.tone}`}
              >
                <span className="text-sm text-gray-800">{t.text}</span>
                <Icon name="close" className="h-4 w-4 text-gray-400" />
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
}

function BounceDemo() {
  const balls = ["bg-blue-500", "bg-red-500", "bg-yellow-400", "bg-green-500"];
  return (
    <div className="grid gap-6 md:grid-cols-3">
      <Panel title="Typing indicator" subtitle="Three dots, offset by 150 ms">
        <div className="flex h-32 items-center justify-center">
          <div className="flex items-center gap-1.5 rounded-2xl bg-gray-100 px-4 py-3">
            {[0, 1, 2].map((i) => (
              <span key={i} style={delay(i * 150)} className="h-2.5 w-2.5 animate-bounce rounded-full bg-gray-500" />
            ))}
          </div>
        </div>
      </Panel>
      <Panel title="Bouncing balls" subtitle="Same animation, staggered phase">
        <div className="flex h-32 items-end justify-center gap-4 pb-2">
          {balls.map((c, i) => (
            <span key={c} style={delay(i * -200)} className={`h-8 w-8 animate-bounce rounded-full shadow-md ${c}`} />
          ))}
        </div>
      </Panel>
      <Panel title="Call to action" subtitle="Draw the eye to what's next">
        <div className="flex h-32 flex-col items-center justify-center gap-2 text-blue-700">
          <span className="text-sm font-medium">Scroll to see more</span>
          <Icon name="dropdown" className="h-6 w-6 animate-bounce" />
        </div>
      </Panel>
    </div>
  );
}

function SpinnersDemo() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      <Panel title="Ring">
        <div className="flex h-28 items-center justify-center">
          <span className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
        </div>
      </Panel>
      <Panel title="Four colour">
        <div className="flex h-28 items-center justify-center">
          <span className="h-12 w-12 animate-spin rounded-full border-4 border-b-yellow-400 border-l-green-500 border-r-red-500 border-t-blue-500" />
        </div>
      </Panel>
      <Panel title="Double ring">
        <div className="relative flex h-28 items-center justify-center">
          <span className="absolute h-14 w-14 animate-spin rounded-full border-4 border-violet-200 border-t-violet-600" />
          <span className="absolute h-8 w-8 animate-spin-reverse rounded-full border-4 border-violet-200 border-b-violet-600 [animation-duration:1s]" />
        </div>
      </Panel>
      <Panel title="Pulsing dots">
        <div className="flex h-28 items-center justify-center gap-2">
          {[0, 1, 2].map((i) => (
            <span key={i} style={delay(i * 200)} className="h-3 w-3 animate-pulse rounded-full bg-blue-600" />
          ))}
        </div>
      </Panel>
      <Panel title="In buttons" subtitle="Show work in progress where it happens" className="sm:col-span-2">
        <div className="flex flex-wrap items-center gap-3">
          <button type="button" className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            Deploying…
          </button>
          <button type="button" className="inline-flex items-center gap-2 rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700">
            <Icon name="replay" className="h-4 w-4 animate-spin" />
            Refreshing
          </button>
        </div>
      </Panel>
      <Panel title="Progress" subtitle="Determinate and shimmering" className="sm:col-span-2">
        <div className="space-y-4">
          <div className="h-1.5 overflow-hidden rounded-full bg-blue-100">
            <div className="h-full w-2/3 animate-pulse rounded-full bg-blue-600" />
          </div>
          <div className="h-1.5 animate-shimmer rounded-full bg-linear-to-r from-blue-100 via-blue-600 to-blue-100 bg-size-[200%_100%]" />
        </div>
      </Panel>
    </div>
  );
}

function PulseDemo() {
  const instances = [
    { name: "web-frontend-1", zone: "us-central1-a", status: "Running", dot: "bg-green-500", ping: "bg-green-400" },
    { name: "api-gateway-2", zone: "europe-west1-b", status: "Starting", dot: "bg-amber-500", ping: "bg-amber-400" },
    { name: "batch-worker-7", zone: "asia-east1-c", status: "Error", dot: "bg-red-500", ping: "bg-red-400" },
  ];
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <Panel title="Live status" subtitle="animate-ping behind a solid dot" className="lg:col-span-2">
        <table className="w-full text-left text-sm">
          <thead className="text-xs uppercase tracking-wide text-gray-500">
            <tr>
              <th className="pb-2 font-medium">Status</th>
              <th className="pb-2 font-medium">Name</th>
              <th className="hidden pb-2 font-medium sm:table-cell">Zone</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {instances.map((vm) => (
              <tr key={vm.name}>
                <td className="py-3">
                  <span className="inline-flex items-center gap-2">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 ${vm.ping}`} />
                      <span className={`relative inline-flex h-2.5 w-2.5 rounded-full ${vm.dot}`} />
                    </span>
                    {vm.status}
                  </span>
                </td>
                <td className="py-3 font-mono text-gray-800">{vm.name}</td>
                <td className="hidden py-3 text-gray-500 sm:table-cell">{vm.zone}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>
      <Panel title="Notification badge">
        <div className="flex h-32 items-center justify-center">
          <span className="relative text-gray-700">
            <Icon name="bell" className="h-10 w-10" />
            <span className="absolute -right-1 -top-1 flex h-5 w-5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                3
              </span>
            </span>
          </span>
        </div>
      </Panel>
      <Panel title="Skeleton loading" subtitle="animate-pulse on placeholder shapes" className="lg:col-span-3">
        <div className="grid gap-4 sm:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="animate-pulse space-y-3 rounded-lg border border-gray-100 p-4">
              <div className="h-24 rounded-md bg-gray-200" />
              <div className="h-3 w-3/4 rounded-sm bg-gray-200" />
              <div className="h-3 w-1/2 rounded-sm bg-gray-200" />
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}

function WaveDemo() {
  const heights = [40, 65, 90, 55, 75, 100, 60, 85, 45, 70, 95, 50, 80, 65, 100, 55, 75, 40, 90, 60, 70, 85, 50, 65];
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <Panel title="Equalizer" subtitle="24 bars, 70 ms apart, scaling from the bottom" className="lg:col-span-2">
        <div className="flex h-48 items-end justify-center gap-1 sm:gap-1.5">
          {heights.map((h, i) => (
            <span
              key={i}
              style={{ height: `${h}%`, ...delay(i * -70) }}
              className="w-2 origin-bottom animate-wave rounded-t bg-linear-to-t from-blue-600 to-cyan-400 sm:w-3"
            />
          ))}
        </div>
      </Panel>
      <Panel title="Now playing">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 shrink-0 animate-gradient-pan items-center justify-center rounded-md bg-linear-to-br from-violet-500 via-fuchsia-500 to-orange-400 bg-size-[200%_200%]">
            <Icon name="wave" className="h-6 w-6 text-white" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate font-medium text-gray-900">Latency Lullaby</p>
            <p className="text-sm text-gray-500">The Load Balancers</p>
          </div>
          <div className="flex h-5 items-end gap-0.5">
            {[0, 1, 2, 3].map((i) => (
              <span key={i} style={delay(i * -250)} className="h-full w-1 origin-bottom animate-wave rounded-xs bg-violet-600" />
            ))}
          </div>
        </div>
      </Panel>
    </div>
  );
}

function FlipDemo() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {services.slice(0, 3).map((s) => (
        <div key={s.name} tabIndex={0} className="group h-56 rounded-lg perspective-[1000px] focus:outline-hidden">
          <div className="relative h-full w-full rounded-lg shadow-xs transition-transform duration-700 transform-3d group-hover:transform-[rotateY(180deg)] group-focus:transform-[rotateY(180deg)]">
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-lg border border-gray-200 bg-white backface-hidden">
              <span className={`flex h-14 w-14 items-center justify-center rounded-xl ${s.color}`}>
                <Icon name={s.icon} className="h-7 w-7" />
              </span>
              <p className="text-lg font-medium text-gray-900">{s.name}</p>
              <p className="text-xs text-gray-500">Hover or focus to flip</p>
            </div>
            <div className="absolute inset-0 flex flex-col justify-center gap-2 rounded-lg bg-linear-to-br from-blue-600 to-indigo-700 p-6 text-white backface-hidden transform-[rotateY(180deg)]">
              <p className="text-sm uppercase tracking-wide text-blue-100">{s.name}</p>
              <p className="text-3xl font-semibold">{s.stat}</p>
              <p className="text-sm text-blue-100">Up 12% from last week</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function OrbitDemo() {
  const inner = ["bg-blue-500", "bg-red-500", "bg-yellow-400"];
  const outer = ["bg-green-500", "bg-violet-500", "bg-cyan-500", "bg-pink-500", "bg-orange-500"];
  // Place n nodes evenly around a ring using rotate → translate
  const ring = (colors, radius, size) =>
    colors.map((c, i) => (
      <span
        key={c}
        style={{ transform: `rotate(${(360 / colors.length) * i}deg) translateX(${radius}px)` }}
        className="absolute left-1/2 top-1/2 h-0 w-0"
      >
        <span className={`-ml-2 -mt-2 block rounded-full shadow-md ring-4 ring-white ${size} ${c}`} />
      </span>
    ));
  // 288px stage: inner ring inset 18% → radius 92px, outer ring radius 144px
  return (
    <Panel title="Service mesh" subtitle="Two rings spinning in opposite directions at different speeds">
      <div className="relative mx-auto my-4 h-72 w-72">
        <div className="absolute inset-[34%] flex animate-pulse items-center justify-center rounded-full bg-linear-to-br from-blue-600 to-indigo-600 text-white shadow-lg">
          <Icon name="sparkle" className="h-8 w-8" />
        </div>
        <div className="absolute inset-[18%] animate-spin-slow rounded-full border border-dashed border-gray-300">
          {ring(inner, 92, "h-4 w-4")}
        </div>
        <div className="absolute inset-0 animate-spin-reverse rounded-full border border-dashed border-gray-200">
          {ring(outer, 144, "h-4 w-4")}
        </div>
      </div>
    </Panel>
  );
}

function TypewriterDemo() {
  const lines = [
    { text: "$ motion deploy web-frontend --region us-central1", cls: "text-gray-100" },
    { text: "Building container image... done", cls: "text-gray-400" },
    { text: "Rolling out revision web-frontend-00042... done", cls: "text-gray-400" },
    { text: "✔ Service is live at https://web-frontend.example.dev", cls: "text-green-400" },
  ];
  let start = 0;
  return (
    <div className="grid gap-6">
      <Panel title="Headline" subtitle="steps() timing reveals one character at a time">
        <h2
          style={{ "--typing-width": "22ch" }}
          className="animate-typing overflow-hidden whitespace-nowrap border-r-4 font-mono text-2xl font-semibold text-blue-700 sm:text-4xl"
        >
          Build. Deploy. Animate.
        </h2>
      </Panel>
      <Panel title="Terminal" subtitle="Each line starts when the previous one finishes">
        <div className="overflow-x-auto rounded-lg bg-gray-900 p-5 font-mono text-sm leading-7 shadow-inner">
          {lines.map((line, i) => {
            const duration = line.text.length * 35;
            const lineDelay = start;
            start += duration + 250;
            const last = i === lines.length - 1;
            return (
              <p
                key={i}
                style={{
                  "--typing-width": `${line.text.length}ch`,
                  animation: `typing ${duration}ms steps(${line.text.length}, end) ${lineDelay}ms both${
                    last ? ", caret 0.8s step-end infinite" : ""
                  }`,
                }}
                className={`w-0 overflow-hidden whitespace-nowrap ${last ? "border-r-2" : ""} ${line.cls}`}
              >
                {line.text}
              </p>
            );
          })}
        </div>
      </Panel>
    </div>
  );
}

function GradientDemo() {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="flex min-h-48 animate-gradient-pan flex-col justify-end rounded-lg bg-linear-to-r from-blue-600 via-violet-500 to-pink-500 bg-size-[200%_200%] p-6 text-white shadow-md lg:col-span-2">
        <p className="text-sm uppercase tracking-wider text-white/80">Hero banner</p>
        <p className="text-3xl font-semibold">A background that never sits still</p>
      </div>
      <Panel title="Gradient text">
        <p className="animate-gradient-pan bg-linear-to-r from-blue-600 via-emerald-500 to-blue-600 bg-size-[200%_auto] bg-clip-text text-4xl font-bold text-transparent">
          Ship faster.
        </p>
      </Panel>
      <Panel title="Shimmer placeholders" subtitle="A highlight sweeps across loading content">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 shrink-0 animate-shimmer rounded-full bg-linear-to-r from-gray-100 via-gray-200 to-gray-100 bg-size-[200%_100%]" />
          <div className="flex-1 space-y-2">
            <div className="h-3 w-3/4 animate-shimmer rounded-sm bg-linear-to-r from-gray-100 via-gray-200 to-gray-100 bg-size-[200%_100%]" />
            <div className="h-3 w-1/2 animate-shimmer rounded-sm bg-linear-to-r from-gray-100 via-gray-200 to-gray-100 bg-size-[200%_100%]" />
          </div>
        </div>
      </Panel>
    </div>
  );
}

export const demos = {
  fade: FadeDemo,
  slide: SlideDemo,
  bounce: BounceDemo,
  spinners: SpinnersDemo,
  pulse: PulseDemo,
  wave: WaveDemo,
  flip: FlipDemo,
  orbit: OrbitDemo,
  typewriter: TypewriterDemo,
  gradient: GradientDemo,
};
