import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink, Star } from "lucide-react";
import { getFlavorBySlug } from "@/lib/queries";
import { BUCKET_META } from "@/lib/constants";
import SafeCanImage from "@/components/SafeCanImage";

type Params = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const flavor = await getFlavorBySlug(slug);

  if (!flavor) {
    return { title: "Flavor Not Found" };
  }

  return {
    title: flavor.name,
    description: flavor.description,
    openGraph: {
      title: `${flavor.name} - BEAST//RANK`,
      description: flavor.description
    }
  };
}

export default async function FlavorPage({ params }: Params) {
  const { slug } = await params;
  const flavor = await getFlavorBySlug(slug);

  if (!flavor) notFound();

  const bucket = BUCKET_META[flavor.bucket];

  return (
    <main className="min-h-screen px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/75 transition hover:border-acid/45 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to board
        </Link>

        <section className="mt-6 grid gap-8 overflow-hidden rounded-lg border border-white/10 bg-panel/88 p-5 shadow-2xl md:grid-cols-[280px_1fr] md:p-8">
          <div className="flex min-h-[360px] items-center justify-center rounded-lg border border-white/10 bg-black/35 p-6">
            <SafeCanImage
              src={flavor.imageUrl}
              slug={flavor.slug}
              alt={`${flavor.name} can`}
              className="can-shadow h-80 max-w-full object-contain"
              loading="eager"
            />
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-md border border-white/10 bg-white/5 px-2 py-1 text-xs font-semibold uppercase text-white/65">
                {flavor.category}
              </span>
              <span className="rounded-md border border-white/10 bg-white/5 px-2 py-1 text-xs font-semibold uppercase text-white/65">
                {flavor.status}
              </span>
              {flavor.isFavorite ? (
                <span className="inline-flex items-center gap-1 rounded-md border border-amber/40 bg-amber/10 px-2 py-1 text-xs font-semibold uppercase text-amber">
                  <Star className="h-3.5 w-3.5 fill-current" />
                  Highlight
                </span>
              ) : null}
            </div>

            <h1 className="mt-5 font-display text-4xl font-black uppercase leading-tight text-white sm:text-5xl">
              {flavor.name}
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-white/72">{flavor.description}</p>

            <dl className="mt-8 grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
                <dt className="text-xs font-semibold uppercase text-white/45">Tier</dt>
                <dd className="mt-1 text-xl font-black text-white">
                  {bucket.label} / {bucket.title}
                </dd>
              </div>
              <div className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
                <dt className="text-xs font-semibold uppercase text-white/45">Profile</dt>
                <dd className="mt-1 text-xl font-black text-white">{flavor.flavorProfile ?? "Unknown"}</dd>
              </div>
              <div className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
                <dt className="text-xs font-semibold uppercase text-white/45">Caffeine</dt>
                <dd className="mt-1 text-xl font-black text-white">
                  {flavor.caffeineMg ? `${flavor.caffeineMg}mg` : "Varies"}
                </dd>
              </div>
              <div className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
                <dt className="text-xs font-semibold uppercase text-white/45">Introduced</dt>
                <dd className="mt-1 text-xl font-black text-white">
                  {flavor.introducedYear ?? "Archive"}
                </dd>
              </div>
            </dl>

            {flavor.sourceUrl ? (
              <a
                href={flavor.sourceUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-7 inline-flex items-center gap-2 rounded-lg border border-cyan/35 bg-cyan/10 px-4 py-2 text-sm font-bold text-cyan transition hover:border-cyan hover:bg-cyan/15"
              >
                Source
                <ExternalLink className="h-4 w-4" />
              </a>
            ) : null}
          </div>
        </section>
      </div>
    </main>
  );
}
