"use client";

import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";
import { GripVertical, Star } from "lucide-react";
import type { FlavorView } from "@/lib/queries";
import { cn } from "@/lib/utils";
import SafeCanImage from "../SafeCanImage";

type Props = {
  flavor: FlavorView;
  isEditable: boolean;
  onOpen: (flavor: FlavorView) => void;
  onFavorite: (flavorId: string) => void;
};

export default function FlavorCard({ flavor, isEditable, onOpen, onFavorite }: Props) {
  const sortable = useSortable({
    id: flavor.id,
    disabled: !isEditable,
    data: {
      type: "flavor",
      bucket: flavor.bucket
    }
  });

  const style = {
    transform: CSS.Transform.toString(sortable.transform),
    transition: sortable.transition
  };

  return (
    <article
      ref={sortable.setNodeRef}
      style={style}
      className={cn(
        "group relative min-h-[168px] overflow-hidden rounded-lg border bg-black/36 shadow-lg transition",
        "border-white/10 hover:border-white/25 hover:bg-white/[0.055]",
        sortable.isDragging && "z-30 scale-[1.02] border-acid/60 bg-black/75 opacity-85 shadow-neon"
      )}
    >
      <div
        className="absolute inset-x-0 top-0 h-1"
        style={{ backgroundColor: flavor.accentColor }}
      />
      <button
        type="button"
        onClick={() => onOpen(flavor)}
        className="grid h-full w-full grid-cols-[72px_1fr] gap-3 p-3 text-left"
      >
        <div className="flex h-32 items-center justify-center rounded-md border border-white/10 bg-white/[0.035]">
          <SafeCanImage
            src={flavor.imageUrl}
            slug={flavor.slug}
            alt={`${flavor.name} can`}
            loading="lazy"
            className="can-shadow h-28 max-w-full object-contain transition duration-300 group-hover:scale-105"
          />
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] font-black uppercase text-white/55">
              {flavor.category}
            </span>
            {flavor.isRecent ? (
              <span className="rounded-md border border-cyan/25 bg-cyan/10 px-2 py-0.5 text-[10px] font-black uppercase text-cyan">
                New
              </span>
            ) : null}
          </div>

          <h3 className="mt-2 line-clamp-2 text-sm font-black uppercase leading-5 text-white">
            {flavor.name}
          </h3>
          <p className="mt-2 line-clamp-2 text-xs leading-5 text-white/54">{flavor.flavorProfile}</p>
          <p className="mt-2 text-[10px] font-bold uppercase text-white/34">{flavor.status}</p>
        </div>
      </button>

      <div className="absolute bottom-2 right-2 flex items-center gap-1">
        {isEditable ? (
          <button
            type="button"
            aria-label={flavor.isFavorite ? "Remove highlight" : "Highlight flavor"}
            onClick={(event) => {
              event.stopPropagation();
              onFavorite(flavor.id);
            }}
            className={cn(
              "rounded-md border p-1.5 transition",
              flavor.isFavorite
                ? "border-amber/45 bg-amber/20 text-amber"
                : "border-white/10 bg-black/45 text-white/35 hover:border-amber/35 hover:text-amber"
            )}
          >
            <Star className={cn("h-3.5 w-3.5", flavor.isFavorite && "fill-current")} />
          </button>
        ) : flavor.isFavorite ? (
          <span className="rounded-md border border-amber/35 bg-amber/15 p-1.5 text-amber">
            <Star className="h-3.5 w-3.5 fill-current" />
          </span>
        ) : null}

        {isEditable ? (
          <button
            type="button"
            aria-label="Drag flavor"
            {...sortable.attributes}
            {...sortable.listeners}
            className="cursor-grab rounded-md border border-white/10 bg-black/45 p-1.5 text-white/38 transition hover:border-acid/35 hover:text-acid active:cursor-grabbing"
          >
            <GripVertical className="h-3.5 w-3.5" />
          </button>
        ) : null}
      </div>
    </article>
  );
}
