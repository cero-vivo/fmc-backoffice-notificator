import { NextRequest, NextResponse } from 'next/server'
import admin, { ServiceAccount } from 'firebase-admin'
import { getCurrentConfig } from '../../../config'

// Cache para las instancias de Firebase Admin por ambiente
const firebaseInstances = new Map()

// Función para obtener configuración de Firebase desde variables de entorno
function getFirebaseConfig(environment: 'development' | 'production') {
  if (environment === 'development') {
    return {
      type: 'service_account',
      project_id: process.env.FIREBASE_DEV_PROJECT_ID,
      private_key_id: process.env.FIREBASE_DEV_PRIVATE_KEY_ID,
      private_key: process.env.FIREBASE_DEV_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      client_email: process.env.FIREBASE_DEV_CLIENT_EMAIL,
      client_id: process.env.FIREBASE_DEV_CLIENT_ID,
      auth_uri: process.env.FIREBASE_DEV_AUTH_URI,
      token_uri: process.env.FIREBASE_DEV_TOKEN_URI,
      auth_provider_x509_cert_url: process.env.FIREBASE_DEV_AUTH_PROVIDER_X509_CERT_URL,
      client_x509_cert_url: process.env.FIREBASE_DEV_CLIENT_X509_CERT_URL,
      universe_domain: process.env.FIREBASE_DEV_UNIVERSE_DOMAIN
    }
  } else {
    return {
      type: 'service_account',
      project_id: process.env.FIREBASE_PROD_PROJECT_ID,
      private_key_id: process.env.FIREBASE_PROD_PRIVATE_KEY_ID,
      private_key: process.env.FIREBASE_PROD_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      client_email: process.env.FIREBASE_PROD_CLIENT_EMAIL,
      client_id: process.env.FIREBASE_PROD_CLIENT_ID,
      auth_uri: process.env.FIREBASE_PROD_AUTH_URI,
      token_uri: process.env.FIREBASE_PROD_TOKEN_URI,
      auth_provider_x509_cert_url: process.env.FIREBASE_PROD_AUTH_PROVIDER_X509_CERT_URL,
      client_x509_cert_url: process.env.FIREBASE_PROD_CLIENT_X509_CERT_URL,
      universe_domain: process.env.FIREBASE_PROD_UNIVERSE_DOMAIN
    }
  }
}

// Función para obtener o crear instancia de Firebase Admin
function getFirebaseInstance() {
  const config = getCurrentConfig()
  const environment = config.environment
  
  if (!firebaseInstances.has(environment)) {
    try {
      const serviceAccount = getFirebaseConfig(environment)
      
      // Validar que todas las variables de entorno estén presentes
      if (!serviceAccount.project_id || !serviceAccount.private_key || !serviceAccount.client_email) {
        throw new Error(`Variables de entorno de Firebase para ${environment} no configuradas correctamente`)
      }
      
      const app = admin.initializeApp({
        credential: admin.credential.cert(serviceAccount as ServiceAccount)
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
      } catch (error: unknown) {
        console.error(`❌ Error al enviar notificación al token ${token}:`, error)
        
        // Crear objeto de error detallado
        const errorDetails = {
          token: token,
          code: (error as { code?: string }).code || 'UNKNOWN_ERROR',
          message: (error as { message?: string }).message || 'Error desconocido',
          details: (error as { details?: unknown }).details || null
        }
        
        failNotifications.push(errorDetails)
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

  } catch (error: unknown) {
    console.error('❌ Error en API de notificaciones:', error)
    return NextResponse.json(
      { 
        error: 'Error interno del servidor',
        details: (error as { message?: string }).message || 'Error desconocido'
      },
      { status: 500 }
    )
  }
}
