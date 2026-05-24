"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  closestCorners,
  DndContext,
  DragEndEvent,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { AnimatePresence, motion } from "framer-motion";
import {
  Activity,
  Crown,
  Filter,
  Gauge,
  LogOut,
  Search,
  Shield,
  Sparkles,
  Star,
  Volume2,
  VolumeX,
  Zap
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { BoardData, FlavorView } from "@/lib/queries";
import { BUCKET_META, CATEGORY_ORDER, RANK_BUCKETS, TIER_BUCKETS, type RankBucket } from "@/lib/constants";
import { cn, formatPercent } from "@/lib/utils";
import SafeCanImage from "../SafeCanImage";
import BucketRow from "./BucketRow";
import FlavorDetailModal from "./FlavorDetailModal";

type Props = {
  initialBoard: BoardData;
  isAdmin: boolean;
};

type SaveState = "idle" | "saving" | "saved" | "error";

const emptyGroups = () =>
  Object.fromEntries(RANK_BUCKETS.map((bucket) => [bucket, [] as FlavorView[]])) as Record<
    RankBucket,
    FlavorView[]
  >;

function groupFlavors(flavors: FlavorView[]) {
  const groups = emptyGroups();
  for (const flavor of flavors) {
    groups[flavor.bucket].push(flavor);
  }
  for (const bucket of RANK_BUCKETS) {
    groups[bucket].sort((a, b) => a.position - b.position || a.name.localeCompare(b.name));
  }
  return groups;
}

function flattenGroups(groups: Record<RankBucket, FlavorView[]>) {
  return RANK_BUCKETS.flatMap((bucket) =>
    groups[bucket].map((flavor, position) => ({
      ...flavor,
      bucket,
      position
    }))
  );
}

function withNormalizedPositions(flavors: FlavorView[]) {
  return flattenGroups(groupFlavors(flavors));
}

function getLiveStats(flavors: FlavorView[]) {
  const tried = flavors.filter((flavor) => flavor.bucket !== "HAVENT_TRIED");
  const favorites = flavors.filter((flavor) => flavor.isFavorite);
  const categoryScores = new Map<string, number>();

  for (const flavor of tried) {
    categoryScores.set(flavor.category, (categoryScores.get(flavor.category) ?? 0) + 1);
  }

  return {
    total: flavors.length,
    tried: tried.length,
    completion: flavors.length ? (tried.length / flavors.length) * 100 : 0,
    favoriteCategory: [...categoryScores.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? "Unranked",
    favorites: favorites.length
  };
}

export default function RankingExperience({ initialBoard, isAdmin }: Props) {
  const [flavors, setFlavors] = useState(initialBoard.flavors);
  const [selectedFlavor, setSelectedFlavor] = useState<FlavorView | null>(null);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [activeFlavor, setActiveFlavor] = useState<FlavorView | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const saveToken = useRef(0);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 }
    })
  );

  const liveStats = useMemo(() => getLiveStats(flavors), [flavors]);
  const categories = useMemo(
    () =>
      CATEGORY_ORDER.map((name) => ({
        name,
        count: flavors.filter((flavor) => flavor.category === name).length
      })).filter((item) => item.count > 0),
    [flavors]
  );

  const visibleFlavors = useMemo(() => {
    const query = search.trim().toLowerCase();
    return flavors.filter((flavor) => {
      const matchesSearch =
        !query ||
        flavor.name.toLowerCase().includes(query) ||
        flavor.flavorProfile?.toLowerCase().includes(query) ||
        flavor.description.toLowerCase().includes(query);
      const matchesCategory = category === "All" || flavor.category === category;
      return matchesSearch && matchesCategory;
    });
  }, [category, flavors, search]);

  const grouped = useMemo(() => groupFlavors(visibleFlavors), [visibleFlavors]);
  const unfilteredGrouped = useMemo(() => groupFlavors(flavors), [flavors]);
  const dragEnabled = isAdmin && search.trim() === "" && category === "All";
  const favorites = useMemo(() => flavors.filter((flavor) => flavor.isFavorite).slice(0, 6), [flavors]);
  const recent = useMemo(
    () =>
      flavors
        .filter((flavor) => flavor.isRecent || (flavor.introducedYear ?? 0) >= 2025)
        .sort((a, b) => (b.introducedYear ?? 0) - (a.introducedYear ?? 0))
        .slice(0, 8),
    [flavors]
  );

  async function persist(next: FlavorView[]) {
    const token = saveToken.current + 1;
    saveToken.current = token;
    setSaveState("saving");

    try {
      const response = await fetch("/api/rankings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: next.map((flavor) => ({
            flavorId: flavor.id,
            bucket: flavor.bucket,
            position: flavor.position,
            isFavorite: flavor.isFavorite
          }))
        })
      });

      if (!response.ok) throw new Error("Failed to save");
      if (saveToken.current === token) {
        setSaveState("saved");
        window.setTimeout(() => {
          if (saveToken.current === token) setSaveState("idle");
        }, 1200);
      }
    } catch {
      if (saveToken.current === token) setSaveState("error");
    }
  }

  function playMoveTone() {
    if (!soundEnabled || typeof window === "undefined") return;
    const AudioContextClass: typeof AudioContext | undefined =
      window.AudioContext ?? window.webkitAudioContext;
    if (!AudioContextClass) return;

    const context = new AudioContextClass();
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = "triangle";
    oscillator.frequency.value = 220;
    gain.gain.setValueAtTime(0.0001, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.035, context.currentTime + 0.018);
    gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.13);
    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start();
    oscillator.stop(context.currentTime + 0.14);
  }

  function onDragStart(event: DragStartEvent) {
    const flavor = flavors.find((item) => item.id === event.active.id);
    setActiveFlavor(flavor ?? null);
  }

  function onDragEnd(event: DragEndEvent) {
    setActiveFlavor(null);
    if (!dragEnabled || !event.over) return;

    const activeId = String(event.active.id);
    const overId = String(event.over.id);
    const active = flavors.find((flavor) => flavor.id === activeId);
    if (!active) return;

    const overFlavor = flavors.find((flavor) => flavor.id === overId);
    const overBucket = (overFlavor?.bucket ?? (RANK_BUCKETS.includes(overId as RankBucket) ? overId : active.bucket)) as RankBucket;

    setFlavors((current) => {
      const currentActive = current.find((flavor) => flavor.id === activeId);
      if (!currentActive) return current;

      const groups = groupFlavors(current);
      const sourceBucket = currentActive.bucket;
      const sourceItems = groups[sourceBucket];
      const activeIndex = sourceItems.findIndex((flavor) => flavor.id === activeId);

      if (activeIndex < 0) return current;

      if (sourceBucket === overBucket) {
        const targetIndex = overFlavor
          ? sourceItems.findIndex((flavor) => flavor.id === overFlavor.id)
          : sourceItems.length - 1;
        if (targetIndex < 0 || targetIndex === activeIndex) return current;
        groups[sourceBucket] = arrayMove(sourceItems, activeIndex, targetIndex);
      } else {
        const [moving] = sourceItems.splice(activeIndex, 1);
        const targetItems = groups[overBucket];
        const insertIndex = overFlavor
          ? Math.max(
              0,
              targetItems.findIndex((flavor) => flavor.id === overFlavor.id)
            )
          : targetItems.length;
        targetItems.splice(insertIndex < 0 ? targetItems.length : insertIndex, 0, {
          ...moving,
          bucket: overBucket
        });
      }

      const next = flattenGroups(groups);
      void persist(next);
      playMoveTone();
      return next;
    });
  }

  function toggleFavorite(flavorId: string) {
    if (!isAdmin) return;
    setFlavors((current) => {
      const next = withNormalizedPositions(
        current.map((flavor) =>
          flavor.id === flavorId ? { ...flavor, isFavorite: !flavor.isFavorite } : flavor
        )
      );
      void persist(next);
      return next;
    });
  }

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/";
  }

  return (
    <main className="min-h-screen px-4 py-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1600px]">
        <header className="noise overflow-hidden rounded-lg border border-white/10 bg-panel/86 shadow-2xl">
          <div className="grid gap-6 bg-panel-sheen p-5 md:grid-cols-[1fr_auto] md:p-7">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-acid/35 bg-acid/10 text-acid shadow-neon">
                  <Zap className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs font-black uppercase text-acid">Monster flavor command board</p>
                  <h1 className="font-display text-4xl font-black uppercase leading-none text-white sm:text-5xl">
                    BEAST//RANK
                  </h1>
                </div>
              </div>
              <p className="mt-4 max-w-3xl text-sm leading-7 text-white/65 sm:text-base">
                A dark-mode ranking board for Monster Energy flavors, ordered from best to worst with a separate archive for cans still on the hit list.
              </p>
            </div>

            <div className="grid min-w-[240px] grid-cols-3 gap-2 sm:min-w-[360px]">
              <StatTile icon={Gauge} label="Tried" value={`${liveStats.tried}/${liveStats.total}`} />
              <StatTile icon={Activity} label="Complete" value={formatPercent(liveStats.completion)} />
              <StatTile icon={Crown} label="Top Type" value={liveStats.favoriteCategory} />
            </div>
          </div>
        </header>

        <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            onDragCancel={() => setActiveFlavor(null)}
          >
            <div className="space-y-3">
              {TIER_BUCKETS.map((bucket, index) => (
                <motion.div
                  key={bucket}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.04 }}
                >
                  <BucketRow
                    bucket={bucket}
                    flavors={grouped[bucket]}
                    isEditable={dragEnabled}
                    onOpen={setSelectedFlavor}
                    onFavorite={toggleFavorite}
                  />
                </motion.div>
              ))}

              <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.28 }}>
                <BucketRow
                  bucket="HAVENT_TRIED"
                  flavors={grouped.HAVENT_TRIED}
                  isEditable={dragEnabled}
                  onOpen={setSelectedFlavor}
                  onFavorite={toggleFavorite}
                  isMuted
                />
              </motion.div>
            </div>

            <AnimatePresence>
              {activeFlavor ? (
                <motion.div
                  className="pointer-events-none fixed bottom-5 left-5 z-40 hidden rounded-lg border border-acid/45 bg-black/80 px-3 py-2 text-sm font-bold text-white shadow-neon md:block"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 12 }}
                >
                  Moving {activeFlavor.name}
                </motion.div>
              ) : null}
            </AnimatePresence>
          </DndContext>

          <aside className="space-y-4 lg:sticky lg:top-4 lg:self-start">
            <section className="rounded-lg border border-white/10 bg-panel/82 p-4 shadow-xl">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-sm font-black uppercase text-white">
                  <Shield className="h-4 w-4 text-acid" />
                  {isAdmin ? "Admin live" : "Viewer mode"}
                </div>
                {isAdmin ? (
                  <button
                    type="button"
                    onClick={logout}
                    className="rounded-md border border-white/10 bg-white/5 p-2 text-white/55 transition hover:border-white/25 hover:text-white"
                    aria-label="Logout"
                  >
                    <LogOut className="h-4 w-4" />
                  </button>
                ) : (
                  <Link
                    href="/admin"
                    className="rounded-md border border-acid/35 bg-acid/10 px-3 py-2 text-xs font-black uppercase text-acid transition hover:border-acid"
                  >
                    Login
                  </Link>
                )}
              </div>

              {isAdmin ? (
                <div className="mt-3 flex items-center justify-between rounded-lg border border-white/10 bg-black/32 px-3 py-2">
                  <span className="text-xs font-bold uppercase text-white/46">
                    {saveState === "saving"
                      ? "Syncing"
                      : saveState === "saved"
                        ? "Synced"
                        : saveState === "error"
                          ? "Sync error"
                          : "Ready"}
                  </span>
                  <button
                    type="button"
                    onClick={() => setSoundEnabled((value) => !value)}
                    aria-label={soundEnabled ? "Disable sound" : "Enable sound"}
                    className={cn(
                      "rounded-md border p-1.5 transition",
                      soundEnabled
                        ? "border-cyan/45 bg-cyan/15 text-cyan"
                        : "border-white/10 bg-white/5 text-white/42 hover:text-white"
                    )}
                  >
                    {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                  </button>
                </div>
              ) : null}
            </section>

            <section className="rounded-lg border border-white/10 bg-panel/82 p-4 shadow-xl">
              <label className="block">
                <span className="mb-2 flex items-center gap-2 text-xs font-black uppercase text-white/45">
                  <Search className="h-3.5 w-3.5" />
                  Search
                </span>
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Mango, Ultra, Rehab..."
                  className="w-full rounded-lg border border-white/10 bg-black/38 px-3 py-2.5 text-sm text-white outline-none transition placeholder:text-white/28 focus:border-acid/60 focus:ring-2 focus:ring-acid/15"
                />
              </label>

              <label className="mt-3 block">
                <span className="mb-2 flex items-center gap-2 text-xs font-black uppercase text-white/45">
                  <Filter className="h-3.5 w-3.5" />
                  Category
                </span>
                <select
                  value={category}
                  onChange={(event) => setCategory(event.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-black/38 px-3 py-2.5 text-sm text-white outline-none transition focus:border-cyan/60 focus:ring-2 focus:ring-cyan/15"
                >
                  <option>All</option>
                  {categories.map((item) => (
                    <option key={item.name}>{item.name}</option>
                  ))}
                </select>
              </label>

              <div className="mt-4 grid grid-cols-2 gap-2">
                {categories.map((item) => (
                  <button
                    key={item.name}
                    type="button"
                    onClick={() => setCategory(item.name)}
                    className={cn(
                      "rounded-md border px-2 py-2 text-left text-xs font-bold uppercase transition",
                      category === item.name
                        ? "border-acid/50 bg-acid/12 text-acid"
                        : "border-white/10 bg-white/[0.035] text-white/48 hover:border-white/24 hover:text-white"
                    )}
                  >
                    {item.name}
                    <span className="ml-1 text-white/28">{item.count}</span>
                  </button>
                ))}
              </div>
            </section>

            <section className="rounded-lg border border-white/10 bg-panel/82 p-4 shadow-xl">
              <div className="mb-3 flex items-center gap-2 text-sm font-black uppercase text-white">
                <Star className="h-4 w-4 text-amber" />
                Highlights
              </div>
              <div className="space-y-2">
                {favorites.length ? (
                  favorites.map((flavor) => (
                    <SideFlavor key={flavor.id} flavor={flavor} onOpen={setSelectedFlavor} />
                  ))
                ) : (
                  <div className="rounded-lg border border-dashed border-white/12 bg-white/[0.025] px-3 py-4 text-sm font-bold uppercase text-white/28">
                    No highlights
                  </div>
                )}
              </div>
            </section>

            <section className="rounded-lg border border-white/10 bg-panel/82 p-4 shadow-xl">
              <div className="mb-3 flex items-center gap-2 text-sm font-black uppercase text-white">
                <Sparkles className="h-4 w-4 text-cyan" />
                Recently Added
              </div>
              <div className="space-y-2">
                {recent.map((flavor) => (
                  <SideFlavor key={flavor.id} flavor={flavor} onOpen={setSelectedFlavor} />
                ))}
              </div>
            </section>
          </aside>
        </div>
      </div>

      <FlavorDetailModal flavor={selectedFlavor} onClose={() => setSelectedFlavor(null)} />
    </main>
  );
}

function StatTile({
  icon: Icon,
  label,
  value
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg border border-white/10 bg-black/32 p-3">
      <Icon className="h-4 w-4 text-cyan" />
      <div className="mt-3 text-[10px] font-bold uppercase text-white/38">{label}</div>
      <div className="mt-1 truncate text-lg font-black text-white">{value}</div>
    </div>
  );
}

function SideFlavor({ flavor, onOpen }: { flavor: FlavorView; onOpen: (flavor: FlavorView) => void }) {
  return (
    <button
      type="button"
      onClick={() => onOpen(flavor)}
      className="grid w-full grid-cols-[38px_1fr_auto] items-center gap-3 rounded-lg border border-white/10 bg-white/[0.035] p-2 text-left transition hover:border-white/24 hover:bg-white/[0.06]"
    >
      <SafeCanImage
        src={flavor.imageUrl}
        slug={flavor.slug}
        alt=""
        loading="lazy"
        className="h-11 w-8 object-contain"
      />
      <span className="min-w-0">
        <span className="block truncate text-xs font-black uppercase text-white">{flavor.name}</span>
        <span className="block truncate text-[10px] font-bold uppercase text-white/38">{flavor.category}</span>
      </span>
      <span
        className="h-2.5 w-2.5 rounded-sm"
        style={{ backgroundColor: flavor.accentColor }}
      />
    </button>
  );
}

declare global {
  interface Window {
    webkitAudioContext?: typeof AudioContext;
  }
}
