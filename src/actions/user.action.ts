"use server";
import { prisma } from "@/lib/prisma";
import { auth, currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { setNotVerified, setRole, setVerified } from "./metadata.action";

type UpdateUserInfoParams = {
  age: number;
  phoneNumber: string;
  city: string;
};
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
        // phoneNumber: user.phoneNumbers[0] || "",
        profilePic: user.imageUrl || "",
        email: user.emailAddresses[0].emailAddress,
      },
    });
    await setRole("CLIENT", userId);
    await setNotVerified(userId);
    return dbUser;
  } catch (error) {
    console.log("Error registering user to DB", error);
  }
};
export const getUserByClerkId = async (clerkId: string) => {
  if (!clerkId) return;
  return prisma.user.findUnique({
    where: {
      clerkId,
    },
    include: {
      _count: {
        select: {
          workPosts: true,
          savedWorkers: true,
          ratingsGiven: true,
        },
      },
    },
  });
};
export const getAuthUser = async (clerkId: string) => {
  try {
    const { userId } = await auth();
    if (!userId) return;

    const authUser = await prisma.user.findUnique({
      where: {
        clerkId,
      },
      include: {
        _count: {
          select: {
            workPosts: true,
            savedWorkers: true,
            ratingsGiven: true,
          },
        },
      },
    });
    return authUser;
  } catch (error) {
    console.log("Error getting auth user", error);
  }
};
export const getLoggedUserId = async () => {
  try {
    const { userId } = await auth();
    if (!userId) return null;
    const dbUser = await prisma.user.findUnique({
      where: {
        clerkId: userId,
      },
    });
    if (!dbUser) throw new Error("User not found.");
    return dbUser.id;
  } catch (error) {}
};
export const updateUserInfo = async ({
  age,
  phoneNumber,
  city,
}: UpdateUserInfoParams) => {
  if (!age || !phoneNumber || !city) throw new Error("All fields are required");
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) return null;
    const user = await getUserByClerkId(clerkId);
    if (!user) throw new Error("User not found");

    const updatedUser = await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        age,
        phoneNumber,
        city,
      },
    });
    return { success: true, updatedUser };
  } catch (error) {
    console.log("error in updateUser", error);
    throw new Error("Error updating user");
  }
};
// V
export const getAllUsers = async () => {
  try {
    const allUsers = await prisma.user.findMany();
    return allUsers ? allUsers : [];
  } catch (error) {
    console.log("Error getting all users", error);
  }
};
export const getUserById = async (id: string) => {
  try {
    const targetUser = await prisma.user.findUnique({
      where: { id },
      include: {
        ratingsGiven: true,
        workPosts: true,
        savedWorkers: true,
        _count: {
          select: {
            workPosts: true,
            savedWorkers: true,
            ratingsGiven: true,
          },
        },
      },
    });
    return targetUser ? targetUser : null;
  } catch (error) {
    console.log("Error getting user by id", error);
  }
};
export const deleteUserById = async (id: string) => {
  try {
    const deletedUser = await prisma.user.delete({
      where: { id },
    });
    return deletedUser;
  } catch (error) {
    console.log("Error deleting user by id", error);
  }
};
export const toggleSavedWorker = async (workerId: string) => {};
