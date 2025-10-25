import { Skeleton } from "@/components/ui/skeleton";

export const LoadingSidebarSkeleton = ({ open }: { open: boolean }) => {
  return open ? (
    <div className="w-full  h-10 rounded-lg">
      <div className="flex items-center gap-2  ">
        <Skeleton className="size-10 rounded-full" />
        <div className="flex flex-col gap-1">
          <Skeleton className="w-[120px] h-3" />
          <Skeleton className="w-[100px] h-3" />
        </div>
      </div>
    </div>
  ) : (
    <div className="w-full h-full rounded-lg p-1 ">
      <Skeleton className="w-full h-10 rounded-full" />
    </div>
  );
};
export const LoadingDialogSkeleton = () => {
  return LoadingSidebarSkeleton({ open: true });
};
export const LoadingChatUserSkeleton = () => {
  return (
    <div className="flex items-center justify-between">
      <Skeleton className="size-5 rounded-full" />
      <div className="flex items-center flex-row gap-2 p-2 lg:p-4">
        <Skeleton className="w-[130px] h-3" />
        <Skeleton className="size-8 rounded-full" />
        <Skeleton className="size-5 rounded-full" />
      </div>
    </div>
  );
};
export const LoadingChatMessageSkeleton = () => {
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      <div className="flex flex-col gap-3 px-2">
        {/* other user */}
        <div className="flex  justify-end gap-2">
          <Skeleton className="w-[200px] h-[50px] rounded-t-2xl rounded-r-2xl px-4 py-3" />
        </div>
        <div className="flex  justify-end gap-2">
          <Skeleton className="w-[200px] h-[50px] rounded-t-2xl rounded-r-2xl px-4 py-3" />
        </div>
      </div>
      {/* my user */}
      <div className="flex  justify-start gap-2">
        <Skeleton className="w-[200px] h-[50px] rounded-t-2xl rounded-r-2xl px-4 py-3" />
      </div>
      <div className="flex  justify-end gap-2">
        <Skeleton className="w-[200px] h-[50px] rounded-t-2xl rounded-r-2xl px-4 py-3" />
      </div>
      <div className="flex  justify-start gap-2">
        <Skeleton className="w-[200px] h-[50px] rounded-t-2xl rounded-r-2xl px-4 py-3" />
      </div>
      <div className="flex  justify-start gap-2">
        <Skeleton className="w-[200px] h-[50px] rounded-t-2xl rounded-r-2xl px-4 py-3" />
      </div>
      <div className="flex  justify-start gap-2">
        <Skeleton className="w-[200px] h-[50px] rounded-t-2xl rounded-r-2xl px-4 py-3" />
      </div>
      <div className="flex  justify-end gap-2">
        <Skeleton className="w-[200px] h-[50px] rounded-t-2xl rounded-r-2xl px-4 py-3" />
      </div>
      <div className="flex  justify-end gap-2">
        <Skeleton className="w-[200px] h-[50px] rounded-t-2xl rounded-r-2xl px-4 py-3" />
      </div>
      <div className="flex  justify-start gap-2">
        <Skeleton className="w-[200px] h-[50px] rounded-t-2xl rounded-r-2xl px-4 py-3" />
      </div>
      <div className="flex  justify-end gap-2">
        <Skeleton className="w-[200px] h-[50px] rounded-t-2xl rounded-r-2xl px-4 py-3" />
      </div>
    </div>
  );
};
