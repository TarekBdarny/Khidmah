"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

type WorkerRequestParams = {
  offDays: string[];
  maxWorkDistance: string;
  yearsOfExperience: string;
  message?: string;
  // userId?: string;
  areasOfExperience: string[];
  companyName: string;
  startTime: string;
  endTime: string;
};
export const sendWorkerRequestToSystem = async (data: WorkerRequestParams) => {
  try {
    const { userId } = await auth();

    if (!userId) return;

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) return { success: false, message: "User not found" };
    console.log(user.email);
    const existingRequest = await prisma.workerRequest.findFirst({
      where: { userId: user.id, status: "PENDING" },
    });
    if (existingRequest !== null) {
      return { success: false, message: "You already have a pending request" };
    }
    const workerRequest = await prisma.workerRequest.create({
      data: {
        companyName: data.companyName,
        yearsExperience: data.yearsOfExperience,
        maxWorkDistance: data.maxWorkDistance,
        offDays: data.offDays,
        startTime: data.startTime,
        endTime: data.endTime,
        areasOfExperience: data.areasOfExperience,
        userId: user.id,
      },
    });
    revalidatePath("/");
    return { success: true, workerRequest };
  } catch (error) {
    console.log("Error sending worker request", error);
  }
};
export const approveWorkerRequest = async (requestId: string) => {
  try {
    const targetRequest = await prisma.workerRequest.update({
      where: { id: requestId },
      data: { status: "APPROVED" },
    });
    if (!targetRequest) return { success: false, message: "Request not found" };
    // create worker profile
    const newWorker = await prisma.worker.create({
      data: {
        userId: targetRequest.userId,
        offDays: targetRequest.offDays,
        startTime: targetRequest.startTime,
        endTime: targetRequest.endTime,
        companyName: targetRequest.companyName,
        yearsExperience: targetRequest.yearsExperience,
        maxWorkDistance: targetRequest.maxWorkDistance,
      },
    });
    if (!newWorker) throw new Error("Error creating worker profile");
    //TODO: send notification to user about approval
    revalidatePath("/");
    return { success: true, newWorker };
  } catch (error) {
    console.log("Error approving worker request", error);
    return { success: false, message: "Error approving worker request" };
  }
};
export const rejectWorkerRequest = async (requestId: string) => {
  try {
    const targetRequest = await prisma.workerRequest.update({
      where: { id: requestId },
      data: { status: "REJECTED" },
    });
    if (!targetRequest) return { success: false, message: "Request not found" };
    revalidatePath("/");
    return { success: true, targetRequest };
  } catch (error) {
    console.log("Error rejecting worker request", error);
  }
};
export const getUserRequests = async (userId: string) => {
  try {
    const userRequests = await prisma.workerRequest.findMany({
      where: { userId },
    });
    return userRequests ? userRequests : [];
  } catch (error) {
    console.log("Error getting user requests", error);
  }
};
export const getAllWorkerRequests = async (order: "asc" | "desc" = "desc") => {
  try {
    const allWorkersRequests = await prisma.workerRequest.findMany({
      orderBy: { createdAt: order },
      include: {
        user: true,
        attachments: true,
      },
    });
    return allWorkersRequests;
  } catch (error) {
    console.log("Error getting all worker requests", error);
  }
};
