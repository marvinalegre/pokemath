import { NextResponse, NextRequest } from "next/server";

// This function can be marked `async` if using `await` inside
export async function proxy(request: NextRequest) {
  const token = request.cookies.get("token")?.value;

  let username;
  if (!token) {
    const res = await fetch(
      `${process.env.INTERNAL_API_BASE_URL as string}/auth/guest`,
    );
    const data = await res.json();
    username = data.username;
  } else {
    // hit /auth/me
  }

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-username", username);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
