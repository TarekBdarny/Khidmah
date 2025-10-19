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

const StatusSelect = ({ status, setStatus }: StatusSelectProps) => {
  const handleValueChange = (
    value: "ALL" | "PENDING" | "APPROVED" | "REJECTED"
  ) => {
    setStatus(value);
  };
  return (
    <Select dir="rtl" onValueChange={handleValueChange}>
      <SelectTrigger className="w-full md:w-64">
        <SelectValue placeholder="Select a Status" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Statuses</SelectLabel>
          <SelectItem
            value="ALL"
            className={`${status === "ALL" && "bg-primary"}`}
          >
            All
          </SelectItem>
          <SelectItem
            value="PENDING"
            className={`${status === "PENDING" && "bg-primary"}`}
          >
            Pending
          </SelectItem>
          <SelectItem
            value="APPROVED"
            className={`${status === "APPROVED" && "bg-primary"}`}
          >
            Approved
          </SelectItem>
          <SelectItem
            value="REJECTED"
            className={`${status === "REJECTED" && "bg-primary"}`}
          >
            Rejected
          </SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default StatusSelect;
