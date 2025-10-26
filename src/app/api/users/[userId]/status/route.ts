// app/api/users/[userId]/status/route.ts

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // or your database client

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        isOnline: true,
        lastSeen: true,
      },
    });
    console.log(user?.lastSeen);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      isOnline: user.isOnline,
      lastSeen: user.lastSeen,
    });
  } catch (error) {
    console.error("Error fetching user status:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
