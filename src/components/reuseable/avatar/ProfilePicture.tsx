"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { pusherClient } from "@/lib/pusher-client";
import { cn, formatLastSeen } from "@/lib/utils";
import React, { useEffect, useState } from "react";

type ProfilePictureWithStatusProps = {
  profilePic: string;
  fallback: string;
  useCase?: "large" | "normal";
  isOnline?: boolean;
  lastSeen?: Date | null;
  currentUserId?: string | null;
  showLastSeen?: boolean;
  userId: string;
  disablePusher?: boolean;
};
type ProfilePicture = {
  profilePic: string;
  fallback: string;
  useCase?: "large" | "normal";
};
const ProfilePictureWithStatus = ({
  profilePic,
  fallback,
  useCase = "normal",
  isOnline: initialIsOnline = false,
  lastSeen: initialLastSeen,
  currentUserId,
  showLastSeen = false,
  userId,
  disablePusher,
}: ProfilePictureWithStatusProps) => {
  const [isOnline, setIsOnline] = useState(initialIsOnline);
  const [lastSeen, setLastSeen] = useState<Date | undefined | null>(
    initialLastSeen
  );
  useEffect(() => {
    setIsOnline(initialIsOnline);
    setLastSeen(initialLastSeen);
  }, [initialIsOnline, initialLastSeen]);

  // Subscribe to status updates (only if not disabled)
  useEffect(() => {
    if (disablePusher) {
      console.log("🔕 Pusher disabled for", userId);
      return; // Skip subscription if parent handles it
    }

    // Subscribe to YOUR channel to receive updates about OTHER users
    const channel = pusherClient.subscribe(`user-${currentUserId}`);

    channel.bind(
      "user:status",
      (data: { userId: string; isOnline: boolean; lastSeen: Date }) => {
        // Update status if this event is about the user we're displaying
        if (data.userId === userId) {
          console.log(
            `📡 Status update for ${userId}:`,
            data.isOnline ? "online" : "offline"
          );
          setIsOnline(data.isOnline);
          setLastSeen(data.lastSeen);
        }
      }
    );

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, [currentUserId, userId, disablePusher]);

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative">
        {/* Avatar using shadcn/ui */}
        <Avatar>
          <AvatarImage src={profilePic || undefined} alt={"Profile Picture"} />
          <AvatarFallback
            className={` bg-gradient-to-br from-blue-400 to-purple-500 text-white`}
          >
            {fallback}
          </AvatarFallback>
        </Avatar>

        {/* Online Indicator - positioned at bottom-right */}
        <div
          className={`absolute bottom-0 right-0 size-3 border} rounded-full border-white ${
            isOnline ? "bg-green-500" : "bg-gray-400"
          }`}
          title={isOnline ? "Online" : "Offline"}
        />
      </div>

      {/* Last Seen Text */}
      {showLastSeen && !isOnline && (
        <span className="text-xs text-gray-500 text-center">
          {formatLastSeen(lastSeen)}
        </span>
      )}

      {/* Online Status Text */}
      {showLastSeen && isOnline && (
        <span className="text-xs text-green-600 font-medium">Online</span>
      )}
    </div>
  );
};

export default ProfilePictureWithStatus;

export const ProfilePicture = ({
  profilePic,
  fallback,
  useCase = "normal",
}: ProfilePicture) => {
  return (
    <Avatar className={cn(useCase === "large" && "size-[60px] ")}>
      <AvatarImage className="" src={profilePic} />
      <AvatarFallback>{fallback}</AvatarFallback>
    </Avatar>
  );
};
