import { getAdminSession } from "@/lib/session";
import { getBoardData } from "@/lib/queries";
import RankingExperience from "@/components/ranking/RankingExperience";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [board, session] = await Promise.all([getBoardData(), getAdminSession()]);

  return <RankingExperience initialBoard={board} isAdmin={Boolean(session)} />;
}
