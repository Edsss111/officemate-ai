"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { mainNav, accountNav } from "@/config/navigation";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

type AppSidebarProps = {
  plan?: string;
  className?: string;
  onNavigate?: () => void;
};

export function AppSidebar({
  plan = "free",
  className,
  onNavigate,
}: AppSidebarProps) {
  const pathname = usePathname();

  const linkClass = (href: string) =>
    cn(
      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
      pathname === href || pathname.startsWith(`${href}/`)
        ? "bg-primary text-primary-foreground"
        : "text-muted-foreground hover:bg-muted hover:text-foreground"
    );

  return (
    <aside
      className={cn(
        "flex h-full w-64 flex-col border-r bg-background",
        className
      )}
    >
      <div className="flex h-16 items-center gap-2 border-b px-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">
          OM
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate font-semibold">OfficeMate AI</p>
          <Badge variant="secondary" className="mt-0.5 text-[10px] uppercase">
            {plan}
          </Badge>
        </div>
      </div>

      <nav className="flex-1 space-y-6 overflow-y-auto p-4">
        <div>
          <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Tools
          </p>
          <ul className="space-y-1">
            {mainNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={linkClass(item.href)}
                  onClick={onNavigate}
                >
                  <item.icon className="h-4 w-4 shrink-0" />
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <Separator />

        <div>
          <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Account
          </p>
          <ul className="space-y-1">
            {accountNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={linkClass(item.href)}
                  onClick={onNavigate}
                >
                  <item.icon className="h-4 w-4 shrink-0" />
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </aside>
  );
}
