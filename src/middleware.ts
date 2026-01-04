import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    const authCookie = request.cookies.get('alma_auth')
    const isLoginPage = request.nextUrl.pathname === '/login'
    const isOnboardingPage = request.nextUrl.pathname === '/onboarding'

    // Allow access to login and onboarding without auth
    if (!authCookie && !isLoginPage && !isOnboardingPage) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    // Redirect authenticated users away from login (but allow onboarding for setup completion)
    if (authCookie && isLoginPage) {
        return NextResponse.redirect(new URL('/', request.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
