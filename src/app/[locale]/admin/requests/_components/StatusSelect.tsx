import React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTranslations } from "next-intl";

const StatusSelect = ({ status, setStatus }: StatusSelectProps) => {
  const t = useTranslations("BecomeWorkerForm");
  const handleValueChange = (
    value: "ALL" | "PENDING" | "APPROVED" | "REJECTED"
  ) => {
    setStatus(value);
  };
  return (
    <Select dir="rtl" onValueChange={handleValueChange}>
      <SelectTrigger className="w-full md:w-64">
        <SelectValue placeholder={t("selectAStatus")} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>{t("statuses")}</SelectLabel>
          <SelectItem
            value="ALL"
            className={`${status === "ALL" && "bg-primary"}`}
          >
            {t("ALL")}
          </SelectItem>
          <SelectItem
            value="PENDING"
            className={`${status === "PENDING" && "bg-primary"}`}
          >
            {t("PENDING")}
          </SelectItem>
          <SelectItem
            value="APPROVED"
            className={`${status === "APPROVED" && "bg-primary"}`}
          >
            {t("APPROVED")}
          </SelectItem>
          <SelectItem
            value="REJECTED"
            className={`${status === "REJECTED" && "bg-primary"}`}
          >
            {t("REJECTED")}
          </SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default StatusSelect;
