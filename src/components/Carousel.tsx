"use client";
import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { CldImage } from "next-cloudinary";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { cn, convertFileToKb } from "@/lib/utils";
import { Attachments } from "@/app/[locale]/admin/requests/page";
import Image from "next/image";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import { AlertDialogCancel } from "@radix-ui/react-alert-dialog";
import { X } from "lucide-react";

interface AttachmentsCarouselProps {
  attachments: Attachments[];
}
export default function CarouselWithPagination(
  attachments: AttachmentsCarouselProps
) {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);
  const attachmentsArray = attachments.attachments;
  React.useEffect(() => {
    if (!api) {
      return;
    }
    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);
  return (
    <div className="mx-auto max-w-xs sm:max-w-md lg:max-w-lg">
      <Carousel setApi={setApi} className="w-full ">
        <div className="flex items-center justify-between px-6 mb-2">
          <p>{convertFileToKb(attachmentsArray[current - 1]?.size)} KB</p>
          <p className="text-center">{attachmentsArray[current - 1]?.name}</p>
        </div>
        <CarouselContent className="flex h-[250px] flex-row-reverse ">
          {attachmentsArray.map(
            (attachment) =>
              attachment.fileType === "image" && (
                <CarouselItem key={attachment.id}>
                  <Card>
                    <CardContent>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <CldImage
                            width="500"
                            height="500"
                            src={attachment.urlPath}
                            alt="worker attachment"
                            className="object-contain cursor-pointer "
                          />
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader className="flex ">
                            <AlertDialogTitle className="flex items-center justify-center">
                              <AlertDialogCancel className="cursor-pointer">
                                <X />
                              </AlertDialogCancel>
                              {attachment.name}
                            </AlertDialogTitle>
                          </AlertDialogHeader>
                          <CldImage
                            width="1000"
                            height="1000"
                            src={attachment.urlPath}
                            alt="worker attachment"
                            className=""
                          />
                        </AlertDialogContent>
                      </AlertDialog>
                    </CardContent>
                  </Card>
                </CarouselItem>
              )
          )}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
      <div className="mt-4 flex flex-row-reverse items-center  justify-center gap-2">
        {Array.from({ length: count }).map((_, index) => (
          <button
            key={index}
            onClick={() => api?.scrollTo(index)}
            className={cn("h-3.5 w-3.5 rounded-full border-2 cursor-pointer", {
              "border-primary": current === index + 1,
            })}
          />
        ))}
      </div>
    </div>
  );
}
