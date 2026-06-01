import { ChatMessage } from "./types";
import { getToken } from "./authApi";

export async function sendChatMessage<T>(
  messages: ChatMessage[],
  currentFields: Record<string, unknown>,
  documentType: string = "mnda"
): Promise<T & { message: string }> {
  const token = getToken();
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const response = await fetch("/api/chat/message", {
    method: "POST",
    headers,
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
