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
const tempObject = {
  offDays: ["Saturday", "Sunday"],
  maxWorkDistance: 50,
  yearsExperience: 5,
  attachments: [],
  message: "Looking forward to working with you!",
  userId: "cmgh2b4w80000ug9kreqr0vjd", // Replace with actual Clerk user ID
  workHours: {
    Monday: { start: "09:00", end: "17:00" },
    Tuesday: { start: "09:00", end: "17:00" },
    Wednesday: { start: "09:00", end: "17:00" },
  },
};
const AuthButtons = () => {
  return (
    <div>
      <SignedIn>
        <p>You are signed in!</p>
        <SignOutButton />
      </SignedIn>
      <SignedOut>
        <p>You are not logged in!</p>
        <SignInButton>
          <Button>Sign In</Button>
        </SignInButton>
        <SignUpButton>
          <Button>Sign Up</Button>
        </SignUpButton>
      </SignedOut>
    </div>
  );
};

export default AuthButtons;
