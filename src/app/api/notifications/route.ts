import { NextRequest, NextResponse } from 'next/server'
import admin from 'firebase-admin'
import { getCurrentConfig } from '../../../config'

// Configuración estática de Firebase para evitar problemas de carga dinámica
const firebaseConfigs = {
  development: {

    "type": "service_account",
    "project_id": "{{DEVELOPMENT_PROJECT_ID}}",
    "private_key_id": "{{DEV_PRIVATE_KEY_ID}}",
    "private_key": ""{{PRIVATE_KEY}}"\n",
    "client_email": "firebase-adminsdk-ab8un@{{DEVELOPMENT_PROJECT_ID}}.iam.gserviceaccount.com",
    "client_id": "{{DEV_CLIENT_ID}}",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-ab8un%40{{DEVELOPMENT_PROJECT_ID}}.iam.gserviceaccount.com",
    "universe_domain": "googleapis.com"
  },
  production: {
    "type": "service_account",
    "project_id": "{{PRODUCTION_PROJECT_ID}}",
    "private_key_id": "{{PROD_PRIVATE_KEY_ID}}",
    "private_key": ""{{PRIVATE_KEY}}"\n",
    "client_email": "firebase-adminsdk-gzust@{{PRODUCTION_PROJECT_ID}}.iam.gserviceaccount.com",
    "client_id": "{{PROD_CLIENT_ID}}",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-gzust%40{{PRODUCTION_PROJECT_ID}}.iam.gserviceaccount.com",
    "universe_domain": "googleapis.com"
  }
}

// Cache para las instancias de Firebase Admin por ambiente
const firebaseInstances = new Map()

// Función para obtener o crear instancia de Firebase Admin
function getFirebaseInstance() {
  const config = getCurrentConfig()
  const environment = config.environment

  if (!firebaseInstances.has(environment)) {
    try {
      const firebaseConfig = firebaseConfigs[environment]

      const serviceAccount = {
        type: 'service_account',
        project_id: firebaseConfig.project_id,
        private_key_id: firebaseConfig.private_key_id,
        private_key: firebaseConfig.private_key,
        client_email: firebaseConfig.client_email,
        client_id: '123456789',
        auth_uri: 'https://accounts.google.com/o/oauth2/auth',
        token_uri: 'https://oauth2.googleapis.com/token',
        auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
        client_x509_cert_url: `https://www.googleapis.com/robot/v1/metadata/x509/${encodeURIComponent(firebaseConfig.client_email)}`
      }

      const app = admin.initializeApp({
        credential: admin.credential.cert(serviceAccount as admin.ServiceAccount)
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
