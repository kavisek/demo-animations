import Link from "next/link";
import Icon from "@/components/Icon";
import { animations, groups } from "@/lib/animations";

// What each card's icon does on hover: a preview of the page behind it
const hoverPreview = {
  fade: "group-hover:animate-fade-up",
  slide: "group-hover:animate-slide-in-left",
  bounce: "group-hover:animate-bounce",
  spinners: "group-hover:animate-spin",
  pulse: "group-hover:animate-pulse",
  wave: "group-hover:animate-wave",
  flip: "group-hover:[transform:rotateY(180deg)]",
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
};

const stats = [
  { label: "Animations", value: animations.length, icon: "sparkle" },
  { label: "Categories", value: groups.length, icon: "layers" },
  { label: "Runtime JS for motion", value: "0 kB", icon: "terminal" },
];

export default function Home() {
  return (
    <>
      <section className="relative mb-8 animate-gradient-pan overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-[length:200%_200%] p-6 text-white shadow-md sm:p-8">
        <div className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 animate-spin-slower rounded-full border-[16px] border-dashed border-white/10" />
        <div className="pointer-events-none absolute bottom-[-60px] right-24 h-32 w-32 animate-float rounded-full bg-white/10" />
        <p className="animate-fade-up text-sm font-medium uppercase tracking-wider text-blue-100">
          Welcome to Motion Console
        </p>
        <h1 style={{ animationDelay: "100ms" }} className="mt-1 max-w-xl animate-fade-up text-2xl font-semibold sm:text-3xl">
          A gallery of animations built with Tailwind CSS
        </h1>
        <p style={{ animationDelay: "200ms" }} className="mt-2 max-w-xl animate-fade-up text-sm text-blue-100">
          Pick an animation from the sidebar, or press <kbd className="rounded bg-white/20 px-1.5 font-mono">/</kbd> to
          search. Every demo uses Tailwind utilities and keyframes, with no animation library.
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
            {animations
              .filter((a) => a.group === group)
              .map((a, i) => (
                // The entrance animation lives on a wrapper: its fill-mode would otherwise
                // pin `transform` and cancel the card's hover lift.
                <div key={a.slug} style={{ animationDelay: `${400 + i * 60}ms` }} className="flex animate-fade-up">
                  <Link
                    href={`/animations/${a.slug}`}
                    className="group flex flex-1 flex-col rounded-lg border border-gray-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                  >
                    <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-blue-50 text-blue-700 [perspective:400px]">
                      <Icon
                        name={a.icon}
                        className={`h-6 w-6 origin-bottom transition-transform duration-500 ${hoverPreview[a.slug]}`}
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
