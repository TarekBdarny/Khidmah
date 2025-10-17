"use server";

import { prisma } from "@/lib/prisma";

export const fetchCategoriesByLocale = async (locale: string) => {
  if (!locale) throw new Error("Locale is required");
  try {
    const wantedCategories = await prisma.categoryTranslation.findMany({
      where: {
        language: locale,
      },
    });

    return wantedCategories;
  } catch (error) {
    console.log("Error fetching categories", error);
  }
};
