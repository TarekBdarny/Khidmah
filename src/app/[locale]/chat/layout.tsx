import React from "react";
import UsersSidebar from "./components/UsersSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { getLoggedUserId } from "@/actions/user.action";

const ChatLayout = async ({ children }: { children: React.ReactNode }) => {
  const loggedUserId = await getLoggedUserId();
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
