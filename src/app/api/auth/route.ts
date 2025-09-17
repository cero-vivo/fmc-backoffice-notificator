import { NextRequest, NextResponse } from 'next/server'
import { getCurrentConfig } from '../../../config'

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    // Usar configuración dinámica
    const config = getCurrentConfig()
    if (username === config.auth.username && password === config.auth.password) {
      return NextResponse.json({ 
        success: true,
        environment: config.environment 
      })
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
