import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import React from "react";

type profileProps = {
  profilePic: string;
  fallback: string;
};
const ProfilePicture = ({ profilePic, fallback }: profileProps) => {
  return (
    <Avatar>
      <AvatarImage src={profilePic} />
      <AvatarFallback>{fallback}</AvatarFallback>
    </Avatar>
  );
};

export default ProfilePicture;
