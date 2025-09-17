import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  // Solo aplicar autenticación a rutas del dashboard
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    const authHeader = request.headers.get('authorization')
    
    if (!authHeader || !authHeader.startsWith('Basic ')) {
      return new NextResponse('Autenticación requerida', {
        status: 401,
        headers: {
          'WWW-Authenticate': 'Basic realm="Dashboard"',
        },
      })
    }

    const base64Credentials = authHeader.split(' ')[1]
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii')
    const [username, password] = credentials.split(':')

    // Credenciales hardcodeadas (en producción usar variables de entorno)
    const validUsername = process.env.BASIC_AUTH_USERNAME || 'admin'
    const validPassword = process.env.BASIC_AUTH_PASSWORD || 'admin123'

    if (username !== validUsername || password !== validPassword) {
      return new NextResponse('Credenciales inválidas', {
        status: 401,
        headers: {
          'WWW-Authenticate': 'Basic realm="Dashboard"',
        },
      })
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/dashboard/:path*'
}
