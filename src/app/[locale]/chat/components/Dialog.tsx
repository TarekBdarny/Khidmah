"use client";
import {
  addUserToChatWith,
  getUsersIncludesFullname,
} from "@/actions/chat.action";
import { ProfilePicture } from "@/components/reuseable/avatar/ProfilePicture";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";

import { UserRoundPlus } from "lucide-react";
import { useEffect, useState } from "react";
import { EmptyUsersDialog } from "./empty-components";
import { LoadingDialogSkeleton } from "./Loaders";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import SearchInput from "./SearchInput";
type Users = Awaited<ReturnType<typeof getUsersIncludesFullname>>;
export function DialogInput() {
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState<Users>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const router = useRouter();
  useEffect(() => {
    const getUsers = async () => {
      setLoading(true);
      if (searchTerm === "") {
        setUsers([]);
        setLoading(false);
        return;
      }
      const res = await getUsersIncludesFullname(
        searchTerm.split(" ").join("")
      );
      setUsers(res);
      setLoading(false);
    };
    getUsers();
  }, [searchTerm]);

  const handleNewConversation = async (otherUserId: string) => {
    const result = await addUserToChatWith(otherUserId);

    if (!result?.success) {
      toast.error(result?.message);
    }

    setSearchTerm("");
    const conversation = result?.data;
    if (!conversation) return;
    setOpen(false);
    router.push(`/chat/${conversation.id}`);
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <form>
        <DialogTrigger asChild>
          <Button
            size={"sm"}
            variant={"default"}
            className="rounded-full text-foreground"
            onClick={() => setOpen(true)}
          >
            <UserRoundPlus />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Find Users to chat with</DialogTitle>
            <DialogDescription>Search users with full name.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <SearchInput
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                label="Search"
                id="search"
                placeholder="Search with full name"
              />
            </div>
          </div>
          {users?.length !== 0 && !loading ? (
            <div>
              Users found
              <span className="text-primary"> {users?.length} </span>
            </div>
          ) : (
            !loading && (
              <EmptyUsersDialog
                searchTerm={searchTerm.trim()}
                length={users?.length}
              />
            )
          )}
          {loading &&
            Array.from({ length: 5 }).map((_, i) => (
              <LoadingDialogSkeleton key={i} />
            ))}
          <ScrollArea className={` max-h-[340px] p-1 `} dir="rtl">
            {!loading &&
              users?.map((user) => (
                <div
                  key={user.id}
                  onClick={() => handleNewConversation(user.id)}
                  className={`w-full flex flex-row gap-2 my-2 items-center hover:bg-muted cursor-pointer px-2 py-1 rounded-md transition duration-150 `}
                >
                  <ProfilePicture
                    profilePic={user.profilePic || ""}
                    fallback="TB"
                  />
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-1">
                      <h2 className="font-semibold">
                        {user.firstName} {user.lastName}
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
          </ScrollArea>
        </DialogContent>
      </form>
    </Dialog>
  );
}
