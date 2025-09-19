export type Environment = 'development' | 'production'

export interface ColorPalette {
  primary: string
  onPrimary: string
  secondary: string
  onSecondary: string
  tertiary: string
  onTertiary: string
  background: string
  onBackground: string
  surface: string
  onSurface: string
  error: string
  onError: string
  success: string
  onSuccess: string
  warning: string
  onWarning: string
  info: string
  onInfo: string
  neutral: string
  onNeutral: string
}

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

// Paleta de colores de Bizland
export const bizlandColors: ColorPalette = {
  primary: "hsl(217, 100.0%, 36.7%)",
  onPrimary: "#fff",
  secondary: "#3CDBC0",
  onSecondary: "#041c2c",
  tertiary: "hsl(204, 83.33%, 9.41%)",
  onTertiary: "#fff",
  background: "#fff",
  onBackground: "#041c2c",
  surface: "#F5F9FF",
  onSurface: "#041c2c",
  error: "#E73D3D",
  onError: "#fff",
  success: "#39B54A",
  onSuccess: "#fff",
  warning: "#FFC107",
  onWarning: "#041c2c",
  info: "#2196F3",
  onInfo: "#fff",
  neutral: "#9E9E9E",
  onNeutral: "#041c2c"
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

// Función para obtener la paleta de colores
export function getColors(): ColorPalette {
  return bizlandColors
}
