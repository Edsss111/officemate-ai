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
import type { ExcelFormulaOutput } from "@/types/ai";

export function ExcelFormulaTool() {
  const [description, setDescription] = useState("");
  const [columnContext, setColumnContext] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ExcelFormulaOutput | null>(null);

  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/ai/excel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          description: description.trim(),
          columnContext: columnContext.trim() || undefined,
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
            Formula request
          </CardTitle>
          <CardDescription>
            Describe what you want in plain English.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleGenerate} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="description">What do you need?</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Count all approved transactions in column D"
                rows={4}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="context">Column / sheet context (optional)</Label>
              <Input
                id="context"
                value={columnContext}
                onChange={(e) => setColumnContext(e.target.value)}
                placeholder="Column D is Status, rows 2-500"
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
                "Generate formula"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="lg:sticky lg:top-24 lg:self-start">
        <CardHeader>
          <CardTitle className="text-lg">Result</CardTitle>
          <CardDescription>Formula, explanation, and example usage.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!result && !loading && (
            <p className="py-12 text-center text-sm text-muted-foreground">
              Your formula will appear here.
            </p>
          )}
          {loading && (
            <div className="flex flex-col items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="mt-2 text-sm text-muted-foreground">Building formula…</p>
            </div>
          )}
          {result && (
            <>
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <Label>Formula</Label>
                  <CopyButton text={result.formula} label="Copy formula" />
                </div>
                <code className="block rounded-md border bg-muted/50 p-3 text-sm">
                  {result.formula}
                </code>
              </div>
              <div>
                <Label className="text-muted-foreground">Explanation</Label>
                <p className="mt-2 text-sm leading-relaxed">{result.explanation}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Alternative</Label>
                <p className="mt-2 text-sm leading-relaxed">{result.alternative}</p>
              </div>
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <Label>Example</Label>
                  <CopyButton
                    text={`${result.formula}\n\n${result.example}`}
                    label="Copy all"
                    variant="secondary"
                  />
                </div>
                <p className="text-sm leading-relaxed">{result.example}</p>
              </div>
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
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
