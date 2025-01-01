import { IconType } from "@/components/ui/Icon";

export interface NavItem {
  name: string;
  icon: IconType;
  href: string;
}

export interface NavProps {
  items: NavItem[];
}

export const NAV_ITEMS: NavItem[] = [
  { name: "Home", icon: "home", href: "/" },
  { name: "Explore", icon: "layers", href: "/explore" },
  { name: "Convert", icon: "arrowLeftRight", href: "/convert" },
  { name: "Stats", icon: "stats", href: "/stats" },
];
