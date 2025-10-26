// app/api/messages/read/route.ts

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { pusherServer } from "@/lib/pusher";

export async function POST(request: Request) {
  try {
    const { conversationId, userId } = await request.json();

    if (!conversationId || !userId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Mark all unread messages in this conversation as read
    // Only mark messages where current user is the RECEIVER
    const updatedMessages = await prisma.message.updateMany({
      where: {
        conversationId,
        receiverId: userId,
        isRead: false,
      },
      data: {
        isRead: true,
      },
    });

    // Get the updated messages to send via Pusher
    const messages = await prisma.message.findMany({
      where: {
        conversationId,
        receiverId: userId,
      },
      select: {
        id: true,
        isRead: true,
      },
    });

    // Get conversation to find the sender
    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
      select: {
        userAId: true,
        userBId: true,
      },
    });

    if (!conversation) {
      return NextResponse.json(
        { error: "Conversation not found" },
        { status: 404 }
      );
    }

    // Find the OTHER user (the sender)
    const otherUserId =
      conversation.userAId === userId
        ? conversation.userBId
        : conversation.userAId;

    console.log("📖 Marking messages as read:", {
      conversationId,
      readBy: userId,
      notifying: otherUserId,
      messagesUpdated: updatedMessages.count,
    });

    // Trigger Pusher event to notify the SENDER that messages were read
    await pusherServer.trigger(`user-${otherUserId}`, "messages:read", {
      conversationId,
      readBy: userId,
      messages: messages,
      readAt: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      updatedCount: updatedMessages.count,
    });
  } catch (error) {
    console.error("❌ Error marking messages as read:", error);
    return NextResponse.json(
      { error: "Failed to mark messages as read" },
      { status: 500 }
    );
  }
}
