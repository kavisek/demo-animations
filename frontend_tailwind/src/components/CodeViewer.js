"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Icon from "@/components/Icon";
import { extractCss, extractHtml, standaloneDocument } from "@/lib/extractCode";

const TABS = [
  { id: "html", label: "HTML" },
  { id: "css", label: "CSS" },
  { id: "file", label: "Standalone file" },
];

export default function CodeViewer({ title, slug, getRoot, onClose }) {
  const [tab, setTab] = useState("html");
  const [code, setCode] = useState(null);
  const [copied, setCopied] = useState(false);
  const closeRef = useRef(null);
  const preRef = useRef(null);

  // Snapshot the demo as it is right now (interactive demos change as you use them)
  const snapshot = useCallback(() => {
    const root = getRoot();
    if (!root) return;
    const html = extractHtml(root);
    const css = extractCss(root);
    setCode({ html, css, file: standaloneDocument(title, html, css) });
  }, [getRoot, title]);

  useEffect(() => {
    snapshot();
    closeRef.current?.focus();
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [snapshot, onClose]);

  const text = code?.[tab] ?? "";
  const lines = text ? text.split("\n").length : 0;

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // Clipboard blocked: select the code so the user can press ⌘/Ctrl+C
      const range = document.createRange();
      range.selectNodeContents(preRef.current);
      window.getSelection().removeAllRanges();
      window.getSelection().addRange(range);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  function download() {
    const url = URL.createObjectURL(new Blob([code.file], { type: "text/html" }));
    const a = Object.assign(document.createElement("a"), { href: url, download: `${slug}.html` });
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <>
      <div onClick={onClose} className="fixed inset-0 top-14 z-40 animate-fade-in bg-gray-900/30" />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label={`Code for ${title}`}
        className="fixed bottom-0 right-0 top-14 z-50 flex w-full max-w-3xl animate-slide-in-right flex-col border-l border-gray-200 bg-white shadow-2xl"
      >
        <header className="flex items-center justify-between gap-3 border-b border-gray-200 px-5 py-3">
          <div className="min-w-0">
            <h2 className="truncate text-base font-medium text-gray-900">Code · {title}</h2>
            <p className="text-xs text-gray-500">Snapshot of the rendered demo and the CSS rules it uses</p>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close code panel"
            className="rounded-full p-2 text-gray-500 transition hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            <Icon name="close" />
          </button>
        </header>

        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-200 px-5">
          <div role="tablist" className="flex">
            {TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                role="tab"
                aria-selected={tab === t.id}
                onClick={() => setTab(t.id)}
                className={`relative px-3 py-3 text-sm font-medium transition-colors ${
                  tab === t.id ? "text-blue-700" : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {t.label}
                <span
                  className={`absolute inset-x-2 bottom-0 h-0.5 rounded-full bg-blue-600 transition-transform duration-200 ${
                    tab === t.id ? "scale-x-100" : "scale-x-0"
                  }`}
                />
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 py-2">
            <button
              type="button"
              onClick={snapshot}
              title="Re-read the demo, e.g. after sorting or selecting"
              className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm text-gray-700 transition hover:bg-gray-100"
            >
              <Icon name="replay" className="h-4 w-4" />
              Refresh
            </button>
            <button
              type="button"
              onClick={download}
              disabled={!code}
              className="inline-flex items-center gap-1.5 rounded-md border border-gray-300 px-2.5 py-1.5 text-sm text-gray-700 transition hover:bg-gray-50"
            >
              <Icon name="download" className="h-4 w-4" />
              Download .html
            </button>
            <button
              type="button"
              onClick={copy}
              disabled={!code}
              className={`inline-flex min-w-[7.5rem] items-center justify-center gap-1.5 whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium text-white transition active:scale-95 ${
                copied ? "bg-green-600" : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              <Icon name={copied ? "check" : "copy"} className="h-4 w-4" />
              {copied ? "Copied" : tab === "file" ? "Copy file" : `Copy ${tab.toUpperCase()}`}
            </button>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-auto bg-gray-950">
          <pre
            ref={preRef}
            key={tab + lines}
            className="animate-fade-in p-5 font-mono text-xs leading-5 text-gray-100 selection:bg-blue-500/40"
          >
            <code>{code ? text : "Reading the demo…"}</code>
          </pre>
        </div>

        <footer className="border-t border-gray-200 bg-gray-50 px-5 py-2 text-xs text-gray-500">
          {lines.toLocaleString()} lines · {(new Blob([text]).size / 1024).toFixed(1)} KB
          {tab === "file" && " · Open it in any browser; no build step or Tailwind needed"}
          {tab === "html" && " · Interactive behaviour (sorting, live updates) comes from React and isn't included"}
        </footer>
      </aside>
    </>
  );
}
