import {
  Bell,
  Briefcase,
  Calendar,
  Headphones,
  Home,
  Inbox,
  Info,
  LayoutDashboard,
  MessageCircleDashed,
  MessageSquare,
  Phone,
  Search,
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
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useTranslations } from "next-intl";
// Menu items.

export function AppSidebar() {
  const t = useTranslations("Sidebar");
  const mainMenuItems = [
    {
      title: t("home"),
      url: "/",
      icon: Home,
    },
    {
      title: t("findWorkers"),
      url: "/find-workers",
      icon: Users,
    },
    {
      title: t("addWork"),
      url: "#",
      icon: Wrench,
    },
    {
      title: t("myWorks"),
      url: "#",
      icon: Briefcase,
    },
    {
      title: t("dashboard"),
      url: "#",
      icon: LayoutDashboard,
    },
  ];

  const generalItems = [
    {
      title: t("inbox"),
      url: "#",
      icon: Inbox,
    },
    {
      title: t("notifications"),
      url: "#",
      icon: Bell,
    },
    {
      title: t("chats"),
      url: "#",
      icon: MessageSquare,
    },
  ];

  const informationItems = [
    {
      title: t("aboutUs"),
      url: "#",
      icon: Info,
    },
    {
      title: t("contactUs"),
      url: "#",
      icon: Phone,
    },
    {
      title: t("support"),
      url: "#",
      icon: Headphones,
    },
    {
      title: t("feedback"),
      url: "#",
      icon: MessageCircleDashed,
    },
  ];
  return (
    <Sidebar side="right" collapsible="icon">
      <SidebarContent className="mt-16">
        <SidebarContentItems label={t("mainMenu")} items={mainMenuItems} />
        <SidebarContentItems
          label={t("general")}
          items={generalItems}
          addBadge
        />
        <SidebarContentItems
          label={t("information")}
          items={informationItems}
        />
      </SidebarContent>
      <SidebarFooter>Footer</SidebarFooter>
    </Sidebar>
  );
}

type Props = {
  label: string;
  addBadge?: boolean;
  items: { title: string; url: string; icon: React.ComponentType }[];
};
const SidebarContentItems = ({ label, items, addBadge = false }: Props) => {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>{label}</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild>
                <a href={item.url}>
                  <item.icon />
                  <span>{item.title}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};
