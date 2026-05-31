# Manual Test Plan — Prelegal Mutual NDA Creator

Run `npm run dev` and open `http://localhost:3000` before starting.

---

## 1. Initial Page Load

| # | Action | Expected |
|---|--------|----------|
| 1.1 | Open the app | Dark header with amber "Prelegal" brand mark visible; form panel on left; NDA document preview on right |
| 1.2 | Check form panel | All sections visible: Purpose, Effective Date, MNDA Term, Term of Confidentiality, Governing Law & Jurisdiction, Parties, MNDA Modifications |
| 1.3 | Check preview panel | Document shows title "Mutual Non-Disclosure Agreement", preamble, Cover Page box, signature table, and Standard Terms (clauses 1–11) |
| 1.4 | Check default purpose | Purpose textarea pre-filled with "Evaluating whether to enter into a business relationship with the other party." |
| 1.5 | Check default date | Effective Date defaults to today's date |
| 1.6 | Check default MNDA term | "Expires after" radio selected, year input shows 1 |
| 1.7 | Check default confidentiality term | "Limited period" radio selected, year input shows 1 |

---

## 2. Live Preview Updates

| # | Action | Expected |
|---|--------|----------|
| 2.1 | Type in the Purpose textarea | Preview cover page "Purpose" field and clauses 1 and 2 in Standard Terms update immediately with the new text, highlighted in amber |
| 2.2 | Change Effective Date | Preview cover page "Effective Date" and clause 5 update immediately |
| 2.3 | Change Governing Law state | Preview "Governing Law" field and clause 9 update in both the cover page and standard terms |
| 2.4 | Change Jurisdiction | Preview "Jurisdiction" field and clause 9 update |
| 2.5 | Type Party 1 company name | Signature table column header updates to the company name |
| 2.6 | Type Party 1 signatory, title, notice address | Values appear in the signature table rows |
| 2.7 | Type Party 2 fields | Party 2 column in signature table updates independently of Party 1 |
| 2.8 | Type in Modifications | Modifications cover page field updates |

---

## 3. MNDA Term Controls

| # | Action | Expected |
|---|--------|----------|
| 3.1 | Select "Expires after" radio | Year number input appears below |
| 3.2 | Change year to 3 | Cover page MNDA Term shows "✓ Expires 3 years from Effective Date"; clause 5 shows "3 years from Effective Date" |
| 3.3 | Change year to 1 | Reverts to singular "1 year" |
| 3.4 | Select "Continues until terminated" | Year input disappears; cover page shows "✓ Continues until terminated"; clause 5 updated accordingly |

---

## 4. Term of Confidentiality Controls

| # | Action | Expected |
|---|--------|----------|
| 4.1 | Select "Limited period" | Year input appears; cover page shows years checkbox selected |
| 4.2 | Change year to 5 | Cover page and clause 5 show "5 years" |
| 4.3 | Select "In perpetuity" | Year input disappears; cover page shows "✓ In perpetuity"; clause 5 says "in perpetuity" |

---

## 5. Empty / Placeholder States

| # | Action | Expected |
|---|--------|----------|
| 5.1 | Leave Governing Law blank | Preview shows "[State]" in stone-300 (light grey) in cover page and clause 9 |
| 5.2 | Leave Jurisdiction blank | Preview shows "[City/County, State]" placeholder |
| 5.3 | Clear the Purpose textarea | Preview shows "Not specified" in cover page; clauses 1 and 2 show "[Purpose]" placeholder |
| 5.4 | Leave party fields blank | Signature table rows show ruled underlines instead of values; column headers show "Party 1" / "Party 2" fallback |

---

## 6. Parties Side-by-Side Layout

| # | Action | Expected |
|---|--------|----------|
| 6.1 | View the Parties section | Party 1 and Party 2 cards appear side by side in two columns |
| 6.2 | Fill in Party 1 fields | Only Party 1 column in the signature table updates |
| 6.3 | Fill in Party 2 fields | Only Party 2 column updates; Party 1 unchanged |

---

## 7. Export .md Download

| # | Action | Expected |
|---|--------|----------|
| 7.1 | Click "Export .md" with empty party names | File downloads as `Mutual-NDA-Party1-Party2.md` |
| 7.2 | Fill in company names, click "Export .md" | Filename uses company names with spaces replaced by dashes |
| 7.3 | Open the downloaded file | Contains: Cover Page with all filled values, all 11 Standard Terms clauses, governing law and jurisdiction substituted correctly |
| 7.4 | Export with special characters in party names (e.g. `A & B Ltd`) | Filename is sanitised; file content contains the raw text without HTML encoding |
| 7.5 | Check markdown checkbox format | Filled checkboxes show `[x]`, empty show `[ ]` |

---

## 8. PDF / Print

| # | Action | Expected |
|---|--------|----------|
| 8.1 | Click "Save PDF" | A new pop-up window opens with the formatted document; browser print dialog appears after ~0.8 s |
| 8.2 | Check the print preview | Document fits on standard letter paper with proper margins; no UI chrome (header, form) visible |
| 8.3 | Check dynamic values in print | Filled values appear as bold underlined text (amber underline colour) |
| 8.4 | Check empty values in print | Placeholder text (`[State]`, `[Jurisdiction]`) shown in light grey |
| 8.5 | Check signature table in print | Blank fields have a horizontal rule; company names appear as column headers |
| 8.6 | Save as PDF from print dialog | PDF file opens cleanly in a PDF viewer; pagination keeps Standard Terms readable |
| 8.7 | Block pop-ups and click "Save PDF" | Alert message prompts user to allow pop-ups for the site |

---

## 9. Reset to Defaults

| # | Action | Expected |
|---|--------|----------|
| 9.1 | Fill in several fields, then click "Reset to defaults" | All fields revert to their defaults; preview updates immediately |
| 9.2 | Check purpose after reset | Returns to the default purpose text |
| 9.3 | Check date after reset | Returns to today's date |

---

## 10. Edge Cases

| # | Action | Expected |
|---|--------|----------|
| 10.1 | Enter very long purpose text (500+ chars) | Textarea expands or scrolls; preview wraps text cleanly without overflow |
| 10.2 | Enter HTML-like text in a field (e.g. `<b>test</b>`) | Rendered as literal text, not parsed as HTML — no bold appears |
| 10.3 | Enter `"` and `&` in a field and export PDF | Print window shows escaped characters correctly; no broken HTML |
| 10.4 | Set MNDA term years to 10 (maximum) | Preview shows "10 years" correctly |
| 10.5 | Set MNDA term years to 1 (minimum) | Preview shows singular "1 year" (not "1 years") |
| 10.6 | Resize the browser window narrower | Form and preview panels remain usable; no text overflow or overlap |
| 10.7 | Enter a multi-line modification note | Whitespace preserved in preview (`whitespace-pre-wrap`); prints correctly |

---

## 11. Cross-Browser (manual spot check)

| Browser | Minimum checks |
|---------|----------------|
| Chrome | All sections above |
| Firefox | Live update, PDF print dialog |
| Safari | PDF print pop-up (pop-up blocker behaviour differs) |
| Edge | Export .md download |
