"use client";
import {
  approveWorkerRequest,
  rejectWorkerRequest,
  sendWorkerRequestToSystem,
} from "@/actions/workerRequest.action";
import { Button } from "@/components/ui/button";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignOutButton,
  SignUpButton,
} from "@clerk/nextjs";
import React from "react";
import { ProfileDropdownMenu } from "../dropdown/ProfileDropdown";
type AuthProps = {
  useCase: "navbar" | "homepage";
};
const AuthButtons = ({ useCase }: AuthProps) => {
  return useCase === "navbar" ? (
    <div>
      <SignedIn>
        <ProfileDropdownMenu />
      </SignedIn>
      <SignedOut>
        <div className="flex items-center gap-2">
          <Button asChild variant={"outline"}>
            <SignUpButton mode="modal">Sign Up</SignUpButton>
          </Button>
          <Button asChild variant={"action"}>
            <SignInButton mode="modal">Sign In</SignInButton>
          </Button>
        </div>
      </SignedOut>
    </div>
  ) : (
    <div></div>
  );
};

export default AuthButtons;
