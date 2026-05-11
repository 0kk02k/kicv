import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/api/webhooks(.*)",
  "/p/(.*)", // Public portfolios
]);

export default clerkMiddleware((auth, req) => {
  const { userId } = auth();
  const url = req.nextUrl;

  // Handle subdomain routing (for tenant portfolios)
  const hostname = req.headers.get("host");
  const searchParams = url.searchParams.toString();
  const path = `${url.pathname}${searchParams.length > 0 ? `?${searchParams}` : ""}`;

  // If we have a custom subdomain (not localhost or main domain)
  // This is a simplified version, in production you'd check against your base domain
  if (hostname && !hostname.startsWith("localhost") && !hostname.startsWith("your-main-domain.com")) {
    const subdomain = hostname.split(".")[0];
    return NextResponse.rewrite(new URL(`/p/${subdomain}${path}`, req.url));
  }

  if (!isPublicRoute(req)) {
    auth().protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
