import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { RANK_BUCKETS } from "@/lib/constants";
import { getAdminSession } from "@/lib/session";

const updateSchema = z.object({
  items: z.array(
    z.object({
      flavorId: z.string().min(1),
      bucket: z.enum(RANK_BUCKETS),
      position: z.number().int().min(0),
      isFavorite: z.boolean().optional()
    })
  )
});

export async function POST(request: Request) {
  const session = await getAdminSession();

  if (!session) {
    return NextResponse.json({ message: "Admin access required." }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const parsed = updateSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ message: "Invalid ranking payload." }, { status: 400 });
  }

  await prisma.$transaction(
    parsed.data.items.map((item) =>
      prisma.rankingEntry.update({
        where: { flavorId: item.flavorId },
        data: {
          bucket: item.bucket,
          position: item.position,
          ...(typeof item.isFavorite === "boolean" ? { isFavorite: item.isFavorite } : {})
        }
      })
    )
  );

  return NextResponse.json({ ok: true, savedAt: new Date().toISOString() });
}
