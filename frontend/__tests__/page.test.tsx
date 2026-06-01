import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Home from "@/app/page";
import { downloadMarkdown, printDocument } from "@/lib/generateDocument";

jest.mock("@/lib/generateDocument", () => ({
  ...jest.requireActual("@/lib/generateDocument"),
  downloadMarkdown: jest.fn(),
  printDocument: jest.fn(),
}));

jest.mock("next/font/google", () => ({
  Playfair_Display: () => ({ variable: "--font-playfair", className: "" }),
  DM_Sans: () => ({ variable: "--font-dm-sans", className: "" }),
}));

jest.mock("@/components/NDAChat", () => ({
  __esModule: true,
  default: ({ formData, onChange }: { formData: unknown; onChange: unknown }) => (
    <div data-testid="nda-chat">
      <p>AI Assistant</p>
      <textarea placeholder="Type your message…" />
    </div>
  ),
}));

const mockReplace = jest.fn();
const mockPush = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({ replace: mockReplace, push: mockPush }),
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

/* ── Layout ─────────────────────────────────────── */

describe("Home page layout", () => {
  beforeEach(() => {
    localStorage.setItem("auth_token", "test-token");
  });

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

  it("renders the chat panel", () => {
    render(<Home />);
    expect(screen.getByTestId("nda-chat")).toBeInTheDocument();
  });

  it("renders the document preview panel (NDA title visible)", () => {
    render(<Home />);
    expect(
      screen.getByRole("heading", { name: "Mutual Non-Disclosure Agreement" })
    ).toBeInTheDocument();
  });
});

/* ── Header action buttons ──────────────────────── */

describe("Header action buttons", () => {
  beforeEach(() => {
    localStorage.setItem("auth_token", "test-token");
  });

  it("calls downloadMarkdown when Export .md is clicked", async () => {
    const user = userEvent.setup();
    render(<Home />);
    await user.click(screen.getByRole("button", { name: /export .md/i }));
    expect(downloadMarkdown).toHaveBeenCalledTimes(1);
  });

  it("calls printDocument when Save PDF is clicked", async () => {
    const user = userEvent.setup();
    render(<Home />);
    await user.click(screen.getByRole("button", { name: /save pdf/i }));
    expect(printDocument).toHaveBeenCalledTimes(1);
  });
});
