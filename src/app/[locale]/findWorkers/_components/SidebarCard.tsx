import { ProfilePicture } from "@/components/reuseable/avatar/ProfilePicture";
import { Separator } from "@/components/ui/separator";
import { Star } from "lucide-react";
import Link from "next/link";
import React from "react";
interface SidebarCardProps {
  id: string;
  companyName: string;
  user: {
    firstName: string;
    lastName: string;
    id: string;
    profilePic: string;
  };
}
const SidebarCard = ({ id, companyName, user }: SidebarCardProps) => {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex  items-center justify-between p-2">
        <div className="flex items-center gap-3">
          <ProfilePicture profilePic={user.profilePic || ""} fallback="TB" />
          <Link href={"/#"}>
            <p className="text-lg font-semibold">{companyName}</p>
            <p className="text-sm text-foreground">
              {user.firstName} {user.lastName}
            </p>
          </Link>
        </div>
        <div className="flex">
          <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-3.5 h-3.5 ${
                  star <= 4
                    ? "fill-primary text-primary"
                    : "fill-gray-600 text-gray-600"
                }`}
              />
            ))}
          </div>
          <span className="text-primary text-sm font-semibold">4.0</span>
          <span className="text-gray-500 text-xs">(127)</span>
        </div>
      </div>
      <Separator />
    </div>
  );
};

export default SidebarCard;
