import { listDrafts, getDraft, saveDraft, updateDraft } from "@/lib/documentsApi";
import * as authApi from "@/lib/authApi";

jest.mock("@/lib/authApi");
const mockGetToken = authApi.getToken as jest.MockedFunction<typeof authApi.getToken>;

beforeEach(() => {
  jest.resetAllMocks();
  mockGetToken.mockReturnValue("test-bearer-token");
});

describe("listDrafts", () => {
  it("returns an empty array on non-ok response", async () => {
    global.fetch = jest.fn().mockResolvedValue({ ok: false }) as jest.Mock;
    const result = await listDrafts();
    expect(result).toEqual([]);
  });

  it("sends Authorization header", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve([]),
    }) as jest.Mock;
    await listDrafts();
    const calledHeaders = (global.fetch as jest.Mock).mock.calls[0][1].headers;
    expect(calledHeaders["Authorization"]).toBe("Bearer test-bearer-token");
  });

  it("returns draft list on success", async () => {
    const drafts = [{ id: 1, document_type: "csa", doc_name: "Test", updated_at: "2026-01-01" }];
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(drafts),
    }) as jest.Mock;
    const result = await listDrafts();
    expect(result).toEqual(drafts);
  });
});

describe("getDraft", () => {
  it("returns full draft on success", async () => {
    const draft = {
      id: 5,
      document_type: "mnda",
      doc_name: "Acme NDA",
      form_data: {},
      chat_messages: [],
      created_at: "2026-01-01",
      updated_at: "2026-01-01",
    };
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(draft),
    }) as jest.Mock;
    const result = await getDraft(5);
    expect(result.id).toBe(5);
    expect(result.doc_name).toBe("Acme NDA");
  });

  it("throws on non-ok response", async () => {
    global.fetch = jest.fn().mockResolvedValue({ ok: false }) as jest.Mock;
    await expect(getDraft(99)).rejects.toThrow("Document not found");
  });

  it("fetches the correct URL", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({}),
    }) as jest.Mock;
    await getDraft(42).catch(() => {});
    expect((global.fetch as jest.Mock).mock.calls[0][0]).toBe("/api/documents/42");
  });
});

describe("saveDraft", () => {
  it("posts to /api/documents with correct body", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ id: 1, document_type: "csa", doc_name: "Test", updated_at: "2026-01-01" }),
    }) as jest.Mock;
    const payload = {
      document_type: "csa",
      doc_name: "Test",
      form_data: {} as never,
      chat_messages: [],
    };
    await saveDraft(payload);
    const call = (global.fetch as jest.Mock).mock.calls[0];
    expect(call[0]).toBe("/api/documents");
    expect(call[1].method).toBe("POST");
    const body = JSON.parse(call[1].body);
    expect(body.doc_name).toBe("Test");
  });
});

describe("updateDraft", () => {
  it("puts to /api/documents/{id}", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ id: 7, document_type: "mnda", doc_name: "Updated", updated_at: "2026-01-01" }),
    }) as jest.Mock;
    const payload = {
      document_type: "mnda",
      doc_name: "Updated",
      form_data: {} as never,
      chat_messages: [],
    };
    await updateDraft(7, payload);
    const call = (global.fetch as jest.Mock).mock.calls[0];
    expect(call[0]).toBe("/api/documents/7");
    expect(call[1].method).toBe("PUT");
  });
});
