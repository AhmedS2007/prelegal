import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Home from "@/app/page";
import { downloadMarkdown, printDocument } from "@/lib/generateDocument";

// Mock the side-effecting exports so tests don't open windows or create blobs
jest.mock("@/lib/generateDocument", () => ({
  ...jest.requireActual("@/lib/generateDocument"),
  downloadMarkdown: jest.fn(),
  printDocument: jest.fn(),
}));

// next/font/google is only used in layout.tsx, not in page.tsx or its imports,
// but mock it defensively in case the resolver traverses it.
jest.mock("next/font/google", () => ({
  Playfair_Display: () => ({ variable: "--font-playfair", className: "" }),
  DM_Sans: () => ({ variable: "--font-dm-sans", className: "" }),
}));

beforeEach(() => {
  jest.clearAllMocks();
});

/* ── Layout ─────────────────────────────────────── */

describe("Home page layout", () => {
  it("renders the Prelegal brand name", () => {
    render(<Home />);
    expect(screen.getByText("Prelegal")).toBeInTheDocument();
  });

  it("renders the Mutual NDA Creator subtitle", () => {
    render(<Home />);
    expect(screen.getByText("Mutual NDA Creator")).toBeInTheDocument();
  });

  it("renders the Export .md button", () => {
    render(<Home />);
    expect(
      screen.getByRole("button", { name: /export .md/i })
    ).toBeInTheDocument();
  });

  it("renders the Save PDF button", () => {
    render(<Home />);
    expect(
      screen.getByRole("button", { name: /save pdf/i })
    ).toBeInTheDocument();
  });

  it("renders the form panel (Purpose section visible)", () => {
    render(<Home />);
    // "Purpose" appears in both the form heading and the preview cover page
    expect(screen.getAllByText("Purpose").length).toBeGreaterThan(0);
  });

  it("renders the document preview panel (NDA title visible)", () => {
    render(<Home />);
    expect(
      screen.getByRole("heading", { name: "Mutual Non-Disclosure Agreement" })
    ).toBeInTheDocument();
  });
});

/* ── Form ↔ Preview live update ─────────────────── */

describe("Live preview updates", () => {
  it("updates the preview when governing law state changes", () => {
    render(<Home />);
    const stateInput = screen.getByPlaceholderText("Delaware");
    fireEvent.change(stateInput, { target: { value: "Texas" } });
    // Texas should now appear in the document preview (cover page + clause 9)
    expect(screen.getAllByText(/Texas/).length).toBeGreaterThan(0);
  });

  it("updates the preview when jurisdiction changes", () => {
    render(<Home />);
    const jurisdictionInput = screen.getByPlaceholderText(
      "courts located in New Castle, DE"
    );
    fireEvent.change(jurisdictionInput, {
      target: { value: "courts in Austin, TX" },
    });
    expect(screen.getAllByText(/Austin/).length).toBeGreaterThan(0);
  });

  it("updates the preview when Party 1 company name changes", () => {
    render(<Home />);
    const companyInputs = screen.getAllByPlaceholderText("Acme Corp.");
    fireEvent.change(companyInputs[0], { target: { value: "MyCompany" } });
    expect(screen.getAllByText(/MyCompany/).length).toBeGreaterThan(0);
  });
});

/* ── Header action buttons ──────────────────────── */

describe("Header action buttons", () => {
  it("calls downloadMarkdown with current formData when Export .md is clicked", async () => {
    const user = userEvent.setup();
    render(<Home />);
    await user.click(screen.getByRole("button", { name: /export .md/i }));
    expect(downloadMarkdown).toHaveBeenCalledTimes(1);
  });

  it("calls printDocument with current formData when Save PDF is clicked", async () => {
    const user = userEvent.setup();
    render(<Home />);
    await user.click(screen.getByRole("button", { name: /save pdf/i }));
    expect(printDocument).toHaveBeenCalledTimes(1);
  });

  it("passes the current formData to downloadMarkdown", async () => {
    const user = userEvent.setup();
    render(<Home />);
    // Change a field first
    fireEvent.change(screen.getByPlaceholderText("Delaware"), {
      target: { value: "Nevada" },
    });
    await user.click(screen.getByRole("button", { name: /export .md/i }));
    expect(downloadMarkdown).toHaveBeenCalledWith(
      expect.objectContaining({ governingLawState: "Nevada" })
    );
  });
});
