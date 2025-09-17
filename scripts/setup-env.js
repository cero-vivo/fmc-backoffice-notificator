#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

const environment = process.argv[2] || 'development'

const envFiles = {
  development: '.env.development',
  production: '.env.production'
}

const envFile = envFiles[environment]

if (!envFile) {
  console.error('❌ Ambiente no válido. Usa: development o production')
  process.exit(1)
}

const sourcePath = path.join(__dirname, '..', envFile)
const targetPath = path.join(__dirname, '..', '.env.local')

if (!fs.existsSync(sourcePath)) {
  console.error(`❌ Archivo ${envFile} no encontrado`)
  process.exit(1)
}

try {
  fs.copyFileSync(sourcePath, targetPath)
  console.log(`✅ Ambiente configurado como: ${environment}`)
  console.log(`📁 Archivo copiado: ${envFile} → .env.local`)
  
  // Mostrar configuración
  const config = fs.readFileSync(targetPath, 'utf8')
  console.log('\n📋 Configuración actual:')
  console.log(config)
  
} catch (error) {
  console.error('❌ Error al configurar ambiente:', error.message)
  process.exit(1)
}
