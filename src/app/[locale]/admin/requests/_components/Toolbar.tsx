"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ArrowDownUp, ArrowUpDown, Search } from "lucide-react";
import StatusSelect from "./StatusSelect";
import { useState } from "react";
import { useTranslations } from "next-intl";

const ToolBar = ({
  length,
  order,
  setOrder,
  status,
  setStatus,
  setSearchedCompany,
}: ToolBarProps & StatusSelectProps) => {
  const t = useTranslations("BecomeWorkerForm");
  return (
    <div
      className="w-full  flex flex-col md:flex-row items-center border-1  gap-4 p-4 
    mx-auto
    "
    >
      <InputGroup className="w-full md:w-3/4 pr-2">
        <InputGroupInput
          onChange={({ target }) => setSearchedCompany(target.value)}
          placeholder={t("searchByCompanyName")}
        />
        <InputGroupAddon align="inline-end">
          <Button variant={"ghost"}>
            <Search />
          </Button>
        </InputGroupAddon>
      </InputGroup>
      <div className="flex items-center gap-2 w-full">
        <StatusSelect status={status} setStatus={setStatus} />
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={"outline"}
              onClick={() =>
                setOrder((prev) => (prev === "desc" ? "asc" : "desc"))
              }
            >
              {order === "desc" ? <ArrowUpDown /> : <ArrowDownUp />}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            {order === "desc" ? t("descendingOrder") : t("ascendingOrder")}
          </TooltipContent>
        </Tooltip>
        <Badge className="text-white p-2 text-">
          {t("requestsFound")} {length}
        </Badge>
      </div>
    </div>
  );
};
export default ToolBar;
