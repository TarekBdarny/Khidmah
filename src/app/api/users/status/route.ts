import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { pusherServer } from "@/lib/pusher";

export async function POST(request: Request) {
  try {
    const { userId, isOnline } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Update user's online status
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        isOnline: isOnline,
        lastSeen: new Date(),
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        profilePic: true,
        isOnline: true,
        lastSeen: true,
      },
    });

    console.log(
      `👤 User ${updatedUser.email} is now ${isOnline ? "online" : "offline"}`
    );

    // Get all conversations this user is part of
    const conversations = await prisma.conversation.findMany({
      where: {
        OR: [{ userAId: userId }, { userBId: userId }],
      },
      select: {
        id: true,
        userAId: true,
        userBId: true,
      },
    });

    // Notify all users in these conversations about status change
    const otherUserIds = conversations.map((convo) =>
      convo.userAId === userId ? convo.userBId : convo.userAId
    );

    // Remove duplicates
    const uniqueUserIds = [...new Set(otherUserIds)];

    console.log(
      `📢 Notifying ${uniqueUserIds.length} users about status change`
    );

    // Trigger Pusher event for each user
    const triggers = uniqueUserIds.map((otherUserId) =>
      pusherServer.trigger(`user-${otherUserId}`, "user:status", {
        userId: updatedUser.id,
        isOnline: updatedUser.isOnline,
        lastSeen: updatedUser.lastSeen,
      })
    );

    await Promise.all(triggers);

    return NextResponse.json({
      success: true,
      user: updatedUser,
    });
  } catch (error) {
    console.error("❌ Error updating user status:", error);
    return NextResponse.json(
      { error: "Failed to update status" },
      { status: 500 }
    );
  }
}

// GET endpoint to fetch user status
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        isOnline: true,
        lastSeen: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("❌ Error fetching user status:", error);
    return NextResponse.json(
      { error: "Failed to fetch status" },
      { status: 500 }
    );
  }
}
