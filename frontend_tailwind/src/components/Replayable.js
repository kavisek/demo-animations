"use client";

import { useCallback, useRef, useState } from "react";
import { snapshotDemo } from "@/lib/extractCode";
import CodeViewer from "@/components/CodeViewer";
import Icon from "@/components/Icon";

const buttonCls =
  "inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-blue-700 transition hover:bg-blue-50 active:scale-95";

// Page header with Replay (remounts the demo, restarting its CSS animations)
// and Code (opens a panel with the demo's HTML and CSS).
export default function Replayable({ title, slug, description, children }) {
  const [run, setRun] = useState(0);
  const [code, setCode] = useState(null); // a snapshot while the Code panel is open
  const demoRef = useRef(null);
  // Read the demo when asked (on open and on Refresh); interactive demos change as you use them
  const snapshot = () => setCode(snapshotDemo(demoRef.current, title));
  const close = useCallback(() => setCode(null), []);

  return (
    <>
      <div className="mb-2 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-normal text-gray-900">{title}</h1>
        <div className="flex items-center gap-2">
          <button type="button" onClick={snapshot} className={buttonCls}>
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
      {code && <CodeViewer title={title} slug={slug} code={code} onRefresh={snapshot} onClose={close} />}
    </>
  );
}
