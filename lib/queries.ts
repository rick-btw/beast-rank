import { prisma } from "./db";
import { CATEGORY_ORDER, RANK_BUCKETS, type RankBucket } from "./constants";

export type FlavorView = {
  id: string;
  slug: string;
  name: string;
  category: string;
  description: string;
  flavorProfile: string | null;
  imageUrl: string | null;
  sourceUrl: string | null;
  status: string;
  accentColor: string;
  caffeineMg: number | null;
  calories: number | null;
  sugarG: number | null;
  introducedYear: number | null;
  isRecent: boolean;
  bucket: RankBucket;
  position: number;
  isFavorite: boolean;
};

export type BoardData = {
  flavors: FlavorView[];
  categories: { name: string; count: number }[];
  stats: {
    total: number;
    tried: number;
    completion: number;
    favoriteCategory: string;
    favorites: number;
  };
};

const validBucket = new Set<string>(RANK_BUCKETS);

function toBucket(value?: string | null): RankBucket {
  return validBucket.has(value ?? "") ? (value as RankBucket) : "HAVENT_TRIED";
}

export async function getBoardData(): Promise<BoardData> {
  const rows = await prisma.flavor.findMany({
    include: { rankingEntry: true },
    orderBy: [{ category: "asc" }, { name: "asc" }]
  });

  const flavors = rows
    .map<FlavorView>((flavor) => ({
      id: flavor.id,
      slug: flavor.slug,
      name: flavor.name,
      category: flavor.category,
      description: flavor.description,
      flavorProfile: flavor.flavorProfile,
      imageUrl: flavor.imageUrl,
      sourceUrl: flavor.sourceUrl,
      status: flavor.status,
      accentColor: flavor.accentColor,
      caffeineMg: flavor.caffeineMg,
      calories: flavor.calories,
      sugarG: flavor.sugarG,
      introducedYear: flavor.introducedYear,
      isRecent: flavor.isRecent,
      bucket: toBucket(flavor.rankingEntry?.bucket),
      position: flavor.rankingEntry?.position ?? 9999,
      isFavorite: flavor.rankingEntry?.isFavorite ?? false
    }))
    .sort((a, b) => {
      const bucketDelta = RANK_BUCKETS.indexOf(a.bucket) - RANK_BUCKETS.indexOf(b.bucket);
      if (bucketDelta !== 0) return bucketDelta;
      return a.position - b.position || a.name.localeCompare(b.name);
    });

  const categories = CATEGORY_ORDER.map((name) => ({
    name,
    count: flavors.filter((flavor) => flavor.category === name).length
  })).filter((category) => category.count > 0);

  const tried = flavors.filter((flavor) => flavor.bucket !== "HAVENT_TRIED");
  const categoryScores = new Map<string, number>();
  for (const flavor of tried) {
    categoryScores.set(flavor.category, (categoryScores.get(flavor.category) ?? 0) + 1);
  }

  const favoriteCategory =
    [...categoryScores.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? "Unranked";

  return {
    flavors,
    categories,
    stats: {
      total: flavors.length,
      tried: tried.length,
      completion: flavors.length ? (tried.length / flavors.length) * 100 : 0,
      favoriteCategory,
      favorites: flavors.filter((flavor) => flavor.isFavorite).length
    }
  };
}

export async function getFlavorBySlug(slug: string) {
  const flavor = await prisma.flavor.findUnique({
    where: { slug },
    include: { rankingEntry: true }
  });

  if (!flavor) return null;

  return {
    id: flavor.id,
    slug: flavor.slug,
    name: flavor.name,
    category: flavor.category,
    description: flavor.description,
    flavorProfile: flavor.flavorProfile,
    imageUrl: flavor.imageUrl,
    sourceUrl: flavor.sourceUrl,
    status: flavor.status,
    accentColor: flavor.accentColor,
    caffeineMg: flavor.caffeineMg,
    calories: flavor.calories,
    sugarG: flavor.sugarG,
    introducedYear: flavor.introducedYear,
    isRecent: flavor.isRecent,
    bucket: toBucket(flavor.rankingEntry?.bucket),
    position: flavor.rankingEntry?.position ?? 9999,
    isFavorite: flavor.rankingEntry?.isFavorite ?? false
  } satisfies FlavorView;
}
