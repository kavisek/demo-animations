import Link from "next/link";
import Icon from "@/components/Icon";
import { animations, groupsFor, projects } from "@/lib/animations";

// What each card's icon does on hover: a preview of the page behind it
const hoverPreview = {
  fade: "group-hover:animate-fade-up",
  slide: "group-hover:animate-slide-in-left",
  bounce: "group-hover:animate-bounce",
  spinners: "group-hover:animate-spin",
  pulse: "group-hover:animate-pulse",
  wave: "group-hover:animate-wave",
  flip: "group-hover:transform-[rotateY(180deg)]",
  orbit: "group-hover:animate-spin-slow",
  typewriter: "group-hover:animate-pulse",
  gradient: "group-hover:animate-float",
  "table-rows": "group-hover:animate-fade-up",
  "table-sort": "group-hover:rotate-180",
  "live-cells": "group-hover:animate-pulse",
  spreadsheet: "group-hover:scale-110",
  "table-expand": "group-hover:animate-bounce",
  "table-loading": "group-hover:animate-pulse",
  "data-bars": "group-hover:animate-wave",
  "table-filter": "group-hover:animate-bounce",
  "dynamic-island": "group-hover:scale-x-125",
  notifications: "group-hover:animate-bounce",
  "app-launch": "group-hover:scale-125",
  alerts: "group-hover:animate-pulse",
  "push-navigation": "group-hover:translate-x-1",
  "bottom-sheet": "group-hover:-translate-y-1",
  "swipe-actions": "group-hover:-translate-x-1",
  "pull-to-refresh": "group-hover:animate-spin",
  controls: "group-hover:rotate-180",
  chat: "group-hover:animate-bounce",
  "chart-columns": "group-hover:animate-wave",
  "chart-stacked": "group-hover:animate-fade-up",
  "chart-race": "group-hover:rotate-180",
  "chart-line": "group-hover:animate-pulse",
  "chart-live": "group-hover:animate-pulse",
  "chart-donut": "group-hover:animate-spin-slow",
  "chart-scatter": "group-hover:animate-float",
  "chart-kpi": "group-hover:animate-pulse",
};

// The banner's gradient differs per project so each one feels distinct
const banners = {
  web: "from-blue-600 via-indigo-600 to-violet-600",
  ios: "from-gray-900 via-slate-800 to-indigo-900",
  charts: "from-teal-600 via-sky-600 to-blue-700",
};

export default function ProjectOverview({ project }) {
  const items = animations.filter((a) => a.project === project.id);
  const groups = groupsFor(project.id);
  const stats = [
    { label: "Animations", value: items.length, icon: "sparkle" },
    { label: "Categories", value: groups.length, icon: "layers" },
    { label: "Projects", value: projects.length, icon: "apps" },
  ];

  return (
    <>
      <section
        className={`relative mb-8 animate-gradient-pan overflow-hidden rounded-xl bg-linear-to-r bg-size-[200%_200%] p-6 text-white shadow-md sm:p-8 ${banners[project.id]}`}
      >
        <div className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 animate-spin-slower rounded-full border-16 border-dashed border-white/10" />
        <div className="pointer-events-none absolute bottom-[-60px] right-24 h-32 w-32 animate-float rounded-full bg-white/10" />
        <p className="animate-fade-up text-sm font-medium uppercase tracking-wider text-blue-100">
          {project.name}
        </p>
        <h1 style={{ animationDelay: "100ms" }} className="mt-1 max-w-xl animate-fade-up text-2xl font-semibold sm:text-3xl">
          {project.tagline}
        </h1>
        <p style={{ animationDelay: "200ms" }} className="mt-2 max-w-xl animate-fade-up text-sm text-white/80">
          {project.description} Switch projects from the header, or press{" "}
          <kbd className="rounded-sm bg-white/20 px-1.5 font-mono">/</kbd> to search every project.
        </p>
      </section>

      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        {stats.map((s, i) => (
          <div
            key={s.label}
            style={{ animationDelay: `${300 + i * 100}ms` }}
            className="flex animate-fade-up items-center gap-4 rounded-lg border border-gray-200 bg-white p-4"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-blue-700">
              <Icon name={s.icon} />
            </span>
            <div>
              <p className="text-2xl font-normal text-gray-900">{s.value}</p>
              <p className="text-sm text-gray-500">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {groups.map((group) => (
        <section key={group} className="mb-10">
          <h2 className="mb-4 text-lg font-normal text-gray-900">{group}</h2>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {items
              .filter((a) => a.group === group)
              .map((a, i) => (
                // The entrance animation lives on a wrapper: its fill-mode would otherwise
                // pin `transform` and cancel the card's hover lift.
                <div key={a.slug} style={{ animationDelay: `${400 + i * 60}ms` }} className="flex animate-fade-up">
                  <Link
                    href={`/${a.project}/${a.slug}`}
                    className="group flex flex-1 flex-col rounded-lg border border-gray-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md focus:outline-hidden focus-visible:ring-2 focus-visible:ring-blue-500"
                  >
                    <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-blue-50 text-blue-700 perspective-[400px]">
                      <Icon
                        name={a.icon}
                        className={`h-6 w-6 origin-bottom transition-transform duration-500 ${hoverPreview[a.slug] ?? "group-hover:scale-110"}`}
                      />
                    </span>
                    <span className="font-medium text-gray-900">{a.title}</span>
                    <span className="mt-1 flex-1 text-sm text-gray-600">{a.description}</span>
                    <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-blue-700">
                      View demo
                      <Icon name="arrow" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </Link>
                </div>
              ))}
          </div>
        </section>
      ))}
    </>
  );
}
