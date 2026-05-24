import "server-only";

import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { AUTH_COOKIE } from "./constants";

type SessionPayload = {
  email: string;
  role: "admin";
  exp: number;
};

function getSecret() {
  return process.env.AUTH_SECRET ?? "dev-only-change-me";
}

function base64url(input: string | Buffer) {
  return Buffer.from(input).toString("base64url");
}

function sign(value: string) {
  return createHmac("sha256", getSecret()).update(value).digest("base64url");
}

function safeEqual(a: string, b: string) {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  return left.length === right.length && timingSafeEqual(left, right);
}

export async function createAdminSession(email: string) {
  const payload: SessionPayload = {
    email,
    role: "admin",
    exp: Date.now() + 1000 * 60 * 60 * 24 * 14
  };
  const body = base64url(JSON.stringify(payload));
  const token = `${body}.${sign(body)}`;
  const cookieStore = await cookies();

  cookieStore.set(AUTH_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 14
  });
}

export async function clearAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete(AUTH_COOKIE);
}

export async function getAdminSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE)?.value;

  if (!token) return null;

  const [body, signature] = token.split(".");
  if (!body || !signature || !safeEqual(signature, sign(body))) {
    return null;
  }

  try {
    const payload = JSON.parse(Buffer.from(body, "base64url").toString("utf8")) as SessionPayload;
    if (payload.role !== "admin" || payload.exp < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

export async function verifyAdminPassword(email: string, password: string) {
  const expectedEmail = process.env.ADMIN_EMAIL ?? "admin@beastrank.local";
  if (email.toLowerCase() !== expectedEmail.toLowerCase()) return false;

  const hash = process.env.ADMIN_PASSWORD_HASH;
  if (hash) return bcrypt.compare(password, hash);

  const expectedPassword = process.env.ADMIN_PASSWORD ?? "monsteradmin";
  return safeEqual(base64url(password), base64url(expectedPassword));
}
