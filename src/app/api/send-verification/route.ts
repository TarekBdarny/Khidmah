import { getLoggedUserId } from "@/actions/user.action";
import { prisma } from "@/lib/prisma";
import { twilioClient, twilioPhoneNumber } from "@/lib/twilio";
import { get } from "http";
import { NextRequest, NextResponse } from "next/server";
import { success } from "zod";

export async function POST(request: NextRequest) {
  const phoneRegex = /^\+972\d{9}$/;
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  try {
    const { phone } = await request.json();
    if (!phone) {
      return NextResponse.json(
        { error: "No Phone number provided", success: false },
        { status: 404 }
      );
    }
    const authUserId = await getLoggedUserId();
    if (!authUserId) {
      return NextResponse.json(
        { error: "User not found", success: false },
        { status: 404 }
      );
    }
    const usersWithSamePhone = await prisma.user.findMany({
      where: {
        phoneNumber: phone,
      },
    });
    if (usersWithSamePhone.length > 0)
      return NextResponse.json(
        { error: "Phone number already exists", success: false },
        { status: 404 }
      );
    await twilioClient.messages.create({
      body: `Your verification code is: ${code}. Valid for 10 minutes.`,
      from: twilioPhoneNumber,
      to: phone,
    });

    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
    await prisma.verificationCode.create({
      data: {
        phoneNumber: phone,
        code,
        expiresAt,
      },
    });
    return NextResponse.json(
      { success: true, message: "Verification code sent" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error sending verification:", error);
    return NextResponse.json(
      { error: "Error sending verification" },
      { status: 500 }
    );
  }
}
