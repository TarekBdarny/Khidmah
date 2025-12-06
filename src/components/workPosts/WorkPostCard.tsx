"use client";

import { WorkPost, User, SavedWorkPost, WorkApplication } from "@prisma/client";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  MapPin,
  Calendar,
  DollarSign,
  Bookmark,
  BookmarkCheck,
} from "lucide-react";
import { useLocale } from "next-intl";
import { format, formatDistanceToNow } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ApplyDialog } from "./ApplyDialog";
import { useState } from "react";
import { toggleSaveWorkPost } from "@/actions/workPost.action";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface WorkPostCardProps {
  post: WorkPost & {
    client: User;
    savedBy?: SavedWorkPost[];
    applications?: WorkApplication[];
  };
}

export function WorkPostCard({ post }: WorkPostCardProps) {
  const locale = useLocale();
  const isArabic = locale === "ar";

  const [isSaved, setIsSaved] = useState(
    post.savedBy && post.savedBy.length > 0
  );
  const [hasApplied, setHasApplied] = useState(
    post.applications && post.applications.length > 0
  );

  const city = isArabic ? post.cityAr : post.cityHe;
  const address = isArabic ? post.addressAr : post.addressHe;
  const locationString = [city, address].filter(Boolean).join(", ");

  const handleSave = async () => {
    // Optimistic update
    const newState = !isSaved;
    setIsSaved(newState);

    const result = await toggleSaveWorkPost(post.id);
    if (!result?.success) {
      setIsSaved(!newState); // Revert
      toast.error(result?.message || "Failed to save");
    } else {
      toast.success(newState ? "Post saved" : "Post removed from saved");
    }
  };

  const isNew =
    new Date(post.createdAt).getTime() > Date.now() - 24 * 60 * 60 * 1000;
  const timeAgo = formatDistanceToNow(new Date(post.createdAt), {
    addSuffix: true,
  });

  return (
    <Card className="w-full hover:shadow-lg transition-shadow duration-200 flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 border">
              <AvatarImage
                src={post.client.profilePic || ""}
                alt={post.client.firstName}
              />
              <AvatarFallback>
                {post.client.firstName[0]}
                {post.client.lastName[0]}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <Link
                href={`/profile/${post.client.id}`}
                className="font-semibold text-sm hover:underline"
              >
                {post.client.firstName} {post.client.lastName}
              </Link>
              <span className="text-xs text-muted-foreground">{timeAgo}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isNew && (
              <Badge className="bg-green-500 hover:bg-green-600">New</Badge>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={handleSave}
              className={cn(
                "text-muted-foreground hover:text-primary",
                isSaved && "text-primary"
              )}
            >
              {isSaved ? (
                <BookmarkCheck className="w-5 h-5" />
              ) : (
                <Bookmark className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-2 flex-grow">
        <h3 className="font-semibold text-lg line-clamp-1 mb-1">
          {post.description.substring(0, 50)}
          {post.description.length > 50 && "..."}
        </h3>
        <div className="flex items-center text-muted-foreground text-sm mb-3">
          <MapPin className="w-3 h-3 mr-1" />
          <span>{locationString || "Location not specified"}</span>
        </div>

        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
          {post.description}
        </p>

        <div className="flex flex-wrap gap-2 mb-4">
          {post.categories.map((cat) => (
            <Badge key={cat} variant="secondary" className="text-sm px-3 py-1">
              {cat}
            </Badge>
          ))}
          {post.isUrgent && (
            <Badge variant="destructive" className="text-sm px-3 py-1">
              Urgent
            </Badge>
          )}
        </div>

        <div className="grid grid-cols-2 gap-2 text-sm mt-auto">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-primary" />
            <span>{format(new Date(post.startDate), "MMM d, yyyy")}</span>
          </div>
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-primary" />
            <span>{post.payment > 0 ? post.payment : "Negotiable"}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-2 mt-auto">
        {hasApplied ? (
          <Button className="w-full" variant="outline" disabled>
            Applied
          </Button>
        ) : (
          <ApplyDialog
            postId={post.id}
            postPayment={post.payment}
            onSuccess={() => setHasApplied(true)}
            trigger={<Button className="w-full">Apply Now</Button>}
          />
        )}
      </CardFooter>
    </Card>
  );
}
