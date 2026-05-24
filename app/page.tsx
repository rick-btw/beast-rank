import { getStaticBoardData } from "@/lib/static-board";
import RankingExperience from "@/components/ranking/RankingExperience";

export const dynamic = "force-static";

export default function HomePage() {
  const board = getStaticBoardData();

  return <RankingExperience initialBoard={board} isAdmin={false} />;
}
