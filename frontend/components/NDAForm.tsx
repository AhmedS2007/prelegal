"use client";

import { NDAFormData, Party, defaultFormData } from "@/lib/types";

interface NDAFormProps {
  value: NDAFormData;
  onChange: (data: NDAFormData) => void;
}

/* ── Shared field components ───────────────────────── */

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="block text-[11px] font-medium text-stone-500 uppercase tracking-[0.07em] mb-1.5">
      {children}
    </label>
  );
}

function TextInput({
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full bg-transparent border-0 border-b border-stone-200 pb-2 pt-0.5 text-[13px] text-stone-800 placeholder:text-stone-300 focus:outline-none focus:border-amber-600 transition-colors duration-150"
    />
  );
}

function NumberInput({
  value,
  onChange,
  min,
  max,
}: {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
}) {
  return (
    <input
      type="number"
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      min={min}
      max={max}
      className="w-14 bg-white border border-stone-200 rounded text-center text-[13px] text-stone-800 py-1 px-2 focus:outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600/20 transition-all duration-150"
    />
  );
}

function RadioOption({
  name,
  checked,
  onChange,
  children,
}: {
  name: string;
  checked: boolean;
  onChange: () => void;
  children: React.ReactNode;
}) {
  return (
    <label className="flex items-start gap-3 cursor-pointer select-none group">
      <div className="relative flex-shrink-0 mt-0.5">
        <input
          type="radio"
          name={name}
          checked={checked}
          onChange={onChange}
          className="peer absolute inset-0 opacity-0 w-4 h-4 cursor-pointer"
        />
        <div className="w-4 h-4 rounded-full border border-stone-300 bg-white peer-checked:border-amber-600 group-hover:border-stone-400 transition-colors duration-150" />
        <div className="absolute top-[3px] left-[3px] w-[10px] h-[10px] rounded-full bg-amber-600 scale-0 peer-checked:scale-100 transition-transform duration-150" />
      </div>
      <div className="flex-1 text-[13px] text-stone-700 leading-snug pt-px">
        {children}
      </div>
    </label>
  );
}

/* ── Section wrapper ───────────────────────────────── */

function Section({
  title,
  subtitle,
  children,
  noDivider = false,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  noDivider?: boolean;
}) {
  return (
    <div className={`px-6 py-5 ${noDivider ? "" : "border-b border-stone-100"}`}>
      <div className="mb-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-stone-800">
          {title}
        </p>
        {subtitle && (
          <p className="text-[11px] text-stone-400 italic mt-0.5 leading-snug">
            {subtitle}
          </p>
        )}
      </div>
      {children}
    </div>
  );
}

/* ── Party fields ──────────────────────────────────── */

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
      <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-amber-700 border-b border-amber-100 pb-1.5">
        {label}
      </p>
      <div>
        <FieldLabel>Company Name</FieldLabel>
        <TextInput
          value={value.company}
          onChange={(v) => onChange({ ...value, company: v })}
          placeholder="Acme Corp."
        />
      </div>
      <div>
        <FieldLabel>Signatory Name</FieldLabel>
        <TextInput
          value={value.signatoryName}
          onChange={(v) => onChange({ ...value, signatoryName: v })}
          placeholder="Jane Smith"
        />
      </div>
      <div>
        <FieldLabel>Title</FieldLabel>
        <TextInput
          value={value.title}
          onChange={(v) => onChange({ ...value, title: v })}
          placeholder="Chief Executive Officer"
        />
      </div>
      <div>
        <FieldLabel>Notice Address</FieldLabel>
        <TextInput
          value={value.noticeAddress}
          onChange={(v) => onChange({ ...value, noticeAddress: v })}
          placeholder="jane@acme.com"
        />
      </div>
    </div>
  );
}

/* ── Main form ─────────────────────────────────────── */

export default function NDAForm({ value: data, onChange }: NDAFormProps) {
  const set = <K extends keyof NDAFormData>(key: K, v: NDAFormData[K]) =>
    onChange({ ...data, [key]: v });

  return (
    <div className="pb-10">
      {/* Form header */}
      <div className="px-6 pt-6 pb-5 border-b border-stone-100">
        <p className="text-[11px] text-stone-400 leading-relaxed">
          Fill in the details below. The document preview updates&nbsp;live.
        </p>
      </div>

      {/* Purpose */}
      <Section title="Purpose" subtitle="How Confidential Information may be used">
        <textarea
          value={data.purpose}
          onChange={(e) => set("purpose", e.target.value)}
          rows={3}
          className="w-full bg-white border border-stone-200 rounded-sm px-3 py-2.5 text-[13px] text-stone-800 placeholder:text-stone-300 focus:outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600/15 transition-all duration-150 resize-none leading-relaxed"
        />
      </Section>

      {/* Effective Date */}
      <Section title="Effective Date">
        <input
          type="date"
          value={data.effectiveDate}
          onChange={(e) => set("effectiveDate", e.target.value)}
          className="bg-transparent border-0 border-b border-stone-200 pb-2 pt-0.5 text-[13px] text-stone-800 focus:outline-none focus:border-amber-600 transition-colors duration-150"
        />
      </Section>

      {/* MNDA Term */}
      <Section title="MNDA Term" subtitle="The length of this MNDA">
        <div className="space-y-3">
          <RadioOption
            name="mndaTermType"
            checked={data.mndaTermType === "expires"}
            onChange={() => set("mndaTermType", "expires")}
          >
            <span>Expires after</span>
            {data.mndaTermType === "expires" && (
              <div className="flex items-center gap-2 mt-2">
                <NumberInput
                  value={data.mndaTermYears}
                  onChange={(v) => set("mndaTermYears", v)}
                  min={1}
                  max={10}
                />
                <span className="text-[12px] text-stone-500">
                  year{data.mndaTermYears !== 1 ? "s" : ""} from Effective Date
                </span>
              </div>
            )}
          </RadioOption>
          <RadioOption
            name="mndaTermType"
            checked={data.mndaTermType === "until_terminated"}
            onChange={() => set("mndaTermType", "until_terminated")}
          >
            Continues until terminated
          </RadioOption>
        </div>
      </Section>

      {/* Term of Confidentiality */}
      <Section
        title="Term of Confidentiality"
        subtitle="How long Confidential Information is protected"
      >
        <div className="space-y-3">
          <RadioOption
            name="confidentialityTermType"
            checked={data.confidentialityTermType === "years"}
            onChange={() => set("confidentialityTermType", "years")}
          >
            <span>Limited period</span>
            {data.confidentialityTermType === "years" && (
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <NumberInput
                  value={data.confidentialityTermYears}
                  onChange={(v) => set("confidentialityTermYears", v)}
                  min={1}
                  max={10}
                />
                <span className="text-[12px] text-stone-500">
                  year{data.confidentialityTermYears !== 1 ? "s" : ""} from Effective Date
                </span>
              </div>
            )}
          </RadioOption>
          <RadioOption
            name="confidentialityTermType"
            checked={data.confidentialityTermType === "perpetuity"}
            onChange={() => set("confidentialityTermType", "perpetuity")}
          >
            In perpetuity
          </RadioOption>
        </div>
      </Section>

      {/* Governing Law */}
      <Section title="Governing Law & Jurisdiction">
        <div className="space-y-4">
          <div>
            <FieldLabel>Governing Law (State)</FieldLabel>
            <TextInput
              value={data.governingLawState}
              onChange={(v) => set("governingLawState", v)}
              placeholder="Delaware"
            />
          </div>
          <div>
            <FieldLabel>Jurisdiction</FieldLabel>
            <TextInput
              value={data.jurisdictionDescription}
              onChange={(v) => set("jurisdictionDescription", v)}
              placeholder="courts located in New Castle, DE"
            />
          </div>
        </div>
      </Section>

      {/* Parties */}
      <Section title="Parties" subtitle="Both signing parties">
        <div className="space-y-6">
          <div className="rounded-sm bg-white/50 border border-stone-100 p-4">
            <PartyFields
              label="Party 1"
              value={data.party1}
              onChange={(p) => set("party1", p)}
            />
          </div>
          <div className="rounded-sm bg-white/50 border border-stone-100 p-4">
            <PartyFields
              label="Party 2"
              value={data.party2}
              onChange={(p) => set("party2", p)}
            />
          </div>
        </div>
      </Section>

      {/* Modifications */}
      <Section
        title="MNDA Modifications"
        subtitle="Optional — any changes to the standard terms"
        noDivider
      >
        <textarea
          value={data.modifications}
          onChange={(e) => set("modifications", e.target.value)}
          rows={3}
          placeholder="e.g. Section 2(b) is modified to require approval from both parties' legal counsel before disclosure to contractors."
          className="w-full bg-white border border-stone-200 rounded-sm px-3 py-2.5 text-[13px] text-stone-800 placeholder:text-stone-300 focus:outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600/15 transition-all duration-150 resize-none leading-relaxed"
        />
      </Section>

      {/* Reset */}
      <div className="px-6 pt-3">
        <button
          type="button"
          onClick={() => onChange(defaultFormData)}
          className="text-[11px] text-stone-400 hover:text-stone-600 underline underline-offset-2 transition-colors duration-150"
        >
          Reset to defaults
        </button>
      </div>
    </div>
  );
}
