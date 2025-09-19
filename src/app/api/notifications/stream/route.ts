import { NextRequest } from 'next/server'
import admin, { ServiceAccount } from 'firebase-admin'
import { getCurrentConfig } from '../../../../config'

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
        throw new Error(`Configuración de Firebase incompleta para ambiente ${environment}`)
      }

      // Crear una nueva instancia específica para este ambiente
      const app = admin.initializeApp({
        credential: admin.credential.cert(serviceAccount as ServiceAccount)
      }, `app-${environment}-${Date.now()}`)
      
      firebaseInstances.set(environment, app)
      console.log(`✅ Firebase Admin inicializado para ambiente: ${environment}`)
    } catch (error) {
      console.error(`❌ Error al inicializar Firebase para ambiente ${environment}:`, error)
      throw error
    }
  }
  
  return firebaseInstances.get(environment)
}

// POST endpoint para envío con streaming de progreso
export async function POST(request: NextRequest) {
  try {
    const { tokens, title, body } = await request.json()
    const config = getCurrentConfig()

    console.log(`🚀 Iniciando envío de notificaciones en ambiente: ${config.environment}`)
    console.log(`📊 Total de tokens: ${tokens.length}`)

    if (!tokens || !Array.isArray(tokens) || tokens.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Se requiere al menos un token válido' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    if (!title || !body) {
      return new Response(
        JSON.stringify({ error: 'Título y mensaje son requeridos' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    const app = getFirebaseInstance()
    const messaging = admin.messaging(app)

    // Configurar headers para streaming
    const headers = new Headers({
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST',
      'Access-Control-Allow-Headers': 'Content-Type',
    })

    // Crear ReadableStream para enviar datos progresivamente
    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder()
        
        // Enviar datos iniciales
        const initialData = {
          type: 'init',
          total: tokens.length,
          environment: config.environment
        }
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(initialData)}\n\n`))

        let successCount = 0
        let failCount = 0
        const successTokens: string[] = []
        const failTokens: Array<{ token: string; code: string; message: string; details?: unknown }> = []

        // Procesar tokens uno por uno
        for (let i = 0; i < tokens.length; i++) {
          const token = tokens[i].trim()
          
          if (!token) {
            continue
          }

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
            successCount++
            successTokens.push(token)

            // Enviar actualización de progreso
            const progressData = {
              type: 'progress',
              processed: i + 1,
              total: tokens.length,
              success: successCount,
              failed: failCount,
              currentToken: token,
              status: 'success'
            }
            controller.enqueue(encoder.encode(`data: ${JSON.stringify(progressData)}\n\n`))

          } catch (error: unknown) {
            console.error(`❌ Error al enviar notificación al token ${token}:`, error)
            
            // Crear objeto de error detallado
            const errorDetails = {
              token: token,
              code: (error as { code?: string }).code || 'UNKNOWN_ERROR',
              message: (error as { message?: string }).message || 'Error desconocido',
              details: (error as { details?: unknown }).details || null
            }
            
            failCount++
            failTokens.push(errorDetails)

            // Enviar actualización de progreso con error
            const progressData = {
              type: 'progress',
              processed: i + 1,
              total: tokens.length,
              success: successCount,
              failed: failCount,
              currentToken: token,
              status: 'error',
              error: errorDetails
            }
            controller.enqueue(encoder.encode(`data: ${JSON.stringify(progressData)}\n\n`))
          }

          // Pequeña pausa para no saturar Firebase
          await new Promise(resolve => setTimeout(resolve, config.notifications.sleepDelay || 100))
        }

        // Enviar resultado final
        const finalData = {
          type: 'complete',
          success: true,
          totalTokens: tokens.length,
          successCount,
          failCount,
          successTokens,
          failTokens,
          environment: config.environment
        }
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(finalData)}\n\n`))
        
        // Cerrar el stream
        controller.close()
      }
    })

    return new Response(stream, { headers })

  } catch (error: unknown) {
    console.error('❌ Error en API de notificaciones:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Error interno del servidor',
        details: (error as { message?: string }).message || 'Error desconocido'
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}