import { PrismaClient } from "@prisma/client";
import { flavorSeeds } from "../data/flavors";

const prisma = new PrismaClient();

const bucketFallback = "HAVENT_TRIED";

async function main() {
  const counters = new Map<string, number>();

  for (const flavor of flavorSeeds) {
    const bucket = flavor.initialBucket ?? bucketFallback;
    const nextPosition = counters.get(bucket) ?? 0;
    counters.set(bucket, nextPosition + 1);

    const record = await prisma.flavor.upsert({
      where: { slug: flavor.slug },
      update: {
        name: flavor.name,
        category: flavor.category,
        description: flavor.description,
        flavorProfile: flavor.flavorProfile,
        imageUrl: flavor.imageUrl ?? `/api/cans/${flavor.slug}`,
        sourceUrl: flavor.sourceUrl,
        status: flavor.status ?? "current",
        accentColor: flavor.accentColor ?? "#69ff72",
        caffeineMg: flavor.caffeineMg,
        calories: flavor.calories,
        sugarG: flavor.sugarG,
        introducedYear: flavor.introducedYear,
        isRecent: flavor.isRecent ?? false
      },
      create: {
        slug: flavor.slug,
        name: flavor.name,
        category: flavor.category,
        description: flavor.description,
        flavorProfile: flavor.flavorProfile,
        imageUrl: flavor.imageUrl ?? `/api/cans/${flavor.slug}`,
        sourceUrl: flavor.sourceUrl,
        status: flavor.status ?? "current",
        accentColor: flavor.accentColor ?? "#69ff72",
        caffeineMg: flavor.caffeineMg,
        calories: flavor.calories,
        sugarG: flavor.sugarG,
        introducedYear: flavor.introducedYear,
        isRecent: flavor.isRecent ?? false
      }
    });

    await prisma.rankingEntry.upsert({
      where: { flavorId: record.id },
      update: {},
      create: {
        flavorId: record.id,
        bucket,
        position: flavor.initialPosition ?? nextPosition,
        isFavorite: flavor.isFavorite ?? false
      }
    });
  }

  console.log(`Seeded ${flavorSeeds.length} Monster flavors.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
