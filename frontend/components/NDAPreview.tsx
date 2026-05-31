"use client";

import { NDAFormData } from "@/lib/types";
import {
  formatDate,
  mndaTermDescription,
  confidentialityTermDescription,
  downloadMarkdown,
} from "@/lib/generateDocument";

interface NDAPreviewProps {
  data: NDAFormData;
  onBack: () => void;
}

function CoverPageField({
  label,
  subtitle,
  children,
}: {
  label: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="py-4 border-b border-slate-200 last:border-0">
      <div className="mb-2">
        <span className="font-semibold text-slate-800">{label}</span>
        {subtitle && (
          <span className="text-slate-500 text-sm ml-2 italic">
            — {subtitle}
          </span>
        )}
      </div>
      <div className="text-slate-700">{children}</div>
    </div>
  );
}

export default function NDAPreview({ data, onBack }: NDAPreviewProps) {
  const effectiveDateStr = formatDate(data.effectiveDate);

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    downloadMarkdown(data);
  };

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Toolbar */}
      <div className="no-print bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 transition-colors"
          >
            <span>←</span>
            <span>Edit Details</span>
          </button>
          <div className="flex items-center gap-3">
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 border border-slate-300 hover:border-slate-400 text-slate-700 hover:text-slate-900 text-sm px-4 py-2 rounded-lg transition-colors"
            >
              <span>↓</span>
              <span>Download .md</span>
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm px-4 py-2 rounded-lg transition-colors"
            >
              <span>⎙</span>
              <span>Print / Save PDF</span>
            </button>
          </div>
        </div>
      </div>

      {/* Document */}
      <div className="max-w-4xl mx-auto px-4 py-8 print-full">
        <div className="bg-white shadow-sm rounded-xl overflow-hidden print-full">
          <div className="px-12 py-10 font-serif">
            {/* Document Title */}
            <h1 className="text-2xl font-bold text-center text-slate-900 mb-2 tracking-tight">
              Mutual Non-Disclosure Agreement
            </h1>
            <p className="text-center text-slate-500 text-sm mb-10">
              Common Paper Mutual NDA Standard Terms Version 1.0
            </p>

            {/* Preamble */}
            <p className="text-sm text-slate-600 mb-8 leading-relaxed">
              This Mutual Non-Disclosure Agreement (the &ldquo;<strong>MNDA</strong>&rdquo;)
              consists of: (1) this Cover Page (&ldquo;<strong>Cover Page</strong>&rdquo;) and
              (2) the Common Paper Mutual NDA Standard Terms Version 1.0 (&ldquo;
              <strong>Standard Terms</strong>&rdquo;) identical to those posted at{" "}
              <span className="text-indigo-600">
                commonpaper.com/standards/mutual-nda/1.0
              </span>
              . Any modifications of the Standard Terms should be made on the
              Cover Page, which will control over conflicts with the Standard
              Terms.
            </p>

            {/* Cover Page Fields */}
            <div className="border border-slate-300 rounded-lg p-6 mb-8">
              <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">
                Cover Page
              </h2>

              <CoverPageField
                label="Purpose"
                subtitle="How Confidential Information may be used"
              >
                <p className="text-sm leading-relaxed">{data.purpose}</p>
              </CoverPageField>

              <CoverPageField label="Effective Date">
                <p className="text-sm">{effectiveDateStr}</p>
              </CoverPageField>

              <CoverPageField
                label="MNDA Term"
                subtitle="The length of this MNDA"
              >
                <div className="text-sm space-y-1">
                  <label className="flex items-center gap-2">
                    <span className="font-mono text-xs border border-slate-400 px-1 rounded">
                      {data.mndaTermType === "expires" ? "✓" : " "}
                    </span>
                    <span>
                      Expires{" "}
                      {data.mndaTermType === "expires"
                        ? `${data.mndaTermYears} year${data.mndaTermYears !== 1 ? "s" : ""}`
                        : "[N] year(s)"}{" "}
                      from Effective Date.
                    </span>
                  </label>
                  <label className="flex items-center gap-2">
                    <span className="font-mono text-xs border border-slate-400 px-1 rounded">
                      {data.mndaTermType === "until_terminated" ? "✓" : " "}
                    </span>
                    <span>
                      Continues until terminated in accordance with the terms
                      of the MNDA.
                    </span>
                  </label>
                </div>
              </CoverPageField>

              <CoverPageField
                label="Term of Confidentiality"
                subtitle="How long Confidential Information is protected"
              >
                <div className="text-sm space-y-1">
                  <label className="flex items-start gap-2">
                    <span className="font-mono text-xs border border-slate-400 px-1 rounded mt-0.5">
                      {data.confidentialityTermType === "years" ? "✓" : " "}
                    </span>
                    <span>
                      {data.confidentialityTermType === "years"
                        ? `${data.confidentialityTermYears} year${data.confidentialityTermYears !== 1 ? "s" : ""}`
                        : "[N] year(s)"}{" "}
                      from Effective Date, but in the case of trade secrets
                      until Confidential Information is no longer considered a
                      trade secret under applicable laws.
                    </span>
                  </label>
                  <label className="flex items-center gap-2">
                    <span className="font-mono text-xs border border-slate-400 px-1 rounded">
                      {data.confidentialityTermType === "perpetuity" ? "✓" : " "}
                    </span>
                    <span>In perpetuity.</span>
                  </label>
                </div>
              </CoverPageField>

              <CoverPageField label="Governing Law & Jurisdiction">
                <div className="text-sm space-y-1">
                  <p>
                    <span className="font-medium">Governing Law:</span>{" "}
                    {data.governingLawState || (
                      <span className="text-slate-400 italic">[State]</span>
                    )}
                  </p>
                  <p>
                    <span className="font-medium">Jurisdiction:</span>{" "}
                    {data.jurisdictionDescription || (
                      <span className="text-slate-400 italic">
                        [City/County, State]
                      </span>
                    )}
                  </p>
                </div>
              </CoverPageField>

              <CoverPageField label="MNDA Modifications">
                <p className="text-sm whitespace-pre-wrap">
                  {data.modifications || "None."}
                </p>
              </CoverPageField>
            </div>

            {/* Signature Block */}
            <p className="text-sm text-slate-700 mb-6 italic">
              By signing this Cover Page, each party agrees to enter into this
              MNDA as of the Effective Date.
            </p>

            <div className="overflow-x-auto mb-10">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr>
                    <th className="text-left py-2 px-3 border border-slate-300 bg-slate-50 w-32">
                      &nbsp;
                    </th>
                    <th className="text-center py-2 px-3 border border-slate-300 bg-slate-50">
                      Party 1
                    </th>
                    <th className="text-center py-2 px-3 border border-slate-300 bg-slate-50">
                      Party 2
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {[
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
                  ].map(([field, v1, v2]) => (
                    <tr key={field}>
                      <td className="py-3 px-3 border border-slate-300 font-medium text-slate-700 text-xs uppercase tracking-wide align-top">
                        {field}
                      </td>
                      <td className="py-3 px-3 border border-slate-300 text-center min-h-[2.5rem] align-top">
                        {v1 || (
                          <span className="block h-8 border-b border-slate-300 w-full" />
                        )}
                      </td>
                      <td className="py-3 px-3 border border-slate-300 text-center min-h-[2.5rem] align-top">
                        {v2 || (
                          <span className="block h-8 border-b border-slate-300 w-full" />
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="text-xs text-slate-400 text-center mb-12">
              Common Paper Mutual Non-Disclosure Agreement (Version 1.0) free
              to use under CC BY 4.0.
            </p>

            {/* Standard Terms */}
            <div className="border-t-2 border-slate-900 pt-8">
              <h2 className="text-xl font-bold text-slate-900 mb-6">
                Standard Terms
              </h2>

              <div className="space-y-5 text-sm leading-relaxed text-slate-700">
                <p>
                  <strong>1. Introduction.</strong> This Mutual Non-Disclosure
                  Agreement (which incorporates these Standard Terms and the
                  Cover Page (defined below)) (&ldquo;<strong>MNDA</strong>&rdquo;) allows each
                  party (&ldquo;<strong>Disclosing Party</strong>&rdquo;) to disclose or make
                  available information in connection with the{" "}
                  <em className="text-indigo-700">{data.purpose}</em> which (1)
                  the Disclosing Party identifies to the receiving party (&ldquo;
                  <strong>Receiving Party</strong>&rdquo;) as &ldquo;confidential&rdquo;,
                  &ldquo;proprietary&rdquo;, or the like or (2) should be reasonably
                  understood as confidential or proprietary due to its nature
                  and the circumstances of its disclosure (&ldquo;
                  <strong>Confidential Information</strong>&rdquo;). Each party&apos;s
                  Confidential Information also includes the existence and
                  status of the parties&apos; discussions and information on the
                  Cover Page. Confidential Information includes technical or
                  business information, product designs or roadmaps,
                  requirements, pricing, security and compliance documentation,
                  technology, inventions and know-how. To use this MNDA, the
                  parties must complete and sign a cover page incorporating
                  these Standard Terms (&ldquo;<strong>Cover Page</strong>&rdquo;). Each party
                  is identified on the Cover Page and capitalized terms have
                  the meanings given herein or on the Cover Page.
                </p>

                <p>
                  <strong>2. Use and Protection of Confidential Information.</strong>{" "}
                  The Receiving Party shall: (a) use Confidential Information
                  solely for the{" "}
                  <em className="text-indigo-700">{data.purpose}</em>; (b) not
                  disclose Confidential Information to third parties without
                  the Disclosing Party&apos;s prior written approval, except that
                  the Receiving Party may disclose Confidential Information to
                  its employees, agents, advisors, contractors and other
                  representatives having a reasonable need to know for the{" "}
                  <em className="text-indigo-700">{data.purpose}</em>, provided
                  these representatives are bound by confidentiality
                  obligations no less protective of the Disclosing Party than
                  the applicable terms in this MNDA and the Receiving Party
                  remains responsible for their compliance with this MNDA; and
                  (c) protect Confidential Information using at least the same
                  protections the Receiving Party uses for its own similar
                  information but no less than a reasonable standard of care.
                </p>

                <p>
                  <strong>3. Exceptions.</strong> The Receiving Party&apos;s
                  obligations in this MNDA do not apply to information that it
                  can demonstrate: (a) is or becomes publicly available through
                  no fault of the Receiving Party; (b) it rightfully knew or
                  possessed prior to receipt from the Disclosing Party without
                  confidentiality restrictions; (c) it rightfully obtained from
                  a third party without confidentiality restrictions; or (d) it
                  independently developed without using or referencing the
                  Confidential Information.
                </p>

                <p>
                  <strong>4. Disclosures Required by Law.</strong> The
                  Receiving Party may disclose Confidential Information to the
                  extent required by law, regulation or regulatory authority,
                  subpoena or court order, provided (to the extent legally
                  permitted) it provides the Disclosing Party reasonable
                  advance notice of the required disclosure and reasonably
                  cooperates, at the Disclosing Party&apos;s expense, with the
                  Disclosing Party&apos;s efforts to obtain confidential treatment
                  for the Confidential Information.
                </p>

                <p>
                  <strong>5. Term and Termination.</strong> This MNDA
                  commences on the{" "}
                  <em className="text-indigo-700">{effectiveDateStr}</em> and
                  expires at the end of the{" "}
                  <em className="text-indigo-700">
                    {mndaTermDescription(data)}
                  </em>
                  . Either party may terminate this MNDA for any or no reason
                  upon written notice to the other party. The Receiving Party&apos;s
                  obligations relating to Confidential Information will survive
                  for the{" "}
                  <em className="text-indigo-700">
                    {confidentialityTermDescription(data)}
                  </em>
                  , despite any expiration or termination of this MNDA.
                </p>

                <p>
                  <strong>6. Return or Destruction of Confidential Information.</strong>{" "}
                  Upon expiration or termination of this MNDA or upon the
                  Disclosing Party&apos;s earlier request, the Receiving Party will:
                  (a) cease using Confidential Information; (b) promptly after
                  the Disclosing Party&apos;s written request, destroy all
                  Confidential Information in the Receiving Party&apos;s possession
                  or control or return it to the Disclosing Party; and (c) if
                  requested by the Disclosing Party, confirm its compliance
                  with these obligations in writing. As an exception to
                  subsection (b), the Receiving Party may retain Confidential
                  Information in accordance with its standard backup or record
                  retention policies or as required by law, but the terms of
                  this MNDA will continue to apply to the retained Confidential
                  Information.
                </p>

                <p>
                  <strong>7. Proprietary Rights.</strong> The Disclosing Party
                  retains all of its intellectual property and other rights in
                  its Confidential Information and its disclosure to the
                  Receiving Party grants no license under such rights.
                </p>

                <p>
                  <strong>8. Disclaimer.</strong> ALL CONFIDENTIAL INFORMATION
                  IS PROVIDED &ldquo;AS IS&rdquo;, WITH ALL FAULTS, AND WITHOUT WARRANTIES,
                  INCLUDING THE IMPLIED WARRANTIES OF TITLE, MERCHANTABILITY
                  AND FITNESS FOR A PARTICULAR PURPOSE.
                </p>

                <p>
                  <strong>9. Governing Law and Jurisdiction.</strong> This
                  MNDA and all matters relating hereto are governed by, and
                  construed in accordance with, the laws of the State of{" "}
                  <em className="text-indigo-700">
                    {data.governingLawState || "[Governing Law State]"}
                  </em>
                  , without regard to the conflict of laws provisions of such{" "}
                  <em className="text-indigo-700">
                    {data.governingLawState || "[Governing Law State]"}
                  </em>
                  . Any legal suit, action, or proceeding relating to this
                  MNDA must be instituted in the federal or state courts
                  located in{" "}
                  <em className="text-indigo-700">
                    {data.jurisdictionDescription || "[Jurisdiction]"}
                  </em>
                  . Each party irrevocably submits to the exclusive
                  jurisdiction of such{" "}
                  <em className="text-indigo-700">
                    {data.jurisdictionDescription || "[Jurisdiction]"}
                  </em>{" "}
                  in any such suit, action, or proceeding.
                </p>

                <p>
                  <strong>10. Equitable Relief.</strong> A breach of this MNDA
                  may cause irreparable harm for which monetary damages are an
                  insufficient remedy. Upon a breach of this MNDA, the
                  Disclosing Party is entitled to seek appropriate equitable
                  relief, including an injunction, in addition to its other
                  remedies.
                </p>

                <p>
                  <strong>11. General.</strong> Neither party has an obligation
                  under this MNDA to disclose Confidential Information to the
                  other or proceed with any proposed transaction. Neither party
                  may assign this MNDA without the prior written consent of the
                  other party, except that either party may assign this MNDA in
                  connection with a merger, reorganization, acquisition or
                  other transfer of all or substantially all its assets or
                  voting securities. Any assignment in violation of this
                  Section is null and void. This MNDA will bind and inure to
                  the benefit of each party&apos;s permitted successors and assigns.
                  Waivers must be signed by the waiving party&apos;s authorized
                  representative and cannot be implied from conduct. If any
                  provision of this MNDA is held unenforceable, it will be
                  limited to the minimum extent necessary so the rest of this
                  MNDA remains in effect. This MNDA (including the Cover Page)
                  constitutes the entire agreement of the parties with respect
                  to its subject matter, and supersedes all prior and
                  contemporaneous understandings, agreements, representations,
                  and warranties, whether written or oral, regarding such
                  subject matter. This MNDA may only be amended, modified,
                  waived, or supplemented by an agreement in writing signed by
                  both parties. Notices, requests and approvals under this
                  MNDA must be sent in writing to the email or postal addresses
                  on the Cover Page and are deemed delivered on receipt. This
                  MNDA may be executed in counterparts, including electronic
                  copies, each of which is deemed an original and which
                  together form the same agreement.
                </p>
              </div>

              <p className="text-xs text-slate-400 text-center mt-10">
                Common Paper Mutual Non-Disclosure Agreement Version 1.0 free
                to use under CC BY 4.0.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
