import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/session";
import AdminLogin from "@/components/AdminLogin";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const session = await getAdminSession();
  if (session) redirect("/");

  return <AdminLogin />;
}
