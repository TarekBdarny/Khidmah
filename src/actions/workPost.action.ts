"use server";

import { JobPosting } from "@/app/[locale]/addWork/page";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export const postWork = async (data: JobPosting) => {
  try {
    const { userId } = await auth();

    if (!userId) return;

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) return { success: false, message: "User not found" };
    const workPost = await prisma.workPost.create({
      data: {
        description: data.description,
        lat: data.location.lat,
        lgn: data.location.lgn,
        address: data.location.address,
        postalCode: data.location.postalCode,
        city: data.location.city,
        payment: data.price === "unknown" ? 0 : data.price,
        isUrgent: data.isUrgent,
        startDate: data.startDate || "",
        endDate: data.endDate || "",
        clientId: user.id,
        categories: [...data.categories],
        workSiteLink: data.workSiteLink,
      },
    });
    revalidatePath("/");
    return { success: true, workPost };
  } catch (error) {
    console.log("Error posting work", error);
    return { success: false, message: "Error posting work" };
  }
};
