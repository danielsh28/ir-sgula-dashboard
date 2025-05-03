import { NextRequest, NextResponse } from 'next/server';
import acceptLanguage from 'accept-language';

acceptLanguage.languages(['en', 'he', 'ar']);


export const config = {
  // Skip static assets, API routes, and Next.js internal routes
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|locales).*)'],
};

const cookieName = 'i18next';
const defaultLocale = 'en';

export function middleware(request: NextRequest) {
  // Check if there is a cookie with language preference
  let locale = request.cookies.get(cookieName)?.value || '';
  
  // If no cookie, check the Accept-Language headers
  if (!locale) {
    const acceptLangHeader = request.headers.get('Accept-Language') || '';
    locale = acceptLanguage.get(acceptLangHeader) || '';
  }
  
  // If no language detected, use default
  if (!locale) {
    locale = defaultLocale;
  }

  // Set the cookie if it doesn't exist or is different
  const response = NextResponse.next();
  if (!request.cookies.has(cookieName) || request.cookies.get(cookieName)?.value !== locale) {
    response.cookies.set(cookieName, locale);
  }

  return response;
} 