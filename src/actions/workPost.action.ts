"use server";

import { JobPosting } from "@/app/[locale]/addWork/page";
import { prisma } from "@/lib/prisma";
import { getLocationInLanguage } from "@/lib/utils";
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
    const [hebrew, arabic] = await Promise.all([
      getLocationInLanguage(data.location.lat, data.location.lgn, "he"),
      getLocationInLanguage(data.location.lat, data.location.lgn, "ar"),
    ]);
    const workPost = await prisma.workPost.create({
      data: {
        description: data.description,
        lat: data.location.lat,
        lgn: data.location.lgn,
        addressAr: arabic?.formattedAddress,
        addressHe: hebrew?.formattedAddress,
        cityAr: arabic?.city,
        cityHe: hebrew?.city,
        postalCode: data.location.postalCode,
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
