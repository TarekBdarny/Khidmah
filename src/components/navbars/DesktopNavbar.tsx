import Link from "next/link";
import React from "react";
import { SidebarTrigger } from "../ui/sidebar";
import { useTranslations } from "next-intl";
import { UserButton } from "@clerk/nextjs";
import { ThemeProvider } from "../theme-provider";
import ThemeSwitcher from "../ThemeSwitcher";
import LocaleSwitcher from "../LocaleSwitcher";
import {
  Home,
  Users,
  Briefcase,
  DollarSign,
  Info,
  Phone,
  Mail,
  Bell,
  MessageSquare,
  Settings,
  Search,
  Menu,
  X,
  ChevronDown,
  Globe,
  LogOut,
  User,
} from "lucide-react";
import { ProfileDropdownMenu } from "../reuseable/dropdown/ProfileDropdown";
const DesktopNavbar = () => {
  const t = useTranslations("Navbar");
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
    // <header className=" px-4 py-4 rounded-lg shadow-sm w-full my-2 border-1 ">
    //   <nav className="px-4 flex items-center justify-between w-full">
    //     <ul className="flex items-center gap-6 list-none ">
    //       <li className="hover:cursor-pointer">
    //         <SidebarTrigger />
    //       </li>
    //       {links.map((link, i) => (
    //         <li key={i} className="relative">
    //           <Link href={link.href} className="listItem">
    //             {link.label}
    //           </Link>
    //         </li>
    //       ))}
    //     </ul>
    //     <div className="flex items-center gap-4">
    //       <LocaleSwitcher />
    //       <ThemeSwitcher />
    //       <UserButton />
    //     </div>
    //   </nav>
    // </header>
    <header className=" border-b  sticky top-0 z-50 shadow-sm">
      <div className="flex items-center justify-between h-16 px-4">
        {/* Right Side - Menu Toggle & Logo */}
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-secondary rounded-lg flex items-center justify-center">
              <Briefcase size={18} />
            </div>
            <span className="font-bold text-lg hidden sm:block">WorkHub</span>
          </div>
        </div>

        {/* Center - Search Bar */}
        <div className="flex-1 max-w-2xl mx-4 hidden md:block">
          <div className="relative">
            <Search
              className="absolute right-3 top-1/2 transform -translate-y-1/2 "
              size={18}
            />
            <input
              type="text"
              placeholder="ابحث عن عمال، وظائف..."
              className="w-full pr-10 pl-4 py-2 border  rounded-lg focus:outline-none focus:ring-2  focus:border-transparent focus:ring-primary"
            />
          </div>
        </div>

        {/* Left Side - Actions & Profile */}
        <div className="flex items-center gap-4">
          <LocaleSwitcher />

          {/* Notifications */}
          <button className="p-2  rounded-lg transition-colors relative">
            <Bell size={20} />
            <span className="absolute top-1 left-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* Messages */}
          <button className="p-2  rounded-lg transition-colors relative">
            <MessageSquare size={20} />
            <span className="absolute top-1 left-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* Profile Dropdown */}
          <ProfileDropdownMenu />
        </div>
      </div>
    </header>
  );
};

export default DesktopNavbar;
