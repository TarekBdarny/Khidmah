// components/Chat.tsx - Simplified for 1-on-1 chat
"use client";

import { useEffect, useState, useRef } from "react";
import { pusherClient } from "@/lib/pusher-client";
import { DotSquareIcon, Trash } from "lucide-react";
import Trigger from "./Trigger";
import { Button } from "@/components/ui/button";
import ProfilePictureWithStatus, {
  ProfilePicture,
} from "@/components/reuseable/avatar/ProfilePicture";
import { useSidebar } from "@/components/ui/sidebar";
import { deleteConversation, getConversation } from "@/actions/chat.action";
import { toast } from "sonner";
import { getInitials } from "@/lib/utils";
import { EmptyMessages } from "./empty-components";
import { LoadingChatMessageSkeleton, LoadingChatUserSkeleton } from "./Loaders";
import ChatForm from "./ChatForm";
import { useRouter } from "next/navigation";
import { Spinner } from "@/components/ui/spinner";
import { useUserOnlineStatus } from "@/hooks/useUserOnlineStatus";

export default function Chat({
  conversationId,
  loggedUserId,
}: {
  conversationId: string;
  loggedUserId: string;
}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversation, setConversation] = useState<
    Conversation | undefined | null
  >(undefined);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [otherUserLoading, setOtherUserLoading] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState<boolean>(false);
  const router = useRouter();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const markingAsRead = useRef(false);
  const otherUser =
    conversation?.userB.id === loggedUserId
      ? conversation?.userA
      : conversation?.userB;
  const { open } = useSidebar();
  // Scroll to bottom

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const channel = pusherClient.subscribe(`user-${loggedUserId}`);

    channel.bind(
      "messages:read",
      (data: {
        conversationId: string;
        readBy: string;
        messages: { id: string; isRead: boolean; readAt: string }[];
      }) => {
        if (data.conversationId === conversationId) {
          setMessages((prev) =>
            prev.map((msg) => {
              const readMessage = data.messages.find((m) => m.id === msg.id);
              if (readMessage) {
                return {
                  ...msg,
                  isRead: true,
                  readAt: readMessage.readAt,
                };
              }
              return msg;
            })
          );
        }
      }
    );

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, [loggedUserId, conversationId]);
  useEffect(() => {
    const fetchConversation = async () => {
      setOtherUserLoading(true);

      const convo = await getConversation(conversationId);
      if (convo?.success) {
        setConversation(convo?.data);
      } else {
        toast.error(convo?.message);
      }

      setOtherUserLoading(false);
    };
    fetchConversation();
  }, [conversationId]);
  const markMessagesAsRead = async () => {
    if (markingAsRead.current) return;

    try {
      markingAsRead.current = true;

      const response = await fetch("/api/messages/read", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationId,
          userId: loggedUserId,
        }),
      });

      if (response.ok) {
        const data = await response.json();
      }
    } catch (error) {
      console.error("Error marking messages as read:", error);
    } finally {
      // Reset after a delay to allow next mark
      setTimeout(() => {
        markingAsRead.current = false;
      }, 1000);
    }
  };
  // Load conversation and messages
  useEffect(() => {
    const loadConversation = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          `/api/messages?userId=${loggedUserId}&otherUserId=${otherUser?.id}`
        );
        const data: Conversation | null = await response.json();

        if (data) {
          setMessages(data.messages || []);
        }
        setTimeout(() => markMessagesAsRead(), 500);
      } catch (error) {
      } finally {
        setIsLoading(false);
      }
    };

    loadConversation();
  }, [conversationId, otherUser?.id, loggedUserId]);

  // Subscribe to Pusher when we have a conversationId
  useEffect(() => {
    if (!conversationId) return;

    const channel = pusherClient.subscribe(`conversation-${conversationId}`);

    channel.bind("new-message", (message: Message) => {
      setMessages((prev) => {
        // Avoid duplicates
        if (prev.some((m) => m.id === message.id)) {
          return prev;
        }
        return [...prev, message];
      });
      scrollToBottom();
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, [conversationId]);
  useEffect(() => {
    const channel = pusherClient.subscribe(`user-${loggedUserId}`);

    channel.bind(
      "messages:read",
      (data: {
        conversationId: string;
        readBy: string;
        messages: { id: string; isRead: boolean; readAt: string }[];
      }) => {
        if (data.conversationId === conversationId) {
          setMessages((prev) =>
            prev.map((msg) => {
              const readMessage = data.messages.find((m) => m.id === msg.id);
              if (readMessage) {
                return {
                  ...msg,
                  isRead: true,
                  readAt: readMessage.readAt,
                };
              }
              return msg;
            })
          );
        }
      }
    );

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, [loggedUserId, conversationId]);
  useEffect(() => {
    const handleFocus = () => {
      markMessagesAsRead();
    };

    window.addEventListener("focus", handleFocus);

    return () => {
      window.removeEventListener("focus", handleFocus);
    };
  }, [conversationId, loggedUserId]);
  // Scroll when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newMessage.trim()) return;

    // setIsLoading(true);

    try {
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: newMessage,
          senderId: loggedUserId,
          receiverId: otherUser?.id,
        }),
      });

      if (response.ok) {
        const message = await response.json();

        setNewMessage("");
      }
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      // setIsLoading(false);
    }
  };

  // const sendNewMessage = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   if (!newMessage.trim()) return;

  //   try {
  //     const res = await sendMessage(
  //       newMessage,
  //       conversationId!,
  //       loggedUserId,
  //       otherUser?.id!
  //     );
  //     if (res?.success) {
  //       setNewMessage("");
  //     }
  //   } catch (error) {
  //     console.error("Error sending message:", error);
  //   } finally {
  //   }
  // };
  const handleDeleteConversation = async (conversationId: string) => {
    setLoadingDelete(true);
    const res = await deleteConversation(conversationId);
    if (res?.success) {
      toast.success("Conversation deleted successfully");
      setLoadingDelete(false);
      router.push(`/chat`);
    } else {
      toast.error("Failed to delete conversation");
      setLoadingDelete(false);
    }
  };

  return (
    <div
      className={`${
        open ? "md:w-[calc(100%-320px)]" : "md:w-[calc(100%-50px)]"
      }  flex flex-col h-[calc(100vh-66px)] `}
    >
      {otherUserLoading ? (
        <LoadingChatUserSkeleton />
      ) : (
        <div className="flex items-center justify-between ">
          <Button
            variant={"ghost"}
            size={"sm"}
            onClick={() => handleDeleteConversation(conversationId)}
          >
            {loadingDelete ? (
              <Spinner />
            ) : (
              <Trash className="size-4 text-destructive" />
            )}
          </Button>
          <div className="flex items-center gap-2 p-2 lg:p-4 ">
            <p>
              {otherUser?.firstName} {otherUser?.lastName}
            </p>
            <ProfilePicture
              fallback={getInitials(otherUser?.firstName, otherUser?.lastName)}
              profilePic={otherUser?.profilePic || ""}
            />

            <Trigger />
          </div>
        </div>
      )}
      {/* messages  */}
      <div className="flex-1 overflow-y-auto  p-4 space-y-4 bg-background">
        {!isLoading && messages.length === 0 ? (
          <EmptyMessages />
        ) : (
          !isLoading &&
          messages.map((message, index) => {
            const isCurrentUser = message.senderId === loggedUserId;

            return (
              <div
                key={index}
                className={`flex gap-2 ${
                  isCurrentUser ? "justify-end" : "justify-start"
                }`}
              >
                {
                  // Profile picture
                  !isCurrentUser && (
                    <div className="flex items-center justify-center mr-2">
                      <ProfilePicture
                        profilePic={otherUser?.profilePic || ""}
                        fallback={getInitials(
                          otherUser?.firstName,
                          otherUser?.lastName
                        )}
                      />
                    </div>
                  )
                }
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    isCurrentUser
                      ? "bg-blue-500 text-white"
                      : "bg-white text-gray-900 border border-gray-200"
                  }`}
                >
                  <p className="break-words">{message.content}</p>
                  <p
                    className={`text-xs mt-1 ${
                      isCurrentUser ? "text-blue-100" : "text-gray-500"
                    }`}
                  >
                    {new Date(message.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                  {isCurrentUser && (
                    <span className="text-xs">
                      {message.isRead ? (
                        <span className="text-blue-100">✓✓</span>
                      ) : (
                        <span className="text-blue-200">✓</span>
                      )}
                    </span>
                  )}
                </div>
                <div ref={messagesEndRef} />
              </div>
            );
          })
        )}
        {isLoading && <LoadingChatMessageSkeleton />}
      </div>
      {/* form */}
      <ChatForm
        sendNewMessage={sendMessage}
        isLoading={isLoading}
        newMessage={newMessage}
        setNewMessage={setNewMessage}
      />
    </div>
  );
}
