"use client";
import {
  Bell,
  Briefcase,
  Headphones,
  Home,
  Inbox,
  Info,
  LayoutDashboard,
  MessageCircleDashed,
  MessageSquare,
  Phone,
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
} from "./SidebarIconTooltip";
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
      url: "/",
      icon: Home,
    },
    {
      id: "findWorkers",
      title: t("findWorkers"),
      url: "/findWorkers",
      icon: Users,
    },
    {
      id: "addWork",
      title: t("addWork"),
      url: "#",
      icon: Wrench,
    },
    {
      id: "myWorks",
      title: t("myWorks"),
      url: "#",
      icon: Briefcase,
    },
    {
      id: "dashboard",
      title: t("dashboard"),
      url: "#",
      icon: LayoutDashboard,
    },
  ];

  const generalItems = [
    {
      id: "inbox",
      title: t("inbox"),
      url: "#",
      icon: Inbox,
    },
    {
      id: "notifications",
      title: t("notifications"),
      url: "#",
      icon: Bell,
    },
    {
      id: "chats",
      title: t("chats"),
      url: "#",
      icon: MessageSquare,
    },
  ];

  const informationItems = [
    {
      id: "aboutUs",
      title: t("aboutUs"),
      url: "#",
      icon: Info,
    },
    {
      id: "contactUs",
      title: t("contactUs"),
      url: "#",
      icon: Phone,
    },
    {
      id: "support",
      title: t("support"),
      url: "#",
      icon: Headphones,
    },
    {
      id: "feedback",
      title: t("feedback"),
      url: "#",
      icon: MessageCircleDashed,
    },
  ];
  return (
    <Sidebar side="right" collapsible={isMobile ? "none" : "icon"}>
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
      <SidebarFooter>Footer</SidebarFooter>
    </Sidebar>
  );
}
