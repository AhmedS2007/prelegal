export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("auth_token");
}

export function setToken(token: string): void {
  localStorage.setItem("auth_token", token);
}

export function clearToken(): void {
  localStorage.removeItem("auth_token");
}

export async function signin(
  email: string,
  password: string
): Promise<{ token: string }> {
  let res: Response;
  try {
    res = await fetch("/api/auth/signin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
  } catch {
    throw new Error("Could not connect to server.");
  }
  const data = await res.json();
  if (!data.success) {
    throw new Error(data.detail || "Invalid email or password");
  }
  return { token: data.token };
}

export async function signup(
  email: string,
  password: string
): Promise<{ token: string }> {
  let res: Response;
  try {
    res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
  } catch {
    throw new Error("Could not connect to server.");
  }
  const data = await res.json();
  if (!data.success) {
    if (res.status === 409)
      throw new Error("An account with this email already exists.");
    throw new Error(data.detail || "Could not create account. Please try again.");
  }
  return { token: data.token };
}

export async function signout(): Promise<void> {
  clearToken();
  await fetch("/api/auth/signout", { method: "POST" }).catch(() => {});
}
