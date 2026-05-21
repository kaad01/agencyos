"use client";

import { startTransition, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";

export function SignInForm({ githubEnabled }: Readonly<{ githubEnabled: boolean }>) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
  const [email, setEmail] = useState("demo@agencyos.dev");
  const [password, setPassword] = useState("agencyos1");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  function handleCredentialsSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setPending(true);

    startTransition(async () => {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
        redirectTo: callbackUrl,
      });

      if (result?.error) {
        setError("Enter a valid email and a password with at least 8 characters.");
        setPending(false);
        return;
      }

      router.push(result?.url || callbackUrl);
      router.refresh();
    });
  }

  function handleGitHubSignIn() {
    setPending(true);
    startTransition(async () => {
      await signIn("github", { redirectTo: callbackUrl });
    });
  }

  return (
    <div className="mt-8 space-y-6">
      <form className="grid gap-4" onSubmit={handleCredentialsSubmit}>
        <label className="grid gap-2 text-sm font-black text-[#17201b]">
          Email
          <input
            className="rounded-2xl border border-black/10 bg-white px-4 py-3 font-medium text-[#17201b] outline-none ring-0"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </label>
        <label className="grid gap-2 text-sm font-black text-[#17201b]">
          Password
          <input
            className="rounded-2xl border border-black/10 bg-white px-4 py-3 font-medium text-[#17201b] outline-none ring-0"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            minLength={8}
            required
          />
        </label>
        <button
          type="submit"
          disabled={pending}
          className="rounded-2xl bg-[#ff6b35] px-5 py-3 text-sm font-black text-white disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending ? "Signing in..." : "Continue to dashboard"}
        </button>
      </form>

      <div className="rounded-[1.4rem] bg-[#f8f6ef] p-5">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-[#738076]">
          OAuth scaffold
        </p>
        <p className="mt-2 text-sm leading-7 text-[#536357]">
          GitHub login is wired into Auth.js and becomes active when the repo has
          GitHub provider env vars configured.
        </p>
        <button
          type="button"
          onClick={handleGitHubSignIn}
          disabled={!githubEnabled || pending}
          className="mt-4 rounded-2xl border border-black/10 bg-white px-5 py-3 text-sm font-black text-[#17201b] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {githubEnabled ? "Continue with GitHub" : "GitHub env vars not set yet"}
        </button>
      </div>

      {error ? <p className="text-sm font-bold text-[#b63a12]">{error}</p> : null}
    </div>
  );
}
