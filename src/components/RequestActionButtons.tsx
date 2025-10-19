"use client";
import React from "react";
import { Button } from "./ui/button";
import {
  approveWorkerRequest,
  rejectWorkerRequest,
} from "@/actions/workerRequest.action";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

const RequestActionButtons = ({ requestId }: { requestId: string }) => {
  const t = useTranslations("BecomeWorkerForm");
  const handleApprove = async () => {
    const res = await approveWorkerRequest(requestId);
    if (res.success) {
      toast.success("Request approved and worker created successfully");
    } else {
      toast.error(res.message);
    }
  };
  const handleReject = async () => {
    const res = await rejectWorkerRequest(requestId);
    if (res?.success) {
      toast.success("Request rejected successfully");
    } else {
      toast.error(res?.message);
    }
  };
  return (
    <div className=" w-full flex gap-10 mt-8">
      <Button variant={"action"} onClick={handleApprove} className="flex-1">
        {t("approveButton")}
      </Button>
      <Button variant={"destructive"} className="flex-1" onClick={handleReject}>
        {t("declineButton")}
      </Button>
    </div>
  );
};

export default RequestActionButtons;
