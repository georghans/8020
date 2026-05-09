import { getToken } from "next-auth/jwt"
import { NextResponse, type NextRequest } from "next/server"

export async function proxy(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  })

  if (token) {
    return NextResponse.next()
  }

  const url = request.nextUrl.clone()
  url.pathname = "/api/auth/signin"
  url.searchParams.set("callbackUrl", request.nextUrl.href)
  return NextResponse.redirect(url)
}

export const config = {
  matcher: ["/", "/c/:path*", "/p/:path*"],
}
