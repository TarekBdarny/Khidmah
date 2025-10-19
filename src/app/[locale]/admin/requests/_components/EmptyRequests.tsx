import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { FileText } from "lucide-react";

const EmptyRequests = ({
  use,
  status,
  companyName,
}: {
  use: "status" | "requests" | "search";
  status: "ALL" | "PENDING" | "APPROVED" | "REJECTED";
  companyName?: string;
}) => {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <FileText />
        </EmptyMedia>
        <EmptyTitle>
          {use === "status"
            ? `No Requests found for status ${status.slice(0, 1)}${status
                .slice(1)
                .toLocaleLowerCase()}`
            : use === "search"
            ? `No Requests with company name ${companyName} found`
            : "No Requests found"}
        </EmptyTitle>
        <EmptyDescription>
          {use === "status"
            ? `There is no requests that have been ${status.slice(0, 1)}${status
                .slice(1)
                .toLocaleLowerCase()} yet. `
            : use === "search"
            ? `There is not a single requests with company name ${companyName}`
            : "There is no requests to show, wait until users makes requests"}
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
};
export default EmptyRequests;
