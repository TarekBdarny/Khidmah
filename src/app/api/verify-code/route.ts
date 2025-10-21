import { setVerified } from "@/actions/metadata.action";
import { getLoggedUserId, updateUserInfo } from "@/actions/user.action";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { error } from "console";
import { NextRequest, NextResponse } from "next/server";
import { success } from "zod";

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId)
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    const { phone, code, age, city } = await request.json();
    if (!phone || !code) {
      return NextResponse.json(
        { error: "Phone and code are required" },
        { status: 400 }
      );
    }
    const loggedUserId = await getLoggedUserId();
    if (!loggedUserId)
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    const verification = await prisma.verificationCode.findFirst({
      where: {
        phoneNumber: phone,
        code,
        verified: false,
        expiresAt: {
          gt: new Date(),
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!verification) {
      return NextResponse.json(
        { error: "Invalid or expired verification code" },
        { status: 400 }
      );
    }
    await prisma.verificationCode.update({
      where: { id: verification.id },
      data: { verified: true },
    });

    // Update user as verified
    await prisma.user.update({
      where: { id: loggedUserId },
      data: { verified: true },
    });
    const isUpdated = await updateUserInfo({ age, phoneNumber: phone, city });
    if (!isUpdated || !isUpdated?.success)
      return NextResponse.json(
        {
          error: "Error updating user",
          success: false,
        },
        { status: 500 }
      );
    const isVerifiedStatusUpdated = await setVerified(true, userId);
    if (!isVerifiedStatusUpdated || !isVerifiedStatusUpdated?.success)
      return NextResponse.json(
        {
          error: "Error updating verified status",
          success: false,
        },
        { status: 500 }
      );
    return NextResponse.json(
      { success: true, message: "Phone Number Verified Successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error verifying code:", error);
    return NextResponse.json(
      { error: "Error verifying code" },
      { status: 500 }
    );
  }
}
