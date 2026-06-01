"use client";

import { NDAFormData } from "@/lib/types";
import {
  formatDate,
  mndaTermDescription,
  confidentialityTermDescription,
} from "@/lib/generateDocument";

interface NDAPreviewProps {
  data: NDAFormData;
}

/* ── Highlight: amber "marker" for dynamic values ──── */
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

/* ── Cover page two-column field row ────────────────── */
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

/* ── Checkbox row in cover page ─────────────────────── */
function CheckRow({
  checked,
  children,
}: {
  checked: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-2 text-[12px] text-stone-700 leading-snug">
      <span className="mt-px font-mono text-[11px] border border-stone-400 w-[14px] h-[14px] flex items-center justify-center flex-shrink-0 rounded-[2px]">
        {checked ? "✓" : ""}
      </span>
      <span>{children}</span>
    </div>
  );
}

/* ── Main preview ───────────────────────────────────── */
export default function NDAPreview({ data }: NDAPreviewProps) {
  const effectiveDateStr = formatDate(data.effectiveDate);

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

          {/* ── Document Title ── */}
          <div className="text-center mb-8">
            <h1 className="text-[22px] font-bold text-stone-900 tracking-tight leading-tight mb-3">
              Mutual Non-Disclosure Agreement
            </h1>
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-stone-200" />
              <p className="font-sans text-[9.5px] font-semibold uppercase tracking-[0.18em] text-stone-400">
                Common Paper Standard Terms · Version 1.0
              </p>
              <div className="flex-1 h-px bg-stone-200" />
            </div>
          </div>

          {/* ── Preamble ── */}
          <p className="text-[12px] text-stone-600 mb-8 leading-relaxed">
            This Mutual Non-Disclosure Agreement (the &ldquo;
            <strong>MNDA</strong>&rdquo;) consists of: (1) this Cover Page (&ldquo;
            <strong>Cover Page</strong>&rdquo;) and (2) the Common Paper Mutual NDA
            Standard Terms Version 1.0 (&ldquo;<strong>Standard Terms</strong>&rdquo;)
            identical to those posted at{" "}
            <span className="font-sans text-[#209dd7] text-[11px]">
              commonpaper.com/standards/mutual-nda/1.0
            </span>
            . Any modifications of the Standard Terms should be made on the Cover
            Page, which will control over conflicts with the Standard Terms.
          </p>

          {/* ── Cover Page ── */}
          <div className="border-2 border-stone-800 p-6 mb-8">
            <p className="font-sans text-[9px] font-bold uppercase tracking-[0.22em] text-stone-500 mb-5 border-b border-stone-200 pb-3">
              Cover Page
            </p>

            <CoverField label="Purpose" subtitle="How Confidential Information may be used">
              {data.purpose ? (
                <p className="leading-relaxed">{data.purpose}</p>
              ) : (
                <Empty text="Not specified" />
              )}
            </CoverField>

            <CoverField label="Effective Date">
              {data.effectiveDate ? (
                <p>{effectiveDateStr}</p>
              ) : (
                <Empty text="[Date]" />
              )}
            </CoverField>

            <CoverField label="MNDA Term" subtitle="The length of this MNDA">
              <div className="space-y-1.5">
                <CheckRow checked={data.mndaTermType === "expires"}>
                  Expires{" "}
                  {data.mndaTermType === "expires"
                    ? `${data.mndaTermYears} year${data.mndaTermYears !== 1 ? "s" : ""}`
                    : "[N] year(s)"}{" "}
                  from Effective Date.
                </CheckRow>
                <CheckRow checked={data.mndaTermType === "until_terminated"}>
                  Continues until terminated.
                </CheckRow>
              </div>
            </CoverField>

            <CoverField
              label="Term of Confidentiality"
              subtitle="How long Confidential Information is protected"
            >
              <div className="space-y-1.5">
                <CheckRow checked={data.confidentialityTermType === "years"}>
                  {data.confidentialityTermType === "years"
                    ? `${data.confidentialityTermYears} year${data.confidentialityTermYears !== 1 ? "s" : ""}`
                    : "[N] year(s)"}{" "}
                  from Effective Date, but in the case of trade secrets until no
                  longer a trade secret under applicable laws.
                </CheckRow>
                <CheckRow checked={data.confidentialityTermType === "perpetuity"}>
                  In perpetuity.
                </CheckRow>
              </div>
            </CoverField>

            <CoverField label="Governing Law & Jurisdiction">
              <div className="space-y-1">
                <p>
                  <span className="font-semibold text-stone-800">Governing Law: </span>
                  {data.governingLawState || <Empty text="[State]" />}
                </p>
                <p>
                  <span className="font-semibold text-stone-800">Jurisdiction: </span>
                  {data.jurisdictionDescription || (
                    <Empty text="[City/County, State]" />
                  )}
                </p>
              </div>
            </CoverField>

            <CoverField label="MNDA Modifications">
              <p className="whitespace-pre-wrap">
                {data.modifications || "None."}
              </p>
            </CoverField>
          </div>

          {/* ── Signature Block ── */}
          <p className="text-[12px] text-stone-600 mb-5 italic">
            By signing this Cover Page, each party agrees to enter into this MNDA
            as of the Effective Date.
          </p>

          <div className="overflow-x-auto mb-10">
            <table className="w-full text-[11px] border-collapse">
              <thead>
                <tr className="border-b-2 border-stone-800">
                  <th className="py-2.5 text-left font-sans text-stone-400 font-normal w-32" />
                  <th className="py-2.5 text-center font-sans font-semibold text-stone-800 text-[10px] uppercase tracking-widest">
                    {data.party1.company || "Party 1"}
                  </th>
                  <th className="py-2.5 text-center font-sans font-semibold text-stone-800 text-[10px] uppercase tracking-widest">
                    {data.party2.company || "Party 2"}
                  </th>
                </tr>
              </thead>
              <tbody>
                {(
                  [
                    ["Company", data.party1.company, data.party2.company],
                    ["Signature", "", ""],
                    ["Print Name", data.party1.signatoryName, data.party2.signatoryName],
                    ["Title", data.party1.title, data.party2.title],
                    ["Notice Address", data.party1.noticeAddress, data.party2.noticeAddress],
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

          <p className="font-sans text-[10px] text-stone-400 text-center mb-12">
            Common Paper Mutual Non-Disclosure Agreement (Version 1.0) — free to
            use under CC BY 4.0
          </p>

          {/* ── Standard Terms ── */}
          <div className="border-t border-stone-300 pt-8">
            <h2 className="text-[18px] font-bold text-stone-900 mb-7 tracking-tight">
              Standard Terms
            </h2>

            <div className="space-y-5 text-[12.5px] leading-[1.75] text-stone-700">

              <p>
                <strong className="text-stone-900">1. Introduction.</strong>{" "}
                This Mutual Non-Disclosure Agreement (&ldquo;<strong>MNDA</strong>&rdquo;)
                allows each party (&ldquo;<strong>Disclosing Party</strong>&rdquo;) to
                disclose or make available information in connection with the{" "}
                <Hi>{data.purpose || "[Purpose]"}</Hi>{" "}
                which (1) the Disclosing Party identifies to the receiving party
                (&ldquo;<strong>Receiving Party</strong>&rdquo;) as &ldquo;confidential&rdquo;,
                &ldquo;proprietary&rdquo;, or the like or (2) should be reasonably understood
                as confidential or proprietary due to its nature and the
                circumstances of its disclosure (&ldquo;
                <strong>Confidential Information</strong>&rdquo;). Each party&apos;s
                Confidential Information also includes the existence and status of
                the parties&apos; discussions and information on the Cover Page.
                Confidential Information includes technical or business information,
                product designs or roadmaps, requirements, pricing, security and
                compliance documentation, technology, inventions and know-how.
              </p>

              <p>
                <strong className="text-stone-900">2. Use and Protection of Confidential Information.</strong>{" "}
                The Receiving Party shall: (a) use Confidential Information solely
                for the <Hi>{data.purpose || "[Purpose]"}</Hi>; (b) not disclose
                Confidential Information to third parties without the Disclosing
                Party&apos;s prior written approval, except that the Receiving Party
                may disclose Confidential Information to its employees, agents,
                advisors, contractors and other representatives having a reasonable
                need to know for the <Hi>{data.purpose || "[Purpose]"}</Hi>,
                provided these representatives are bound by confidentiality
                obligations no less protective of the Disclosing Party than the
                applicable terms in this MNDA and the Receiving Party remains
                responsible for their compliance with this MNDA; and (c) protect
                Confidential Information using at least the same protections the
                Receiving Party uses for its own similar information but no less
                than a reasonable standard of care.
              </p>

              <p>
                <strong className="text-stone-900">3. Exceptions.</strong>{" "}
                The Receiving Party&apos;s obligations in this MNDA do not apply to
                information that it can demonstrate: (a) is or becomes publicly
                available through no fault of the Receiving Party; (b) it
                rightfully knew or possessed prior to receipt from the Disclosing
                Party without confidentiality restrictions; (c) it rightfully
                obtained from a third party without confidentiality restrictions;
                or (d) it independently developed without using or referencing the
                Confidential Information.
              </p>

              <p>
                <strong className="text-stone-900">4. Disclosures Required by Law.</strong>{" "}
                The Receiving Party may disclose Confidential Information to the
                extent required by law, regulation or regulatory authority,
                subpoena or court order, provided (to the extent legally
                permitted) it provides the Disclosing Party reasonable advance
                notice of the required disclosure and reasonably cooperates, at
                the Disclosing Party&apos;s expense, with the Disclosing Party&apos;s
                efforts to obtain confidential treatment for the Confidential
                Information.
              </p>

              <p>
                <strong className="text-stone-900">5. Term and Termination.</strong>{" "}
                This MNDA commences on the{" "}
                <Hi>{effectiveDateStr}</Hi>{" "}
                and expires at the end of the{" "}
                <Hi>{mndaTermDescription(data)}</Hi>. Either party may terminate
                this MNDA for any or no reason upon written notice to the other
                party. The Receiving Party&apos;s obligations relating to Confidential
                Information will survive for the{" "}
                <Hi>{confidentialityTermDescription(data)}</Hi>, despite any
                expiration or termination of this MNDA.
              </p>

              <p>
                <strong className="text-stone-900">6. Return or Destruction of Confidential Information.</strong>{" "}
                Upon expiration or termination of this MNDA or upon the Disclosing
                Party&apos;s earlier request, the Receiving Party will: (a) cease using
                Confidential Information; (b) promptly after the Disclosing Party&apos;s
                written request, destroy all Confidential Information in the
                Receiving Party&apos;s possession or control or return it to the
                Disclosing Party; and (c) if requested by the Disclosing Party,
                confirm its compliance with these obligations in writing. As an
                exception to subsection (b), the Receiving Party may retain
                Confidential Information in accordance with its standard backup or
                record retention policies or as required by law, but the terms of
                this MNDA will continue to apply to the retained Confidential
                Information.
              </p>

              <p>
                <strong className="text-stone-900">7. Proprietary Rights.</strong>{" "}
                The Disclosing Party retains all of its intellectual property and
                other rights in its Confidential Information and its disclosure to
                the Receiving Party grants no license under such rights.
              </p>

              <p>
                <strong className="text-stone-900">8. Disclaimer.</strong>{" "}
                ALL CONFIDENTIAL INFORMATION IS PROVIDED &ldquo;AS IS&rdquo;, WITH ALL
                FAULTS, AND WITHOUT WARRANTIES, INCLUDING THE IMPLIED WARRANTIES
                OF TITLE, MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE.
              </p>

              <p>
                <strong className="text-stone-900">9. Governing Law and Jurisdiction.</strong>{" "}
                This MNDA and all matters relating hereto are governed by, and
                construed in accordance with, the laws of the State of{" "}
                <Hi>
                  {data.governingLawState || <Empty text="[Governing Law State]" />}
                </Hi>
                , without regard to the conflict of laws provisions of such{" "}
                <Hi>
                  {data.governingLawState || <Empty text="[Governing Law State]" />}
                </Hi>
                . Any legal suit, action, or proceeding relating to this MNDA
                must be instituted in the federal or state courts located in{" "}
                <Hi>
                  {data.jurisdictionDescription || <Empty text="[Jurisdiction]" />}
                </Hi>
                . Each party irrevocably submits to the exclusive jurisdiction of
                such{" "}
                <Hi>
                  {data.jurisdictionDescription || <Empty text="[Jurisdiction]" />}
                </Hi>{" "}
                in any such suit, action, or proceeding.
              </p>

              <p>
                <strong className="text-stone-900">10. Equitable Relief.</strong>{" "}
                A breach of this MNDA may cause irreparable harm for which
                monetary damages are an insufficient remedy. Upon a breach of this
                MNDA, the Disclosing Party is entitled to seek appropriate
                equitable relief, including an injunction, in addition to its
                other remedies.
              </p>

              <p>
                <strong className="text-stone-900">11. General.</strong>{" "}
                Neither party has an obligation under this MNDA to disclose
                Confidential Information to the other or proceed with any proposed
                transaction. Neither party may assign this MNDA without the prior
                written consent of the other party, except that either party may
                assign this MNDA in connection with a merger, reorganization,
                acquisition or other transfer of all or substantially all its
                assets or voting securities. Any assignment in violation of this
                Section is null and void. This MNDA will bind and inure to the
                benefit of each party&apos;s permitted successors and assigns. Waivers
                must be signed by the waiving party&apos;s authorized representative
                and cannot be implied from conduct. If any provision of this MNDA
                is held unenforceable, it will be limited to the minimum extent
                necessary so the rest of this MNDA remains in effect. This MNDA
                may only be amended, modified, waived, or supplemented by an
                agreement in writing signed by both parties. Notices must be sent
                to the email or postal addresses on the Cover Page and are deemed
                delivered on receipt. This MNDA may be executed in counterparts,
                including electronic copies, each of which is deemed an original
                and which together form the same agreement.
              </p>
            </div>

            <p className="font-sans text-[10px] text-stone-400 text-center mt-10 pb-2">
              Common Paper Mutual Non-Disclosure Agreement Version 1.0 — free to
              use under CC BY 4.0
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
