import { render, screen, fireEvent } from "@testing-library/react";
import DocumentSelector from "@/components/DocumentSelector";
import { DOC_CONFIGS, DocConfig } from "@/lib/docConfig";

describe("DocumentSelector rendering", () => {
  it("renders all document cards", () => {
    render(<DocumentSelector onSelect={jest.fn()} />);
    for (const doc of DOC_CONFIGS) {
      expect(screen.getAllByText(doc.name).length).toBeGreaterThan(0);
    }
  });

  it("renders the heading", () => {
    render(<DocumentSelector onSelect={jest.fn()} />);
    expect(screen.getByText(/choose a document type/i)).toBeInTheDocument();
  });

  it("renders party labels on each card", () => {
    render(<DocumentSelector onSelect={jest.fn()} />);
    // Provider appears on most cards
    expect(screen.getAllByText("Provider").length).toBeGreaterThan(0);
  });
});

describe("DocumentSelector selection", () => {
  it("calls onSelect with the clicked document config", () => {
    const onSelect = jest.fn();
    render(<DocumentSelector onSelect={onSelect} />);
    // Click the first card (Mutual Non-Disclosure Agreement)
    fireEvent.click(screen.getAllByText("Mutual Non-Disclosure Agreement")[0]);
    expect(onSelect).toHaveBeenCalledTimes(1);
    const called = onSelect.mock.calls[0][0] as DocConfig;
    expect(called.id).toBe("mnda");
    expect(called.isNDA).toBe(true);
  });

  it("calls onSelect with a non-NDA doc config when non-NDA card is clicked", () => {
    const onSelect = jest.fn();
    render(<DocumentSelector onSelect={onSelect} />);
    fireEvent.click(screen.getAllByText("Cloud Service Agreement")[0]);
    expect(onSelect).toHaveBeenCalledTimes(1);
    const called = onSelect.mock.calls[0][0] as DocConfig;
    expect(called.id).toBe("csa");
    expect(called.isNDA).toBe(false);
  });
});
