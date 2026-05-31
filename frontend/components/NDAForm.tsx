"use client";

import { NDAFormData, Party, defaultFormData } from "@/lib/types";

interface NDAFormProps {
  value: NDAFormData;
  onChange: (data: NDAFormData) => void;
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
    <div className="space-y-3">
      <h3 className="font-semibold text-slate-600 text-xs uppercase tracking-wide">
        {label}
      </h3>
      <div>
        <label className="block text-xs font-medium text-slate-500 mb-1">
          Company Name
        </label>
        <input
          type="text"
          value={value.company}
          onChange={(e) => onChange({ ...value, company: e.target.value })}
          placeholder="Acme Corp."
          className="w-full border border-slate-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-slate-500 mb-1">
          Signatory Name
        </label>
        <input
          type="text"
          value={value.signatoryName}
          onChange={(e) =>
            onChange({ ...value, signatoryName: e.target.value })
          }
          placeholder="Jane Smith"
          className="w-full border border-slate-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-slate-500 mb-1">
          Title
        </label>
        <input
          type="text"
          value={value.title}
          onChange={(e) => onChange({ ...value, title: e.target.value })}
          placeholder="Chief Executive Officer"
          className="w-full border border-slate-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-slate-500 mb-1">
          Notice Address
        </label>
        <input
          type="text"
          value={value.noticeAddress}
          onChange={(e) =>
            onChange({ ...value, noticeAddress: e.target.value })
          }
          placeholder="jane@acme.com"
          className="w-full border border-slate-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
      </div>
    </div>
  );
}

function Section({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border-b border-slate-200 px-5 py-4">
      <div className="mb-3">
        <p className="text-sm font-semibold text-slate-700">{title}</p>
        {subtitle && (
          <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>
        )}
      </div>
      {children}
    </div>
  );
}

export default function NDAForm({ value: data, onChange }: NDAFormProps) {
  const set = <K extends keyof NDAFormData>(key: K, v: NDAFormData[K]) =>
    onChange({ ...data, [key]: v });

  return (
    <div className="pb-8">
      <Section title="Purpose" subtitle="How Confidential Information may be used">
        <textarea
          value={data.purpose}
          onChange={(e) => set("purpose", e.target.value)}
          rows={3}
          className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
        />
      </Section>

      <Section title="Effective Date">
        <input
          type="date"
          value={data.effectiveDate}
          onChange={(e) => set("effectiveDate", e.target.value)}
          className="border border-slate-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
      </Section>

      <Section title="MNDA Term" subtitle="The length of this MNDA">
        <div className="space-y-2">
          <label className="flex items-start gap-2 cursor-pointer">
            <input
              type="radio"
              name="mndaTermType"
              checked={data.mndaTermType === "expires"}
              onChange={() => set("mndaTermType", "expires")}
              className="mt-0.5 text-indigo-600"
            />
            <div className="flex-1">
              <span className="text-sm text-slate-700">Expires after</span>
              {data.mndaTermType === "expires" && (
                <div className="flex items-center gap-2 mt-1.5">
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={data.mndaTermYears}
                    onChange={(e) =>
                      set("mndaTermYears", Number(e.target.value))
                    }
                    className="w-16 border border-slate-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <span className="text-sm text-slate-500">
                    year(s) from Effective Date
                  </span>
                </div>
              )}
            </div>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
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
      </Section>

      <Section
        title="Term of Confidentiality"
        subtitle="How long Confidential Information is protected"
      >
        <div className="space-y-2">
          <label className="flex items-start gap-2 cursor-pointer">
            <input
              type="radio"
              name="confidentialityTermType"
              checked={data.confidentialityTermType === "years"}
              onChange={() => set("confidentialityTermType", "years")}
              className="mt-0.5 text-indigo-600"
            />
            <div className="flex-1">
              <span className="text-sm text-slate-700">Limited period</span>
              {data.confidentialityTermType === "years" && (
                <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={data.confidentialityTermYears}
                    onChange={(e) =>
                      set("confidentialityTermYears", Number(e.target.value))
                    }
                    className="w-16 border border-slate-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <span className="text-sm text-slate-500">
                    year(s) from Effective Date
                  </span>
                </div>
              )}
            </div>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
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
      </Section>

      <Section title="Governing Law & Jurisdiction">
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">
              Governing Law (State)
            </label>
            <input
              type="text"
              value={data.governingLawState}
              onChange={(e) => set("governingLawState", e.target.value)}
              placeholder="Delaware"
              className="w-full border border-slate-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">
              Jurisdiction
            </label>
            <input
              type="text"
              value={data.jurisdictionDescription}
              onChange={(e) => set("jurisdictionDescription", e.target.value)}
              placeholder="courts located in New Castle, DE"
              className="w-full border border-slate-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
        </div>
      </Section>

      <Section title="Parties" subtitle="Both signing parties">
        <div className="space-y-6">
          <PartyFields
            label="Party 1"
            value={data.party1}
            onChange={(p) => set("party1", p)}
          />
          <div className="border-t border-slate-200" />
          <PartyFields
            label="Party 2"
            value={data.party2}
            onChange={(p) => set("party2", p)}
          />
        </div>
      </Section>

      <Section
        title="MNDA Modifications"
        subtitle="Optional — any changes to the standard terms"
      >
        <textarea
          value={data.modifications}
          onChange={(e) => set("modifications", e.target.value)}
          rows={3}
          placeholder="e.g. Section 2(b) is modified to require approval from both parties' legal counsel before disclosure to contractors."
          className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
        />
      </Section>

      <div className="px-5 pt-4">
        <button
          type="button"
          onClick={() => onChange(defaultFormData)}
          className="text-xs text-slate-400 hover:text-slate-600 underline transition-colors"
        >
          Reset to defaults
        </button>
      </div>
    </div>
  );
}
