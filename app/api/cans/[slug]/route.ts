import { NextResponse } from "next/server";
import { getFlavorBySlug } from "@/lib/queries";

type Params = {
  params: Promise<{ slug: string }>;
};

function escapeXml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function splitName(name: string) {
  const parts = name.replace(/^Monster\s+/i, "").split(" ");
  const lines: string[] = [];
  let current = "";

  for (const part of parts) {
    if (`${current} ${part}`.trim().length > 17 && current) {
      lines.push(current);
      current = part;
    } else {
      current = `${current} ${part}`.trim();
    }
  }

  if (current) lines.push(current);
  return lines.slice(0, 4);
}

export async function GET(_request: Request, { params }: Params) {
  const { slug } = await params;
  const flavor = await getFlavorBySlug(slug);

  if (!flavor) {
    return new NextResponse("Not found", { status: 404 });
  }

  const accent = flavor.accentColor || "#69ff72";
  const lines = splitName(flavor.name);
  const label = lines
    .map(
      (line, index) =>
        `<text x="128" y="${176 + index * 30}" text-anchor="middle" class="name">${escapeXml(
          line.toUpperCase()
        )}</text>`
    )
    .join("");

  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="256" height="512" viewBox="0 0 256 512" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="can" x1="36" x2="220" y1="0" y2="512" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#151a20"/>
      <stop offset=".22" stop-color="${accent}"/>
      <stop offset=".35" stop-color="#0b0f14"/>
      <stop offset=".72" stop-color="#111923"/>
      <stop offset="1" stop-color="${accent}"/>
    </linearGradient>
    <linearGradient id="shine" x1="82" x2="120" y1="24" y2="488" gradientUnits="userSpaceOnUse">
      <stop stop-color="#ffffff" stop-opacity=".48"/>
      <stop offset=".45" stop-color="#ffffff" stop-opacity=".04"/>
      <stop offset="1" stop-color="#ffffff" stop-opacity=".16"/>
    </linearGradient>
    <filter id="glow" x="-45%" y="-25%" width="190%" height="150%">
      <feGaussianBlur stdDeviation="10" result="blur"/>
      <feColorMatrix in="blur" type="matrix" values="0 0 0 0 0.4 0 0 0 0 1 0 0 0 0 0.45 0 0 0 .7 0"/>
      <feBlend in="SourceGraphic"/>
    </filter>
    <style>
      .brand{font:900 34px system-ui,sans-serif;letter-spacing:3px;fill:#ffffff}
      .mark{font:900 96px system-ui,sans-serif;letter-spacing:-2px;fill:${accent}}
      .name{font:800 20px system-ui,sans-serif;letter-spacing:1px;fill:#ffffff}
      .meta{font:800 13px system-ui,sans-serif;letter-spacing:2px;fill:#0b1118}
    </style>
  </defs>
  <rect x="45" y="10" width="166" height="492" rx="42" fill="#05070b"/>
  <rect x="51" y="18" width="154" height="476" rx="36" fill="url(#can)" stroke="rgba(255,255,255,.38)" stroke-width="2"/>
  <path d="M82 32c-18 126-19 274 1 446" stroke="url(#shine)" stroke-width="16" stroke-linecap="round" opacity=".5"/>
  <path d="M69 64h118M65 448h126" stroke="#ffffff" stroke-opacity=".16" stroke-width="3"/>
  <g filter="url(#glow)">
    <text x="128" y="111" text-anchor="middle" class="brand">BEAST</text>
    <text x="128" y="154" text-anchor="middle" class="mark">M</text>
  </g>
  ${label}
  <rect x="73" y="365" width="110" height="32" rx="5" fill="${accent}"/>
  <text x="128" y="386" text-anchor="middle" class="meta">${escapeXml(flavor.category.toUpperCase())}</text>
  <path d="M80 424h96" stroke="#fff" stroke-opacity=".3" stroke-width="2"/>
  <text x="128" y="450" text-anchor="middle" class="name" style="font-size:14px">${escapeXml(
    flavor.status.toUpperCase()
  )}</text>
</svg>`;

  return new NextResponse(svg, {
    headers: {
      "Content-Type": "image/svg+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600"
    }
  });
}
