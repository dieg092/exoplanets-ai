import { NextRequest, NextResponse } from "next/server"

const allowedPaths = [
  "/",
  /^\/api\/.*/,
  /^\/_next\/.*/,
  /^\/public\/.*/,
  /^\/textures\/.*/,
  /^\/sound\/.*/,
]

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  const isPathAllowed = allowedPaths.some((path) => {
    if (typeof path === "string") {
      return pathname === path
    } else if (path instanceof RegExp) {
      return path.test(pathname)
    }
    return false
  })

  if (isPathAllowed) {
    return NextResponse.next()
  } else {
    return NextResponse.redirect(new URL("/", req.url))
  }
}

export const config = {
  matcher: ["/:path*"],
}
