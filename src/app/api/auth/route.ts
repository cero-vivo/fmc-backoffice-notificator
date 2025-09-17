import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    const validUsername = process.env.BASIC_AUTH_USERNAME || 'admin'
    const validPassword = process.env.BASIC_AUTH_PASSWORD || 'admin123'

    if (username === validUsername && password === validPassword) {
      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json(
        { error: 'Credenciales inválidas' },
        { status: 401 }
      )
    }
  } catch (error) {
    return NextResponse.json(
      { error: 'Error en la autenticación' },
      { status: 500 }
    )
  }
}
