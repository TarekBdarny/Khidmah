"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

type WorkerRequestParams = {
  offDays: string[];
  maxWorkDistance?: number;
  yearsExperience?: number;
  attachments?: string[]; // URLs or file paths (PDFs)
  message?: string;
  userId: string;
  companyName?: string;
  workHours: Record<string, { start: string; end: string }>;
};
export const sendWorkerRequestToSystem = async (data: WorkerRequestParams) => {
  try {
    const { userId } = data;

    if (!userId) return;

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) return { success: false, message: "User not found" };
    const existingRequest = await prisma.workerRequest.findFirst({
      where: { userId, status: "PENDING" },
    });
    if (existingRequest) {
      return { success: false, message: "You already have a pending request" };
    }
    const workerRequest = await prisma.workerRequest.create({
      data: {
        ...data,
      },
    });
    revalidatePath("/");
    return { success: true, workerRequest };
  } catch (error) {
    console.log("Error sending worker request", error);
    return { success: false, message: "Error sending worker request" };
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
        workHours: targetRequest.workHours || {},
        companyName: targetRequest.companyName,
        yearsExperience: targetRequest.yearsExperience,
        maxWorkDistance: targetRequest.maxWorkDistance,
        attachments: targetRequest.attachments,
      },
    });
    if (!newWorker) throw new Error("Error creating worker profile");
    //TODO: send notification to user about approval
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
export const getAllWorkerRequests = async () => {
  try {
    const allWorkersRequests = await prisma.workerRequest.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        user: true,
      },
    });
    return allWorkersRequests;
  } catch (error) {
    console.log("Error getting all worker requests", error);
  }
};
