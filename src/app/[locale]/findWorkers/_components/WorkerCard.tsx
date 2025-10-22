import { getWorkersExplicit } from "@/actions/worker.action";
import ProfilePicture from "@/components/reuseable/avatar/ProfilePicture";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  ArrowUpRight,
  Calendar,
  Clock,
  MapPin,
  Navigation,
  Phone,
  Star,
} from "lucide-react";
import Link from "next/link";
import React from "react";
type Workers = Awaited<ReturnType<typeof getWorkersExplicit>>;
export type Worker = Workers["data"][0];

const WorkerCard = ({
  id,
  user,
  yearsExperience,
  maxWorkDistance,
  areasOfExperience,
  companyName,
  availableToWork,
  startTime,
  endTime,
  offDays,
}: Worker) => {
  const userInitials = `${user.firstName[0]
    .slice(0, 1)
    .toUpperCase()}${user.lastName[0].slice(0, 1).toUpperCase()}`;
  const userFullName = `${user.firstName} ${user.lastName}`;
  const workTime = `${startTime} - ${endTime}`;
  const ratings = user.ratingsGiven;

  return (
    <Card className="flex flex-col gap-4">
      {/* profile picture + names */}
      <CardHeader>
        <div className=" flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ProfilePicture
              useCase="large"
              profilePic={user.profilePic || ""}
              fallback={userInitials ?? "US"}
            />
            <div className="flex items-center gap-2 w-fit">
              <div className="flex flex-col gap-1">
                <Link href={"/#"} className="flex flex-col ">
                  <h2 className="hover:underline text-lg font-semibold">
                    {companyName}
                  </h2>
                  <p className="text-muted-foreground text-sm">
                    {userFullName}
                  </p>
                </Link>
                <div className="flex items-center gap-1.5">
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-3.5 h-3.5 ${
                          star <= 4
                            ? "fill-primary text-primary"
                            : "fill-gray-600 text-gray-600"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-primary text-sm font-semibold">
                    4.0
                  </span>
                  <span className="text-gray-500 text-xs">(127)</span>
                </div>
              </div>
            </div>
          </div>
          <AnimatedBadge status={availableToWork} />
        </div>
      </CardHeader>
      <Separator />
      <CardContent className="">
        <div className="flex space-y-3 flex-col gap-2">
          <div className="flex flex-wrap gap-2">
            {areasOfExperience.map((area, index) => (
              <Badge key={index} variant={"secondary"} className="p-3 text-sm ">
                {area}
              </Badge>
            ))}
          </div>
          <div className="flex gap-2 items-center">
            <MapPin size={20} />
            <p>{user.city}</p>
          </div>
          <div className="flex gap-2 items-center">
            <Phone size={20} />
            <p>{user.phoneNumber}</p>
          </div>
          <div className="flex gap-2 items-center">
            <Clock size={20} />
            <p>{workTime}</p>
          </div>
          <div className="flex gap-2 items-center">
            <Calendar size={20} />
            {offDays.length === 0 ? (
              <p>Available All Days</p>
            ) : (
              <p>
                Off:
                {offDays.map((day, index) =>
                  index === offDays.length - 1 ? (
                    <span key={day}>{day}</span>
                  ) : (
                    <span key={day}>{day}, </span>
                  )
                )}
              </p>
            )}
          </div>

          <div className="flex gap-2 items-center">
            <Navigation size={20} />
            <p>{maxWorkDistance} </p>
          </div>
        </div>
      </CardContent>
      <Separator />
      <CardFooter className="my-2">
        <Button className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold py-3.5 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 hover:-translate-y-1 active:scale-[0.98]">
          <ArrowUpRight />
          Contact
        </Button>
      </CardFooter>
    </Card>
  );
};

export default WorkerCard;

const AnimatedBadge = ({ status }: { status: boolean }) => {
  const isAvailable = status;
  return (
    <div className="flex items-center gap-2">
      <span
        className={`
          relative inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium bg-transparent border-1
          ${isAvailable ? " text-primary" : " text-red-800"}
        `}
      >
        {/* Animated pulse dot */}
        <span className="relative flex h-3 w-3">
          <span
            className={`
              animate-ping absolute inline-flex h-full w-full rounded-full opacity-75
              ${isAvailable ? "bg-green-400" : "bg-red-400"}
            `}
          ></span>
          <span
            className={`
              relative inline-flex rounded-full h-3 w-3
              ${isAvailable ? "bg-green-500" : "bg-red-500"}
            `}
          ></span>
        </span>

        {status ? "Available" : "Busy"}
      </span>
    </div>
  );
};
