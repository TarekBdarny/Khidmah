"use server";
import { prisma } from "@/lib/prisma";
import { auth, currentUser } from "@clerk/nextjs/server";

export const registerUserToDB = async () => {
  try {
    const { userId } = await auth();
    const user = await currentUser();
    if (!user || !userId) return;

    const existingUser = await prisma.user.findUnique({
      where: {
        clerkId: userId,
      },
    });
    if (existingUser) return existingUser;
    const dbUser = await prisma.user.create({
      data: {
        clerkId: userId,
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        phoneNumber: user.phoneNumbers[0] || "",
        profilePic: user.imageUrl || "",

        email: user.emailAddresses[0].emailAddress,
      },
    });
  } catch (error) {}
};
