"use client";

import { useState } from "react";
import NDAForm from "@/components/NDAForm";
import NDAPreview from "@/components/NDAPreview";
import { NDAFormData, defaultFormData } from "@/lib/types";
import { downloadMarkdown } from "@/lib/generateDocument";

export default function Home() {
  const [formData, setFormData] = useState<NDAFormData>(defaultFormData);

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-slate-50">
      {/* Header */}
      <header className="no-print bg-white border-b border-slate-200 shrink-0 flex items-center justify-between px-6 py-3">
        <div>
          <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wider leading-none">
            Prelegal
          </p>
          <h1 className="text-base font-semibold text-slate-900">
            Mutual NDA Creator
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-400">Common Paper v1.0</span>
          <button
            onClick={() => downloadMarkdown(formData)}
            className="flex items-center gap-1.5 border border-slate-300 hover:border-slate-400 text-slate-700 hover:text-slate-900 text-sm px-4 py-2 rounded-lg transition-colors"
          >
            <span>↓</span>
            <span>Download .md</span>
          </button>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm px-4 py-2 rounded-lg transition-colors"
          >
            <span>⎙</span>
            <span>Print / Save PDF</span>
          </button>
        </div>
      </header>

      {/* Two-column layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Form */}
        <div className="no-print w-[420px] shrink-0 overflow-y-auto border-r border-slate-200 bg-slate-50">
          <NDAForm value={formData} onChange={setFormData} />
        </div>

        {/* Right: Live preview */}
        <div className="print-panel flex-1 overflow-y-auto bg-slate-100">
          <NDAPreview data={formData} />
        </div>
      </div>
    </div>
  );
}
