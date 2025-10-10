"use server";
import { prisma } from "@/lib/prisma";

export const updateWorkerProfile = async () => {};
export const deleteWorkerProfile = async (workerId: string) => {
  try {
    const deletedWorker = await prisma.worker.delete({
      where: {
        id: workerId,
      },
    });
    if (!deletedWorker) {
      return { success: false, message: "Worker not found" };
    }
    return { success: true, message: "Worker deleted successfully" };
  } catch (error) {}
};
export const getAllWorkers = async () => {
  try {
    const allWorkers = await prisma.worker.findMany();
    return allWorkers;
  } catch (error) {
    console.log(error);
  }
};
export const getWorkerById = async (workerId: string) => {
  try {
    const targetWorker = await prisma.worker.findUnique({
      where: {
        id: workerId,
      },
      include: {
        user: true,
        previousWorks: true,
        ratings: true,
      },
    });
    if (!targetWorker) {
      return { success: false, message: "Worker not found" };
    }
    return { success: true, targetWorker };
  } catch (error) {
    console.log(error);
  }
};

export const applyForJob = async () => {};
