"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ExternalLink, X } from "lucide-react";
import type { FlavorView } from "@/lib/queries";
import { BUCKET_META } from "@/lib/constants";
import SafeCanImage from "../SafeCanImage";

type Props = {
  flavor: FlavorView | null;
  onClose: () => void;
};

export default function FlavorDetailModal({ flavor, onClose }: Props) {
  return (
    <AnimatePresence>
      {flavor ? (
        <motion.div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/72 p-3 backdrop-blur-sm sm:items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.section
            initial={{ y: 24, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 20, opacity: 0, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 260, damping: 26 }}
            onClick={(event) => event.stopPropagation()}
            className="noise max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-lg border border-white/10 bg-panel shadow-2xl"
          >
            <div className="grid gap-0 md:grid-cols-[280px_1fr]">
              <div className="scanline flex min-h-[320px] items-center justify-center border-b border-white/10 bg-black/40 p-6 md:border-b-0 md:border-r">
                <SafeCanImage
                  src={flavor.imageUrl}
                  slug={flavor.slug}
                  alt={`${flavor.name} can`}
                  className="can-shadow h-72 max-w-full object-contain"
                />
              </div>

              <div className="p-5 sm:p-6">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-md border border-white/10 bg-white/5 px-2 py-1 text-xs font-black uppercase text-white/55">
                      {flavor.category}
                    </span>
                    <span className="rounded-md border border-white/10 bg-white/5 px-2 py-1 text-xs font-black uppercase text-white/55">
                      {BUCKET_META[flavor.bucket].title}
                    </span>
                    {flavor.isRecent ? (
                      <span className="rounded-md border border-cyan/25 bg-cyan/10 px-2 py-1 text-xs font-black uppercase text-cyan">
                        Recent
                      </span>
                    ) : null}
                  </div>
                  <button
                    type="button"
                    aria-label="Close"
                    onClick={onClose}
                    className="rounded-md border border-white/10 bg-white/5 p-2 text-white/55 transition hover:border-white/25 hover:text-white"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <h2 className="mt-5 text-3xl font-black uppercase leading-tight text-white">
                  {flavor.name}
                </h2>
                <p className="mt-4 text-sm leading-7 text-white/70">{flavor.description}</p>

                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-lg border border-white/10 bg-white/[0.035] p-3">
                    <div className="text-[10px] font-bold uppercase text-white/38">Profile</div>
                    <div className="mt-1 font-black text-white">{flavor.flavorProfile ?? "Unknown"}</div>
                  </div>
                  <div className="rounded-lg border border-white/10 bg-white/[0.035] p-3">
                    <div className="text-[10px] font-bold uppercase text-white/38">Status</div>
                    <div className="mt-1 font-black capitalize text-white">{flavor.status}</div>
                  </div>
                  <div className="rounded-lg border border-white/10 bg-white/[0.035] p-3">
                    <div className="text-[10px] font-bold uppercase text-white/38">Caffeine</div>
                    <div className="mt-1 font-black text-white">
                      {flavor.caffeineMg ? `${flavor.caffeineMg}mg` : "Varies"}
                    </div>
                  </div>
                  <div className="rounded-lg border border-white/10 bg-white/[0.035] p-3">
                    <div className="text-[10px] font-bold uppercase text-white/38">Year</div>
                    <div className="mt-1 font-black text-white">{flavor.introducedYear ?? "Archive"}</div>
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap gap-2">
                  <Link
                    href={`/flavors/${flavor.slug}`}
                    className="inline-flex items-center gap-2 rounded-lg border border-acid/35 bg-acid/10 px-4 py-2 text-sm font-black uppercase text-acid transition hover:border-acid"
                  >
                    Detail page
                  </Link>
                  {flavor.sourceUrl ? (
                    <a
                      href={flavor.sourceUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-lg border border-cyan/35 bg-cyan/10 px-4 py-2 text-sm font-black uppercase text-cyan transition hover:border-cyan"
                    >
                      Source
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  ) : null}
                </div>
              </div>
            </div>
          </motion.section>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
