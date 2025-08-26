import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const hostname = request.headers.get('host')
  
  if (hostname && hostname.includes('.localhost:3000')) {
    const subdomain = hostname.split('.')[0]
    const url = request.nextUrl.clone()
    url.pathname = `/${subdomain}${url.pathname}`
    return NextResponse.rewrite(url)
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}