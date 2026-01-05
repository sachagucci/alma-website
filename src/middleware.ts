import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    const authCookie = request.cookies.get('alma_auth')
    const isLoginPage = request.nextUrl.pathname === '/login'
    const isOnboardingPage = request.nextUrl.pathname === '/onboarding'
    const isRootPage = request.nextUrl.pathname === '/'

    // Allow access to login, onboarding, and root page without auth
    if (!authCookie && !isLoginPage && !isOnboardingPage && !isRootPage) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    // Redirect authenticated users away from login (but allow onboarding for setup completion)
    if (authCookie && isLoginPage) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
