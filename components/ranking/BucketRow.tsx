"use client";

import { useDroppable } from "@dnd-kit/core";
import { SortableContext, rectSortingStrategy } from "@dnd-kit/sortable";
import type { FlavorView } from "@/lib/queries";
import { BUCKET_META, type RankBucket } from "@/lib/constants";
import { cn } from "@/lib/utils";
import FlavorCard from "./FlavorCard";

type Props = {
  bucket: RankBucket;
  flavors: FlavorView[];
  isEditable: boolean;
  onOpen: (flavor: FlavorView) => void;
  onFavorite: (flavorId: string) => void;
  isMuted?: boolean;
};

export default function BucketRow({
  bucket,
  flavors,
  isEditable,
  onOpen,
  onFavorite,
  isMuted
}: Props) {
  const meta = BUCKET_META[bucket];
  const { setNodeRef, isOver } = useDroppable({ id: bucket });

  return (
    <section
      ref={setNodeRef}
      className={cn(
        "grid gap-3 rounded-lg border bg-panel/78 p-3 transition md:grid-cols-[92px_1fr]",
        meta.border,
        isOver && "border-acid/70 bg-acid/10 shadow-neon",
        isMuted && "bg-black/28"
      )}
    >
      <div
        className={cn(
          "flex min-h-16 flex-row items-center justify-between rounded-md border border-white/10 bg-gradient-to-br px-4 py-3 md:flex-col md:justify-center",
          meta.tone
        )}
      >
        <span className="text-3xl font-black text-white">{meta.label}</span>
        <span className="text-xs font-black uppercase text-white/55">{meta.title}</span>
      </div>

      <SortableContext items={flavors.map((flavor) => flavor.id)} strategy={rectSortingStrategy}>
        <div className="grid min-h-[176px] grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {flavors.map((flavor) => (
            <FlavorCard
              key={flavor.id}
              flavor={flavor}
              isEditable={isEditable}
              onOpen={onOpen}
              onFavorite={onFavorite}
            />
          ))}

          {flavors.length === 0 ? (
            <div className="flex min-h-[168px] items-center justify-center rounded-lg border border-dashed border-white/12 bg-white/[0.025] text-sm font-bold uppercase text-white/28">
              Empty tier
            </div>
          ) : null}
        </div>
      </SortableContext>
    </section>
  );
}
