import { ChatMessage, ExtractedNDAFields } from "./types";

export interface ChatApiResponse extends ExtractedNDAFields {
  message: string;
}

export async function sendChatMessage(
  messages: ChatMessage[],
  currentFields: Record<string, unknown>
): Promise<ChatApiResponse> {
  const response = await fetch("/api/chat/message", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages, current_fields: currentFields }),
  });
  if (!response.ok) {
    throw new Error(`Chat API error: ${response.status}`);
  }
  return response.json();
}
