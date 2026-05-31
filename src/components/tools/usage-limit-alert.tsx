import Link from "next/link";

export function UsageLimitAlert({ message }: { message: string }) {
  return (
    <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
      {message}
      {message.includes("limit") && (
        <>
          {" "}
          <Link href="/billing" className="font-medium underline">
            Upgrade to Pro
          </Link>
        </>
      )}
    </div>
  );
}
