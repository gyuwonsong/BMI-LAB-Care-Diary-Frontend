/**
 * Simplified proxy for testing
 *
 * In the current implementation, we use client-side AdminGuard component
 * instead of middleware for role-based access control.
 *
 * This allows us to test role switching easily via lib/auth-mock.ts
 * without needing cookie-based authentication.
 *
 * For production, you can implement proper middleware authentication here.
 */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  // Currently, we handle role-based routing on the client side
  // using AdminGuard component and useCurrentUser hook

  // This middleware is kept for future server-side authentication
  return NextResponse.next();
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\..*|api).*)",
  ],
};
