import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/layout/page-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export default async function SettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("email, full_name")
    .eq("id", user!.id)
    .maybeSingle();

  return (
    <>
      <PageHeader
        title="Account Settings"
        description="Manage your profile and preferences."
      />

      <div className="max-w-xl space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>Your account information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Full name</Label>
              <Input value={profile?.full_name ?? ""} disabled readOnly />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                value={profile?.email ?? user?.email ?? ""}
                disabled
                readOnly
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Profile editing will be added in a later release.
            </p>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
