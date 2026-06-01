"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signin, signup, setToken, getToken } from "@/lib/authApi";

export default function LoginPage() {
  const router = useRouter();
  const [tab, setTab] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (getToken()) {
      router.replace("/");
    }
  }, [router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const fn = tab === "signin" ? signin : signup;
      const { token } = await fn(email, password);
      setToken(token);
      router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col">
      {/* Header */}
      <header className="bg-[#032147] h-14 flex items-center px-6 shrink-0">
        <div className="flex items-center gap-3">
          <span className="w-2.5 h-2.5 rounded-[2px] bg-[#ecad0a] shrink-0" aria-hidden />
          <div>
            <span className="text-[10px] font-semibold tracking-[0.18em] uppercase text-[#ecad0a] leading-none block">
              Prelegal
            </span>
            <span className="text-[13px] font-medium text-white/70 leading-tight block">
              Legal Agreements, Simplified
            </span>
          </div>
        </div>
      </header>

      {/* Centered card */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-[360px]">

          {/* Wordmark */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2.5 mb-2">
              <span className="w-3 h-3 rounded-[3px] bg-[#ecad0a]" aria-hidden />
              <span className="text-[24px] font-bold text-[#032147] font-serif tracking-tight">
                Prelegal
              </span>
            </div>
            <p className="text-[13px] text-[#888888]">
              Professional legal documents, in minutes
            </p>
          </div>

          {/* Card */}
          <div className="bg-white rounded-lg border border-stone-200 shadow-sm overflow-hidden">

            {/* Tabs */}
            <div className="flex border-b border-stone-200">
              {(["signin", "signup"] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => { setTab(t); setError(""); }}
                  className={`flex-1 py-3 text-[12px] font-medium transition-colors duration-150 ${
                    tab === t
                      ? "text-[#032147] border-b-2 border-[#ecad0a] -mb-px bg-white"
                      : "text-[#888888] hover:text-[#032147] bg-stone-50"
                  }`}
                >
                  {t === "signin" ? "Sign In" : "Sign Up"}
                </button>
              ))}
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div>
                <label className="block text-[11px] font-medium text-[#888888] uppercase tracking-[0.07em] mb-1.5">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full bg-transparent border-0 border-b border-stone-200 pb-2 pt-0.5 text-[13px] text-stone-800 placeholder:text-stone-300 focus:outline-none focus:border-[#ecad0a] transition-colors duration-150"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-[#888888] uppercase tracking-[0.07em] mb-1.5">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full bg-transparent border-0 border-b border-stone-200 pb-2 pt-0.5 text-[13px] text-stone-800 placeholder:text-stone-300 focus:outline-none focus:border-[#ecad0a] transition-colors duration-150"
                />
              </div>

              {error && (
                <p className="text-[12px] text-red-500">{error}</p>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#753991] hover:bg-[#8b44a5] disabled:opacity-60 text-white text-[13px] font-semibold py-2.5 rounded transition-colors duration-150"
              >
                {isLoading ? "..." : tab === "signin" ? "Sign In" : "Create Account"}
              </button>
            </form>
          </div>

          <p className="text-center text-[11px] text-stone-400 mt-5">
            Documents generated on this platform are drafts only and subject to legal review.
          </p>
        </div>
      </div>
    </div>
  );
}
