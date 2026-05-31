import {
  LayoutDashboard,
  Mail,
  FileText,
  Table2,
  Settings,
  CreditCard,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  title: string;
  href: string;
  icon: LucideIcon;
  description?: string;
};

export const mainNav: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    description: "Overview and usage",
  },
  {
    title: "Email Writer",
    href: "/tools/email",
    icon: Mail,
    description: "Professional emails",
  },
  {
    title: "SOP Generator",
    href: "/tools/sop",
    icon: FileText,
    description: "Standard procedures",
  },
  {
    title: "Excel Formula",
    href: "/tools/excel",
    icon: Table2,
    description: "Formula assistant",
  },
];

export const accountNav: NavItem[] = [
  {
    title: "Account Settings",
    href: "/settings",
    icon: Settings,
  },
  {
    title: "Billing",
    href: "/billing",
    icon: CreditCard,
  },
];
