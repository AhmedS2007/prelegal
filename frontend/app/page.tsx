"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import NDAForm from "@/components/NDAForm";
import NDAPreview from "@/components/NDAPreview";
import { NDAFormData, defaultFormData } from "@/lib/types";
import { downloadMarkdown, printDocument } from "@/lib/generateDocument";

export default function Home() {
  const [formData, setFormData] = useState<NDAFormData>(defaultFormData);
  const [isAuthenticated] = useState<boolean>(
    () => typeof window !== "undefined" && !!localStorage.getItem("auth_token")
  );
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null;

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-stone-100">
      {/* ── Header ── */}
      <header className="no-print bg-[#032147] shrink-0 flex items-center justify-between px-6 py-0 h-14">
        {/* Wordmark */}
        <div className="flex items-center gap-3">
          <span
            className="w-2.5 h-2.5 rounded-[2px] bg-[#ecad0a] shrink-0"
            aria-hidden="true"
          />
          <div>
            <span className="text-[10px] font-semibold tracking-[0.18em] uppercase text-[#ecad0a] leading-none block">
              Prelegal
            </span>
            <span className="text-[13px] font-medium text-white/70 leading-tight block">
              Mutual NDA Creator
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2.5">
          <span className="text-[10px] text-[#888888] tracking-wide mr-1">
            Common Paper v1.0
          </span>
          <button
            onClick={() => downloadMarkdown(formData)}
            className="flex items-center gap-1.5 border border-white/20 hover:border-white/40 text-[#888888] hover:text-white text-[12px] font-medium px-3.5 py-1.5 rounded transition-all duration-150"
          >
            <svg
              className="w-3 h-3"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V4"
              />
            </svg>
            Export .md
          </button>
          <button
            onClick={() => printDocument(formData)}
            className="flex items-center gap-1.5 bg-[#753991] hover:bg-[#8b44a5] text-white text-[12px] font-semibold px-3.5 py-1.5 rounded transition-colors duration-150"
          >
            <svg
              className="w-3 h-3"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
              />
            </svg>
            Save PDF
          </button>
        </div>
      </header>

      {/* ── Two-column layout ── */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left — Form */}
        <div className="no-print w-[480px] shrink-0 overflow-y-auto scrollbar-form bg-[#f7f4ef] border-r border-stone-200">
          <NDAForm value={formData} onChange={setFormData} />
        </div>

        {/* Right — Live document preview */}
        <div className="print-panel flex-1 overflow-y-auto bg-stone-200/70">
          <NDAPreview data={formData} />
        </div>
      </div>
    </div>
  );
}
