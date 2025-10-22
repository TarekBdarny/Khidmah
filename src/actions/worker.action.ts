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
export const getAllWorkersCities = async (): Promise<string[]> => {
  try {
    const cities = await prisma.user.findMany({
      select: {
        city: true,
      },
      distinct: ["city"],
      where: {
        city: {
          not: null, // exclude null cities
        },
        worker: {
          NOT: undefined,
        },
      },
      orderBy: {
        city: "asc",
      },
    });

    // Extract just the city strings
    cities.unshift({ city: "All" });
    return cities.map((city) => city.city as string);
  } catch (error) {
    console.error("Error fetching worker cities:", error);
    return [];
  }
};
export async function getWorkersExplicit(
  city?: string,
  categories?: string[],
  status: string = "All"
) {
  try {
    const hasCity = city && city.trim() !== "";
    const hasCategories = categories && categories.length > 0;
    const hasStatus = status !== "All";
    let allWorkers;
    if (hasStatus) {
      allWorkers = await prisma.worker.findMany({
        where: {
          availableToWork: status === "Available" ? true : false,
        },
        include: {
          user: {
            include: {
              ratingsGiven: true,
            },
          },
        },
      });
    } else {
      allWorkers = await prisma.worker.findMany({
        include: {
          user: {
            include: {
              ratingsGiven: true,
            },
          },
        },
      });
    }

    if (!hasCity && !hasCategories) {
      return { success: true, data: allWorkers };
    }

    // Case 1: No filters - fetch all workers
    // if (!hasCity && !hasCategories && !hasStatus) {
    //   const workers = await prisma.worker.findMany({
    //     include: {
    //       user: true, // Include user data to access city
    //     },
    //     orderBy: { createdAt: "desc" },
    //   });
    //   return { success: true, data: workers };
    // }
    if (hasCity && !hasCategories) {
      const workers = allWorkers.filter((worker) => worker.user.city === city);
      return { success: true, data: workers };
    }
    // // Case 2: Only city filter
    // if (hasCity && !hasCategories && hasStatus) {
    //   const workers = await prisma.worker.findMany({
    //     where: {
    //       user: {
    //         city: { equals: city, mode: "insensitive" },
    //       },
    //       availableToWork: status !== "All" && {
    //         equals: status === "Available" ? true : false,
    //       },
    //     },
    //     include: {
    //       user: true,
    //     },
    //     orderBy: { createdAt: "desc" },
    //   });
    //   return { success: true, data: workers };
    // }
    if (!hasCity && hasCategories) {
      const workers = allWorkers.filter((worker) =>
        worker.areasOfExperience.some((category) =>
          categories.includes(category)
        )
      );
      return { success: true, data: workers };
    }
    // // Case 3: Only categories filter
    // if (!hasCity && hasCategories && hasStatus) {
    //   const workers = await prisma.worker.findMany({
    //     where: {
    //       areasOfExperience: { hasSome: categories },
    //       availableToWork: status !== "All" && {
    //         equals: status === "Available" ? true : false,
    //       },
    //     },
    //     include: {
    //       user: true,
    //     },
    //     orderBy: { createdAt: "desc" },
    //   });
    //   return { success: true, data: workers };
    // }

    // // Case 4: Both filters
    // const workers = await prisma.worker.findMany({
    //   where: {
    //     AND: [
    //       {
    //         user: {
    //           city: { equals: city, mode: "insensitive" },
    //         },
    //       },
    //       { areasOfExperience: { hasSome: categories } },
    //       {
    //         availableToWork: status !== "All" && {
    //           equals: status === "Available" ? true : false,
    //         },
    //       },
    //     ],
    //   },
    //   include: {
    //     user: true,
    //   },
    //   orderBy: { createdAt: "desc" },
    // });
    // return { success: true, data: workers };
    const workers = allWorkers.filter((worker) => {
      worker.areasOfExperience.some((category) =>
        category.includes(category)
      ) && worker.user.city === city;
    });
    return { success: true, data: workers };
  } catch (error) {
    console.error("Error fetching workers:", error);
    return { success: false, error: "Failed to fetch workers", data: [] };
  }
}

export const applyForJob = async () => {};
