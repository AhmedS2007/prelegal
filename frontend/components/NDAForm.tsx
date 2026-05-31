"use client";

import { useState } from "react";
import { NDAFormData, Party, defaultFormData } from "@/lib/types";

interface NDAFormProps {
  initialData: NDAFormData;
  onSubmit: (data: NDAFormData) => void;
}

function PartyFields({
  label,
  value,
  onChange,
}: {
  label: string;
  value: Party;
  onChange: (p: Party) => void;
}) {
  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-slate-700 text-sm uppercase tracking-wide">
        {label}
      </h3>
      <div>
        <label className="block text-sm font-medium text-slate-600 mb-1">
          Company Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          required
          value={value.company}
          onChange={(e) => onChange({ ...value, company: e.target.value })}
          placeholder="Acme Corp."
          className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-600 mb-1">
          Signatory Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          required
          value={value.signatoryName}
          onChange={(e) =>
            onChange({ ...value, signatoryName: e.target.value })
          }
          placeholder="Jane Smith"
          className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-600 mb-1">
          Title
        </label>
        <input
          type="text"
          value={value.title}
          onChange={(e) => onChange({ ...value, title: e.target.value })}
          placeholder="Chief Executive Officer"
          className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-600 mb-1">
          Notice Address
        </label>
        <input
          type="text"
          value={value.noticeAddress}
          onChange={(e) =>
            onChange({ ...value, noticeAddress: e.target.value })
          }
          placeholder="jane@acmecorp.com or 123 Main St, Springfield, IL 62701"
          className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
      </div>
    </div>
  );
}

function SectionCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
      <div className="mb-4">
        <h2 className="text-base font-semibold text-slate-800">{title}</h2>
        {subtitle && (
          <p className="text-sm text-slate-500 mt-0.5">{subtitle}</p>
        )}
      </div>
      {children}
    </div>
  );
}

export default function NDAForm({ initialData, onSubmit }: NDAFormProps) {
  const [data, setData] = useState<NDAFormData>(initialData);

  const set = <K extends keyof NDAFormData>(key: K, value: NDAFormData[K]) =>
    setData((d) => ({ ...d, [key]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(data);
  };

  const handleReset = () => {
    setData(defaultFormData);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">
              Prelegal
            </span>
            <h1 className="text-lg font-semibold text-slate-900 leading-tight">
              Mutual NDA Creator
            </h1>
          </div>
          <div className="text-xs text-slate-400">Common Paper v1.0</div>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="max-w-3xl mx-auto px-4 py-8">
        <div className="mb-6">
          <p className="text-sm text-slate-600">
            Fill in the details below to generate a Mutual Non-Disclosure
            Agreement. Required fields are marked with{" "}
            <span className="text-red-500">*</span>.
          </p>
        </div>

        <div className="space-y-5">
          {/* Purpose */}
          <SectionCard
            title="Purpose"
            subtitle="How Confidential Information may be used"
          >
            <textarea
              value={data.purpose}
              onChange={(e) => set("purpose", e.target.value)}
              rows={3}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
            />
          </SectionCard>

          {/* Effective Date */}
          <SectionCard title="Effective Date">
            <input
              type="date"
              required
              value={data.effectiveDate}
              onChange={(e) => set("effectiveDate", e.target.value)}
              className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </SectionCard>

          {/* MNDA Term */}
          <SectionCard title="MNDA Term" subtitle="The length of this MNDA">
            <div className="space-y-3">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="mndaTermType"
                  checked={data.mndaTermType === "expires"}
                  onChange={() => set("mndaTermType", "expires")}
                  className="mt-0.5 text-indigo-600"
                />
                <div className="flex-1">
                  <span className="text-sm text-slate-700">
                    Expires after
                  </span>
                  {data.mndaTermType === "expires" && (
                    <div className="flex items-center gap-2 mt-2">
                      <input
                        type="number"
                        min={1}
                        max={10}
                        value={data.mndaTermYears}
                        onChange={(e) =>
                          set("mndaTermYears", Number(e.target.value))
                        }
                        className="w-20 border border-slate-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                      <span className="text-sm text-slate-600">
                        year(s) from Effective Date
                      </span>
                    </div>
                  )}
                </div>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="mndaTermType"
                  checked={data.mndaTermType === "until_terminated"}
                  onChange={() => set("mndaTermType", "until_terminated")}
                  className="text-indigo-600"
                />
                <span className="text-sm text-slate-700">
                  Continues until terminated
                </span>
              </label>
            </div>
          </SectionCard>

          {/* Term of Confidentiality */}
          <SectionCard
            title="Term of Confidentiality"
            subtitle="How long Confidential Information is protected"
          >
            <div className="space-y-3">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="confidentialityTermType"
                  checked={data.confidentialityTermType === "years"}
                  onChange={() => set("confidentialityTermType", "years")}
                  className="mt-0.5 text-indigo-600"
                />
                <div className="flex-1">
                  <span className="text-sm text-slate-700">
                    Limited period
                  </span>
                  {data.confidentialityTermType === "years" && (
                    <div className="flex items-center gap-2 mt-2">
                      <input
                        type="number"
                        min={1}
                        max={10}
                        value={data.confidentialityTermYears}
                        onChange={(e) =>
                          set(
                            "confidentialityTermYears",
                            Number(e.target.value)
                          )
                        }
                        className="w-20 border border-slate-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                      <span className="text-sm text-slate-600">
                        year(s) from Effective Date (trade secrets protected
                        until no longer a trade secret)
                      </span>
                    </div>
                  )}
                </div>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="confidentialityTermType"
                  checked={data.confidentialityTermType === "perpetuity"}
                  onChange={() => set("confidentialityTermType", "perpetuity")}
                  className="text-indigo-600"
                />
                <span className="text-sm text-slate-700">In perpetuity</span>
              </label>
            </div>
          </SectionCard>

          {/* Governing Law & Jurisdiction */}
          <SectionCard title="Governing Law & Jurisdiction">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">
                  Governing Law (State){" "}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={data.governingLawState}
                  onChange={(e) => set("governingLawState", e.target.value)}
                  placeholder="Delaware"
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">
                  Jurisdiction <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={data.jurisdictionDescription}
                  onChange={(e) =>
                    set("jurisdictionDescription", e.target.value)
                  }
                  placeholder="courts located in New Castle, DE"
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>
          </SectionCard>

          {/* Parties */}
          <SectionCard
            title="Parties"
            subtitle="Information for both signing parties"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <PartyFields
                label="Party 1"
                value={data.party1}
                onChange={(p) => set("party1", p)}
              />
              <div className="hidden sm:block border-l border-slate-200" />
              <PartyFields
                label="Party 2"
                value={data.party2}
                onChange={(p) => set("party2", p)}
              />
            </div>
          </SectionCard>

          {/* Modifications */}
          <SectionCard
            title="MNDA Modifications"
            subtitle="List any modifications to the standard terms (optional)"
          >
            <textarea
              value={data.modifications}
              onChange={(e) => set("modifications", e.target.value)}
              rows={3}
              placeholder="e.g. Section 2(b) is modified to require approval from both parties' legal counsel before disclosure to contractors."
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
            />
          </SectionCard>
        </div>

        {/* Actions */}
        <div className="mt-8 flex items-center justify-between">
          <button
            type="button"
            onClick={handleReset}
            className="text-sm text-slate-500 hover:text-slate-700 underline"
          >
            Reset to defaults
          </button>
          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6 py-2.5 rounded-lg text-sm transition-colors shadow-sm"
          >
            Preview Document →
          </button>
        </div>

        <p className="text-center text-xs text-slate-400 mt-6">
          Common Paper Mutual NDA v1.0 — free to use under CC BY 4.0. This tool
          does not provide legal advice.
        </p>
      </form>
    </div>
  );
}
