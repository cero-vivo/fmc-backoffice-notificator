import { NextRequest, NextResponse } from 'next/server'
import { getCurrentConfig, setEnvironment } from '../../../config'

// GET: Obtener configuración actual
export async function GET() {
  try {
    const config = getCurrentConfig()
    
    return NextResponse.json({
      success: true,
      environment: config.environment,
      config
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Error al obtener configuración' },
      { status: 500 }
    )
  }
}

// POST: Cambiar ambiente
export async function POST(request: NextRequest) {
  try {
    const { environment } = await request.json()
    
    if (!environment || !['development', 'production'].includes(environment)) {
      return NextResponse.json(
        { error: 'Ambiente no válido' },
        { status: 400 }
      )
    }
    
    setEnvironment(environment as 'development' | 'production')
    const config = getCurrentConfig()
    
    return NextResponse.json({
      success: true,
      environment: config.environment,
      config
    })
    
  } catch (error) {
    return NextResponse.json(
      { error: 'Error al cambiar ambiente' },
      { status: 500 }
    )
  }
}
