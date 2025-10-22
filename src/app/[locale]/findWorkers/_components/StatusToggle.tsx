import * as React from "react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function StatusToggle({
  setSelectStatus,
  selectStatus,
}: {
  setSelectStatus: React.Dispatch<React.SetStateAction<string>>;
  selectStatus: string;
}) {
  const handleValueChange = (value: string) => {
    setSelectStatus(value);
  };
  return (
    <Select dir="rtl" onValueChange={handleValueChange} value={selectStatus}>
      <SelectTrigger className="w-full md:w-[200px]">
        <SelectValue placeholder={selectStatus} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Select a Status</SelectLabel>
          <SelectItem value="All">All</SelectItem>
          <SelectItem value="Available">Available</SelectItem>
          <SelectItem value="Busy">Busy</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
export default StatusToggle;
