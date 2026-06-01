"use client";

import { DOC_CONFIGS, DocConfig } from "@/lib/docConfig";

interface DocumentSelectorProps {
  onSelect: (doc: DocConfig) => void;
}

function DocIcon() {
  return (
    <svg
      className="w-7 h-7 text-[#ecad0a] mb-3"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
      />
    </svg>
  );
}

export default function DocumentSelector({ onSelect }: DocumentSelectorProps) {
  return (
    <div className="flex-1 overflow-y-auto bg-stone-100 px-8 py-10">
      <div className="max-w-5xl mx-auto">
        {/* Heading */}
        <div className="mb-8">
          <h2 className="text-[22px] font-bold text-[#032147] tracking-tight mb-2">
            Choose a document type
          </h2>
          <p className="text-[13px] text-[#888888] leading-relaxed">
            Select the legal agreement you&apos;d like to draft. Our AI will guide you
            through filling in the key terms conversationally.
          </p>
        </div>

        {/* Document grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {DOC_CONFIGS.map((doc, i) => (
            <button
              key={`${doc.id}-${i}`}
              onClick={() => onSelect(doc)}
              className="group text-left bg-white border border-stone-200 rounded-lg p-5 hover:border-[#ecad0a] hover:shadow-md transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[#ecad0a]/40"
            >
              <DocIcon />
              <h3 className="text-[13px] font-semibold text-[#032147] leading-snug mb-2 group-hover:text-[#209dd7] transition-colors duration-150">
                {doc.name}
              </h3>
              <p className="text-[11px] text-[#888888] leading-relaxed line-clamp-3">
                {doc.description}
              </p>
              <div className="mt-3 flex items-center gap-1 text-[10px] font-semibold text-stone-400 group-hover:text-[#209dd7] uppercase tracking-wider transition-colors duration-150">
                <span>{doc.party1Label}</span>
                <span>↔</span>
                <span>{doc.party2Label}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Footer note */}
        <p className="text-[11px] text-stone-400 text-center mt-8">
          All templates are based on Common Paper standard agreements, free to use under CC BY 4.0.
        </p>
      </div>
    </div>
  );
}
