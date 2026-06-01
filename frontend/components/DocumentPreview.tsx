"use client";

import { GenericDocFormData } from "@/lib/types";
import { DocConfig } from "@/lib/docConfig";
import { formatDate } from "@/lib/generateDocument";

interface DocumentPreviewProps {
  data: GenericDocFormData;
  docConfig: DocConfig;
}

function Hi({ children }: { children: React.ReactNode }) {
  return (
    <mark className="bg-[#ecad0a]/15 text-[#032147] rounded-[2px] px-[3px] py-px font-medium not-italic">
      {children}
    </mark>
  );
}

function Empty({ text }: { text: string }) {
  return <span className="text-stone-300 font-normal">{text}</span>;
}

function CoverField({
  label,
  subtitle,
  children,
}: {
  label: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-5 py-3 border-b border-stone-100 last:border-0">
      <div className="w-36 flex-shrink-0">
        <p className="text-[11px] font-semibold text-stone-700 leading-snug">
          {label}
        </p>
        {subtitle && (
          <p className="text-[10px] text-stone-400 italic mt-0.5 leading-snug">
            {subtitle}
          </p>
        )}
      </div>
      <div className="flex-1 text-[12px] text-stone-700 leading-relaxed">
        {children}
      </div>
    </div>
  );
}

function PartyBlock({
  label,
  party,
}: {
  label: string;
  party: GenericDocFormData["party1"];
}) {
  const hasAny =
    party.company ||
    party.signatoryName ||
    party.title ||
    party.noticeAddress;
  return (
    <CoverField label={label}>
      {hasAny ? (
        <div className="space-y-0.5">
          {party.company && (
            <p className="font-semibold text-stone-800">{party.company}</p>
          )}
          {party.signatoryName && <p>{party.signatoryName}</p>}
          {party.title && (
            <p className="text-stone-500 text-[11px]">{party.title}</p>
          )}
          {party.noticeAddress && (
            <p className="text-stone-500 text-[11px]">{party.noticeAddress}</p>
          )}
        </div>
      ) : (
        <Empty text="Not specified" />
      )}
    </CoverField>
  );
}

export default function DocumentPreview({
  data,
  docConfig,
}: DocumentPreviewProps) {
  const effectiveDateStr = data.effectiveDate
    ? formatDate(data.effectiveDate)
    : null;

  return (
    <div className="py-8 px-8 min-h-full print-full">
      {/* Draft disclaimer — screen only */}
      <div className="no-print max-w-[720px] mx-auto mb-4 bg-amber-50 border border-amber-200 rounded px-4 py-2.5 flex items-start gap-2.5">
        <svg className="w-3.5 h-3.5 text-amber-600 mt-0.5 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
        </svg>
        <p className="text-[11px] text-amber-800 leading-relaxed">
          <strong>Draft only.</strong> This document was generated with AI assistance and has not been reviewed by a licensed attorney. It does not constitute legal advice. All parties should seek qualified legal counsel before signing.
        </p>
      </div>
      <div className="bg-paper shadow-document rounded-[3px] print-full mx-auto max-w-[720px]">
        <div className="px-14 py-12 font-serif">

          {/* Document Title */}
          <div className="text-center mb-8">
            <h1 className="text-[22px] font-bold text-stone-900 tracking-tight leading-tight mb-3">
              {docConfig.name}
            </h1>
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-stone-200" />
              <p className="font-sans text-[9.5px] font-semibold uppercase tracking-[0.18em] text-stone-400">
                Common Paper Standard Terms
              </p>
              <div className="flex-1 h-px bg-stone-200" />
            </div>
          </div>

          {/* Preamble */}
          <p className="text-[12px] text-stone-600 mb-8 leading-relaxed">
            This {docConfig.name} (the &ldquo;<strong>Agreement</strong>&rdquo;) consists of:
            (1) this Cover Page setting out the key terms agreed between{" "}
            <strong>{docConfig.party1Label}</strong> and{" "}
            <strong>{docConfig.party2Label}</strong>, and (2) the Common Paper{" "}
            {docConfig.name} Standard Terms incorporated by reference.
          </p>

          {/* Cover Page */}
          <div className="border-2 border-stone-800 p-6 mb-8">
            <p className="font-sans text-[9px] font-bold uppercase tracking-[0.22em] text-stone-500 mb-5 border-b border-stone-200 pb-3">
              Cover Page
            </p>

            <PartyBlock label={docConfig.party1Label} party={data.party1} />
            <PartyBlock label={docConfig.party2Label} party={data.party2} />

            <CoverField label="Effective Date">
              {effectiveDateStr ? (
                <Hi>{effectiveDateStr}</Hi>
              ) : (
                <Empty text="[Date]" />
              )}
            </CoverField>

            <CoverField label="Term" subtitle="Duration of the agreement">
              {data.term ? (
                <Hi>{data.term}</Hi>
              ) : (
                <Empty text="[e.g. 1 year from Effective Date]" />
              )}
            </CoverField>

            <CoverField label="Governing Law &amp; Jurisdiction">
              <div className="space-y-1">
                <p>
                  <span className="font-semibold text-stone-800">
                    Governing Law:{" "}
                  </span>
                  {data.governingLawState ? (
                    <Hi>{data.governingLawState}</Hi>
                  ) : (
                    <Empty text="[State]" />
                  )}
                </p>
                <p>
                  <span className="font-semibold text-stone-800">
                    Jurisdiction:{" "}
                  </span>
                  {data.jurisdictionDescription ? (
                    <Hi>{data.jurisdictionDescription}</Hi>
                  ) : (
                    <Empty text="[City/County, State]" />
                  )}
                </p>
              </div>
            </CoverField>

            {data.specialTerms && (
              <CoverField label="Special Terms">
                <p className="whitespace-pre-wrap">{data.specialTerms}</p>
              </CoverField>
            )}
          </div>

          {/* Signature Block */}
          <p className="text-[12px] text-stone-600 mb-5 italic">
            By signing this Cover Page, each party agrees to enter into this{" "}
            {docConfig.name} as of the Effective Date.
          </p>

          <div className="overflow-x-auto mb-10">
            <table className="w-full text-[11px] border-collapse">
              <thead>
                <tr className="border-b-2 border-stone-800">
                  <th className="py-2.5 text-left font-sans text-stone-400 font-normal w-32" />
                  <th className="py-2.5 text-center font-sans font-semibold text-stone-800 text-[10px] uppercase tracking-widest">
                    {data.party1.company || docConfig.party1Label}
                  </th>
                  <th className="py-2.5 text-center font-sans font-semibold text-stone-800 text-[10px] uppercase tracking-widest">
                    {data.party2.company || docConfig.party2Label}
                  </th>
                </tr>
              </thead>
              <tbody>
                {(
                  [
                    ["Company", data.party1.company, data.party2.company],
                    ["Signature", "", ""],
                    [
                      "Print Name",
                      data.party1.signatoryName,
                      data.party2.signatoryName,
                    ],
                    ["Title", data.party1.title, data.party2.title],
                    [
                      "Notice Address",
                      data.party1.noticeAddress,
                      data.party2.noticeAddress,
                    ],
                    ["Date", "", ""],
                  ] as [string, string, string][]
                ).map(([field, v1, v2]) => (
                  <tr key={field} className="border-b border-stone-100">
                    <td className="py-3 pr-4 font-sans text-[10px] font-semibold text-stone-500 uppercase tracking-wider align-top">
                      {field}
                    </td>
                    <td className="py-3 px-3 text-center align-top text-stone-700">
                      {v1 || (
                        <span className="block mt-3 border-b border-stone-200 mx-4" />
                      )}
                    </td>
                    <td className="py-3 px-3 text-center align-top text-stone-700">
                      {v2 || (
                        <span className="block mt-3 border-b border-stone-200 mx-4" />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Standard Terms reference */}
          <div className="border-t border-stone-200 pt-6 mt-2">
            <p className="font-sans text-[10px] text-stone-400 text-center mb-3">
              Common Paper {docConfig.name} — Standard Terms incorporated by reference
            </p>
            <p className="text-[11px] text-stone-500 text-center italic leading-relaxed">
              The standard terms for this agreement are published by Common Paper
              and incorporated into this document by reference. They govern the
              rights and obligations of {docConfig.party1Label} and{" "}
              {docConfig.party2Label} in addition to the key terms above.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
