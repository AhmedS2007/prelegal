import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import LoginPage from "@/app/login/page";

const mockReplace = jest.fn();
const mockPush = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({ replace: mockReplace, push: mockPush }),
}));

global.fetch = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();
  localStorage.clear();
});

describe("LoginPage", () => {
  it("renders the Prelegal brand", () => {
    render(<LoginPage />);
    expect(screen.getAllByText("Prelegal").length).toBeGreaterThan(0);
  });

  it("shows Sign In tab by default", () => {
    render(<LoginPage />);
    expect(screen.getAllByRole("button", { name: "Sign In" }).length).toBeGreaterThan(0);
  });

  it("shows Sign Up tab", () => {
    render(<LoginPage />);
    expect(screen.getByRole("button", { name: "Sign Up" })).toBeInTheDocument();
  });

  it("redirects to / if already authenticated", () => {
    localStorage.setItem("auth_token", "existing-token");
    render(<LoginPage />);
    expect(mockReplace).toHaveBeenCalledWith("/");
  });

  it("calls signin endpoint and redirects on success", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => ({ success: true, token: "test-token" }),
    });

    const { container } = render(<LoginPage />);
    fireEvent.change(screen.getByPlaceholderText("you@example.com"), {
      target: { value: "user@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("••••••••"), {
      target: { value: "password123" },
    });
    fireEvent.submit(container.querySelector("form")!);

    await waitFor(() => {
      expect(localStorage.getItem("auth_token")).toBe("test-token");
      expect(mockPush).toHaveBeenCalledWith("/");
    });
  });

  it("shows error message on fetch failure", async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error("Network error"));

    const { container } = render(<LoginPage />);
    fireEvent.change(screen.getByPlaceholderText("you@example.com"), {
      target: { value: "user@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("••••••••"), {
      target: { value: "password" },
    });
    fireEvent.submit(container.querySelector("form")!);

    await waitFor(() => {
      expect(screen.getByText("Could not connect to server.")).toBeInTheDocument();
    });
  });
});
