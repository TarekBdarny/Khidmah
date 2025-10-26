"use client";
import React, { useEffect } from "react";
import UsersSidebar from "./components/UsersSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { getLoggedUserId } from "@/actions/user.action";

const ChatLayout = ({ children }: { children: React.ReactNode }) => {
  const [loggedUserId, setLoggedUserId] = React.useState<
    string | null | undefined
  >(null);
  useEffect(() => {
    const getUserId = async () => {
      const id = await getLoggedUserId();
      setLoggedUserId(id);
    };
    getUserId();
  }, []);
  // useOnlineStatus(loggedUserId);

  return (
    <SidebarProvider>
      <main className="w-full h-full">
        <UsersSidebar loggedUserId={loggedUserId} />
        <section className="h-full">{children}</section>
      </main>
    </SidebarProvider>
  );
};

export default ChatLayout;
