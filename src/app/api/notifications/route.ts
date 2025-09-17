import { NextRequest, NextResponse } from 'next/server'
import admin from 'firebase-admin'

// Inicializar Firebase Admin si no está inicializado
if (!admin.apps.length) {
  const serviceAccount = require('../../../../service-account-key.json')
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  })
}

export async function POST(request: NextRequest) {
  try {
    const { tokens, title, body } = await request.json()

    if (!tokens || !Array.isArray(tokens) || tokens.length === 0) {
      return NextResponse.json(
        { error: 'Se requieren tokens válidos' },
        { status: 400 }
      )
    }

    if (!title || !body) {
      return NextResponse.json(
        { error: 'Se requieren título y mensaje' },
        { status: 400 }
      )
    }

    const successNotifications = []
    const failNotifications = []

    for (const token of tokens) {
      const message = {
        notification: {
          title,
          body
        },
        token,
      }

      try {
        const response = await admin.messaging().send(message)
        console.log(`Notificación enviada al token ${token}:`, response)
        successNotifications.push(token)
      } catch (error) {
        console.error(`Error al enviar notificación al token ${token}:`, error)
        failNotifications.push(token)
      }

      // Pequeña pausa para evitar throttling
      await new Promise(resolve => setTimeout(resolve, 100))
    }

    return NextResponse.json({
      success: true,
      totalTokens: tokens.length,
      successCount: successNotifications.length,
      failCount: failNotifications.length,
      successTokens: successNotifications,
      failTokens: failNotifications
    })

  } catch (error) {
    console.error('Error en API de notificaciones:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
