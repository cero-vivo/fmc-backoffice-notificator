export type Environment = 'development' | 'production'

export interface AppConfig {
  environment: Environment
  firebase: {
    serviceAccountPath: string
  }
  auth: {
    username: string
    password: string
  }
  notifications: {
    sleepDelay: number
  }
  ui: {
    title: string
  }
}

// Configuración base para desarrollo
const developmentConfig: AppConfig = {
  environment: 'development',
  firebase: {
    serviceAccountPath: './service-account-key-dev.json'
  },
  auth: {
    username: process.env.BASIC_AUTH_USERNAME || 'admin',
    password: process.env.BASIC_AUTH_PASSWORD || 'admin123'
  },
  notifications: {
    sleepDelay: 100
  },
  ui: {
    title: '📱 Dashboard de Notificaciones Push - DEV'
  }
}

// Configuración base para producción
const productionConfig: AppConfig = {
  environment: 'production',
  firebase: {
    serviceAccountPath: './service-account-key-prod.json'
  },
  auth: {
    username: process.env.BASIC_AUTH_USERNAME || 'admin',
    password: process.env.BASIC_AUTH_PASSWORD || 'admin123'
  },
  notifications: {
    sleepDelay: 500
  },
  ui: {
    title: '📱 Dashboard de Notificaciones Push'
  }
}

// Variable global para el ambiente actual
let currentEnvironment: Environment = 'development'

// Función para cambiar el ambiente
export function setEnvironment(environment: Environment): void {
  currentEnvironment = environment
}

// Función para obtener el ambiente actual
export function getCurrentEnvironment(): Environment {
  return currentEnvironment
}

// Función para obtener configuración actual
export function getCurrentConfig(): AppConfig {
  return currentEnvironment === 'production' ? productionConfig : developmentConfig
}
