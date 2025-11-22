"use client";
import {
  Bell,
  Briefcase,
  Headphones,
  Home,
  Inbox,
  Info,
  LayoutDashboard,
  LogOut,
  MessageCircleDashed,
  MessageSquare,
  Phone,
  Settings,
  Users,
  Wrench,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useTranslations } from "next-intl";
import Link from "next/link";
import SidebarIconTooltip, {
  GreetingHeader,
  SidebarContentItems,
  SidebarFooterItems,
} from "./SidebarHelpers";
import { SignedIn } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
// Menu items.

export function AppSidebar() {
  const t = useTranslations("Sidebar");
  const { isMobile } = useSidebar();
  const pathname = usePathname();
  const [activeLink, setActiveLink] = useState<string>(pathname || "/");
  useEffect(() => {
    const wantedSegment = pathname.split("/")[2];
    setActiveLink(wantedSegment === undefined ? "/" : wantedSegment);
  }, [pathname]);
  const mainMenuItems = [
    {
      id: "/",
      title: t("home"),
      href: "/",
      icon: Home,
    },
    {
      id: "findWorkers",
      title: t("findWorkers"),
      href: "/findWorkers",
      icon: Users,
    },
    {
      id: "addWork",
      title: t("addWork"),
      href: "/addWork",
      icon: Wrench,
    },
    {
      id: "myWorks",
      title: t("myWorks"),
      href: "#",
      icon: Briefcase,
    },
    {
      id: "dashboard",
      title: t("dashboard"),
      href: "#",
      icon: LayoutDashboard,
    },
  ];

  const generalItems = [
    {
      id: "inbox",
      title: t("inbox"),
      href: "#",
      icon: Inbox,
    },
    {
      id: "notifications",
      title: t("notifications"),
      href: "#",
      icon: Bell,
    },
    {
      id: "chats",
      title: t("chats"),
      href: "/chat",
      icon: MessageSquare,
    },
  ];

  const informationItems = [
    {
      id: "aboutUs",
      title: t("aboutUs"),
      href: "#",
      icon: Info,
    },
    {
      id: "contactUs",
      title: t("contactUs"),
      href: "#",
      icon: Phone,
    },
    {
      id: "support",
      title: t("support"),
      href: "#",
      icon: Headphones,
    },
    {
      id: "feedback",
      title: t("feedback"),
      href: "#",
      icon: MessageCircleDashed,
    },
  ];
  const footerItems = [
    {
      id: "settings",
      title: t("settings"),
      href: "/settings",
      icon: Settings,
    },
    {
      id: "logout",
      title: t("logout"),
      href: "#",
      icon: LogOut,
    },
  ];
  return (
    <Sidebar side="right">
      {/* collapsible={isMobile ? "none" : "icon"} */}
      <SignedIn>
        <GreetingHeader name="Tarek" />
      </SignedIn>
      <SidebarContent className="mt-16">
        <SidebarContentItems
          label={t("mainMenu")}
          items={mainMenuItems}
          pathSegment={activeLink}
        />
        <SidebarContentItems
          label={t("general")}
          items={generalItems}
          pathSegment={activeLink}
          addBadge
        />
        <SidebarContentItems
          label={t("information")}
          pathSegment={activeLink}
          items={informationItems}
        />
      </SidebarContent>
      <SidebarFooter>
        <SidebarFooterItems
          label={t("personal")}
          pathSegment={activeLink}
          items={footerItems}
        />
      </SidebarFooter>
    </Sidebar>
  );
}
