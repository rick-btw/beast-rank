import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { flavorSeeds } from "../data/flavors";
import { createCanSvg } from "../lib/can-svg";

const outputDir = join(process.cwd(), "public", "cans", "generated");

async function main() {
  await mkdir(outputDir, { recursive: true });

  await Promise.all(
    flavorSeeds.map((flavor) =>
      writeFile(
        join(outputDir, `${flavor.slug}.svg`),
        createCanSvg({
          name: flavor.name,
          category: flavor.category,
          status: flavor.status ?? "current",
          accentColor: flavor.accentColor ?? "#69ff72"
        })
      )
    )
  );

  console.log(`Generated ${flavorSeeds.length} static can fallbacks.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
