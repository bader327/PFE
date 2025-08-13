import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher([
  "/admin",
  "/ligne/1",
  "/ligne/2",
  "/ligne/3",
  "/ligne/4",
  "/ligne/5",
  "/ligne/6",
  "/ligne/7",
  "/niveauligne",
  "/niveau1", 
  "/niveau2", 


]);

export default clerkMiddleware(async (_auth, _req) => {
  // Temporarily allow all access to all pages and APIs
  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
