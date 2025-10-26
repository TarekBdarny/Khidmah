"use client";
import { getLastSpokenWithUsers } from "@/actions/chat.action";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";

import React, { useEffect, useState } from "react";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { DialogInput } from "./Dialog";

import { EmptySidebarUsers } from "./empty-components";
import { LoadingSidebarSkeleton } from "./Loaders";
import Link from "next/link";
import { useConversations } from "@/hooks/use-conversations";

import { getInitials, timeAgo } from "@/lib/utils";
import ProfilePictureWithStatus from "@/components/reuseable/avatar/ProfilePicture";
import SearchInput from "./SearchInput";
import { Separator } from "@/components/ui/separator";
type Users = Awaited<ReturnType<typeof getLastSpokenWithUsers>>;
interface SidebarUsersProps {
  loggedUserId: string | null | undefined;
}
const UsersSidebar = ({ loggedUserId }: SidebarUsersProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const { open } = useSidebar();
  const [sidebarUsers, setSidebarUsers] = useState<Users>([]);
  const [loading, setLoading] = useState<boolean>(false);
  useEffect(() => {
    const fetchUserSpokenWith = async () => {
      setLoading(true);
      const users = await getLastSpokenWithUsers();
      setSidebarUsers(users);
      setLoading(false);
    };
    fetchUserSpokenWith();
  }, []);

  const { conversations, setConversations } = useConversations(sidebarUsers);

  return (
    <Sidebar
      className="mt-15 w-80 max-h-screen overflow-y-auto"
      collapsible="icon"
    >
      <SidebarHeader className="flex flex-row items-center ">
        <div className="flex mt-2 flex-col gap-3 w-full px-2">
          <div
            className={`${
              !open ? "hidden" : "flex items-center justify-between w-full px-2"
            }`}
          >
            <DialogInput />
            <h2 className="font-semibold text-xl">Messages</h2>
          </div>
          <Separator />
        </div>
      </SidebarHeader>
      <SidebarContent className="w-full" dir="ltr">
        {!loading &&
          conversations?.map((conversation) => {
            const secUser =
              conversation.userB.id === loggedUserId
                ? conversation.userA
                : conversation.userB;
            const initials = getInitials(secUser.firstName, secUser.lastName);

            return open ? (
              <SidebarGroup
                key={secUser.id}
                className="hover:bg-muted dark:hover:bg-background cursor-pointer rounded-lg transition duration-150 w-full"
              >
                <div className="w-full flex items-center justify-between px-2">
                  <Link
                    href={`/chat/${conversation.id}`}
                    className="flex gap-2 items-center"
                  >
                    <ProfilePictureWithStatus
                      profilePic={secUser.profilePic || ""}
                      fallback={initials}
                      userId={secUser.id}
                      isOnline={secUser.isOnline}
                      currentUserId={loggedUserId}
                      disablePusher={true}
                    />
                    <div className="w-full">
                      <div className="flex items-center justify-between">
                        <h2 className="font-semibold">
                          {conversation.userB.firstName}
                        </h2>
                        {/* <p className="text-sm text-muted-foreground">2h ago</p> */}
                      </div>
                      <div className="flex flex-row items-center justify-between w-full ">
                        <p
                          className={`text-sm text-muted-foreground truncate w-[170px] `}
                        >
                          {conversation.lastMessage
                            ? conversation.lastMessage
                            : "No messages yet."}
                        </p>
                      </div>
                    </div>
                  </Link>
                  <p className="text-sm text-muted-foreground">
                    {conversation.lastMessageAt &&
                      timeAgo(new Date(conversation.lastMessageAt))}
                  </p>
                </div>
              </SidebarGroup>
            ) : (
              <Tooltip key={secUser.id}>
                <TooltipTrigger asChild>
                  <SidebarGroup className="hover:bg-gray-400 dark:hover:bg-background cursor-pointer rounded-lg transition duration-150">
                    <Link
                      href={`/chat/${conversation.id}`}
                      className="flex gap-2 items-center"
                    >
                      <ProfilePictureWithStatus
                        profilePic={secUser.profilePic || ""}
                        fallback={initials}
                        userId={secUser.id}
                        isOnline={secUser.isOnline}
                        currentUserId={loggedUserId}
                        disablePusher={true}
                      />
                    </Link>
                  </SidebarGroup>
                </TooltipTrigger>
                <TooltipContent side="right">
                  {secUser.firstName + " " + secUser.lastName}
                </TooltipContent>
              </Tooltip>
            );
          })}
        {loading &&
          Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="flex flex-col gap-4">
              <LoadingSidebarSkeleton open={open} />
            </div>
          ))}
        {!loading && open && conversations?.length === 0 && (
          <EmptySidebarUsers />
        )}
      </SidebarContent>
    </Sidebar>
  );
};

export default UsersSidebar;

// const TooltipGroup = (
//   secUser: User,
//   conversation: Conversation,

// ) => {
//   <Tooltip key={secUser.id}>
//                 <TooltipTrigger asChild>
//                   <SidebarGroup className="hover:bg-gray-400 dark:hover:bg-background cursor-pointer rounded-lg transition duration-150">
//                     <Link
//                       href={`/chat/${conversation.id}`}
//                       className="flex gap-2 items-center"
//                     >
//                       <ProfilePictureWithStatus
//                         profilePic={secUser.profilePic || ""}
//                         fallback={getInitials(secUser.firstName, secUser.lastName)}
//                         userId={secUser.id}
//                         isOnline={secUser.isOnline}
//                         currentUserId={loggedUserId}
//                       />
//                     </Link>
//                   </SidebarGroup>
//                 </TooltipTrigger>
//                 <TooltipContent side="right">
//                   {secUser.firstName + " " + secUser.lastName}
//                 </TooltipContent>
//               </Tooltip>
// }
