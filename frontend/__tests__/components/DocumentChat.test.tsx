import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import DocumentChat from "@/components/DocumentChat";
import { defaultGenericFormData } from "@/lib/types";
import * as chatApi from "@/lib/chatApi";
import { DocConfig } from "@/lib/docConfig";

jest.mock("@/lib/chatApi");
const mockSend = chatApi.sendChatMessage as jest.MockedFunction<
  typeof chatApi.sendChatMessage
>;

const csaConfig: DocConfig = {
  id: "csa",
  name: "Cloud Service Agreement",
  description: "Standard CSA",
  filename: "CSA.md",
  party1Label: "Provider",
  party2Label: "Customer",
  isNDA: false,
};

const mockOnChange = jest.fn();

const renderChat = () =>
  render(
    <DocumentChat
      formData={defaultGenericFormData}
      docConfig={csaConfig}
      onChange={mockOnChange}
    />
  );

beforeEach(() => {
  jest.clearAllMocks();
  mockSend.mockResolvedValue({
    message: "What is the Customer's company name?",
  } as Awaited<ReturnType<typeof chatApi.sendChatMessage>>);
});

describe("DocumentChat rendering", () => {
  it("renders the AI Assistant header", () => {
    renderChat();
    expect(screen.getByText("AI Assistant")).toBeInTheDocument();
  });

  it("renders a welcome message mentioning the document name", () => {
    renderChat();
    expect(screen.getByText(/Cloud Service Agreement/)).toBeInTheDocument();
  });

  it("renders the welcome message mentioning the party1 label", () => {
    renderChat();
    expect(screen.getByText(/Provider/)).toBeInTheDocument();
  });

  it("renders the message input and Send button", () => {
    renderChat();
    expect(screen.getByPlaceholderText(/Type your message/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /send/i })).toBeInTheDocument();
  });

  it("disables Send when input is empty", () => {
    renderChat();
    expect(screen.getByRole("button", { name: /send/i })).toBeDisabled();
  });
});

describe("DocumentChat sending messages", () => {
  it("shows user message in chat after sending", async () => {
    const user = userEvent.setup();
    renderChat();
    await user.type(screen.getByPlaceholderText(/Type your message/), "Acme Corp");
    await user.click(screen.getByRole("button", { name: /send/i }));
    expect(screen.getByText("Acme Corp")).toBeInTheDocument();
  });

  it("calls sendChatMessage with documentType from docConfig", async () => {
    const user = userEvent.setup();
    renderChat();
    await user.type(screen.getByPlaceholderText(/Type your message/), "Hello");
    await user.click(screen.getByRole("button", { name: /send/i }));
    expect(mockSend).toHaveBeenCalledTimes(1);
    const [, , docType] = mockSend.mock.calls[0];
    expect(docType).toBe("csa");
  });

  it("displays the AI response", async () => {
    const user = userEvent.setup();
    renderChat();
    await user.type(screen.getByPlaceholderText(/Type your message/), "Hello");
    await user.click(screen.getByRole("button", { name: /send/i }));
    await waitFor(() => {
      expect(screen.getByText("What is the Customer's company name?")).toBeInTheDocument();
    });
  });

  it("calls onChange with merged fields from AI response", async () => {
    mockSend.mockResolvedValue({
      message: "Got it!",
      party1: { company: "Acme", signatoryName: null, title: null, noticeAddress: null },
      party2: null,
    } as Awaited<ReturnType<typeof chatApi.sendChatMessage>>);
    const user = userEvent.setup();
    renderChat();
    await user.type(screen.getByPlaceholderText(/Type your message/), "Acme");
    await user.click(screen.getByRole("button", { name: /send/i }));
    await waitFor(() => {
      expect(mockOnChange).toHaveBeenCalledWith(
        expect.objectContaining({
          party1: expect.objectContaining({ company: "Acme" }),
        })
      );
    });
  });

  it("shows an error message when the API call fails", async () => {
    mockSend.mockRejectedValue(new Error("Network error"));
    const user = userEvent.setup();
    renderChat();
    await user.type(screen.getByPlaceholderText(/Type your message/), "Hello");
    await user.click(screen.getByRole("button", { name: /send/i }));
    await waitFor(() => {
      expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
    });
  });
});

describe("DocumentChat reset", () => {
  it("calls onChange with defaultGenericFormData on reset", async () => {
    const user = userEvent.setup();
    renderChat();
    await user.click(screen.getByRole("button", { name: /reset/i }));
    expect(mockOnChange).toHaveBeenCalledWith(defaultGenericFormData);
  });
});
