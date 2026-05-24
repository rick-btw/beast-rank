import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://beastrank.local"),
  title: {
    default: "BEAST//RANK - Monster Energy Flavor Rankings",
    template: "%s | BEAST//RANK"
  },
  description:
    "A premium Monster Energy flavor ranking board with admin-only editing, tier lists, flavor search, and a researched flavor archive.",
  openGraph: {
    title: "BEAST//RANK",
    description: "Monster Energy flavor rankings from best to worst.",
    type: "website"
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
