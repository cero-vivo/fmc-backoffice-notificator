import { NextRequest, NextResponse } from 'next/server'
import { getCurrentConfig } from './config'

export function middleware(request: NextRequest) {
  // Solo aplicar autenticación a rutas del dashboard
  // Solo aplicar protección a rutas del dashboard
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    // Verificar si existe sesión (cookie 'session')
  const session = request.cookies.get('session')?.value
    if (!session) {
      // Redirigir a login si no hay sesión
      return NextResponse.redirect(new URL(`/login`, request.nextUrl.origin))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/dashboard/:path*'
}
