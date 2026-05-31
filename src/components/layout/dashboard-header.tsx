import { signOut } from "@/app/(auth)/actions";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MobileSidebar } from "@/components/layout/mobile-sidebar";

type DashboardHeaderProps = {
  email: string;
  fullName?: string | null;
  plan?: string;
};

export function DashboardHeader({
  email,
  fullName,
  plan,
}: DashboardHeaderProps) {
  const initials =
    (fullName ?? email)
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "U";

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/80 lg:px-6">
      <div className="flex items-center gap-3">
        <MobileSidebar plan={plan} />
        <p className="font-semibold lg:hidden">OfficeMate AI</p>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden text-right sm:block">
          <p className="text-sm font-medium">{fullName ?? "Account"}</p>
          <p className="text-xs text-muted-foreground">{email}</p>
        </div>
        <Avatar className="h-9 w-9">
          <AvatarFallback className="bg-muted text-xs font-medium">
            {initials}
          </AvatarFallback>
        </Avatar>
        <form action={signOut}>
          <Button type="submit" variant="outline" size="sm">
            Sign out
          </Button>
        </form>
      </div>
    </header>
  );
}
