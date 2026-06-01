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

jest.mock("@/lib/authApi", () => ({
  getToken: jest.fn(() => null),
  clearToken: jest.fn(),
}));

jest.mock("@/lib/documentsApi", () => ({
  listDrafts: jest.fn().mockResolvedValue([]),
  getDraft: jest.fn(),
  saveDraft: jest.fn(),
  updateDraft: jest.fn(),
}));

import * as authApi from "@/lib/authApi";
const mockGetToken = authApi.getToken as jest.MockedFunction<typeof authApi.getToken>;

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
  default: ({ onSelect, onRestore }: {
    onSelect: (doc: { id: string; name: string; isNDA: boolean; party1Label: string; party2Label: string; description: string; filename: string }) => void;
    onRestore: (id: number) => void;
  }) => (
    <div data-testid="document-selector">
      <button onClick={() => onSelect({ id: "mnda", name: "Mutual Non-Disclosure Agreement", isNDA: true, party1Label: "Party 1", party2Label: "Party 2", description: "", filename: "" })}>
        Select NDA
      </button>
      <button onClick={() => onSelect({ id: "csa", name: "Cloud Service Agreement", isNDA: false, party1Label: "Provider", party2Label: "Customer", description: "", filename: "" })}>
        Select CSA
      </button>
      <button onClick={() => onRestore(1)}>
        Restore Draft
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
  mockGetToken.mockReturnValue(null);
});

/* ── Auth gate ───────────────────────────────────── */

describe("Auth gate", () => {
  it("redirects to /login when no auth token", () => {
    render(<Home />);
    expect(mockReplace).toHaveBeenCalledWith("/login");
  });

  it("renders the app when auth token is present", () => {
    mockGetToken.mockReturnValue("test-token");
    render(<Home />);
    expect(mockReplace).not.toHaveBeenCalled();
    expect(screen.getByText("Prelegal")).toBeInTheDocument();
  });
});

/* ── Document selector ───────────────────────────── */

describe("Document selector", () => {
  beforeEach(() => {
    mockGetToken.mockReturnValue("test-token");
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

  it("shows sign out button when on the selector screen", () => {
    render(<Home />);
    expect(screen.getByRole("button", { name: /sign out/i })).toBeInTheDocument();
  });
});

/* ── NDA workspace ───────────────────────────────── */

describe("NDA workspace", () => {
  beforeEach(() => {
    mockGetToken.mockReturnValue("test-token");
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

  it("shows Save Draft button when a document is selected", async () => {
    const user = userEvent.setup();
    render(<Home />);
    await user.click(screen.getByRole("button", { name: /select nda/i }));
    expect(screen.getByRole("button", { name: /save draft/i })).toBeInTheDocument();
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
    mockGetToken.mockReturnValue("test-token");
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

/* ── Save draft ──────────────────────────────────── */

describe("Save draft", () => {
  beforeEach(() => {
    mockGetToken.mockReturnValue("test-token");
  });

  it("shows 'Saved ✓' briefly after successful save", async () => {
    const { saveDraft: mockSave } = await import("@/lib/documentsApi");
    (mockSave as jest.Mock).mockResolvedValue({ id: 99, document_type: "mnda", doc_name: "Test", updated_at: new Date().toISOString() });
    const user = userEvent.setup();
    render(<Home />);
    await user.click(screen.getByRole("button", { name: /select nda/i }));
    await user.click(screen.getByRole("button", { name: /save draft/i }));
    await waitFor(() => {
      expect(screen.getByRole("button", { name: /saved/i })).toBeInTheDocument();
    });
  });
});
