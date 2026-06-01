import { render, screen, waitFor } from "@testing-library/react";
import { useState } from "react";
import userEvent from "@testing-library/user-event";
import NDAChat from "@/components/NDAChat";
import { defaultFormData, ChatMessage } from "@/lib/types";
import * as chatApi from "@/lib/chatApi";

jest.mock("@/lib/chatApi");
const mockSend = chatApi.sendChatMessage as jest.MockedFunction<
  typeof chatApi.sendChatMessage
>;

const mockOnChange = jest.fn();
const mockOnMessagesChange = jest.fn();

const WELCOME =
  "Hi! I'm here to help you draft your Mutual NDA. Let's start — what are the names of the two companies involved in this agreement?";

function NDAWrapper({ initialMessages = [{ role: "assistant" as const, content: WELCOME }] }: { initialMessages?: ChatMessage[] }) {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const handleMessages = (msgs: ChatMessage[]) => {
    setMessages(msgs);
    mockOnMessagesChange(msgs);
  };
  return (
    <NDAChat
      formData={defaultFormData}
      onChange={mockOnChange}
      messages={messages}
      onMessagesChange={handleMessages}
    />
  );
}

const renderChat = (initialMessages?: ChatMessage[]) =>
  render(<NDAWrapper initialMessages={initialMessages} />);

beforeEach(() => {
  jest.clearAllMocks();
  mockSend.mockResolvedValue({
    message: "Great! What is the purpose of this NDA?",
    party1: null,
    party2: null,
  });
});

/* ── Rendering ──────────────────────────────────── */

describe("NDAChat rendering", () => {
  it("renders the AI Assistant header", () => {
    renderChat();
    expect(screen.getByText("AI Assistant")).toBeInTheDocument();
  });

  it("renders the welcome message as an assistant bubble", () => {
    renderChat();
    expect(
      screen.getByText(/Let's start — what are the names/)
    ).toBeInTheDocument();
  });

  it("renders the message input textarea", () => {
    renderChat();
    expect(
      screen.getByPlaceholderText(/Type your message/)
    ).toBeInTheDocument();
  });

  it("renders the Send button", () => {
    renderChat();
    expect(screen.getByRole("button", { name: /send/i })).toBeInTheDocument();
  });

  it("renders the Reset button", () => {
    renderChat();
    expect(screen.getByRole("button", { name: /reset/i })).toBeInTheDocument();
  });

  it("disables Send when input is empty", () => {
    renderChat();
    expect(screen.getByRole("button", { name: /send/i })).toBeDisabled();
  });
});

/* ── Sending a message ──────────────────────────── */

describe("NDAChat sending messages", () => {
  it("shows the user's message in the chat after sending", async () => {
    const user = userEvent.setup();
    renderChat();
    await user.type(screen.getByPlaceholderText(/Type your message/), "Acme and Globex");
    await user.click(screen.getByRole("button", { name: /send/i }));
    expect(screen.getByText("Acme and Globex")).toBeInTheDocument();
  });

  it("calls sendChatMessage with the conversation and only AI-extracted fields (not defaults)", async () => {
    const user = userEvent.setup();
    renderChat();
    await user.type(screen.getByPlaceholderText(/Type your message/), "Hello");
    await user.click(screen.getByRole("button", { name: /send/i }));
    expect(mockSend).toHaveBeenCalledTimes(1);
    const [messages, fields] = mockSend.mock.calls[0];
    expect(messages.at(-1)).toEqual({ role: "user", content: "Hello" });
    // On the first message, extracted fields are empty — defaultFormData values are NOT sent
    expect(fields).toEqual({});
  });

  it("displays the AI response after receiving it", async () => {
    const user = userEvent.setup();
    renderChat();
    await user.type(screen.getByPlaceholderText(/Type your message/), "Hello");
    await user.click(screen.getByRole("button", { name: /send/i }));
    await waitFor(() => {
      expect(
        screen.getByText("Great! What is the purpose of this NDA?")
      ).toBeInTheDocument();
    });
  });

  it("calls onChange with merged fields from AI response", async () => {
    mockSend.mockResolvedValue({
      message: "Got it!",
      party1: { company: "Acme", signatoryName: null, title: null, noticeAddress: null },
      party2: null,
    });
    const user = userEvent.setup();
    renderChat();
    await user.type(screen.getByPlaceholderText(/Type your message/), "Acme Corp");
    await user.click(screen.getByRole("button", { name: /send/i }));
    await waitFor(() => {
      expect(mockOnChange).toHaveBeenCalledWith(
        expect.objectContaining({
          party1: expect.objectContaining({ company: "Acme" }),
        })
      );
    });
  });

  it("clears the input after sending", async () => {
    const user = userEvent.setup();
    renderChat();
    const textarea = screen.getByPlaceholderText(/Type your message/);
    await user.type(textarea, "Hello");
    await user.click(screen.getByRole("button", { name: /send/i }));
    expect(textarea).toHaveValue("");
  });
});

/* ── Keyboard behaviour ─────────────────────────── */

describe("NDAChat keyboard shortcuts", () => {
  it("submits on Enter (without shift)", async () => {
    const user = userEvent.setup();
    renderChat();
    await user.type(
      screen.getByPlaceholderText(/Type your message/),
      "Hello{Enter}"
    );
    expect(mockSend).toHaveBeenCalledTimes(1);
  });

  it("does not submit on Shift+Enter", async () => {
    const user = userEvent.setup();
    renderChat();
    await user.type(
      screen.getByPlaceholderText(/Type your message/),
      "Hello{Shift>}{Enter}{/Shift}"
    );
    expect(mockSend).not.toHaveBeenCalled();
  });
});

/* ── Error handling ─────────────────────────────── */

describe("NDAChat error handling", () => {
  it("shows an error message when the API call fails", async () => {
    mockSend.mockRejectedValue(new Error("Network error"));
    const user = userEvent.setup();
    renderChat();
    await user.type(screen.getByPlaceholderText(/Type your message/), "Hello");
    await user.click(screen.getByRole("button", { name: /send/i }));
    await waitFor(() => {
      expect(
        screen.getByText(/something went wrong/i)
      ).toBeInTheDocument();
    });
  });
});

/* ── Reset ──────────────────────────────────────── */

describe("NDAChat reset", () => {
  it("calls onChange with defaultFormData when Reset is clicked", async () => {
    const user = userEvent.setup();
    renderChat();
    await user.click(screen.getByRole("button", { name: /reset/i }));
    expect(mockOnChange).toHaveBeenCalledWith(defaultFormData);
  });

  it("calls onMessagesChange with welcome message when Reset is clicked", async () => {
    const user = userEvent.setup();
    renderChat();
    await user.click(screen.getByRole("button", { name: /reset/i }));
    expect(mockOnMessagesChange).toHaveBeenCalledWith([
      { role: "assistant", content: WELCOME },
    ]);
  });
});
