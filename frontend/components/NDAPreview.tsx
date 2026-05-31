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
    <div className="py-3 border-b border-slate-200 last:border-0">
      <div className="mb-1.5">
        <span className="font-semibold text-slate-800 text-sm">{label}</span>
        {subtitle && (
          <span className="text-slate-400 text-xs ml-2 italic">{subtitle}</span>
        )}
      </div>
      <div className="text-slate-700 text-sm">{children}</div>
    </div>
  );
}

export default function NDAPreview({ data }: NDAPreviewProps) {
  const effectiveDateStr = formatDate(data.effectiveDate);

  return (
    <div className="py-6 px-6 print-full">
      <div className="bg-white shadow-sm rounded-xl overflow-hidden print-full">
        <div className="px-10 py-8 font-serif">
          {/* Title */}
          <h1 className="text-xl font-bold text-center text-slate-900 mb-1 tracking-tight">
            Mutual Non-Disclosure Agreement
          </h1>
          <p className="text-center text-slate-400 text-xs mb-8">
            Common Paper Mutual NDA Standard Terms Version 1.0
          </p>

          {/* Preamble */}
          <p className="text-xs text-slate-600 mb-6 leading-relaxed">
            This Mutual Non-Disclosure Agreement (the &ldquo;
            <strong>MNDA</strong>&rdquo;) consists of: (1) this Cover Page (&ldquo;
            <strong>Cover Page</strong>&rdquo;) and (2) the Common Paper Mutual NDA
            Standard Terms Version 1.0 (&ldquo;<strong>Standard Terms</strong>&rdquo;)
            identical to those posted at{" "}
            <span className="text-indigo-600">
              commonpaper.com/standards/mutual-nda/1.0
            </span>
            . Any modifications of the Standard Terms should be made on the
            Cover Page, which will control over conflicts with the Standard
            Terms.
          </p>

          {/* Cover Page */}
          <div className="border border-slate-300 rounded-lg p-5 mb-6">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
              Cover Page
            </p>

            <CoverField
              label="Purpose"
              subtitle="How Confidential Information may be used"
            >
              <p className="leading-relaxed">{data.purpose || <span className="text-slate-300 italic">Not specified</span>}</p>
            </CoverField>

            <CoverField label="Effective Date">
              <p>{effectiveDateStr}</p>
            </CoverField>

            <CoverField label="MNDA Term" subtitle="The length of this MNDA">
              <div className="space-y-1">
                <p className="flex items-center gap-2">
                  <span className="font-mono text-xs border border-slate-400 px-0.5 rounded w-4 text-center inline-block">
                    {data.mndaTermType === "expires" ? "✓" : ""}
                  </span>
                  <span>
                    Expires{" "}
                    {data.mndaTermType === "expires"
                      ? `${data.mndaTermYears} year${data.mndaTermYears !== 1 ? "s" : ""}`
                      : "[N] year(s)"}{" "}
                    from Effective Date.
                  </span>
                </p>
                <p className="flex items-center gap-2">
                  <span className="font-mono text-xs border border-slate-400 px-0.5 rounded w-4 text-center inline-block">
                    {data.mndaTermType === "until_terminated" ? "✓" : ""}
                  </span>
                  <span>Continues until terminated.</span>
                </p>
              </div>
            </CoverField>

            <CoverField
              label="Term of Confidentiality"
              subtitle="How long Confidential Information is protected"
            >
              <div className="space-y-1">
                <p className="flex items-start gap-2">
                  <span className="font-mono text-xs border border-slate-400 px-0.5 rounded w-4 text-center inline-block mt-0.5 shrink-0">
                    {data.confidentialityTermType === "years" ? "✓" : ""}
                  </span>
                  <span>
                    {data.confidentialityTermType === "years"
                      ? `${data.confidentialityTermYears} year${data.confidentialityTermYears !== 1 ? "s" : ""}`
                      : "[N] year(s)"}{" "}
                    from Effective Date, but in the case of trade secrets until
                    no longer a trade secret under applicable laws.
                  </span>
                </p>
                <p className="flex items-center gap-2">
                  <span className="font-mono text-xs border border-slate-400 px-0.5 rounded w-4 text-center inline-block">
                    {data.confidentialityTermType === "perpetuity" ? "✓" : ""}
                  </span>
                  <span>In perpetuity.</span>
                </p>
              </div>
            </CoverField>

            <CoverField label="Governing Law & Jurisdiction">
              <p>
                <span className="font-medium">Governing Law:</span>{" "}
                {data.governingLawState || (
                  <span className="text-slate-300 italic">[State]</span>
                )}
              </p>
              <p className="mt-1">
                <span className="font-medium">Jurisdiction:</span>{" "}
                {data.jurisdictionDescription || (
                  <span className="text-slate-300 italic">[City/County, State]</span>
                )}
              </p>
            </CoverField>

            <CoverField label="MNDA Modifications">
              <p className="whitespace-pre-wrap">
                {data.modifications || "None."}
              </p>
            </CoverField>
          </div>

          {/* Signature block */}
          <p className="text-xs text-slate-600 mb-4 italic">
            By signing this Cover Page, each party agrees to enter into this
            MNDA as of the Effective Date.
          </p>

          <div className="overflow-x-auto mb-8">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr>
                  <th className="py-2 px-3 border border-slate-300 bg-slate-50 text-left w-28" />
                  <th className="py-2 px-3 border border-slate-300 bg-slate-50 text-center">
                    Party 1
                  </th>
                  <th className="py-2 px-3 border border-slate-300 bg-slate-50 text-center">
                    Party 2
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
                  <tr key={field}>
                    <td className="py-2 px-3 border border-slate-300 font-semibold text-slate-600 uppercase tracking-wide align-top">
                      {field}
                    </td>
                    <td className="py-2 px-3 border border-slate-300 text-center align-top">
                      {v1 || <span className="block h-6 border-b border-slate-200 mx-2" />}
                    </td>
                    <td className="py-2 px-3 border border-slate-300 text-center align-top">
                      {v2 || <span className="block h-6 border-b border-slate-200 mx-2" />}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="text-xs text-slate-400 text-center mb-10">
            Common Paper Mutual Non-Disclosure Agreement (Version 1.0) free to
            use under CC BY 4.0.
          </p>

          {/* Standard Terms */}
          <div className="border-t-2 border-slate-800 pt-6">
            <h2 className="text-lg font-bold text-slate-900 mb-5">
              Standard Terms
            </h2>

            <div className="space-y-4 text-xs leading-relaxed text-slate-700">
              <p>
                <strong>1. Introduction.</strong> This Mutual Non-Disclosure
                Agreement (which incorporates these Standard Terms and the Cover
                Page) (&ldquo;<strong>MNDA</strong>&rdquo;) allows each party (&ldquo;
                <strong>Disclosing Party</strong>&rdquo;) to disclose or make available
                information in connection with the{" "}
                <em className="text-indigo-700 not-italic font-medium">
                  {data.purpose || "[Purpose]"}
                </em>{" "}
                which (1) the Disclosing Party identifies to the receiving party
                (&ldquo;<strong>Receiving Party</strong>&rdquo;) as &ldquo;confidential&rdquo;,
                &ldquo;proprietary&rdquo;, or the like or (2) should be reasonably understood
                as confidential or proprietary due to its nature and the
                circumstances of its disclosure (&ldquo;
                <strong>Confidential Information</strong>&rdquo;). Each party&apos;s
                Confidential Information also includes the existence and status
                of the parties&apos; discussions and information on the Cover Page.
                Confidential Information includes technical or business
                information, product designs or roadmaps, requirements, pricing,
                security and compliance documentation, technology, inventions and
                know-how.
              </p>

              <p>
                <strong>2. Use and Protection of Confidential Information.</strong>{" "}
                The Receiving Party shall: (a) use Confidential Information
                solely for the{" "}
                <em className="text-indigo-700 not-italic font-medium">
                  {data.purpose || "[Purpose]"}
                </em>
                ; (b) not disclose Confidential Information to third parties
                without the Disclosing Party&apos;s prior written approval, except
                that the Receiving Party may disclose Confidential Information to
                its employees, agents, advisors, contractors and other
                representatives having a reasonable need to know for the{" "}
                <em className="text-indigo-700 not-italic font-medium">
                  {data.purpose || "[Purpose]"}
                </em>
                , provided these representatives are bound by confidentiality
                obligations no less protective of the Disclosing Party than the
                applicable terms in this MNDA and the Receiving Party remains
                responsible for their compliance with this MNDA; and (c) protect
                Confidential Information using at least the same protections the
                Receiving Party uses for its own similar information but no less
                than a reasonable standard of care.
              </p>

              <p>
                <strong>3. Exceptions.</strong> The Receiving Party&apos;s obligations
                in this MNDA do not apply to information that it can demonstrate:
                (a) is or becomes publicly available through no fault of the
                Receiving Party; (b) it rightfully knew or possessed prior to
                receipt from the Disclosing Party without confidentiality
                restrictions; (c) it rightfully obtained from a third party
                without confidentiality restrictions; or (d) it independently
                developed without using or referencing the Confidential
                Information.
              </p>

              <p>
                <strong>4. Disclosures Required by Law.</strong> The Receiving
                Party may disclose Confidential Information to the extent
                required by law, regulation or regulatory authority, subpoena or
                court order, provided (to the extent legally permitted) it
                provides the Disclosing Party reasonable advance notice of the
                required disclosure and reasonably cooperates, at the Disclosing
                Party&apos;s expense, with the Disclosing Party&apos;s efforts to obtain
                confidential treatment for the Confidential Information.
              </p>

              <p>
                <strong>5. Term and Termination.</strong> This MNDA commences on
                the{" "}
                <em className="text-indigo-700 not-italic font-medium">
                  {effectiveDateStr}
                </em>{" "}
                and expires at the end of the{" "}
                <em className="text-indigo-700 not-italic font-medium">
                  {mndaTermDescription(data)}
                </em>
                . Either party may terminate this MNDA for any or no reason upon
                written notice to the other party. The Receiving Party&apos;s
                obligations relating to Confidential Information will survive for
                the{" "}
                <em className="text-indigo-700 not-italic font-medium">
                  {confidentialityTermDescription(data)}
                </em>
                , despite any expiration or termination of this MNDA.
              </p>

              <p>
                <strong>6. Return or Destruction of Confidential Information.</strong>{" "}
                Upon expiration or termination of this MNDA or upon the
                Disclosing Party&apos;s earlier request, the Receiving Party will: (a)
                cease using Confidential Information; (b) promptly after the
                Disclosing Party&apos;s written request, destroy all Confidential
                Information in the Receiving Party&apos;s possession or control or
                return it to the Disclosing Party; and (c) if requested by the
                Disclosing Party, confirm its compliance with these obligations
                in writing.
              </p>

              <p>
                <strong>7. Proprietary Rights.</strong> The Disclosing Party
                retains all of its intellectual property and other rights in its
                Confidential Information and its disclosure to the Receiving
                Party grants no license under such rights.
              </p>

              <p>
                <strong>8. Disclaimer.</strong> ALL CONFIDENTIAL INFORMATION IS
                PROVIDED &ldquo;AS IS&rdquo;, WITH ALL FAULTS, AND WITHOUT WARRANTIES,
                INCLUDING THE IMPLIED WARRANTIES OF TITLE, MERCHANTABILITY AND
                FITNESS FOR A PARTICULAR PURPOSE.
              </p>

              <p>
                <strong>9. Governing Law and Jurisdiction.</strong> This MNDA
                and all matters relating hereto are governed by, and construed
                in accordance with, the laws of the State of{" "}
                <em className="text-indigo-700 not-italic font-medium">
                  {data.governingLawState || "[Governing Law State]"}
                </em>
                , without regard to the conflict of laws provisions of such{" "}
                <em className="text-indigo-700 not-italic font-medium">
                  {data.governingLawState || "[Governing Law State]"}
                </em>
                . Any legal suit, action, or proceeding relating to this MNDA
                must be instituted in the federal or state courts located in{" "}
                <em className="text-indigo-700 not-italic font-medium">
                  {data.jurisdictionDescription || "[Jurisdiction]"}
                </em>
                . Each party irrevocably submits to the exclusive jurisdiction
                of such{" "}
                <em className="text-indigo-700 not-italic font-medium">
                  {data.jurisdictionDescription || "[Jurisdiction]"}
                </em>{" "}
                in any such suit, action, or proceeding.
              </p>

              <p>
                <strong>10. Equitable Relief.</strong> A breach of this MNDA
                may cause irreparable harm for which monetary damages are an
                insufficient remedy. Upon a breach of this MNDA, the Disclosing
                Party is entitled to seek appropriate equitable relief, including
                an injunction, in addition to its other remedies.
              </p>

              <p>
                <strong>11. General.</strong> Neither party has an obligation
                under this MNDA to disclose Confidential Information to the
                other or proceed with any proposed transaction. Neither party may
                assign this MNDA without the prior written consent of the other
                party, except that either party may assign this MNDA in
                connection with a merger, reorganization, acquisition or other
                transfer of all or substantially all its assets or voting
                securities. Any assignment in violation of this Section is null
                and void. This MNDA will bind and inure to the benefit of each
                party&apos;s permitted successors and assigns. Waivers must be signed
                by the waiving party&apos;s authorized representative and cannot be
                implied from conduct. If any provision of this MNDA is held
                unenforceable, it will be limited to the minimum extent
                necessary so the rest of this MNDA remains in effect. This MNDA
                may only be amended, modified, waived, or supplemented by an
                agreement in writing signed by both parties. Notices must be
                sent to the email or postal addresses on the Cover Page and are
                deemed delivered on receipt.
              </p>
            </div>

            <p className="text-xs text-slate-400 text-center mt-8">
              Common Paper Mutual Non-Disclosure Agreement Version 1.0 — free
              to use under CC BY 4.0.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
