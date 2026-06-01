import { NDAFormData, GenericDocFormData } from "./types";
import { DocConfig } from "./docConfig";

export function formatDate(isoDate: string): string {
  if (!isoDate) return "[Date]";
  const d = new Date(isoDate + "T00:00:00");
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function mndaTermDescription(data: NDAFormData): string {
  if (data.mndaTermType === "expires") {
    return `${data.mndaTermYears} year${data.mndaTermYears !== 1 ? "s" : ""} from Effective Date`;
  }
  return "continues until terminated in accordance with the terms of the MNDA";
}

export function confidentialityTermDescription(data: NDAFormData): string {
  if (data.confidentialityTermType === "perpetuity") {
    return "in perpetuity";
  }
  return `${data.confidentialityTermYears} year${data.confidentialityTermYears !== 1 ? "s" : ""} from Effective Date, but in the case of trade secrets until Confidential Information is no longer considered a trade secret under applicable laws`;
}

const DRAFT_DISCLAIMER_MD = `> **DRAFT — FOR DISCUSSION PURPOSES ONLY.** This document was generated with AI assistance and has not been reviewed by a licensed attorney. It does not constitute legal advice. All parties should seek qualified legal counsel before signing.

---

`;

/* ── Markdown export ─────────────────────────────── */

export function generateMarkdown(data: NDAFormData): string {
  const effectiveDateStr = formatDate(data.effectiveDate);
  return `${DRAFT_DISCLAIMER_MD}# Mutual Non-Disclosure Agreement

## USING THIS MUTUAL NON-DISCLOSURE AGREEMENT

This Mutual Non-Disclosure Agreement (the "MNDA") consists of: (1) this Cover Page ("**Cover Page**") and (2) the Common Paper Mutual NDA Standard Terms Version 1.0 ("**Standard Terms**") identical to those posted at commonpaper.com/standards/mutual-nda/1.0. Any modifications of the Standard Terms should be made on the Cover Page, which will control over conflicts with the Standard Terms.

---

### Purpose
*How Confidential Information may be used*

${data.purpose}

### Effective Date

${effectiveDateStr}

### MNDA Term
*The length of this MNDA*

${data.mndaTermType === "expires" ? `- [x] Expires ${data.mndaTermYears} year${data.mndaTermYears !== 1 ? "s" : ""} from Effective Date.\n- [ ] Continues until terminated.` : `- [ ] Expires [N] year(s) from Effective Date.\n- [x] Continues until terminated.`}

### Term of Confidentiality
*How long Confidential Information is protected*

${data.confidentialityTermType === "years" ? `- [x] ${data.confidentialityTermYears} year${data.confidentialityTermYears !== 1 ? "s" : ""} from Effective Date (trade secrets protected until no longer a trade secret).\n- [ ] In perpetuity.` : `- [ ] [N] year(s) from Effective Date.\n- [x] In perpetuity.`}

### Governing Law & Jurisdiction

Governing Law: ${data.governingLawState || "[State]"}

Jurisdiction: ${data.jurisdictionDescription || "[City/County, State]"}

### MNDA Modifications

${data.modifications || "None."}

---

By signing this Cover Page, each party agrees to enter into this MNDA as of the Effective Date.

|  | PARTY 1 | PARTY 2 |
|:--- | :----: | :----: |
| **Company** | ${data.party1.company || ""} | ${data.party2.company || ""} |
| **Signature** | | |
| **Print Name** | ${data.party1.signatoryName || ""} | ${data.party2.signatoryName || ""} |
| **Title** | ${data.party1.title || ""} | ${data.party2.title || ""} |
| **Notice Address** | ${data.party1.noticeAddress || ""} | ${data.party2.noticeAddress || ""} |
| **Date** | | |

*Common Paper Mutual Non-Disclosure Agreement (Version 1.0) free to use under CC BY 4.0.*

---

# Standard Terms

1. **Introduction**. This MNDA allows each party ("**Disclosing Party**") to disclose information in connection with the **${data.purpose}** which the Disclosing Party identifies to the receiving party ("**Receiving Party**") as "confidential", "proprietary", or the like, or which should be reasonably understood as confidential ("**Confidential Information**").

2. **Use and Protection of Confidential Information**. The Receiving Party shall: (a) use Confidential Information solely for the **${data.purpose}**; (b) not disclose Confidential Information to third parties without prior written approval; and (c) protect Confidential Information using at least the same protections it uses for its own similar information.

3. **Exceptions**. Obligations do not apply to information that: (a) becomes publicly available through no fault of the Receiving Party; (b) was rightfully known prior to receipt; (c) was rightfully obtained from a third party; or (d) was independently developed.

4. **Disclosures Required by Law**. The Receiving Party may disclose Confidential Information to the extent required by law, provided it gives the Disclosing Party reasonable advance notice.

5. **Term and Termination**. This MNDA commences on **${effectiveDateStr}** and expires at the end of the **${mndaTermDescription(data)}**. Confidentiality obligations survive for the **${confidentialityTermDescription(data)}**.

6. **Return or Destruction**. Upon termination, the Receiving Party will cease using and destroy or return all Confidential Information.

7. **Proprietary Rights**. The Disclosing Party retains all intellectual property rights in its Confidential Information.

8. **Disclaimer**. ALL CONFIDENTIAL INFORMATION IS PROVIDED "AS IS", WITHOUT WARRANTIES.

9. **Governing Law and Jurisdiction**. Governed by the laws of **${data.governingLawState || "[State]"}**. Disputes resolved in **${data.jurisdictionDescription || "[Jurisdiction]"}**.

10. **Equitable Relief**. A breach may cause irreparable harm; the Disclosing Party is entitled to seek equitable relief.

11. **General**. Neither party may assign this MNDA without prior written consent. This MNDA constitutes the entire agreement and may only be amended in writing signed by both parties.

*Common Paper Mutual Non-Disclosure Agreement Version 1.0 — free to use under CC BY 4.0.*
`;
}

export function downloadMarkdown(data: NDAFormData): void {
  const content = generateMarkdown(data);
  const blob = new Blob([content], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  const party1 = data.party1.company || "Party1";
  const party2 = data.party2.company || "Party2";
  a.href = url;
  a.download = `Mutual-NDA-${party1}-${party2}.md`
    .replace(/\s+/g, "-")
    .replace(/[^a-zA-Z0-9.-]/g, "");
  a.click();
  URL.revokeObjectURL(url);
}

/* ── Print / PDF ─────────────────────────────────── */

function esc(s: string): string {
  if (!s) return "";
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/\n/g, "<br>");
}

function hi(s: string, fallback = ""): string {
  const v = s || fallback;
  return `<span class="hi">${esc(v)}</span>`;
}

function checkRow(checked: boolean, text: string): string {
  return `<div class="cr"><span class="cb">${checked ? "&#10003;" : "&nbsp;"}</span><span>${text}</span></div>`;
}

function sigCell(value: string): string {
  return value
    ? `<td class="sc">${esc(value)}</td>`
    : `<td class="sc"><span class="sl"></span></td>`;
}

export function generatePrintHTML(data: NDAFormData): string {
  const date = formatDate(data.effectiveDate);
  const mndaTerm = mndaTermDescription(data);
  const confTerm = confidentialityTermDescription(data);
  const p1 = data.party1;
  const p2 = data.party2;

  const mndaYrs = `${data.mndaTermYears} year${data.mndaTermYears !== 1 ? "s" : ""}`;
  const confYrs = `${data.confidentialityTermYears} year${data.confidentialityTermYears !== 1 ? "s" : ""}`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Mutual Non-Disclosure Agreement</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=DM+Sans:wght@400;500;600&display=swap" rel="stylesheet">
<style>
@page { size: letter; margin: 1.5cm; }
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:'Playfair Display',Georgia,serif;font-size:10.5pt;color:#1c1917;line-height:1.65;background:#fff}
.sans{font-family:'DM Sans',system-ui,sans-serif}

/* Title */
.title-block{text-align:center;margin-bottom:22pt}
h1{font-size:18pt;font-weight:700;letter-spacing:-0.02em;line-height:1.2;margin-bottom:10pt}
.rule-row{display:flex;align-items:center;gap:10pt}
.rule-row hr{flex:1;border:none;border-top:1px solid #d6d3d1}
.rule-label{font-family:'DM Sans',sans-serif;font-size:7pt;font-weight:600;text-transform:uppercase;letter-spacing:.18em;color:#a8a29e;white-space:nowrap}

/* Preamble */
.preamble{font-size:9.5pt;color:#57534e;margin-bottom:18pt;line-height:1.6}
.preamble a{color:#92400e;text-decoration:none}

/* Cover box */
.cover{border:2pt solid #1c1917;padding:14pt;margin-bottom:18pt}
.cover-heading{font-family:'DM Sans',sans-serif;font-size:7pt;font-weight:700;text-transform:uppercase;letter-spacing:.22em;color:#78716c;border-bottom:1pt solid #e7e5e4;padding-bottom:8pt;margin-bottom:10pt}
.cf{display:flex;gap:14pt;padding:7pt 0;border-bottom:1pt solid #f5f5f4}
.cf:last-child{border-bottom:none}
.cf-lbl{width:100pt;flex-shrink:0}
.cf-name{font-family:'DM Sans',sans-serif;font-size:8.5pt;font-weight:600;color:#292524;line-height:1.3}
.cf-hint{font-size:7.5pt;font-style:italic;color:#a8a29e;margin-top:1pt;line-height:1.3}
.cf-val{flex:1;font-size:9.5pt;color:#292524;line-height:1.55}

/* Check rows */
.cr{display:flex;align-items:flex-start;gap:5pt;font-size:9.5pt;margin-bottom:4pt;line-height:1.4}
.cb{font-family:'DM Sans',sans-serif;font-size:8pt;border:1pt solid #78716c;width:11pt;height:11pt;display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-top:1pt;border-radius:1pt;text-align:center;line-height:1}

/* Sig block */
.sig-pre{font-size:9.5pt;font-style:italic;color:#57534e;margin-bottom:10pt}
table.sig{width:100%;border-collapse:collapse;font-size:9pt;margin-bottom:14pt}
table.sig th{font-family:'DM Sans',sans-serif;font-size:7.5pt;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:#1c1917;padding:7pt 8pt;border-bottom:2pt solid #1c1917;text-align:center}
table.sig th.rh{text-align:left}
table.sig td.rh{font-family:'DM Sans',sans-serif;font-size:7.5pt;font-weight:600;text-transform:uppercase;letter-spacing:.08em;color:#78716c;padding:7pt 8pt;border-bottom:1pt solid #f5f5f4;vertical-align:top}
table.sig td.sc{padding:7pt 8pt;border-bottom:1pt solid #f5f5f4;text-align:center;vertical-align:top;font-size:9pt}
.sl{display:block;border-bottom:1pt solid #d6d3d1;height:14pt}

/* License */
.license{font-family:'DM Sans',sans-serif;font-size:7.5pt;color:#a8a29e;text-align:center;margin:12pt 0}

/* Standard terms */
hr.terms-rule{border:none;border-top:1pt solid #c8c5c0;margin:18pt 0 14pt}
h2.terms-title{font-size:14pt;font-weight:700;letter-spacing:-.01em;margin-bottom:12pt}
.term{font-size:9.5pt;line-height:1.65;color:#292524;margin-bottom:9pt}
.term b{color:#1c1917}

/* Dynamic value highlight → underline for print */
.hi{font-weight:600;text-decoration:underline;text-decoration-color:#92400e;text-underline-offset:2pt;color:#1c1917}
.empty{color:#c8c5c0}
</style>
</head>
<body>

<div class="title-block">
  <h1>Mutual Non-Disclosure Agreement</h1>
  <div class="rule-row">
    <hr>
    <span class="rule-label">Common Paper Standard Terms &middot; Version 1.0</span>
    <hr>
  </div>
</div>

<p class="preamble">
  This Mutual Non-Disclosure Agreement (the &ldquo;<b>MNDA</b>&rdquo;) consists of:
  (1) this Cover Page (&ldquo;<b>Cover Page</b>&rdquo;) and (2) the Common Paper Mutual NDA
  Standard Terms Version 1.0 (&ldquo;<b>Standard Terms</b>&rdquo;) identical to those posted at
  <a>commonpaper.com/standards/mutual-nda/1.0</a>.
  Any modifications of the Standard Terms should be made on the Cover Page,
  which will control over conflicts with the Standard Terms.
</p>

<div class="cover">
  <div class="cover-heading">Cover Page</div>

  <div class="cf">
    <div class="cf-lbl">
      <div class="cf-name">Purpose</div>
      <div class="cf-hint">How Confidential Information may be used</div>
    </div>
    <div class="cf-val">${esc(data.purpose) || '<span class="empty">Not specified</span>'}</div>
  </div>

  <div class="cf">
    <div class="cf-lbl"><div class="cf-name">Effective Date</div></div>
    <div class="cf-val">${esc(date)}</div>
  </div>

  <div class="cf">
    <div class="cf-lbl">
      <div class="cf-name">MNDA Term</div>
      <div class="cf-hint">The length of this MNDA</div>
    </div>
    <div class="cf-val">
      ${checkRow(data.mndaTermType === "expires", `Expires ${data.mndaTermType === "expires" ? mndaYrs : "[N] year(s)"} from Effective Date.`)}
      ${checkRow(data.mndaTermType === "until_terminated", "Continues until terminated.")}
    </div>
  </div>

  <div class="cf">
    <div class="cf-lbl">
      <div class="cf-name">Term of Confidentiality</div>
      <div class="cf-hint">How long Confidential Information is protected</div>
    </div>
    <div class="cf-val">
      ${checkRow(data.confidentialityTermType === "years", `${data.confidentialityTermType === "years" ? confYrs : "[N] year(s)"} from Effective Date, but in the case of trade secrets until no longer a trade secret under applicable laws.`)}
      ${checkRow(data.confidentialityTermType === "perpetuity", "In perpetuity.")}
    </div>
  </div>

  <div class="cf">
    <div class="cf-lbl"><div class="cf-name">Governing Law &amp; Jurisdiction</div></div>
    <div class="cf-val">
      <div><b>Governing Law:</b> ${esc(data.governingLawState) || '<span class="empty">[State]</span>'}</div>
      <div style="margin-top:4pt"><b>Jurisdiction:</b> ${esc(data.jurisdictionDescription) || '<span class="empty">[City/County, State]</span>'}</div>
    </div>
  </div>

  <div class="cf">
    <div class="cf-lbl"><div class="cf-name">MNDA Modifications</div></div>
    <div class="cf-val">${esc(data.modifications) || "None."}</div>
  </div>
</div>

<p class="sig-pre">By signing this Cover Page, each party agrees to enter into this MNDA as of the Effective Date.</p>

<table class="sig">
  <thead>
    <tr>
      <th class="rh" style="width:90pt"></th>
      <th>${esc(p1.company) || "Party 1"}</th>
      <th>${esc(p2.company) || "Party 2"}</th>
    </tr>
  </thead>
  <tbody>
    <tr><td class="rh">Company</td>${sigCell(p1.company)}${sigCell(p2.company)}</tr>
    <tr><td class="rh">Signature</td>${sigCell("")}${sigCell("")}</tr>
    <tr><td class="rh">Print Name</td>${sigCell(p1.signatoryName)}${sigCell(p2.signatoryName)}</tr>
    <tr><td class="rh">Title</td>${sigCell(p1.title)}${sigCell(p2.title)}</tr>
    <tr><td class="rh">Notice Address</td>${sigCell(p1.noticeAddress)}${sigCell(p2.noticeAddress)}</tr>
    <tr><td class="rh">Date</td>${sigCell("")}${sigCell("")}</tr>
  </tbody>
</table>

<p class="license">Common Paper Mutual Non-Disclosure Agreement (Version 1.0) &mdash; free to use under CC BY 4.0</p>

<hr class="terms-rule">
<h2 class="terms-title">Standard Terms</h2>

<div class="term">
  <b>1. Introduction.</b> This Mutual Non-Disclosure Agreement
  (&ldquo;<b>MNDA</b>&rdquo;) allows each party (&ldquo;<b>Disclosing Party</b>&rdquo;) to
  disclose or make available information in connection with the
  ${hi(data.purpose, "[Purpose]")}
  which (1) the Disclosing Party identifies to the receiving party
  (&ldquo;<b>Receiving Party</b>&rdquo;) as &ldquo;confidential&rdquo;, &ldquo;proprietary&rdquo;,
  or the like or (2) should be reasonably understood as confidential or
  proprietary due to its nature and the circumstances of its disclosure
  (&ldquo;<b>Confidential Information</b>&rdquo;). Each party&rsquo;s Confidential Information
  also includes the existence and status of the parties&rsquo; discussions.
  Confidential Information includes technical or business information,
  product designs or roadmaps, requirements, pricing, security and
  compliance documentation, technology, inventions and know-how.
</div>

<div class="term">
  <b>2. Use and Protection of Confidential Information.</b>
  The Receiving Party shall: (a) use Confidential Information solely for
  the ${hi(data.purpose, "[Purpose]")}; (b) not disclose Confidential Information to third
  parties without the Disclosing Party&rsquo;s prior written approval, except
  that the Receiving Party may disclose Confidential Information to its
  employees, agents, advisors, contractors and other representatives
  having a reasonable need to know for the ${hi(data.purpose, "[Purpose]")}, provided
  these representatives are bound by confidentiality obligations no less
  protective of the Disclosing Party than the applicable terms in this
  MNDA and the Receiving Party remains responsible for their compliance
  with this MNDA; and (c) protect Confidential Information using at least
  the same protections the Receiving Party uses for its own similar
  information but no less than a reasonable standard of care.
</div>

<div class="term">
  <b>3. Exceptions.</b> The Receiving Party&rsquo;s obligations in this MNDA do
  not apply to information that it can demonstrate: (a) is or becomes
  publicly available through no fault of the Receiving Party; (b) it
  rightfully knew or possessed prior to receipt from the Disclosing Party
  without confidentiality restrictions; (c) it rightfully obtained from a
  third party without confidentiality restrictions; or (d) it independently
  developed without using or referencing the Confidential Information.
</div>

<div class="term">
  <b>4. Disclosures Required by Law.</b> The Receiving Party may disclose
  Confidential Information to the extent required by law, regulation or
  regulatory authority, subpoena or court order, provided (to the extent
  legally permitted) it provides the Disclosing Party reasonable advance
  notice of the required disclosure and reasonably cooperates, at the
  Disclosing Party&rsquo;s expense, with the Disclosing Party&rsquo;s efforts to
  obtain confidential treatment for the Confidential Information.
</div>

<div class="term">
  <b>5. Term and Termination.</b> This MNDA commences on the
  ${hi(date)} and expires at the end of the ${hi(mndaTerm)}.
  Either party may terminate this MNDA for any or no reason upon written
  notice to the other party. The Receiving Party&rsquo;s obligations relating to
  Confidential Information will survive for the ${hi(confTerm)},
  despite any expiration or termination of this MNDA.
</div>

<div class="term">
  <b>6. Return or Destruction of Confidential Information.</b>
  Upon expiration or termination of this MNDA or upon the Disclosing
  Party&rsquo;s earlier request, the Receiving Party will: (a) cease using
  Confidential Information; (b) promptly destroy all Confidential
  Information in its possession or control or return it to the Disclosing
  Party; and (c) if requested, confirm its compliance in writing. The
  Receiving Party may retain Confidential Information in accordance with
  its standard backup or record retention policies or as required by law,
  subject to continuing confidentiality obligations.
</div>

<div class="term">
  <b>7. Proprietary Rights.</b> The Disclosing Party retains all of its
  intellectual property and other rights in its Confidential Information
  and its disclosure to the Receiving Party grants no license under such
  rights.
</div>

<div class="term">
  <b>8. Disclaimer.</b> ALL CONFIDENTIAL INFORMATION IS PROVIDED &ldquo;AS IS&rdquo;,
  WITH ALL FAULTS, AND WITHOUT WARRANTIES, INCLUDING THE IMPLIED WARRANTIES
  OF TITLE, MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE.
</div>

<div class="term">
  <b>9. Governing Law and Jurisdiction.</b> This MNDA and all matters
  relating hereto are governed by, and construed in accordance with, the
  laws of the State of ${hi(data.governingLawState, "[Governing Law State]")}, without
  regard to the conflict of laws provisions of such
  ${hi(data.governingLawState, "[Governing Law State]")}. Any legal suit, action,
  or proceeding relating to this MNDA must be instituted in the federal or
  state courts located in ${hi(data.jurisdictionDescription, "[Jurisdiction]")}.
  Each party irrevocably submits to the exclusive jurisdiction of such
  ${hi(data.jurisdictionDescription, "[Jurisdiction]")} in any such suit, action,
  or proceeding.
</div>

<div class="term">
  <b>10. Equitable Relief.</b> A breach of this MNDA may cause irreparable
  harm for which monetary damages are an insufficient remedy. Upon a breach
  of this MNDA, the Disclosing Party is entitled to seek appropriate
  equitable relief, including an injunction, in addition to its other
  remedies.
</div>

<div class="term">
  <b>11. General.</b> Neither party has an obligation under this MNDA to
  disclose Confidential Information or proceed with any proposed
  transaction. Neither party may assign this MNDA without the prior written
  consent of the other party, except in connection with a merger,
  reorganization, acquisition or other transfer of all or substantially all
  its assets or voting securities. This MNDA will bind and inure to the
  benefit of each party&rsquo;s permitted successors and assigns. Waivers must be
  signed by the waiving party&rsquo;s authorized representative. If any provision
  of this MNDA is held unenforceable, it will be limited to the minimum
  extent necessary so the rest of this MNDA remains in effect. This MNDA
  constitutes the entire agreement of the parties with respect to its
  subject matter and may only be amended in writing signed by both parties.
  Notices must be sent to the email or postal addresses on the Cover Page
  and are deemed delivered on receipt. This MNDA may be executed in
  counterparts, each of which is deemed an original.
</div>

<p class="license">Common Paper Mutual Non-Disclosure Agreement Version 1.0 &mdash; free to use under CC BY 4.0</p>

<script>(function(){function doPrint(){window.focus();window.print();}if(document.fonts&&document.fonts.ready){document.fonts.ready.then(function(){setTimeout(doPrint,250);});}else{setTimeout(doPrint,900);}})()</script>
</body>
</html>`;
}

function openPrintWindow(html: string): void {
  const w = window.open("", "_blank", "width=900,height=700");
  if (!w) {
    alert("Please allow pop-ups for this site to enable PDF printing.");
    return;
  }
  w.document.open();
  w.document.write(html);
  w.document.close();
}

export function printDocument(data: NDAFormData): void {
  openPrintWindow(generatePrintHTML(data));
}

/* ── Generic document export ─────────────────────── */

export function generateGenericMarkdown(
  data: GenericDocFormData,
  docConfig: DocConfig
): string {
  const effectiveDateStr = data.effectiveDate
    ? formatDate(data.effectiveDate)
    : "[Date]";
  const p1 = data.party1;
  const p2 = data.party2;

  const partyRow = (label: string, p: typeof p1) =>
    `### ${label}\n- **Company:** ${p.company || "[Company]"}\n- **Signatory:** ${p.signatoryName || "[Name]"}\n- **Title:** ${p.title || "[Title]"}\n- **Notice Address:** ${p.noticeAddress || "[Address]"}`;

  return `${DRAFT_DISCLAIMER_MD}# ${docConfig.name}

## Cover Page

${partyRow(docConfig.party1Label, p1)}

${partyRow(docConfig.party2Label, p2)}

### Effective Date
${effectiveDateStr}

### Term
${data.term || "[Not specified]"}

### Governing Law & Jurisdiction
- **Governing Law:** ${data.governingLawState || "[State]"}
- **Jurisdiction:** ${data.jurisdictionDescription || "[City/County, State]"}

${data.specialTerms ? `### Special Terms\n${data.specialTerms}\n` : ""}
---

By signing this Cover Page, each party agrees to enter into this ${docConfig.name} as of the Effective Date.

| | ${docConfig.party1Label} | ${docConfig.party2Label} |
|:--- | :----: | :----: |
| **Company** | ${p1.company || ""} | ${p2.company || ""} |
| **Signature** | | |
| **Print Name** | ${p1.signatoryName || ""} | ${p2.signatoryName || ""} |
| **Title** | ${p1.title || ""} | ${p2.title || ""} |
| **Notice Address** | ${p1.noticeAddress || ""} | ${p2.noticeAddress || ""} |
| **Date** | | |

*Common Paper ${docConfig.name} — Standard Terms incorporated by reference.*
*Free to use under CC BY 4.0.*
`;
}

export function downloadGenericMarkdown(
  data: GenericDocFormData,
  docConfig: DocConfig
): void {
  const content = generateGenericMarkdown(data, docConfig);
  const blob = new Blob([content], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  const p1 = data.party1.company || docConfig.party1Label;
  const p2 = data.party2.company || docConfig.party2Label;
  a.href = url;
  a.download = `${docConfig.name.replace(/\s+/g, "-")}-${p1}-${p2}.md`
    .replace(/[^a-zA-Z0-9.-]/g, "-")
    .replace(/-+/g, "-");
  a.click();
  URL.revokeObjectURL(url);
}

export function generateGenericPrintHTML(
  data: GenericDocFormData,
  docConfig: DocConfig
): string {
  const date = data.effectiveDate ? formatDate(data.effectiveDate) : "[Date]";
  const p1 = data.party1;
  const p2 = data.party2;

  function partyBlock(p: typeof p1): string {
    const lines: string[] = [];
    if (p.company) lines.push(`<div class="pb-name">${esc(p.company)}</div>`);
    if (p.signatoryName) lines.push(`<div>${esc(p.signatoryName)}</div>`);
    if (p.title) lines.push(`<div class="pb-sub">${esc(p.title)}</div>`);
    if (p.noticeAddress)
      lines.push(`<div class="pb-sub">${esc(p.noticeAddress)}</div>`);
    return lines.length
      ? lines.join("")
      : `<span class="empty">Not specified</span>`;
  }

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>${esc(docConfig.name)}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=DM+Sans:wght@400;500;600&display=swap" rel="stylesheet">
<style>
@page{size:letter;margin:1.5cm}
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:'Playfair Display',Georgia,serif;font-size:10.5pt;color:#1c1917;line-height:1.65;background:#fff}
.sans{font-family:'DM Sans',system-ui,sans-serif}
.title-block{text-align:center;margin-bottom:22pt}
h1{font-size:18pt;font-weight:700;letter-spacing:-.02em;line-height:1.2;margin-bottom:10pt}
.rule-row{display:flex;align-items:center;gap:10pt}
.rule-row hr{flex:1;border:none;border-top:1px solid #d6d3d1}
.rule-label{font-family:'DM Sans',sans-serif;font-size:7pt;font-weight:600;text-transform:uppercase;letter-spacing:.18em;color:#a8a29e;white-space:nowrap}
.preamble{font-size:9.5pt;color:#57534e;margin-bottom:18pt;line-height:1.6}
.cover{border:2pt solid #1c1917;padding:14pt;margin-bottom:18pt}
.cover-heading{font-family:'DM Sans',sans-serif;font-size:7pt;font-weight:700;text-transform:uppercase;letter-spacing:.22em;color:#78716c;border-bottom:1pt solid #e7e5e4;padding-bottom:8pt;margin-bottom:10pt}
.cf{display:flex;gap:14pt;padding:7pt 0;border-bottom:1pt solid #f5f5f4}
.cf:last-child{border-bottom:none}
.cf-lbl{width:110pt;flex-shrink:0}
.cf-name{font-family:'DM Sans',sans-serif;font-size:8.5pt;font-weight:600;color:#292524;line-height:1.3}
.cf-hint{font-size:7.5pt;font-style:italic;color:#a8a29e;margin-top:1pt;line-height:1.3}
.cf-val{flex:1;font-size:9.5pt;color:#292524;line-height:1.55}
.pb-name{font-weight:600;font-size:10pt}
.pb-sub{font-size:8.5pt;color:#78716c;margin-top:1pt}
.sig-pre{font-size:9.5pt;font-style:italic;color:#57534e;margin-bottom:10pt}
table.sig{width:100%;border-collapse:collapse;font-size:9pt;margin-bottom:14pt}
table.sig th{font-family:'DM Sans',sans-serif;font-size:7.5pt;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:#1c1917;padding:7pt 8pt;border-bottom:2pt solid #1c1917;text-align:center}
table.sig th.rh{text-align:left}
table.sig td.rh{font-family:'DM Sans',sans-serif;font-size:7.5pt;font-weight:600;text-transform:uppercase;letter-spacing:.08em;color:#78716c;padding:7pt 8pt;border-bottom:1pt solid #f5f5f4;vertical-align:top}
table.sig td.sc{padding:7pt 8pt;border-bottom:1pt solid #f5f5f4;text-align:center;vertical-align:top;font-size:9pt}
.sl{display:block;border-bottom:1pt solid #d6d3d1;height:14pt}
.license{font-family:'DM Sans',sans-serif;font-size:7.5pt;color:#a8a29e;text-align:center;margin:12pt 0}
.std-note{font-family:'DM Sans',sans-serif;font-size:8.5pt;color:#78716c;text-align:center;margin-top:14pt;line-height:1.6;font-style:italic}
.hi{font-weight:600;text-decoration:underline;text-decoration-color:#92400e;text-underline-offset:2pt;color:#1c1917}
.empty{color:#c8c5c0}
</style>
</head>
<body>

<div class="title-block">
  <h1>${esc(docConfig.name)}</h1>
  <div class="rule-row">
    <hr>
    <span class="rule-label">Common Paper Standard Terms</span>
    <hr>
  </div>
</div>

<p class="preamble">
  This ${esc(docConfig.name)} (the &ldquo;<b>Agreement</b>&rdquo;) consists of:
  (1) this Cover Page setting out the key terms agreed between the
  <b>${esc(docConfig.party1Label)}</b> and the <b>${esc(docConfig.party2Label)}</b>, and
  (2) the Common Paper ${esc(docConfig.name)} Standard Terms incorporated by reference.
</p>

<div class="cover">
  <div class="cover-heading">Cover Page</div>

  <div class="cf">
    <div class="cf-lbl"><div class="cf-name">${esc(docConfig.party1Label)}</div></div>
    <div class="cf-val">${partyBlock(p1)}</div>
  </div>

  <div class="cf">
    <div class="cf-lbl"><div class="cf-name">${esc(docConfig.party2Label)}</div></div>
    <div class="cf-val">${partyBlock(p2)}</div>
  </div>

  <div class="cf">
    <div class="cf-lbl"><div class="cf-name">Effective Date</div></div>
    <div class="cf-val">${hi(date)}</div>
  </div>

  <div class="cf">
    <div class="cf-lbl">
      <div class="cf-name">Term</div>
      <div class="cf-hint">Duration of the agreement</div>
    </div>
    <div class="cf-val">${data.term ? hi(data.term) : '<span class="empty">[Not specified]</span>'}</div>
  </div>

  <div class="cf">
    <div class="cf-lbl"><div class="cf-name">Governing Law &amp; Jurisdiction</div></div>
    <div class="cf-val">
      <div><b>Governing Law:</b> ${esc(data.governingLawState) || '<span class="empty">[State]</span>'}</div>
      <div style="margin-top:4pt"><b>Jurisdiction:</b> ${esc(data.jurisdictionDescription) || '<span class="empty">[City/County, State]</span>'}</div>
    </div>
  </div>

  ${data.specialTerms ? `<div class="cf">
    <div class="cf-lbl"><div class="cf-name">Special Terms</div></div>
    <div class="cf-val">${esc(data.specialTerms)}</div>
  </div>` : ""}
</div>

<p class="sig-pre">By signing this Cover Page, each party agrees to enter into this ${esc(docConfig.name)} as of the Effective Date.</p>

<table class="sig">
  <thead>
    <tr>
      <th class="rh" style="width:90pt"></th>
      <th>${esc(p1.company) || esc(docConfig.party1Label)}</th>
      <th>${esc(p2.company) || esc(docConfig.party2Label)}</th>
    </tr>
  </thead>
  <tbody>
    <tr><td class="rh">Company</td>${sigCell(p1.company)}${sigCell(p2.company)}</tr>
    <tr><td class="rh">Signature</td>${sigCell("")}${sigCell("")}</tr>
    <tr><td class="rh">Print Name</td>${sigCell(p1.signatoryName)}${sigCell(p2.signatoryName)}</tr>
    <tr><td class="rh">Title</td>${sigCell(p1.title)}${sigCell(p2.title)}</tr>
    <tr><td class="rh">Notice Address</td>${sigCell(p1.noticeAddress)}${sigCell(p2.noticeAddress)}</tr>
    <tr><td class="rh">Date</td>${sigCell("")}${sigCell("")}</tr>
  </tbody>
</table>

<p class="license">Common Paper ${esc(docConfig.name)} &mdash; Standard Terms incorporated by reference &mdash; CC BY 4.0</p>
<p class="std-note">The standard terms for this agreement are published by Common Paper and incorporated into this document by reference.</p>

<script>(function(){function doPrint(){window.focus();window.print();}if(document.fonts&&document.fonts.ready){document.fonts.ready.then(function(){setTimeout(doPrint,250);});}else{setTimeout(doPrint,900);}})()</script>
</body>
</html>`;
}

export function printGenericDocument(
  data: GenericDocFormData,
  docConfig: DocConfig
): void {
  openPrintWindow(generateGenericPrintHTML(data, docConfig));
}
