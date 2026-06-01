import { render, screen, fireEvent } from "@testing-library/react";
import DocumentSelector from "@/components/DocumentSelector";
import { DOC_CONFIGS, DocConfig } from "@/lib/docConfig";

const defaultProps = {
  onSelect: jest.fn(),
  drafts: [],
  onRestore: jest.fn(),
};

describe("DocumentSelector rendering", () => {
  it("renders all document cards", () => {
    render(<DocumentSelector {...defaultProps} />);
    for (const doc of DOC_CONFIGS) {
      expect(screen.getAllByText(doc.name).length).toBeGreaterThan(0);
    }
  });

  it("renders the heading", () => {
    render(<DocumentSelector {...defaultProps} />);
    expect(screen.getByText(/choose a document type/i)).toBeInTheDocument();
  });

  it("renders party labels on each card", () => {
    render(<DocumentSelector {...defaultProps} />);
    // Provider appears on most cards
    expect(screen.getAllByText("Provider").length).toBeGreaterThan(0);
  });

  it("does not show saved drafts section when drafts array is empty", () => {
    render(<DocumentSelector {...defaultProps} drafts={[]} />);
    expect(screen.queryByText(/my saved drafts/i)).not.toBeInTheDocument();
  });

  it("shows saved drafts section when drafts are present", () => {
    const drafts = [
      { id: 1, document_type: "mnda", doc_name: "Acme — Mutual NDA", updated_at: new Date().toISOString() },
    ];
    render(<DocumentSelector {...defaultProps} drafts={drafts} />);
    expect(screen.getByText(/my saved drafts/i)).toBeInTheDocument();
    expect(screen.getByText("Acme — Mutual NDA")).toBeInTheDocument();
  });

  it("calls onRestore with the draft id when a draft card is clicked", () => {
    const onRestore = jest.fn();
    const drafts = [
      { id: 42, document_type: "csa", doc_name: "Acme — CSA", updated_at: new Date().toISOString() },
    ];
    render(<DocumentSelector {...defaultProps} drafts={drafts} onRestore={onRestore} />);
    fireEvent.click(screen.getByText("Acme — CSA"));
    expect(onRestore).toHaveBeenCalledWith(42);
  });
});

describe("DocumentSelector selection", () => {
  it("calls onSelect with the clicked document config", () => {
    const onSelect = jest.fn();
    render(<DocumentSelector {...defaultProps} onSelect={onSelect} />);
    // Click the first card (Mutual Non-Disclosure Agreement)
    fireEvent.click(screen.getAllByText("Mutual Non-Disclosure Agreement")[0]);
    expect(onSelect).toHaveBeenCalledTimes(1);
    const called = onSelect.mock.calls[0][0] as DocConfig;
    expect(called.id).toBe("mnda");
    expect(called.isNDA).toBe(true);
  });

  it("calls onSelect with a non-NDA doc config when non-NDA card is clicked", () => {
    const onSelect = jest.fn();
    render(<DocumentSelector {...defaultProps} onSelect={onSelect} />);
    fireEvent.click(screen.getAllByText("Cloud Service Agreement")[0]);
    expect(onSelect).toHaveBeenCalledTimes(1);
    const called = onSelect.mock.calls[0][0] as DocConfig;
    expect(called.id).toBe("csa");
    expect(called.isNDA).toBe(false);
  });
});
