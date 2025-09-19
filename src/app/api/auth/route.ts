import { NextRequest, NextResponse } from 'next/server'
import { getCurrentConfig } from '../../../config'

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    // Usar configuración dinámica
    const config = getCurrentConfig()
    if(!config.auth.username || !config.auth.password || config.auth.username?.length === 0 || config.auth.password?.length === 0) {
       return NextResponse.json(
        { error: 'Parece que aún no has configurado tus credenciales. Necesitas crear un archivo .env.local con tu usuario y contraseña, y recuerda agregar los datos cuenta de servicio de Firebase.' },
        { status: 500 }
      )
    }
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
