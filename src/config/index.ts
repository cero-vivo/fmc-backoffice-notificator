export type Environment = 'development' | 'production'

export interface AppConfig {
  environment: Environment
  auth: {
    username: string | undefined
    password: string | undefined
  }
  notifications: {
    sleepDelay: number | undefined
  }
  ui: {
    title: string | undefined
  }
}

// Configuración base para desarrollo
const developmentConfig: AppConfig = {
  environment: 'development',
  auth: {
    username: process.env.BASIC_AUTH_USERNAME,
    password: process.env.BASIC_AUTH_PASSWORD
  },
  notifications: {
    sleepDelay: 100
  },
  ui: {
    title: 'Dashboard de Notificaciones Push - DEV'
  }
}

// Configuración base para producción
const productionConfig: AppConfig = {
  environment: 'production',
  auth: {
    username: process.env.BASIC_AUTH_USERNAME,
    password: process.env.BASIC_AUTH_PASSWORD
  },
  notifications: {
    sleepDelay: 500
  },
  ui: {
    title: 'Dashboard de Notificaciones Push'
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
