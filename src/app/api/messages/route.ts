// app/api/messages/route.ts

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { pusherServer } from "@/lib/pusher";
import { timeAgo } from "@/lib/utils";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { content, senderId, receiverId } = body;

    // Validate input
    if (!content || !senderId || !receiverId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Find or create conversation between these two users
    // Check both directions (A->B and B->A)
    let conversation = await prisma.conversation.findFirst({
      where: {
        OR: [
          { userAId: senderId, userBId: receiverId },
          { userAId: receiverId, userBId: senderId },
        ],
      },
    });

    // Create conversation if it doesn't exist
    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: {
          userAId: senderId,
          userBId: receiverId,
        },
      });
    }

    // Create the message
    const message = await prisma.message.create({
      data: {
        content,
        senderId,
        receiverId,
        conversationId: conversation.id,
      },
      include: {
        sender: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            profilePic: true,
          },
        },
      },
    });
    // Update conversation timestamp
    const updatedConversation = await prisma.conversation.update({
      where: {
        id: conversation.id,
      },
      data: {
        lastMessageAt: new Date(),
        lastMessage: message.content,
        messages: {
          connect: {
            id: message.id,
          },
        },
      },
      include: {
        userA: true,
        userB: true,
        messages: true,
      },
    });

    // Trigger Pusher event for both users
    await pusherServer.trigger(
      `conversation-${conversation.id}`,
      "new-message",
      message
    );

    // Also trigger a personal channel for the receiver (for notifications)
    await pusherServer.trigger(`user-${receiverId}`, "new-message", {
      conversationId: conversation.id,
      message,
    });
    const lastMessage =
      updatedConversation.messages[updatedConversation.messages.length - 1];

    pusherServer.trigger(`user-${senderId}`, "conversation:update", {
      id: conversation.id,
      lastMessage: lastMessage.content,
      lastMessageAt: updatedConversation.lastMessageAt,
    });
    pusherServer.trigger(`user-${receiverId}`, "conversation:update", {
      id: conversation.id,
      lastMessage: lastMessage.content,
      lastMessageAt: updatedConversation.lastMessageAt,
    });

    return NextResponse.json(message);
  } catch (error) {
    console.error("Error sending message:", error);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const conversationId = searchParams.get("conversationId");
    const userId = searchParams.get("userId");
    const otherUserId = searchParams.get("otherUserId");

    // Get messages by conversation ID
    if (conversationId) {
      const messages = await prisma.message.findMany({
        where: { conversationId },
        include: {
          sender: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              profilePic: true,
            },
          },
        },
        orderBy: { createdAt: "asc" },
      });

      return NextResponse.json(messages);
    }

    // Get conversation between two users
    if (userId && otherUserId) {
      const conversation = await prisma.conversation.findFirst({
        where: {
          OR: [
            { userAId: userId, userBId: otherUserId },
            { userAId: otherUserId, userBId: userId },
          ],
        },
        include: {
          messages: {
            include: {
              sender: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  profilePic: true,
                },
              },
            },
            orderBy: { createdAt: "asc" },
          },
        },
      });

      return NextResponse.json(conversation);
    }

    return NextResponse.json(
      { error: "Either conversationId or userId + otherUserId required" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Error fetching messages:", error);
    return NextResponse.json(
      { error: "Failed to fetch messages" },
      { status: 500 }
    );
  }
}
