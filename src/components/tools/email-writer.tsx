"use client";

import { useState } from "react";
import { Loader2, Plus, Sparkles, X } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CopyButton } from "@/components/tools/copy-button";
import { UsageLimitAlert } from "@/components/tools/usage-limit-alert";
import type { EmailTone, EmailWriterOutput } from "@/types/ai";

const TONES: { value: EmailTone; label: string }[] = [
  { value: "professional", label: "Professional" },
  { value: "friendly", label: "Friendly" },
  { value: "firm", label: "Firm" },
  { value: "apologetic", label: "Apologetic" },
  { value: "persuasive", label: "Persuasive" },
];

function formatEmail(subject: string, body: string) {
  return `Subject: ${subject}\n\n${body}`;
}

export function EmailWriter() {
  const [recipient, setRecipient] = useState("");
  const [purpose, setPurpose] = useState("");
  const [tone, setTone] = useState<EmailTone>("professional");
  const [keyPoints, setKeyPoints] = useState([""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<EmailWriterOutput | null>(null);

  function updateKeyPoint(i: number, value: string) {
    setKeyPoints((prev) => prev.map((p, idx) => (idx === i ? value : p)));
  }

  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    setResult(null);

    const points = keyPoints.map((p) => p.trim()).filter(Boolean);
    try {
      const res = await fetch("/api/ai/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipient: recipient.trim(),
          purpose: purpose.trim(),
          tone,
          keyPoints: points,
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

  const versions = result
    ? [
        { id: "primary", subject: result.subject, body: result.body },
        {
          id: "alt1",
          subject: result.alternatives[0]?.subject ?? "",
          body: result.alternatives[0]?.body ?? "",
        },
        {
          id: "alt2",
          subject: result.alternatives[1]?.subject ?? "",
          body: result.alternatives[1]?.body ?? "",
        },
      ]
    : [];

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Sparkles className="h-5 w-5 text-primary" />
            Email details
          </CardTitle>
          <CardDescription>
            Describe who you are writing to and what you need to say.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleGenerate} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="recipient">Recipient</Label>
              <Input
                id="recipient"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder="Finance Manager, ABC Corp"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="purpose">Purpose</Label>
              <Textarea
                id="purpose"
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                placeholder="Request approval for Q2 travel budget"
                rows={4}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Tone</Label>
              <Select value={tone} onValueChange={(v) => setTone(v as EmailTone)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TONES.map((t) => (
                    <SelectItem key={t.value} value={t.value}>
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Key points</Label>
              {keyPoints.map((point, i) => (
                <div key={i} className="flex gap-2">
                  <Input
                    value={point}
                    onChange={(e) => updateKeyPoint(i, e.target.value)}
                    placeholder={`Key point ${i + 1}`}
                  />
                  {keyPoints.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        setKeyPoints((p) => p.filter((_, idx) => idx !== i))
                      }
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              {keyPoints.length < 10 && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setKeyPoints((p) => [...p, ""])}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add key point
                </Button>
              )}
            </div>
            {error && <UsageLimitAlert message={error} />}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating…
                </>
              ) : (
                "Generate email"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="lg:sticky lg:top-24 lg:self-start">
        <CardHeader>
          <CardTitle className="text-lg">Generated email</CardTitle>
          <CardDescription>Copy subject, body, or the full message.</CardDescription>
        </CardHeader>
        <CardContent>
          {!result && !loading && (
            <p className="py-12 text-center text-sm text-muted-foreground">
              Your email will appear here.
            </p>
          )}
          {loading && (
            <div className="flex flex-col items-center py-12 text-muted-foreground">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="mt-2 text-sm">Writing your email…</p>
            </div>
          )}
          {result && (
            <Tabs defaultValue="primary">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="primary">Primary</TabsTrigger>
                <TabsTrigger value="alt1">Alt 1</TabsTrigger>
                <TabsTrigger value="alt2">Alt 2</TabsTrigger>
              </TabsList>
              {versions.map((v) => (
                <TabsContent key={v.id} value={v.id} className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-muted-foreground">Subject</Label>
                    <CopyButton text={v.subject} label="Copy subject" />
                  </div>
                  <p className="rounded-md border bg-muted/50 p-3 text-sm font-medium">
                    {v.subject}
                  </p>
                  <div className="flex items-center justify-between">
                    <Label className="text-muted-foreground">Body</Label>
                    <CopyButton
                      text={formatEmail(v.subject, v.body)}
                      label="Copy all"
                    />
                  </div>
                  <pre className="whitespace-pre-wrap rounded-md border bg-muted/50 p-4 text-sm leading-relaxed">
                    {v.body}
                  </pre>
                </TabsContent>
              ))}
              <Button
                type="button"
                variant="outline"
                className="mt-4 w-full"
                disabled={loading}
                onClick={() =>
                  document.querySelector<HTMLFormElement>("form")?.requestSubmit()
                }
              >
                Regenerate
              </Button>
            </Tabs>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
