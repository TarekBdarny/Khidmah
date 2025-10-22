import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

export function SkeletonCard() {
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-row items-center justify-between">
          <div className="flex flex-row items-center gap-3">
            <Skeleton className="size-12 rounded-full" />
            <div className="flex flex-col  gap-2">
              <Skeleton className="w-[100px] h-3" />
              <Skeleton className="w-[100px] h-3" />
            </div>
          </div>
          <Skeleton className="w-[130px] h-[50px] rounded-lg flex  items-center">
            <Skeleton className="size-3 rounded-full bg-primary mr-3" />
          </Skeleton>
        </div>
      </CardHeader>
      <Separator />
      <CardContent className="flex flex-col gap-4">
        <Skeleton className="w-[300px] h-4 rounded-lg"></Skeleton>
        <Skeleton className="w-[300px] h-4 rounded-lg"></Skeleton>
        <Skeleton className="w-[300px] h-4 rounded-lg"></Skeleton>
        <Skeleton className="w-[300px] h-4 rounded-lg"></Skeleton>
        <Skeleton className="w-[300px] h-4 rounded-lg"></Skeleton>
      </CardContent>
      <Separator />
      <CardFooter>
        <Skeleton className="w-full h-10 rounded-lg"></Skeleton>
      </CardFooter>
    </Card>
  );
}
