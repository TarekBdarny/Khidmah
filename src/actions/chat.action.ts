"use server";
import { getLoggedUserId } from "./user.action";
import { prisma } from "@/lib/prisma";
import { pusherServer } from "@/lib/pusher";
import { revalidatePath } from "next/cache";

export const getLastSpokenWithUsers = async () => {
  try {
    const loggedUserId = await getLoggedUserId();
    if (!loggedUserId) return [];
    const users = await prisma.conversation.findMany({
      where: {
        OR: [{ userAId: loggedUserId }, { userBId: loggedUserId }],
      },
      include: {
        userB: true,
        userA: true,
        messages: true,
      },
      orderBy: {
        lastMessageAt: "desc",
      },
    });
    return users ? users : [];
  } catch (error) {
    console.log("Error getting last spoken with users", error);
  }
};
export const getUsersIncludesFullname = async (fullname: string) => {
  try {
    if (!fullname) return [];

    const LoggedUserId = await getLoggedUserId();
    if (!LoggedUserId) return [];
    const users = await prisma.user.findMany({
      where: {
        OR: [
          {
            firstName: {
              contains: fullname,
              mode: "insensitive",
            },
          },
          {
            lastName: {
              contains: fullname,
              mode: "insensitive",
            },
          },
        ],
        NOT: [
          {
            id: LoggedUserId,
          },
          {
            conversationsA: {
              some: {
                userBId: LoggedUserId,
              },
            },
          },
          {
            // Exclude users who are userB in a conversation where logged user is userA
            conversationsB: {
              some: {
                userAId: LoggedUserId,
              },
            },
          },
        ],
        AND: [
          {
            verified: true,
          },
        ],
      },
      orderBy: {
        firstName: "desc",
      },
    });

    return users;
  } catch (error) {
    console.log("Error getting users includes fullname", error);
  }
};
export const addUserToChatWith = async (userId: string) => {
  try {
    const loggedUserId = await getLoggedUserId();
    if (!loggedUserId) return { message: "User not found!", success: false };
    const otherUser = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (!otherUser)
      return {
        message: "User you selected not found!",
        success: false,
      };

    const conversation = await prisma.conversation.create({
      data: {
        userAId: loggedUserId,
        userBId: userId,
      },
      include: {
        userA: true,
        userB: true,
      },
    });
    if (!conversation)
      return {
        message: "Error creating conversation!",
        success: false,
      };
    await pusherServer.trigger(`user-${loggedUserId}`, "conversation:new", {
      ...conversation,
      userB: {
        id: conversation.userBId,
        firstName: conversation.userB.firstName,
        lastName: conversation.userB.lastName,
        profilePic: conversation.userB.profilePic,
      },
    });

    // 2. Trigger for the OTHER USER (who was clicked on)
    await pusherServer.trigger(
      `user-${conversation.userBId}`,
      "conversation:new",
      {
        ...conversation,
        userB: {
          id: loggedUserId,
          firstName: conversation.userA.firstName,
          lastName: conversation.userA.lastName,
          profilePic: conversation.userA.profilePic,
        },
      }
    );

    return { message: "Success", success: true, data: conversation };
  } catch (error) {
    console.log("Error adding user to chat with", error);
  }
};

// export async function createConversation(userId: string, otherUserId: string) {
//   try {
//     // Your logic to create conversation in database
//     const newConversation = await prisma.conversation.create({
//       data: {
//         userAId: userId,
//         userBId: otherUserId,
//       },
//     });

//     // Trigger Pusher event to notify all clients
//     await pusherServer.trigger(
//       `user-${userId}`,
//       "conversation:new",
//       newConversation
//     );

//     // Also trigger for the other user
//     await pusherServer.trigger(`user-${otherUserId}`, "conversation:new", {
//       ...newConversation,
//       otherUser: {
//         id: userId,
//         name: "Current User",
//         avatar: "/avatar.jpg",
//       },
//     });

//     revalidatePath("/conversations");

//     return { success: true, conversation: newConversation };
//   } catch (error) {
//     console.error("Failed to create conversation:", error);
//     return { success: false, error: "Failed to create conversation" };
//   }
// }

export const deleteConversation = async (conversationId: string) => {
  try {
    const conversation = await prisma.conversation.delete({
      where: {
        id: conversationId,
      },
    });
    if (!conversationId || !conversation) return { success: false };

    await pusherServer.trigger(
      `user-${conversation.userAId}`,
      "conversation:delete",
      {
        conversationId: conversationId,
      }
    );
    await pusherServer.trigger(
      `user-${conversation.userBId}`,
      "conversation:delete",
      {
        conversationId: conversationId,
      }
    );
    revalidatePath("/chat");
    return { success: true };
  } catch (error) {
    console.log("Error deleting conversation", error);
  }
};

export const getConversation = async (conversationId: string) => {
  try {
    if (!conversationId)
      return {
        message: "Conversation not provided",
        success: false,
      };
    const conversation = await prisma.conversation.findUnique({
      where: {
        id: conversationId,
      },
      include: {
        userA: true,
        userB: true,
        messages: true,
      },
    });

    return {
      message: "Success",
      success: true,
      data: conversation,
    };
  } catch (error) {
    console.log("Error getting conversation", error);
  }
};
