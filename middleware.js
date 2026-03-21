import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

export async function middleware(request) {
  const token = request.cookies.get('auth_token')?.value;

  const { pathname } = request.nextUrl;
  
  // Basic route protection flag
  const isAuthRoute = pathname.startsWith('/login');

  if (isAuthRoute && token) {
    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback_secret_for_dev_only');
      const { payload } = await jwtVerify(token, secret);
      
      if (payload.role === 'admin') return NextResponse.redirect(new URL('/admin/dashboard', request.url));
      if (payload.role === 'instructor') return NextResponse.redirect(new URL('/instructor', request.url));
      return NextResponse.redirect(new URL('/dashboard', request.url)); // student dashboard now at /dashboard
    } catch (err) {
      // Invalid token, allow them to view login
      return NextResponse.next();
    }
  }

  // Check RBAC for protected routes
  const isAdminRoute = pathname.startsWith('/admin');
  const isInstructorRoute = pathname.startsWith('/instructor');
  const isStudentRoute = pathname.startsWith('/learning') || pathname.startsWith('/dashboard') || pathname.startsWith('/learn');

  if (isAdminRoute || isInstructorRoute || isStudentRoute) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback_secret_for_dev_only');
      const { payload } = await jwtVerify(token, secret);
      const role = payload.role;

      if (isAdminRoute && role !== 'admin') {
        return NextResponse.redirect(new URL('/login', request.url));
      }

      if (isInstructorRoute && role !== 'instructor' && role !== 'admin') {
        return NextResponse.redirect(new URL('/login', request.url));
      }

      if (isStudentRoute && !['student', 'admin', 'instructor'].includes(role)) {
        return NextResponse.redirect(new URL('/login', request.url));
      }

      return NextResponse.next();
    } catch (err) {
      // Token is expired or invalid
      request.cookies.delete('auth_token');
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/instructor/:path*',
    '/learning/:path*',
    '/dashboard/:path*',
    '/learn/:path*',
    '/login'
  ]
};
