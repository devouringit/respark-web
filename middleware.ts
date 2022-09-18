import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
    const url = request.nextUrl.clone()
    const baseRouteUrl = request.cookies.get('baseRouteUrl')
    if (url.pathname === '/') {
        url.pathname = baseRouteUrl || '/';
        return NextResponse.redirect(url)
    }
    //     const response = NextResponse.next()
    //   response.cookies.set('vercel', 'fast')

}