import { flavorSeeds } from "@/data/flavors";
import { CATEGORY_ORDER, RANK_BUCKETS, type RankBucket } from "./constants";
import type { BoardData, FlavorView } from "./queries";

const validBucket = new Set<string>(RANK_BUCKETS);

function toBucket(value?: string | null): RankBucket {
  return validBucket.has(value ?? "") ? (value as RankBucket) : "HAVENT_TRIED";
}

export function getStaticFlavors(): FlavorView[] {
  const counters = new Map<RankBucket, number>();

  return flavorSeeds
    .map<FlavorView>((flavor) => {
      const bucket = toBucket(flavor.initialBucket);
      const nextPosition = counters.get(bucket) ?? 0;
      counters.set(bucket, nextPosition + 1);

      return {
        id: flavor.slug,
        slug: flavor.slug,
        name: flavor.name,
        category: flavor.category,
        description: flavor.description,
        flavorProfile: flavor.flavorProfile ?? null,
        imageUrl: flavor.imageUrl ?? `/cans/generated/${flavor.slug}.svg`,
        sourceUrl: flavor.sourceUrl ?? null,
        status: flavor.status ?? "current",
        accentColor: flavor.accentColor ?? "#69ff72",
        caffeineMg: flavor.caffeineMg ?? null,
        calories: flavor.calories ?? null,
        sugarG: flavor.sugarG ?? null,
        introducedYear: flavor.introducedYear ?? null,
        isRecent: flavor.isRecent ?? false,
        bucket,
        position: flavor.initialPosition ?? nextPosition,
        isFavorite: flavor.isFavorite ?? false
      };
    })
    .sort((a, b) => {
      const bucketDelta = RANK_BUCKETS.indexOf(a.bucket) - RANK_BUCKETS.indexOf(b.bucket);
      if (bucketDelta !== 0) return bucketDelta;
      return a.position - b.position || a.name.localeCompare(b.name);
    });
}

export function getStaticBoardData(): BoardData {
  const flavors = getStaticFlavors();
  const categories = CATEGORY_ORDER.map((name) => ({
    name,
    count: flavors.filter((flavor) => flavor.category === name).length
  })).filter((category) => category.count > 0);

  const tried = flavors.filter((flavor) => flavor.bucket !== "HAVENT_TRIED");
  const categoryScores = new Map<string, number>();
  for (const flavor of tried) {
    categoryScores.set(flavor.category, (categoryScores.get(flavor.category) ?? 0) + 1);
  }

  return {
    flavors,
    categories,
    stats: {
      total: flavors.length,
      tried: tried.length,
      completion: flavors.length ? (tried.length / flavors.length) * 100 : 0,
      favoriteCategory: [...categoryScores.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? "Unranked",
      favorites: flavors.filter((flavor) => flavor.isFavorite).length
    }
  };
}

export function getStaticFlavorBySlug(slug: string) {
  return getStaticFlavors().find((flavor) => flavor.slug === slug) ?? null;
}

export function getStaticFlavorSlugs() {
  return flavorSeeds.map((flavor) => flavor.slug);
}
