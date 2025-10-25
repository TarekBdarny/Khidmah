"use client";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ChevronsLeft, ChevronsRight, Hamburger, Menu, X } from "lucide-react";
import React from "react";

const Trigger = ({ onClick }: React.ComponentProps<typeof Button>) => {
  const { toggleSidebar, open } = useSidebar();

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          data-sidebar="trigger"
          data-slot="sidebar-trigger"
          variant="ghost"
          size="icon"
          className={"size-7"}
          onClick={(event) => {
            onClick?.(event);
            toggleSidebar();
          }}
        >
          {!open ? <ChevronsRight /> : <ChevronsLeft />}

          <span className="sr-only">Toggle Sidebar</span>
        </Button>
      </TooltipTrigger>
      <TooltipContent side="right">
        {open ? "Close sidebar" : "Open sidebar"}
      </TooltipContent>
    </Tooltip>
  );
};

export default Trigger;
