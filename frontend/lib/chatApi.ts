import { ChatMessage } from "./types";

export async function sendChatMessage<T>(
  messages: ChatMessage[],
  currentFields: Record<string, unknown>,
  documentType: string = "mnda"
): Promise<T & { message: string }> {
  const response = await fetch("/api/chat/message", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      messages,
      current_fields: currentFields,
      document_type: documentType,
    }),
  });
  if (!response.ok) {
    throw new Error(`Chat API error: ${response.status}`);
  }
  return response.json();
}
