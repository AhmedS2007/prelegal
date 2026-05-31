import {
  formatDate,
  mndaTermDescription,
  confidentialityTermDescription,
  generateMarkdown,
  generatePrintHTML,
  downloadMarkdown,
  printDocument,
} from "@/lib/generateDocument";
import { defaultFormData, NDAFormData } from "@/lib/types";

const fullData: NDAFormData = {
  purpose: "Evaluating a potential partnership",
  effectiveDate: "2024-03-15",
  mndaTermType: "expires",
  mndaTermYears: 2,
  confidentialityTermType: "years",
  confidentialityTermYears: 3,
  governingLawState: "Delaware",
  jurisdictionDescription: "courts located in Wilmington, DE",
  modifications: "Section 2 is modified as follows: none.",
  party1: {
    company: "Acme Inc.",
    signatoryName: "Jane Smith",
    title: "CEO",
    noticeAddress: "jane@acme.com",
  },
  party2: {
    company: "Beta Corp.",
    signatoryName: "John Doe",
    title: "CFO",
    noticeAddress: "john@beta.com",
  },
};

/* ── formatDate ─────────────────────────────────── */

describe("formatDate", () => {
  it("returns [Date] for empty string", () => {
    expect(formatDate("")).toBe("[Date]");
  });

  it("formats a valid ISO date as human-readable", () => {
    expect(formatDate("2024-01-15")).toBe("January 15, 2024");
  });

  it("handles end-of-year date correctly", () => {
    expect(formatDate("2024-12-31")).toBe("December 31, 2024");
  });

  it("handles single-digit month and day", () => {
    expect(formatDate("2025-01-01")).toBe("January 1, 2025");
  });
});

/* ── mndaTermDescription ─────────────────────────── */

describe("mndaTermDescription", () => {
  it("returns singular year when mndaTermYears is 1", () => {
    const desc = mndaTermDescription({
      ...defaultFormData,
      mndaTermType: "expires",
      mndaTermYears: 1,
    });
    expect(desc).toBe("1 year from Effective Date");
  });

  it("returns plural years when mndaTermYears is greater than 1", () => {
    const desc = mndaTermDescription({
      ...defaultFormData,
      mndaTermType: "expires",
      mndaTermYears: 3,
    });
    expect(desc).toBe("3 years from Effective Date");
  });

  it("returns until-terminated description when type is until_terminated", () => {
    const desc = mndaTermDescription({
      ...defaultFormData,
      mndaTermType: "until_terminated",
    });
    expect(desc).toContain("terminated");
  });
});

/* ── confidentialityTermDescription ─────────────── */

describe("confidentialityTermDescription", () => {
  it("returns singular year when confidentialityTermYears is 1", () => {
    const desc = confidentialityTermDescription({
      ...defaultFormData,
      confidentialityTermType: "years",
      confidentialityTermYears: 1,
    });
    expect(desc).toContain("1 year from Effective Date");
  });

  it("returns plural years when confidentialityTermYears is greater than 1", () => {
    const desc = confidentialityTermDescription({
      ...defaultFormData,
      confidentialityTermType: "years",
      confidentialityTermYears: 5,
    });
    expect(desc).toContain("5 years from Effective Date");
  });

  it("mentions trade secrets for years type", () => {
    const desc = confidentialityTermDescription({
      ...defaultFormData,
      confidentialityTermType: "years",
      confidentialityTermYears: 2,
    });
    expect(desc).toContain("trade secrets");
  });

  it("returns 'in perpetuity' for perpetuity type", () => {
    const desc = confidentialityTermDescription({
      ...defaultFormData,
      confidentialityTermType: "perpetuity",
    });
    expect(desc).toBe("in perpetuity");
  });
});

/* ── generateMarkdown ────────────────────────────── */

describe("generateMarkdown", () => {
  it("returns a non-empty string", () => {
    expect(generateMarkdown(fullData).length).toBeGreaterThan(0);
  });

  it("includes the purpose text", () => {
    const md = generateMarkdown(fullData);
    expect(md).toContain(fullData.purpose);
  });

  it("includes party 1 company name", () => {
    const md = generateMarkdown(fullData);
    expect(md).toContain("Acme Inc.");
  });

  it("includes party 2 company name", () => {
    const md = generateMarkdown(fullData);
    expect(md).toContain("Beta Corp.");
  });

  it("includes the governing law state", () => {
    const md = generateMarkdown(fullData);
    expect(md).toContain("Delaware");
  });

  it("includes the jurisdiction description", () => {
    const md = generateMarkdown(fullData);
    expect(md).toContain("courts located in Wilmington, DE");
  });

  it("marks expires checkbox when mndaTermType is expires", () => {
    const md = generateMarkdown({ ...fullData, mndaTermType: "expires" });
    expect(md).toContain("[x] Expires");
  });

  it("marks until-terminated checkbox when mndaTermType is until_terminated", () => {
    const md = generateMarkdown({
      ...fullData,
      mndaTermType: "until_terminated",
    });
    expect(md).toContain("[x] Continues until terminated");
  });

  it("marks perpetuity checkbox when confidentialityTermType is perpetuity", () => {
    const md = generateMarkdown({
      ...fullData,
      confidentialityTermType: "perpetuity",
    });
    expect(md).toContain("[x] In perpetuity");
  });

  it("includes the modifications text", () => {
    const md = generateMarkdown(fullData);
    expect(md).toContain(fullData.modifications);
  });
});

/* ── generatePrintHTML ───────────────────────────── */

describe("generatePrintHTML", () => {
  it("returns a valid HTML document string", () => {
    const html = generatePrintHTML(fullData);
    expect(html).toContain("<!DOCTYPE html>");
    expect(html).toContain("</html>");
  });

  it("includes the document title in HTML", () => {
    const html = generatePrintHTML(fullData);
    expect(html).toContain("Mutual Non-Disclosure Agreement");
  });

  it("includes the purpose value", () => {
    const html = generatePrintHTML(fullData);
    expect(html).toContain("Evaluating a potential partnership");
  });

  it("includes governing law state", () => {
    const html = generatePrintHTML(fullData);
    expect(html).toContain("Delaware");
  });

  it("includes party 1 company name", () => {
    const html = generatePrintHTML(fullData);
    expect(html).toContain("Acme Inc.");
  });

  it("includes party 2 signatory name", () => {
    const html = generatePrintHTML(fullData);
    expect(html).toContain("John Doe");
  });

  it("escapes HTML special characters in user input", () => {
    const html = generatePrintHTML({
      ...fullData,
      purpose: '<script>alert("xss")</script>',
    });
    expect(html).not.toContain("<script>");
    expect(html).toContain("&lt;script&gt;");
  });

  it("escapes ampersands in user input", () => {
    const html = generatePrintHTML({
      ...fullData,
      governingLawState: "A & B State",
    });
    expect(html).toContain("A &amp; B State");
  });

  it("includes @page rule for print margins", () => {
    const html = generatePrintHTML(fullData);
    expect(html).toContain("@page");
  });

  it("links to Google Fonts", () => {
    const html = generatePrintHTML(fullData);
    expect(html).toContain("fonts.googleapis.com");
  });

  it("shows checked symbol for expires when mndaTermType is expires", () => {
    const html = generatePrintHTML({ ...fullData, mndaTermType: "expires" });
    // HTML encodes ✓ as &#10003;
    expect(html).toMatch(/&#10003;[\s\S]*?from Effective Date/);
  });

  it("shows checked symbol for perpetuity when selected", () => {
    const html = generatePrintHTML({
      ...fullData,
      confidentialityTermType: "perpetuity",
    });
    expect(html).toMatch(/&#10003;[\s\S]*?In perpetuity/);
  });
});

/* ── downloadMarkdown ────────────────────────────── */

describe("downloadMarkdown", () => {
  let mockAnchor: { href: string; download: string; click: jest.Mock };

  beforeEach(() => {
    mockAnchor = { href: "", download: "", click: jest.fn() };
    jest.spyOn(document, "createElement").mockImplementation((tag: string) => {
      if (tag === "a") return mockAnchor as unknown as HTMLElement;
      return document.createElement.call(document, tag);
    });
    jest.spyOn(URL, "createObjectURL").mockReturnValue("blob:mock-url");
    jest.spyOn(URL, "revokeObjectURL").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("calls URL.createObjectURL with a Blob", () => {
    downloadMarkdown(fullData);
    expect(URL.createObjectURL).toHaveBeenCalledWith(expect.any(Blob));
  });

  it("triggers a click on the anchor element", () => {
    downloadMarkdown(fullData);
    expect(mockAnchor.click).toHaveBeenCalledTimes(1);
  });

  it("revokes the object URL after download", () => {
    downloadMarkdown(fullData);
    expect(URL.revokeObjectURL).toHaveBeenCalledWith("blob:mock-url");
  });

  it("sets the download filename using party company names", () => {
    downloadMarkdown(fullData);
    expect(mockAnchor.download).toContain("Acme");
    expect(mockAnchor.download).toContain("Beta");
  });

  it("falls back to Party1/Party2 in filename when company names are empty", () => {
    downloadMarkdown(defaultFormData);
    expect(mockAnchor.download).toContain("Party1");
    expect(mockAnchor.download).toContain("Party2");
  });
});

/* ── printDocument ───────────────────────────────── */

describe("printDocument", () => {
  let mockPrintWindow: {
    document: { open: jest.Mock; write: jest.Mock; close: jest.Mock };
    focus: jest.Mock;
    print: jest.Mock;
    onload: (() => void) | null;
  };

  beforeEach(() => {
    mockPrintWindow = {
      document: {
        open: jest.fn(),
        write: jest.fn(),
        close: jest.fn(),
      },
      focus: jest.fn(),
      print: jest.fn(),
      onload: null,
    };
    jest
      .spyOn(window, "open")
      .mockReturnValue(mockPrintWindow as unknown as Window);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("opens a new browser window", () => {
    printDocument(fullData);
    expect(window.open).toHaveBeenCalledWith("", "_blank", expect.any(String));
  });

  it("writes the generated HTML to the new window's document", () => {
    printDocument(fullData);
    expect(mockPrintWindow.document.write).toHaveBeenCalledWith(
      expect.stringContaining("<!DOCTYPE html>")
    );
  });

  it("closes the document after writing", () => {
    printDocument(fullData);
    expect(mockPrintWindow.document.close).toHaveBeenCalled();
  });

  it("shows an alert when window.open returns null", () => {
    jest.spyOn(window, "open").mockReturnValue(null);
    const alertSpy = jest.spyOn(window, "alert").mockImplementation(() => {});
    printDocument(fullData);
    expect(alertSpy).toHaveBeenCalledWith(
      expect.stringContaining("pop-ups")
    );
  });
});
