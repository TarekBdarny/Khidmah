"use client";
import React from "react";
import { SidebarTrigger } from "../ui/sidebar";
import { useTranslations } from "next-intl";
import LocaleSwitcher from "../LocaleSwitcher";
import { Briefcase, Bell, MessageSquare, Search } from "lucide-react";
import AuthButtons from "../reuseable/buttons/AuthButtons";
import { Button } from "../ui/button";
import ThemeSwitcher from "../ThemeSwitcher";
import { useIsMobile } from "@/hooks/use-mobile";
const DesktopNavbar = () => {
  const t = useTranslations("Navbar");
  const isMobile = useIsMobile();
  const links = [
    {
      label: t("home"),
      href: "/",
    },
    {
      label: t("about"),
      href: "/about",
    },
    {
      label: t("findWorkers"),
      href: "/find-workers",
    },
    {
      label: t("createWork"),
      href: "/create-work",
    },
    {
      label: t("contact"),
      href: "/contact",
    },
  ];
  return (
    <header className=" border-b  sticky top-0 bg-background z-50 shadow-sm pl-3 ">
      <div className="flex items-center justify-between h-16 px-4">
        {/* Right Side - Menu Toggle & Logo */}
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-secondary rounded-lg flex items-center justify-center">
              <Briefcase size={18} />
            </div>
            <span className="font-bold text-lg hidden sm:block">Khidma</span>
          </div>
        </div>

        {/* center - main actions buttons */}

        {/* Left Side - Actions & Profile */}
        <div className="flex items-center gap-4">
          <LocaleSwitcher />

          <ThemeSwitcher />
          {/* Notifications */}
          {!isMobile && (
            <Button variant={"ghost"} className=" relative hover:scale-105">
              <Bell size={20} />
              <span className="absolute top-1 left-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </Button>
          )}

          {/* Messages */}
          <Button variant={"ghost"} className="p-2 hover:scale-105 relative">
            <MessageSquare size={20} />
            <span className="absolute top-1 left-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </Button>

          {/* Profile Dropdown */}
          <AuthButtons useCase="navbar" />
        </div>
      </div>
    </header>
  );
};

export default DesktopNavbar;
