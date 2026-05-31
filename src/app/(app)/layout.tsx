import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { DashboardHeader } from "@/components/layout/dashboard-header";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const [{ data: profile }, { data: subscription }] = await Promise.all([
    supabase
      .from("profiles")
      .select("full_name, email")
      .eq("id", user.id)
      .maybeSingle(),
    supabase
      .from("subscriptions")
      .select("plan")
      .eq("user_id", user.id)
      .maybeSingle(),
  ]);

  const plan = subscription?.plan ?? "free";

  return (
    <div className="flex min-h-full flex-1 bg-muted/30">
      <div className="hidden lg:flex lg:shrink-0">
        <AppSidebar plan={plan} />
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <DashboardHeader
          email={profile?.email ?? user.email ?? ""}
          fullName={profile?.full_name}
          plan={plan}
        />
        <main className="flex-1 p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
