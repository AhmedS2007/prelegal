import { render, screen } from "@testing-library/react";
import DocumentPreview from "@/components/DocumentPreview";
import { defaultGenericFormData, GenericDocFormData } from "@/lib/types";
import { DocConfig } from "@/lib/docConfig";

jest.mock("next/font/google", () => ({
  Playfair_Display: () => ({ variable: "--font-playfair", className: "" }),
  DM_Sans: () => ({ variable: "--font-dm-sans", className: "" }),
}));

const csaConfig: DocConfig = {
  id: "csa",
  name: "Cloud Service Agreement",
  description: "Standard CSA",
  filename: "CSA.md",
  party1Label: "Provider",
  party2Label: "Customer",
  isNDA: false,
};

const filledData: GenericDocFormData = {
  party1: {
    company: "Acme Corp",
    signatoryName: "Jane Smith",
    title: "CEO",
    noticeAddress: "jane@acme.com",
  },
  party2: {
    company: "Beta Inc",
    signatoryName: "Bob Jones",
    title: "CTO",
    noticeAddress: "bob@beta.com",
  },
  effectiveDate: "2026-01-01",
  term: "1 year",
  governingLawState: "Delaware",
  jurisdictionDescription: "courts in Wilmington, DE",
  specialTerms: "Monthly billing at $500/mo",
};

describe("DocumentPreview rendering", () => {
  it("renders the document title", () => {
    render(<DocumentPreview data={defaultGenericFormData} docConfig={csaConfig} />);
    expect(screen.getByRole("heading", { name: /cloud service agreement/i })).toBeInTheDocument();
  });

  it("renders the party labels in the cover page", () => {
    render(<DocumentPreview data={defaultGenericFormData} docConfig={csaConfig} />);
    expect(screen.getAllByText("Provider").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Customer").length).toBeGreaterThan(0);
  });

  it("renders empty placeholders when data is default", () => {
    render(<DocumentPreview data={defaultGenericFormData} docConfig={csaConfig} />);
    expect(screen.getAllByText("Not specified").length).toBeGreaterThan(0);
  });
});

describe("DocumentPreview with filled data", () => {
  it("renders party1 company name", () => {
    render(<DocumentPreview data={filledData} docConfig={csaConfig} />);
    expect(screen.getAllByText("Acme Corp").length).toBeGreaterThan(0);
  });

  it("renders party2 company name", () => {
    render(<DocumentPreview data={filledData} docConfig={csaConfig} />);
    expect(screen.getAllByText("Beta Inc").length).toBeGreaterThan(0);
  });

  it("renders the effective date as formatted text", () => {
    render(<DocumentPreview data={filledData} docConfig={csaConfig} />);
    expect(screen.getByText("January 1, 2026")).toBeInTheDocument();
  });

  it("renders the term value", () => {
    render(<DocumentPreview data={filledData} docConfig={csaConfig} />);
    expect(screen.getByText("1 year")).toBeInTheDocument();
  });

  it("renders governing law state", () => {
    render(<DocumentPreview data={filledData} docConfig={csaConfig} />);
    expect(screen.getByText("Delaware")).toBeInTheDocument();
  });

  it("renders special terms when provided", () => {
    render(<DocumentPreview data={filledData} docConfig={csaConfig} />);
    expect(screen.getByText("Monthly billing at $500/mo")).toBeInTheDocument();
  });

  it("renders signature table with correct column headers", () => {
    render(<DocumentPreview data={filledData} docConfig={csaConfig} />);
    const acmeCells = screen.getAllByText("Acme Corp");
    expect(acmeCells.length).toBeGreaterThanOrEqual(2); // cover page + signature table
  });
});
