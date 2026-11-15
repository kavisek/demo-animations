"use client";

import { useCallback, useRef, useState } from "react";
import CodeViewer from "@/components/CodeViewer";
import Icon from "@/components/Icon";

const buttonCls =
  "inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-blue-700 transition hover:bg-blue-50 active:scale-95";

// Page header with Replay (remounts the demo, restarting its CSS animations)
// and Code (opens a panel with the demo's HTML and CSS).
export default function Replayable({ title, slug, description, children }) {
  const [run, setRun] = useState(0);
  const [showCode, setShowCode] = useState(false);
  const demoRef = useRef(null);
  const getRoot = useCallback(() => demoRef.current, []);
  const close = useCallback(() => setShowCode(false), []);

  return (
    <>
      <div className="mb-2 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-normal text-gray-900">{title}</h1>
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => setShowCode(true)} className={buttonCls}>
            <Icon name="terminal" className="h-4 w-4" />
            Code
          </button>
          <button type="button" onClick={() => setRun((n) => n + 1)} className={buttonCls}>
            <Icon name="replay" className="h-4 w-4" />
            Replay
          </button>
        </div>
      </div>
      <p className="mb-6 max-w-2xl text-sm text-gray-600">{description}</p>
      <div key={run} ref={demoRef}>
        {children}
      </div>
      {showCode && <CodeViewer title={title} slug={slug} getRoot={getRoot} onClose={close} />}
    </>
  );
}
