import { NextResponse, NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const requestHeaders = new Headers(request.headers);

  let username;
  let newToken;
  if (!token) {
    const res = await fetch(
      `${process.env.INTERNAL_API_BASE_URL as string}/auth/guest`,
    );

    if (!res.ok) {
      return new NextResponse(
        "Sorry. Something went wrong. Try refreshing the page.",
        {
          status: 500,
          headers: { "Content-Type": "text/plain" },
        },
      );
    }

    ({ token: newToken, username } = await res.json());
  } else {
    const res = await fetch(
      `${process.env.INTERNAL_API_BASE_URL as string}/auth/me`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    if (!res.ok) {
      return new NextResponse(
        "Sorry. Something went wrong. Try refreshing the page.",
        {
          status: 500,
          headers: { "Content-Type": "text/plain" },
        },
      );
    }
    ({ username } = await res.json());
  }

  requestHeaders.set("x-username", username);

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  if (!token) {
    response.cookies.set("token", newToken);
  }

  return response;
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
