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
  // Use req.nextUrl.hostname which is more reliable in Next.js 16
  const hostname = req.nextUrl.hostname;
  const searchParams = url.searchParams.toString();
  const path = `${url.pathname}${searchParams.length > 0 ? `?${searchParams}` : ""}`;

  // Simplified subdomain check
  // Avoid rewriting for localhost or the main domain
  const isLocalhost = hostname.includes("localhost");
  const isMainDomain = hostname === "ai-portfolio.com" || hostname.endsWith(".vercel.app"); 

  if (!isLocalhost && !isMainDomain) {
    const subdomain = hostname.split(".")[0];
    if (subdomain && subdomain !== "www") {
      return NextResponse.rewrite(new URL(`/p/${subdomain}${path}`, req.url));
    }
  }

  if (!isPublicRoute(req)) {
    const authObject = await auth();
    authObject.protect();
  }
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
