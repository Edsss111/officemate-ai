"use client";

import { useState } from "react";
import { Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CopyButton } from "@/components/tools/copy-button";
import { UsageLimitAlert } from "@/components/tools/usage-limit-alert";
import type { SopGeneratorOutput } from "@/types/ai";

function formatSop(result: SopGeneratorOutput): string {
  const lines = [
    "STANDARD OPERATING PROCEDURE",
    "",
    "OBJECTIVE",
    result.objective,
    "",
    "SCOPE",
    result.scope,
    "",
    "RESPONSIBILITIES",
    ...result.responsibilities.map((r) => `• ${r}`),
    "",
    "PROCEDURE",
    ...result.procedure.map((step, i) => `${i + 1}. ${step}`),
    "",
    "APPROVAL",
    result.approvalBlock,
  ];
  return lines.join("\n");
}

export function SopGeneratorTool() {
  const [department, setDepartment] = useState("");
  const [processName, setProcessName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<SopGeneratorOutput | null>(null);

  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/ai/sop", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          department: department.trim(),
          processName: processName.trim(),
          description: description.trim(),
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(
          res.status === 429
            ? `Daily limit reached (${json.used}/${json.limit}).`
            : (json.error ?? "Something went wrong.")
        );
        return;
      }
      setResult(json.data);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Sparkles className="h-5 w-5 text-primary" />
            SOP details
          </CardTitle>
          <CardDescription>
            Describe the process you need documented.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleGenerate} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Input
                id="department"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                placeholder="Operations"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="processName">Process name</Label>
              <Input
                id="processName"
                value={processName}
                onChange={(e) => setProcessName(e.target.value)}
                placeholder="Invoice approval"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Process description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Steps, roles, tools, and rules for this process…"
                rows={6}
                required
              />
            </div>
            {error && <UsageLimitAlert message={error} />}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating…
                </>
              ) : (
                "Generate SOP"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="lg:sticky lg:top-24 lg:self-start">
        <CardHeader>
          <div className="flex items-start justify-between gap-2">
            <div>
              <CardTitle className="text-lg">Generated SOP</CardTitle>
              <CardDescription>
                Objective, scope, steps, and approval block.
              </CardDescription>
            </div>
            {result && (
              <CopyButton text={formatSop(result)} label="Copy SOP" />
            )}
          </div>
        </CardHeader>
        <CardContent>
          {!result && !loading && (
            <p className="py-12 text-center text-sm text-muted-foreground">
              Your SOP will appear here.
            </p>
          )}
          {loading && (
            <div className="flex flex-col items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="mt-2 text-sm text-muted-foreground">Writing SOP…</p>
            </div>
          )}
          {result && (
            <div className="max-h-[70vh] space-y-6 overflow-y-auto text-sm">
              <section>
                <h3 className="font-semibold uppercase tracking-wide text-muted-foreground">
                  Objective
                </h3>
                <p className="mt-2 leading-relaxed">{result.objective}</p>
              </section>
              <section>
                <h3 className="font-semibold uppercase tracking-wide text-muted-foreground">
                  Scope
                </h3>
                <p className="mt-2 leading-relaxed">{result.scope}</p>
              </section>
              <section>
                <h3 className="font-semibold uppercase tracking-wide text-muted-foreground">
                  Responsibilities
                </h3>
                <ul className="mt-2 list-disc space-y-1 pl-5">
                  {result.responsibilities.map((r) => (
                    <li key={r}>{r}</li>
                  ))}
                </ul>
              </section>
              <section>
                <h3 className="font-semibold uppercase tracking-wide text-muted-foreground">
                  Procedure
                </h3>
                <ol className="mt-2 list-decimal space-y-2 pl-5">
                  {result.procedure.map((step) => (
                    <li key={step}>{step}</li>
                  ))}
                </ol>
              </section>
              <section>
                <h3 className="font-semibold uppercase tracking-wide text-muted-foreground">
                  Approval
                </h3>
                <pre className="mt-2 whitespace-pre-wrap rounded-md border bg-muted/50 p-3 leading-relaxed">
                  {result.approvalBlock}
                </pre>
              </section>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() =>
                  document
                    .querySelector<HTMLFormElement>("form")
                    ?.requestSubmit()
                }
              >
                Regenerate
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
