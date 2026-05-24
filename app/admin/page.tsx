import Link from "next/link";
import { ShieldOff, Zap } from "lucide-react";

export const dynamic = "force-static";

export default function AdminPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-8">
      <section className="noise w-full max-w-md overflow-hidden rounded-lg border border-white/10 bg-panel/90 shadow-2xl">
        <div className="border-b border-white/10 bg-panel-sheen px-6 py-5">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold uppercase text-acid">
            <Zap className="h-4 w-4" />
            BEAST//RANK
          </Link>
          <h1 className="mt-6 text-3xl font-black uppercase leading-tight text-white">
            Static board mode
          </h1>
          <p className="mt-2 text-sm leading-6 text-white/62">
            GitHub Pages serves static files only, so admin login and live ranking sync are disabled on this deploy.
          </p>
        </div>

        <div className="space-y-4 p-6">
          <div className="flex items-start gap-3 rounded-lg border border-cyan/20 bg-cyan/10 p-3 text-sm leading-6 text-cyan/90">
            <ShieldOff className="mt-0.5 h-4 w-4 shrink-0" />
            <span>Update rankings in the source data, rebuild, and redeploy to publish changes.</span>
          </div>

          <Link
            href="/"
            className="inline-flex w-full items-center justify-center rounded-lg border border-acid/45 bg-acid px-4 py-3 text-sm font-black uppercase text-black shadow-neon transition hover:brightness-110"
          >
            Back to board
          </Link>
        </div>
      </section>
    </main>
  );
}
