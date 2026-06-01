import { DraftFull, DraftMeta, SaveDraftPayload } from "./types";
import { getToken } from "./authApi";

function authHeaders(): Record<string, string> {
  const token = getToken();
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return headers;
}

export async function listDrafts(): Promise<DraftMeta[]> {
  const res = await fetch("/api/documents", { headers: authHeaders() });
  if (!res.ok) return [];
  return res.json();
}

export async function getDraft(id: number): Promise<DraftFull> {
  const res = await fetch(`/api/documents/${id}`, { headers: authHeaders() });
  if (!res.ok) throw new Error("Document not found");
  return res.json();
}

export async function saveDraft(payload: SaveDraftPayload): Promise<DraftMeta> {
  const res = await fetch("/api/documents", {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to save draft");
  return res.json();
}

export async function updateDraft(
  id: number,
  payload: SaveDraftPayload
): Promise<DraftMeta> {
  const res = await fetch(`/api/documents/${id}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to update draft");
  return res.json();
}
