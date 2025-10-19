"use client";
import React, { useEffect, useState } from "react";
import {
  ArrowDownUp,
  ArrowUpDown,
  Briefcase,
  Building2,
  Clock,
  MapPin,
  Search,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

import { getAllWorkerRequests } from "@/actions/workerRequest.action";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ProfilePicture from "@/components/reuseable/avatar/ProfilePicture";
import AttachmentsCarousel from "@/components/Carousel";
import { useTranslations } from "next-intl";
import RequestActionButtons from "@/components/RequestActionButtons";
import ToolBar from "./_components/Toolbar";
import EmptyRequests from "./_components/EmptyRequests";

type allRequests = Awaited<ReturnType<typeof getAllWorkerRequests>>;
const page = () => {
  const [allRequests, setAllRequests] = useState<allRequests>([]);
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<"asc" | "desc">("desc");

  const [status, setStatus] = useState<
    "PENDING" | "APPROVED" | "REJECTED" | "ALL"
  >("ALL");

  const [searchedCompany, setSearchedCompany] = useState<string>("");
  const tempArray = allRequests;
  const requestsByCompanyName = tempArray?.filter((request) =>
    request.companyName?.includes(searchedCompany)
  );
  const length =
    searchedCompany !== ""
      ? requestsByCompanyName?.length
      : status !== "ALL"
      ? allRequests?.filter((request) => request.status === status).length
      : allRequests?.length;

  useEffect(() => {
    setLoading(true);
    const getAllRequests = async () => {
      const requests = await getAllWorkerRequests(order);
      setAllRequests(requests);
      setLoading(false);
    };
    getAllRequests();
  }, [order]);

  if (loading && allRequests?.length === 0) return;
  return (
    <section className="">
      <ToolBar
        {...{
          length,
          order,
          setOrder,
          status,
          setStatus,
          setSearchedCompany,
        }}
      />
      <div className="p-4 flex flex-col gap-4">
        {searchedCompany === "" ? (
          <RequestByStatus status={status} allRequests={allRequests} />
        ) : (
          requestsByCompanyName?.map((request) => (
            <RequestCard key={request.id} {...request} />
          ))
        )}
        {searchedCompany !== "" && requestsByCompanyName?.length === 0 ? (
          <EmptyRequests
            use="search"
            status={status}
            companyName={searchedCompany}
          />
        ) : (
          ""
        )}
      </div>
    </section>
  );
};
const RequestByStatus = ({
  status,
  allRequests,
}: {
  status: "ALL" | "PENDING" | "APPROVED" | "REJECTED";
  allRequests: allRequests;
}) => {
  const requestsByStatus = allRequests?.filter(
    (request) => request.status === status
  );
  return (
    <>
      {status === "ALL" ? (
        allRequests?.length === 0 ? (
          <EmptyRequests use="requests" status="ALL" />
        ) : (
          allRequests?.map((request) => (
            <RequestCard key={request.id} {...request} />
          ))
        )
      ) : requestsByStatus?.length === 0 ? (
        <p>
          <EmptyRequests use="status" status={status} />
        </p>
      ) : (
        requestsByStatus?.map((request) => (
          <RequestCard key={request.id} {...request} />
        ))
      )}
    </>
  );
};
const RequestCard = (props: RequestCardProps) => {
  const t = useTranslations("BecomeWorkerForm");
  const {
    areasOfExperience,
    id,
    attachments,
    companyName,
    user,
    status,
    endTime,
    startTime,
    maxWorkDistance,
    offDays,
    yearsExperience,
  } = props;
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ProfilePicture
              fallback="TB"
              profilePic="https://github.com/shadcn.png"
            />
            <div className="flex flex-col gap-1">
              <CardTitle>{companyName}</CardTitle>
              <CardDescription>{`${user.firstName} ${user.lastName}`}</CardDescription>
            </div>
          </div>
          <Badge
            variant={"outline"}
            className={`p-4 flex items-center gap-2 ${
              status === "APPROVED"
                ? "bg-primary"
                : status === "REJECTED"
                ? "bg-destructive"
                : ""
            }`}
          >
            {status}
            {status === "PENDING" && (
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gray-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-gray-500"></span>
              </span>
            )}
          </Badge>
        </div>
      </CardHeader>
      <Separator />
      <CardContent className="flex w-full flex-col lg:flex-row">
        {/* relative content  */}
        <div className="flex-1  flex flex-col gap-3">
          <RequestFieldItem label={t("companyName")} value={companyName}>
            <Building2 />
          </RequestFieldItem>
          <RequestFieldItem
            label={t("yearsOfExperience")}
            value={yearsExperience}
          >
            <Briefcase />
          </RequestFieldItem>
          <RequestFieldItem
            label={t("maxWorkDistance")}
            value={maxWorkDistance}
          >
            <MapPin />
          </RequestFieldItem>
          <RequestFieldItem
            label={t("workHours")}
            value={`${startTime} - ${endTime}`}
          >
            <Clock />
          </RequestFieldItem>
          <div className="w-full p-3 flex flex-col gap-2">
            <p>{t("offDays")}</p>
            <div className="flex items-center gap-3">
              {offDays.map((day) => (
                <Badge
                  key={day}
                  variant="outline"
                  className=" border text-lg  px-5 py-2"
                >
                  {day}
                </Badge>
              ))}
            </div>
          </div>
          <div className="w-full p-3 flex flex-col gap-2">
            <p>{t("workCategories")}</p>
            <div className="flex items-center gap-3">
              {areasOfExperience.map((area) => (
                <Badge
                  key={area}
                  variant="outline"
                  className=" border text-lg  px-5 py-2"
                >
                  {area}
                </Badge>
              ))}
            </div>
          </div>
          {status === "PENDING" && (
            <div className="hidden lg:block">
              <RequestActionButtons requestId={id} />
            </div>
          )}
        </div>
        {/* carousel for attachments */}
        <div className="flex-1">
          <AttachmentsCarousel attachments={attachments} />
        </div>
        {status === "PENDING" && (
          <div className="block lg:hidden">
            <RequestActionButtons requestId={id} />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const RequestFieldItem = ({ label, value, children }: RequestFieldItem) => {
  return (
    <div className="flex items-center  bg-accent  p-3 rounded-lg">
      <div className="flex flex-col items-center gap-1 ">
        <div className="flex items-center gap-2">
          {children}
          <span className="text-sm text-muted-foreground">{label}</span>
        </div>
        <span className="font-semibold text-base">{value}</span>
      </div>
    </div>
  );
};

export default page;
