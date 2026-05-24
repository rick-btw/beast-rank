import { NextResponse } from "next/server";
import { z } from "zod";
import { createAdminSession, verifyAdminPassword } from "@/lib/session";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = loginSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ message: "Invalid credentials." }, { status: 400 });
  }

  const ok = await verifyAdminPassword(parsed.data.email, parsed.data.password);
  if (!ok) {
    return NextResponse.json({ message: "Invalid credentials." }, { status: 401 });
  }

  await createAdminSession(parsed.data.email);
  return NextResponse.json({ ok: true });
}
