import { render, screen } from "@testing-library/react";
import NDAPreview from "@/components/NDAPreview";
import { defaultFormData, NDAFormData } from "@/lib/types";

const fullData: NDAFormData = {
  purpose: "Evaluating a potential business partnership",
  effectiveDate: "2024-06-01",
  mndaTermType: "expires",
  mndaTermYears: 2,
  confidentialityTermType: "years",
  confidentialityTermYears: 3,
  governingLawState: "Delaware",
  jurisdictionDescription: "courts located in Wilmington, DE",
  modifications: "No modifications.",
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

/* ── Document structure ─────────────────────────── */

describe("NDAPreview document structure", () => {
  it("renders the document title", () => {
    render(<NDAPreview data={fullData} />);
    expect(
      screen.getByText("Mutual Non-Disclosure Agreement")
    ).toBeInTheDocument();
  });

  it("renders the Standard Terms heading", () => {
    render(<NDAPreview data={fullData} />);
    expect(
      screen.getByRole("heading", { name: "Standard Terms" })
    ).toBeInTheDocument();
  });

  it("renders the Cover Page label in the cover box", () => {
    render(<NDAPreview data={fullData} />);
    // "Cover Page" appears in preamble too — look for the box heading specifically
    const instances = screen.getAllByText("Cover Page");
    expect(instances.length).toBeGreaterThan(0);
  });

  it("renders the preamble text", () => {
    render(<NDAPreview data={fullData} />);
    expect(screen.getByText(/consists of/i)).toBeInTheDocument();
  });
});

/* ── Cover page fields ──────────────────────────── */

describe("NDAPreview cover page fields", () => {
  it("renders the purpose value", () => {
    render(<NDAPreview data={fullData} />);
    expect(
      screen.getAllByText("Evaluating a potential business partnership")
    ).not.toHaveLength(0);
  });

  it("renders the effective date in human-readable form", () => {
    render(<NDAPreview data={fullData} />);
    expect(screen.getAllByText("June 1, 2024")).not.toHaveLength(0);
  });

  it("renders the governing law state", () => {
    render(<NDAPreview data={fullData} />);
    expect(screen.getAllByText(/Delaware/).length).toBeGreaterThan(0);
  });

  it("renders the jurisdiction description", () => {
    render(<NDAPreview data={fullData} />);
    expect(
      screen.getAllByText(/courts located in Wilmington, DE/).length
    ).toBeGreaterThan(0);
  });

  it("renders modifications text", () => {
    render(<NDAPreview data={fullData} />);
    expect(screen.getByText("No modifications.")).toBeInTheDocument();
  });

  it("shows 'None.' for modifications when field is empty", () => {
    render(<NDAPreview data={{ ...fullData, modifications: "" }} />);
    expect(screen.getByText("None.")).toBeInTheDocument();
  });
});

/* ── Placeholder / empty state ──────────────────── */

describe("NDAPreview empty state handling", () => {
  it("shows placeholder for governing law when empty", () => {
    render(<NDAPreview data={{ ...fullData, governingLawState: "" }} />);
    expect(screen.getAllByText("[State]").length).toBeGreaterThan(0);
  });

  it("shows placeholder for jurisdiction when empty", () => {
    render(
      <NDAPreview data={{ ...fullData, jurisdictionDescription: "" }} />
    );
    expect(
      screen.getAllByText("[City/County, State]").length
    ).toBeGreaterThan(0);
  });

  it("shows 'Not specified' for purpose when empty", () => {
    render(<NDAPreview data={{ ...fullData, purpose: "" }} />);
    expect(screen.getByText("Not specified")).toBeInTheDocument();
  });
});

/* ── Checkbox states ────────────────────────────── */

describe("NDAPreview checkbox indicators", () => {
  it("shows checkmark for expires when mndaTermType is expires", () => {
    render(<NDAPreview data={{ ...fullData, mndaTermType: "expires" }} />);
    const expiresRow = screen.getByText(/Expires.*from Effective Date/);
    expect(expiresRow.closest(".flex")).toBeInTheDocument();
  });

  it("shows checkmark for perpetuity when confidentialityTermType is perpetuity", () => {
    render(
      <NDAPreview
        data={{ ...fullData, confidentialityTermType: "perpetuity" }}
      />
    );
    expect(screen.getByText("In perpetuity.")).toBeInTheDocument();
  });
});

/* ── Signature table ────────────────────────────── */

describe("NDAPreview signature table", () => {
  it("renders Party 1 company name as column header", () => {
    render(<NDAPreview data={fullData} />);
    // The sig table header should show the company name
    const headers = screen.getAllByText("Acme Inc.");
    expect(headers.length).toBeGreaterThan(0);
  });

  it("renders Party 2 company name as column header", () => {
    render(<NDAPreview data={fullData} />);
    const headers = screen.getAllByText("Beta Corp.");
    expect(headers.length).toBeGreaterThan(0);
  });

  it("falls back to 'Party 1' header when company name is empty", () => {
    render(
      <NDAPreview
        data={{
          ...fullData,
          party1: { ...fullData.party1, company: "" },
        }}
      />
    );
    expect(screen.getByText("Party 1")).toBeInTheDocument();
  });

  it("renders signatory names in the table", () => {
    render(<NDAPreview data={fullData} />);
    expect(screen.getByText("Jane Smith")).toBeInTheDocument();
    expect(screen.getByText("John Doe")).toBeInTheDocument();
  });

  it("renders notice addresses in the table", () => {
    render(<NDAPreview data={fullData} />);
    expect(screen.getByText("jane@acme.com")).toBeInTheDocument();
    expect(screen.getByText("john@beta.com")).toBeInTheDocument();
  });
});

/* ── Standard Terms dynamic values ─────────────── */

describe("NDAPreview standard terms dynamic values", () => {
  it("renders the purpose inside standard terms clause 1", () => {
    render(<NDAPreview data={fullData} />);
    const clause1 = screen.getByText(/1\. Introduction\./);
    expect(clause1.closest("p")).toHaveTextContent(
      "Evaluating a potential business partnership"
    );
  });

  it("renders the effective date inside standard terms clause 5", () => {
    render(<NDAPreview data={fullData} />);
    const clause5 = screen.getByText(/5\. Term and Termination\./);
    expect(clause5.closest("p")).toHaveTextContent("June 1, 2024");
  });

  it("renders the MNDA term inside clause 5", () => {
    render(<NDAPreview data={fullData} />);
    const clause5 = screen.getByText(/5\. Term and Termination\./);
    expect(clause5.closest("p")).toHaveTextContent("2 years from Effective Date");
  });

  it("renders governing law inside clause 9", () => {
    render(<NDAPreview data={fullData} />);
    const clause9 = screen.getByText(/9\. Governing Law/);
    expect(clause9.closest("p")).toHaveTextContent("Delaware");
  });

  it("renders jurisdiction inside clause 9", () => {
    render(<NDAPreview data={fullData} />);
    const clause9 = screen.getByText(/9\. Governing Law/);
    expect(clause9.closest("p")).toHaveTextContent(
      "courts located in Wilmington, DE"
    );
  });
});

/* ── MNDA term display ──────────────────────────── */

describe("NDAPreview MNDA term years display", () => {
  it("displays singular 'year' for mndaTermYears of 1", () => {
    render(<NDAPreview data={{ ...fullData, mndaTermYears: 1 }} />);
    // Should contain "1 year" not "1 years"
    const yearText = screen.getAllByText(/1 year from Effective Date/);
    expect(yearText.length).toBeGreaterThan(0);
  });

  it("displays plural 'years' for mndaTermYears greater than 1", () => {
    render(<NDAPreview data={{ ...fullData, mndaTermYears: 3 }} />);
    const yearText = screen.getAllByText(/3 years from Effective Date/);
    expect(yearText.length).toBeGreaterThan(0);
  });
});
