import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { ArrowLeft, Bell, CheckCircle, ExternalLink, Mail } from "lucide-react";

import React from "react";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import Link from "next/link";
import { useTranslations } from "next-intl";

type Props = {
  role: "WORKER" | "ADMIN";
};
const EmptyComponent = ({ role }: Props) => {
  const t = useTranslations("EmptyComponent");
  return (
    <Empty className="p4 ">
      <div className=" rounded-lg border-1 p-8 flex flex-col items-center justify-center w-2xl">
        <EmptyHeader>
          <EmptyMedia variant="icon" className="size-12">
            <CheckCircle className="text-green-600" strokeWidth={2} />
          </EmptyMedia>
          <EmptyTitle className="text-2xl">
            {role === "WORKER" ? t("workerTitle") : t("adminTitle")}
          </EmptyTitle>
          <EmptyDescription className="text-lg ">
            {role === "WORKER" ? t("workerDescription") : t("adminDescription")}
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 border-2 border-green-600 rounded-full mb-8 my-10">
            <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse"></div>
            <span className="text-green-700 font-semibold">
              {role === "WORKER" ? t("workerBadge") : t("adminBadge")}
            </span>
          </div>
          <div className="w-full flex items-center justify-center flex-col-reverse sm:flex-row gap-4 max-w-md  ">
            <Button
              variant={"outline"}
              className="flex-1 w-full
             font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2
            "
            >
              <ExternalLink className="w-4 h-4" />
              {t("workerProfile")}
            </Button>
            <Button
              variant={"action"}
              className="flex-1 w-full  font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
            >
              {t("workerDashboard")}
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </div>
          <Separator className="my-3" />
          <div className="flex flex-col w-full items-center justify-center gap-5">
            <p className=" w-full">{t("helpDesc")}</p>
            <Link
              href="/support"
              className="flex gap-3 text-lg items-center justify-center text-primary "
            >
              {t("contactSupport")}
              <Mail className="w-5 h-5" />
            </Link>
          </div>
        </EmptyContent>
      </div>
    </Empty>
  );
};

export default EmptyComponent;
