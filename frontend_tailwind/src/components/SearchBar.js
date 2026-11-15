"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Icon from "@/components/Icon";
import { getProject, searchAnimations } from "@/lib/animations";

export default function SearchBar() {
  const router = useRouter();
  const inputRef = useRef(null);
  const listId = useId();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);

  const results = searchAnimations(query);

  // Press "/" anywhere to jump to the search bar, like most cloud consoles
  useEffect(() => {
    function onKey(e) {
      const typing = ["INPUT", "TEXTAREA"].includes(document.activeElement?.tagName);
      if (e.key === "/" && !typing) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  function go(animation) {
    router.push(`/${animation.project}/${animation.slug}`);
    setQuery("");
    setOpen(false);
    inputRef.current?.blur();
  }

  function onKeyDown(e) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setOpen(true);
      setActive((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && results[active]) {
      e.preventDefault();
      go(results[active]);
    } else if (e.key === "Escape") {
      setOpen(false);
      inputRef.current?.blur();
    }
  }

  return (
    <div className="relative w-full max-w-2xl">
      <div className="group flex h-10 items-center gap-2 rounded-lg border border-transparent bg-gray-100 px-3 transition focus-within:border-gray-200 focus-within:bg-white focus-within:shadow-md">
        <Icon name="search" className="h-5 w-5 shrink-0 text-gray-500" />
        <input
          ref={inputRef}
          type="search"
          role="combobox"
          aria-expanded={open}
          aria-controls={listId}
          aria-activedescendant={open && results[active] ? `${listId}-${active}` : undefined}
          aria-label="Search animations"
          placeholder="Search all projects, e.g. spin, sheet, chart"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setActive(0);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => setOpen(false)}
          onKeyDown={onKeyDown}
          className="min-w-0 flex-1 bg-transparent text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none [&::-webkit-search-cancel-button]:hidden"
        />
        {query ? (
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => setQuery("")}
            className="rounded-full p-1 text-gray-500 hover:bg-gray-200"
            aria-label="Clear search"
          >
            <Icon name="close" className="h-4 w-4" />
          </button>
        ) : (
          <kbd className="hidden rounded border border-gray-300 bg-white px-1.5 font-mono text-xs text-gray-500 sm:block">
            /
          </kbd>
        )}
      </div>

      {open && (
        <div
          // Keep focus in the input while clicking a result
          onMouseDown={(e) => e.preventDefault()}
          className="absolute left-0 right-0 top-12 z-50 origin-top animate-pop-in overflow-hidden rounded-lg border border-gray-200 bg-white shadow-xl"
        >
          <p className="border-b border-gray-100 px-4 py-2 text-xs font-medium uppercase tracking-wide text-gray-500">
            {query ? `${results.length} result${results.length === 1 ? "" : "s"}` : "All animations"}
          </p>
          <ul id={listId} role="listbox" className="max-h-80 overflow-y-auto py-1">
            {results.length === 0 && (
              <li className="px-4 py-6 text-center text-sm text-gray-500">
                No animations match “{query}”.
              </li>
            )}
            {results.map((a, i) => (
              <li
                key={`${a.project}-${a.slug}`}
                id={`${listId}-${i}`}
                role="option"
                aria-selected={i === active}
                onMouseEnter={() => setActive(i)}
                onClick={() => go(a)}
                className={`flex cursor-pointer items-center gap-3 px-4 py-2.5 ${
                  i === active ? "bg-blue-50" : ""
                }`}
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-blue-100 text-blue-700">
                  <Icon name={a.icon} className="h-4 w-4" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-900">{a.title}</span>
                    <span className="rounded bg-gray-100 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-gray-500">
                      {getProject(a.project).name}
                    </span>
                  </span>
                  <span className="block truncate text-xs text-gray-500">{a.description}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
