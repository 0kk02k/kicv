import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/api/webhooks(.*)",
  "/p/(.*)", // Public portfolios
]);

export default clerkMiddleware(async (auth, req) => {
  const url = req.nextUrl;

  // Handle subdomain routing (for tenant portfolios)
  const hostname = req.nextUrl.hostname;
  const searchParams = url.searchParams.toString();
  const path = `${url.pathname}${searchParams.length > 0 ? `?${searchParams}` : ""}`;

  // Simplified subdomain check
  const isLocalhost = hostname.includes("localhost");
  const isMainDomain = hostname === "ai-portfolio.com" || hostname.endsWith(".vercel.app"); 

  if (!isLocalhost && !isMainDomain) {
    const subdomain = hostname.split(".")[0];
    if (subdomain && subdomain !== "www") {
      return NextResponse.rewrite(new URL(`/p/${subdomain}${path}`, req.url));
    }
  }

  if (!isPublicRoute(req)) {
    // In Clerk v7, protect() is available directly on the auth() result
    // or you can call it without awaiting if used within clerkMiddleware
    await (await auth()).protect();
  }
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
