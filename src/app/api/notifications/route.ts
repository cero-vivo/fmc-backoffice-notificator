import { NextRequest, NextResponse } from 'next/server'
import admin from 'firebase-admin'
import { getCurrentConfig } from '../../../config'

// Cache para las instancias de Firebase Admin por ambiente
const firebaseInstances = new Map()

// Función para obtener o crear instancia de Firebase Admin
function getFirebaseInstance() {
  const config = getCurrentConfig()
  const environment = config.environment
  
  if (!firebaseInstances.has(environment)) {
    try {
      const serviceAccount = require(config.firebase.serviceAccountPath)
      const app = admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
      }, environment)
      firebaseInstances.set(environment, app)
      console.log(`✅ Firebase Admin inicializado para ambiente: ${environment}`)
    } catch (error) {
      console.error(`❌ Error al inicializar Firebase Admin para ${environment}:`, error)
      throw error
    }
  }
  
  return firebaseInstances.get(environment)
}

export async function POST(request: NextRequest) {
  try {
    const { tokens, title, body } = await request.json()
    const config = getCurrentConfig()

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

    // Obtener instancia de Firebase para el ambiente actual
    const firebaseApp = getFirebaseInstance()
    const messaging = firebaseApp.messaging()

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
        const response = await messaging.send(message)
        console.log(`✅ Notificación enviada al token ${token}:`, response)
        successNotifications.push(token)
      } catch (error) {
        console.error(`❌ Error al enviar notificación al token ${token}:`, error)
        failNotifications.push(token)
      }

      // Usar delay configurado para evitar throttling
      await new Promise(resolve => setTimeout(resolve, config.notifications.sleepDelay))
    }

    return NextResponse.json({
      success: true,
      totalTokens: tokens.length,
      successCount: successNotifications.length,
      failCount: failNotifications.length,
      successTokens: successNotifications,
      failTokens: failNotifications,
      environment: config.environment
    })

  } catch (error) {
    console.error('❌ Error en API de notificaciones:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
