import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/layout/page-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";

const proFeatures = [
  "Unlimited AI requests",
  "SOP PDF export",
  "Priority processing",
];

export default async function BillingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("plan, status")
    .eq("user_id", user!.id)
    .maybeSingle();

  const plan = subscription?.plan ?? "free";
  const isPro = plan === "pro";

  return (
    <>
      <PageHeader
        title="Billing"
        description="Manage your subscription and plan."
      />

      <div className="grid max-w-4xl gap-6 lg:grid-cols-2">
        <Card className={!isPro ? "border-primary ring-1 ring-primary/20" : ""}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Free</CardTitle>
              {plan === "free" && <Badge>Current</Badge>}
            </div>
            <CardDescription>$0 / month</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p className="flex items-center gap-2">
              <Check className="h-4 w-4 text-primary" />
              10 AI requests per day
            </p>
            <p className="flex items-center gap-2">
              <Check className="h-4 w-4 text-primary" />
              All 3 tools
            </p>
          </CardContent>
        </Card>

        <Card className={isPro ? "border-primary ring-1 ring-primary/20" : ""}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Pro</CardTitle>
              {isPro && <Badge>Current</Badge>}
            </div>
            <CardDescription>$19 / month</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-2 text-sm">
              {proFeatures.map((feature) => (
                <li key={feature} className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  {feature}
                </li>
              ))}
            </ul>
            {isPro ? (
              <p className="text-sm text-muted-foreground">
                Stripe customer portal — Phase 4
              </p>
            ) : (
              <Button className="w-full" disabled>
                Upgrade to Pro — Phase 4
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
