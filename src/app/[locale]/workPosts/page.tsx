import { getWorkPosts } from "@/actions/workPost.action";
import { WorkPostCard } from "@/components/workPosts/WorkPostCard";
import { WorkPostFilter } from "@/components/workPosts/WorkPostFilter";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
  params: Promise<{ locale: string }>;
};
export default async function WorkPostsPage({ searchParams, params }: Props) {
  const resolvedSearchParams = await searchParams;
  const resolvedParams = await params;
  const t = await getTranslations("WorkPosts"); // Assuming translations exist or fallback

  const page = Number(resolvedSearchParams.page) || 1;
  const limit = 10;
  const category =
    typeof resolvedSearchParams.category === "string"
      ? resolvedSearchParams.category
      : undefined;
  const lat = resolvedSearchParams.lat
    ? parseFloat(resolvedSearchParams.lat as string)
    : undefined;
  const lgn = resolvedSearchParams.lgn
    ? parseFloat(resolvedSearchParams.lgn as string)
    : undefined;
  const maxDistance = resolvedSearchParams.maxDistance
    ? parseFloat(resolvedSearchParams.maxDistance as string)
    : undefined;

  const { userId } = await auth();
  let defaultMaxDistance = 50;

  if (userId) {
    const worker = await prisma.worker.findUnique({
      where: { userId },
      select: { maxWorkDistance: true },
    });
    if (worker?.maxWorkDistance) {
      const parsed = parseInt(worker.maxWorkDistance);
      if (!isNaN(parsed)) {
        defaultMaxDistance = parsed;
      }
    }
  }

  const {
    data: posts,
    total,
    success,
  } = await getWorkPosts({
    page,
    limit,
    category,
    lat,
    lgn,
    maxDistance,
  });

  const totalPages = total ? Math.ceil(total / limit) : 0;

  return (
    <div className="container mx-auto py-8 px-4 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Find Work</h1>
        <p className="text-muted-foreground">
          Browse available job opportunities or filter by category and location.
        </p>
      </div>

      <WorkPostFilter defaultMaxDistance={defaultMaxDistance} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {success && posts && posts.length > 0 ? (
          posts.map((post) => <WorkPostCard key={post.id} post={post} />)
        ) : (
          <div className="col-span-full text-center py-12 text-muted-foreground">
            No work posts found matching your criteria.
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-8">
          <Button
            variant="outline"
            size="icon"
            disabled={page <= 1}
            asChild={page > 1}
          >
            {page > 1 ? (
              <Link
                href={{
                  query: { ...resolvedSearchParams, page: page - 1 },
                }}
              >
                <ChevronLeft className="h-4 w-4" />
              </Link>
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
          <span className="text-sm">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="icon"
            disabled={page >= totalPages}
            asChild={page < totalPages}
          >
            {page < totalPages ? (
              <Link
                href={{
                  query: { ...resolvedSearchParams, page: page + 1 },
                }}
              >
                <ChevronRight className="h-4 w-4" />
              </Link>
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
