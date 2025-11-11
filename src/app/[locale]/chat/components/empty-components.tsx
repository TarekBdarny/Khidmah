import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import {
  ChartArea,
  MessageCircle,
  MessageSquare,
  UserRoundPlus,
  UserX,
} from "lucide-react";
import Link from "next/link";
export const EmptyUsersDialog = ({
  searchTerm,
  length,
}: {
  searchTerm: string;
  length: number | undefined;
}) => {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          {!searchTerm ? <UserRoundPlus /> : <UserX />}
        </EmptyMedia>
        {
          <EmptyTitle>
            {searchTerm ? `No users found` : "Chat with users"}
          </EmptyTitle>
        }
      </EmptyHeader>
      <EmptyDescription>
        {!searchTerm && (
          <p>
            Start a conversation with a user by typing their first name of last
            name.
          </p>
        )}
        {searchTerm && length === 0 && (
          <p className="text-lg">
            No users found with name{" "}
            <span className="font-semibold text-primary underline underline-offset-4">
              {searchTerm}
            </span>
          </p>
        )}
      </EmptyDescription>
    </Empty>
  );
};
export const EmptySidebarUsers = () => {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <UserRoundPlus />
        </EmptyMedia>
        <EmptyTitle>You have no messages</EmptyTitle>
      </EmptyHeader>
      <EmptyDescription>
        <p>Click the button above to start a conversation with a user.</p>
      </EmptyDescription>
    </Empty>
  );
};
export const EmptyChats = () => {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <MessageCircle />
        </EmptyMedia>
        <EmptyTitle>Select a message to start chatting.</EmptyTitle>
      </EmptyHeader>
      <EmptyDescription>
        <p>
          Click on a conversation to start chatting with a user, or add new
          users by there first name or last name.
        </p>
      </EmptyDescription>
    </Empty>
  );
};
export const EmptyMessages = () => {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <MessageSquare />
        </EmptyMedia>
        <EmptyTitle>This conversation has no messages</EmptyTitle>
      </EmptyHeader>
      <EmptyDescription>
        <p>Start sending message and it will appear here.</p>
      </EmptyDescription>
    </Empty>
  );
};
export const EmptyWorkers = () => {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <MessageSquare />
        </EmptyMedia>
        <EmptyTitle>No Workers found.</EmptyTitle>
      </EmptyHeader>
      <EmptyDescription className="flex flex-col gap-3">
        <p>No workers momentarily available, try again later.</p>
        <hr />
        <Link href={"/becomeWorker"}>
          <Button variant={"action"} className="w-full">
            Become one!
          </Button>
        </Link>
      </EmptyDescription>
    </Empty>
  );
};
