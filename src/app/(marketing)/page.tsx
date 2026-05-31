import Link from "next/link";
import { Mail, FileText, Table2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const features = [
  {
    icon: Mail,
    title: "Email Writer",
    description:
      "Professional emails with subject lines and tone control.",
  },
  {
    icon: FileText,
    title: "SOP Generator",
    description:
      "Structured procedures with scope, steps, and approvals.",
  },
  {
    icon: Table2,
    title: "Excel Formula",
    description: "Plain-English descriptions to working formulas.",
  },
];

export default function LandingPage() {
  return (
    <>
      <section className="mx-auto max-w-6xl px-4 py-20 text-center sm:px-6 sm:py-28">
        <Badge variant="secondary" className="mb-4">
          AI for office teams
        </Badge>
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          Finish office work faster with{" "}
          <span className="text-primary">OfficeMate AI</span>
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
          Emails, SOPs, and Excel formulas — generated in seconds for admins,
          operations, HR, and coordinators.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button asChild size="lg">
            <Link href="/login">Start free</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="#features">See features</Link>
          </Button>
        </div>
        <p className="mt-4 text-sm text-muted-foreground">
          Free plan: 10 AI requests per day. No credit card required.
        </p>
      </section>

      <section id="features" className="border-t bg-muted/40 py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="text-center text-3xl font-semibold">
            Three tools. One workspace.
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-center text-muted-foreground">
            MVP tools built for real office workflows.
          </p>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {features.map((feature) => (
              <Card key={feature.title}>
                <CardHeader>
                  <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <feature.icon className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild variant="secondary" className="w-full">
                    <Link href="/login">Try after sign in</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <h2 className="text-center text-3xl font-semibold">Simple pricing</h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Free</CardTitle>
                <CardDescription>$0 / month</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <p className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  10 AI requests / day
                </p>
                <p className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  All 3 tools
                </p>
              </CardContent>
            </Card>
            <Card className="border-primary ring-1 ring-primary/20">
              <CardHeader>
                <CardTitle>Pro</CardTitle>
                <CardDescription>$19 / month</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  Unlimited requests
                </p>
                <p className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  SOP PDF export
                </p>
                <Button asChild className="mt-4 w-full">
                  <Link href="/login">Upgrade after signup</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </>
  );
}
