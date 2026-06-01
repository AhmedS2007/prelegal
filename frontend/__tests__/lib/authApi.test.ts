import { getToken, setToken, clearToken, signin, signup } from "@/lib/authApi";

beforeEach(() => {
  localStorage.clear();
  jest.resetAllMocks();
});

describe("token storage", () => {
  it("getToken returns null when nothing stored", () => {
    expect(getToken()).toBeNull();
  });

  it("setToken then getToken returns the token", () => {
    setToken("abc123");
    expect(getToken()).toBe("abc123");
  });

  it("clearToken removes the token", () => {
    setToken("abc123");
    clearToken();
    expect(getToken()).toBeNull();
  });
});

describe("signin", () => {
  it("returns token on successful response", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ success: true, token: "jwt-token-here" }),
    }) as jest.Mock;

    const result = await signin("user@example.com", "pass");
    expect(result.token).toBe("jwt-token-here");
  });

  it("throws on non-ok response", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 401,
      json: () => Promise.resolve({ success: false, detail: "Invalid email or password" }),
    }) as jest.Mock;

    await expect(signin("user@example.com", "wrong")).rejects.toThrow(
      "Invalid email or password"
    );
  });
});

describe("signup", () => {
  it("returns token on successful registration", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ success: true, token: "new-jwt" }),
    }) as jest.Mock;

    const result = await signup("new@example.com", "password");
    expect(result.token).toBe("new-jwt");
  });

  it("throws specific message for duplicate email (409)", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 409,
      json: () => Promise.resolve({ success: false, detail: "Email already registered" }),
    }) as jest.Mock;

    await expect(signup("dup@example.com", "pass")).rejects.toThrow(
      "An account with this email already exists."
    );
  });
});
