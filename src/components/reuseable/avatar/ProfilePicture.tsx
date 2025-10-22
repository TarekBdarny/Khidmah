import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import React from "react";

type profileProps = {
  profilePic: string;
  fallback: string;
  useCase?: "large" | "normal";
};
const ProfilePicture = ({
  profilePic,
  fallback,
  useCase = "normal",
}: profileProps) => {
  return (
    <Avatar className={cn(useCase === "large" && "size-[60px] ")}>
      <AvatarImage className="" src={profilePic} />
      <AvatarFallback>{fallback}</AvatarFallback>
    </Avatar>
  );
};

export default ProfilePicture;
