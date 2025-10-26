"use client";
import { getLastSpokenWithUsers } from "@/actions/chat.action";
import { getLoggedUserId } from "@/actions/user.action";
import { pusherClient } from "@/lib/pusher-client";
import { SetStateAction, useEffect, useState } from "react";

export function useConversations(
  initialConversations: Conversation[] | undefined
) {
  const [conversations, setConversations] = useState<Conversation[]>(
    initialConversations || []
  );
  const [userId, setUserId] = useState<string | null | undefined>(null);
  useEffect(() => {
    if (initialConversations && initialConversations.length > 0) {
      setConversations(initialConversations);
    }
  }, [initialConversations]);
  useEffect(() => {
    const getUserId = async () => {
      const id = await getLoggedUserId();
      setUserId(id);
    };
    setConversations(initialConversations || []);
    getUserId();
  }, []);
  useEffect(() => {
    console.log("conversations", conversations);
  }, [conversations]);
  useEffect(() => {
    if (!userId) return;
    const channel = pusherClient.subscribe(`user-${userId}`);

    channel.bind("conversation:new", (newConversation: Conversation) => {
      setConversations((prev) => {
        if (prev?.some((c) => c.id === newConversation.id)) {
          return prev;
        }
        return [newConversation, ...prev];
      });
    });

    // Listen for conversation updates
    channel.bind(
      "conversation:update",
      (updatedConversation: {
        id: string;
        lastMessage: string;
        lastMessageAt: Date;
      }) => {
        console.log("Conversation updated:", updatedConversation);
        setConversations((prev) =>
          prev.map((c) =>
            c.id === updatedConversation.id
              ? { ...c, ...updatedConversation }
              : c
          )
        );
      }
    );

    // Listen for conversation deletions
    channel.bind(
      "conversation:delete",
      ({ conversationId }: { conversationId: string }) => {
        setConversations((prev) => prev.filter((c) => c.id !== conversationId));
      }
    );

    return () => {
      console.log("🔌 Unsubscribing from:", `user-${userId}`);
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, [userId]);

  return conversations;
}
