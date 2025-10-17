import { getAuthUser } from "@/actions/user.action";
import BecomeWorkerForm from "@/components/becomeWorkerForm";
import EmptyComponent from "@/components/reuseable/Empty";
import WorkerForm from "@/components/WorkerForm";
import { auth } from "@clerk/nextjs/server";
import React from "react";

const page = async () => {
  const { userId } = await auth();
  const authUser = await getAuthUser(userId || "");
  return !authUser ? (
    <div>You Must be signed in</div>
  ) : authUser.role === "WORKER" ? (
    <EmptyComponent role="WORKER" />
  ) : authUser.role === "ADMIN" ? (
    <EmptyComponent role="ADMIN" />
  ) : (
    <div className="flex items-center justify-center h-full">
      <BecomeWorkerForm />
    </div>
  );
};

export default page;
