"use client";
import React from "react";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "./ui/sidebar";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import Link from "next/link";
import { useTranslations } from "next-intl";

type SidebarContentProps = {
  label: string;
  addBadge?: boolean;
  pathSegment: string;
  items: {
    id: string;
    title: string;
    url: string;
    icon: React.ComponentType;
  }[];
};
export const SidebarContentItems = ({
  label,
  items,
  pathSegment,
  addBadge = false,
}: SidebarContentProps) => {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>{label}</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem
              key={item.title}
              className={`
            ${
              pathSegment === item.id
                ? "bg-accent/50 text-primary font-semibold"
                : ""
            }`}
            >
              <SidebarMenuButton asChild>
                <Link href={item.url}>
                  <SidebarIconTooltip
                    title={item.title}
                    IconComponent={item.icon}
                  />
                  {/* <item.icon /> */}
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};

type Props = {
  title: string;
  IconComponent: React.ComponentType;
};
export const SidebarIconTooltip = ({ title, IconComponent }: Props) => {
  const { open } = useSidebar();

  return (
    <>
      {!open ? (
        <Tooltip>
          <TooltipTrigger asChild>
            <IconComponent />
          </TooltipTrigger>
          <TooltipContent side="left">
            <span>{title}</span>
          </TooltipContent>
        </Tooltip>
      ) : (
        <IconComponent />
      )}
    </>
  );
};

export const GreetingHeader = ({ name }: { name: string }) => {
  const { open } = useSidebar();
  const t = useTranslations("Sidebar");
  return (
    open && (
      <SidebarHeader>
        <div className="flex gap-3 mt-2 text-xl font-medium">
          <p>{t("welcome")}</p>
          <span className="text-primary font-semibold">{name}</span>
        </div>
      </SidebarHeader>
    )
  );
};
export default SidebarIconTooltip;
