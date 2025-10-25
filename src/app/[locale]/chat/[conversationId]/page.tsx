import React from "react";
import Chat from "../components/Chat";
import { getLoggedUserId } from "@/actions/user.action";

const page = async ({
  params,
}: {
  params: Promise<{ conversationId: string }>;
}) => {
  const { conversationId } = await params;
  const loggedUserId = await getLoggedUserId();
  if (!loggedUserId) return null;

  return (
    <main className="">
      <Chat conversationId={conversationId} loggedUserId={loggedUserId} />
    </main>
  );
};

export default page;
