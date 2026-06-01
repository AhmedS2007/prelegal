import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Home from "@/app/page";

jest.mock("@/lib/generateDocument", () => ({
  ...jest.requireActual("@/lib/generateDocument"),
  downloadMarkdown: jest.fn(),
  printDocument: jest.fn(),
  downloadGenericMarkdown: jest.fn(),
  printGenericDocument: jest.fn(),
}));

jest.mock("next/font/google", () => ({
  Playfair_Display: () => ({ variable: "--font-playfair", className: "" }),
  DM_Sans: () => ({ variable: "--font-dm-sans", className: "" }),
}));

jest.mock("@/components/NDAChat", () => ({
  __esModule: true,
  default: () => <div data-testid="nda-chat"><p>NDA AI Assistant</p></div>,
}));

jest.mock("@/components/NDAPreview", () => ({
  __esModule: true,
  default: () => <div data-testid="nda-preview"><h1>Mutual Non-Disclosure Agreement</h1></div>,
}));

jest.mock("@/components/DocumentChat", () => ({
  __esModule: true,
  default: ({ docConfig }: { docConfig: { name: string } }) => (
    <div data-testid="doc-chat">{docConfig.name} AI Assistant</div>
  ),
}));

jest.mock("@/components/DocumentPreview", () => ({
  __esModule: true,
  default: ({ docConfig }: { docConfig: { name: string } }) => (
    <div data-testid="doc-preview"><h1>{docConfig.name}</h1></div>
  ),
}));

jest.mock("@/components/DocumentSelector", () => ({
  __esModule: true,
  default: ({ onSelect }: { onSelect: (doc: { id: string; name: string; isNDA: boolean; party1Label: string; party2Label: string }) => void }) => (
    <div data-testid="document-selector">
      <button onClick={() => onSelect({ id: "mnda", name: "Mutual Non-Disclosure Agreement", isNDA: true, party1Label: "Party 1", party2Label: "Party 2" })}>
        Select NDA
      </button>
      <button onClick={() => onSelect({ id: "csa", name: "Cloud Service Agreement", isNDA: false, party1Label: "Provider", party2Label: "Customer" })}>
        Select CSA
      </button>
    </div>
  ),
}));

const mockReplace = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({ replace: mockReplace, push: jest.fn() }),
}));

beforeEach(() => {
  jest.clearAllMocks();
  localStorage.clear();
});

/* ── Auth gate ───────────────────────────────────── */

describe("Auth gate", () => {
  it("redirects to /login when no auth token", () => {
    render(<Home />);
    expect(mockReplace).toHaveBeenCalledWith("/login");
  });

  it("renders the app when auth token is present", () => {
    localStorage.setItem("auth_token", "test-token");
    render(<Home />);
    expect(mockReplace).not.toHaveBeenCalled();
    expect(screen.getByText("Prelegal")).toBeInTheDocument();
  });
});

/* ── Document selector ───────────────────────────── */

describe("Document selector", () => {
  beforeEach(() => {
    localStorage.setItem("auth_token", "test-token");
  });

  it("shows document selector when no document is selected", () => {
    render(<Home />);
    expect(screen.getByTestId("document-selector")).toBeInTheDocument();
  });

  it("shows 'Legal Document Creator' subtitle before selection", () => {
    render(<Home />);
    expect(screen.getByText("Legal Document Creator")).toBeInTheDocument();
  });

  it("does not show chat or preview before selection", () => {
    render(<Home />);
    expect(screen.queryByTestId("nda-chat")).not.toBeInTheDocument();
    expect(screen.queryByTestId("nda-preview")).not.toBeInTheDocument();
  });
});

/* ── NDA workspace ───────────────────────────────── */

describe("NDA workspace", () => {
  beforeEach(() => {
    localStorage.setItem("auth_token", "test-token");
  });

  it("shows NDA chat and preview after selecting NDA", async () => {
    const user = userEvent.setup();
    render(<Home />);
    await user.click(screen.getByRole("button", { name: /select nda/i }));
    expect(screen.getByTestId("nda-chat")).toBeInTheDocument();
    expect(screen.getByTestId("nda-preview")).toBeInTheDocument();
  });

  it("shows NDA name in header after selecting NDA", async () => {
    const user = userEvent.setup();
    render(<Home />);
    await user.click(screen.getByRole("button", { name: /select nda/i }));
    expect(screen.getAllByText("Mutual Non-Disclosure Agreement").length).toBeGreaterThan(0);
  });

  it("shows Export .md and Save PDF buttons after selecting NDA", async () => {
    const user = userEvent.setup();
    render(<Home />);
    await user.click(screen.getByRole("button", { name: /select nda/i }));
    expect(screen.getByRole("button", { name: /export .md/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /save pdf/i })).toBeInTheDocument();
  });

  it("returns to selector when 'Change document' is clicked", async () => {
    const user = userEvent.setup();
    render(<Home />);
    await user.click(screen.getByRole("button", { name: /select nda/i }));
    await user.click(screen.getByRole("button", { name: /change document/i }));
    expect(screen.getByTestId("document-selector")).toBeInTheDocument();
  });
});

/* ── Generic document workspace ──────────────────── */

describe("Generic document workspace", () => {
  beforeEach(() => {
    localStorage.setItem("auth_token", "test-token");
  });

  it("shows generic chat and preview after selecting a non-NDA doc", async () => {
    const user = userEvent.setup();
    render(<Home />);
    await user.click(screen.getByRole("button", { name: /select csa/i }));
    expect(screen.getByTestId("doc-chat")).toBeInTheDocument();
    expect(screen.getByTestId("doc-preview")).toBeInTheDocument();
  });

  it("does not show NDA-specific components for non-NDA doc", async () => {
    const user = userEvent.setup();
    render(<Home />);
    await user.click(screen.getByRole("button", { name: /select csa/i }));
    expect(screen.queryByTestId("nda-chat")).not.toBeInTheDocument();
    expect(screen.queryByTestId("nda-preview")).not.toBeInTheDocument();
  });

  it("shows Export .md and Save PDF buttons for generic docs", async () => {
    const user = userEvent.setup();
    render(<Home />);
    await user.click(screen.getByRole("button", { name: /select csa/i }));
    expect(screen.getByRole("button", { name: /export .md/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /save pdf/i })).toBeInTheDocument();
  });
});
