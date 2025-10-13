"use client";

import * as React from "react";
import { DropdownMenuCheckboxItemProps } from "@radix-ui/react-dropdown-menu";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ProfilePicture from "../avatar/ProfilePicture";
import { LogOut, Settings, User } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { SignOutButton } from "@clerk/nextjs";

export function ProfileDropdownMenu() {
  return (
    <DropdownMenu dir="rtl">
      <DropdownMenuTrigger className="cursor-pointer">
        <ProfilePicture />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>أحمد محمد </DropdownMenuLabel>
        <DropdownMenuItem>example@gmail.com</DropdownMenuItem>
        <DropdownMenuSeparator />

        <Link href={"/profile"}>
          <DropdownMenuItem className={`cursor-pointer`}>
            <User size={18} className="ml-2" />
            الملف الشخصي
          </DropdownMenuItem>
        </Link>

        <Link href={"/settings"}>
          <DropdownMenuItem className={`cursor-pointer`}>
            <Settings size={18} className="ml-2" />
            الإعدادات
          </DropdownMenuItem>
        </Link>

        <DropdownMenuItem className={`cursor-pointer hover:text-red-400 `}>
          <SignOutButton>
            <Button>
              <LogOut size={18} className="ml-2" />
              تسجيل الخروج
            </Button>
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
