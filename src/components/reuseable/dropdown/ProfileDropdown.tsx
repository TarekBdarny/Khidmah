"use client";

import * as React from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ProfilePicture } from "../avatar/ProfilePicture";
import { LogOut, Settings, User } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { SignOutButton, useAuth } from "@clerk/nextjs";
import { getAuthUser } from "@/actions/user.action";
import useAuthUser from "@/hooks/use-authUser";
import { useTranslations } from "next-intl";

export function ProfileDropdownMenu() {
  const t = useTranslations("ProfileDropDown");
  const authUser = useAuthUser();
  const fallback =
    `${authUser?.firstName?.charAt(0).toUpperCase()}
  ${authUser?.firstName?.charAt(0).toUpperCase()}` || "";

  return (
    <DropdownMenu dir="rtl">
      <DropdownMenuTrigger className="cursor-pointer">
        <ProfilePicture
          profilePic={authUser?.profilePic || ""}
          fallback={fallback}
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>
          {authUser?.firstName} {authUser?.lastName}
        </DropdownMenuLabel>
        <DropdownMenuItem>{authUser?.email}</DropdownMenuItem>
        <DropdownMenuSeparator />

        <Link href={"/profile"}>
          <DropdownMenuItem className={`cursor-pointer`}>
            <User size={18} className="ml-2" />
            {t("profile")}
          </DropdownMenuItem>
        </Link>

        <Link href={"/settings"}>
          <DropdownMenuItem className={`cursor-pointer`}>
            <Settings size={18} className="ml-2" />
            {t("settings")}
          </DropdownMenuItem>
        </Link>

        <DropdownMenuItem className={`cursor-pointer hover:text-red-400 `}>
          <SignOutButton>
            <div className="w-full h-full flex items-center">
              <LogOut size={18} className="ml-2" />
              {t("logout")}
            </div>
          </SignOutButton>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

type Props = {
  children: React.ReactNode;
  //   cln?: string;
  label: string;
};
const ProfileDropdownItem = ({ children, label }: Props) => {
  return (
    <DropdownMenuItem className={`cursor-pointer ${cn()}`}>
      {children}
      {label}
    </DropdownMenuItem>
  );
};
