"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Lock, LogIn, ShieldCheck, Zap } from "lucide-react";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@beastrank.local");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    startTransition(async () => {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        setError("Access denied.");
        return;
      }

      router.push("/");
      router.refresh();
    });
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-8">
      <section className="noise w-full max-w-md overflow-hidden rounded-lg border border-white/10 bg-panel/90 shadow-2xl">
        <div className="border-b border-white/10 bg-panel-sheen px-6 py-5">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold uppercase text-acid">
            <Zap className="h-4 w-4" />
            BEAST//RANK
          </Link>
          <h1 className="mt-6 text-3xl font-black uppercase leading-tight text-white">
            Admin ignition
          </h1>
          <p className="mt-2 text-sm leading-6 text-white/62">
            Sign in to unlock ranking edits and board sync.
          </p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4 p-6">
          <label className="block">
            <span className="mb-2 block text-xs font-bold uppercase text-white/45">Email</span>
            <input
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              type="email"
              autoComplete="username"
              className="w-full rounded-lg border border-white/10 bg-black/40 px-4 py-3 text-white outline-none transition placeholder:text-white/28 focus:border-acid/60 focus:ring-2 focus:ring-acid/20"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-xs font-bold uppercase text-white/45">Password</span>
            <input
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              type="password"
              autoComplete="current-password"
              className="w-full rounded-lg border border-white/10 bg-black/40 px-4 py-3 text-white outline-none transition placeholder:text-white/28 focus:border-acid/60 focus:ring-2 focus:ring-acid/20"
            />
          </label>

          {error ? (
            <div className="rounded-lg border border-red-400/30 bg-red-500/10 px-3 py-2 text-sm text-red-100">
              {error}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={isPending}
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-acid/45 bg-acid px-4 py-3 text-sm font-black uppercase text-black shadow-neon transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isPending ? <Lock className="h-4 w-4" /> : <LogIn className="h-4 w-4" />}
            {isPending ? "Checking" : "Enter"}
          </button>

          <div className="flex items-start gap-3 rounded-lg border border-cyan/20 bg-cyan/10 p-3 text-sm leading-6 text-cyan/90">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" />
            <span>Session cookies are signed and HTTP-only. Change the example credentials before deployment.</span>
          </div>
        </form>
      </section>
    </main>
  );
}
