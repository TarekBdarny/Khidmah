import {
  clerkClient,
  clerkMiddleware,
  createRouteMatcher,
} from "@clerk/nextjs/server";
import { routing as AppConfig } from "@/i18n/routing";
import createMiddleware from "next-intl/middleware";
import { NextResponse } from "next/server";
import { prisma } from "./lib/prisma";

const intlMiddleware = createMiddleware(AppConfig);

const isPublicRoute = createRouteMatcher([
  "/he/sign-in(.*)",
  "/he/sign-up(.*)",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/ar",
  "/he",
  "/",
  "/api(.*)",
  "/becomeWorker",
]);
const isAdminRoute = createRouteMatcher(["/admin(.*)", "/admin/requests(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  if (req.nextUrl.pathname.startsWith("/api")) {
    if (!isPublicRoute(req)) {
      await auth.protect();
    }
    return; // Don't apply intl middleware to API routes
  }
  if (!isPublicRoute(req)) {
    await auth.protect();
  }
  return intlMiddleware(req);
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
