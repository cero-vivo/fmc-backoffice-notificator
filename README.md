# 📱 Push Notifications Dashboard

Dashboard web para enviar notificaciones push a través de Firebase Cloud Messaging (FCM) con autenticación BasicAuth y **cambio de ambiente en tiempo de ejecución**.

## 🚀 Características

- ✅ Interfaz web moderna y responsive
- ✅ Autenticación BasicAuth
- ✅ **Cambio de ambiente en tiempo de ejecución** con select simple
- ✅ Envío masivo de notificaciones push
- ✅ Manejo de errores y reportes detallados
- ✅ Integración con Firebase Admin SDK
- ✅ Soporte para múltiples tokens
- ✅ Configuración centralizada por ambiente

## 📋 Requisitos Previos

1. **Node.js** (versión 18 o superior)
2. **Cuenta de Firebase** con proyecto configurado
3. **Claves de servicio de Firebase** (archivos JSON para desarrollo y producción)

## 🛠️ Instalación

1. **Clonar el repositorio:**
   ```bash
   git clone <tu-repositorio>
   cd push-notifications-app
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Configurar Firebase:**
   - Ve a la consola de Firebase
   - Selecciona tu proyecto de desarrollo
   - Ve a "Configuración del proyecto" > "Cuentas de servicio"
   - Genera una nueva clave privada
   - Descarga el archivo JSON y renómbralo a `service-account-key-dev.json`
   
   - Repite el proceso para tu proyecto de producción
   - Renombra el archivo a `service-account-key-prod.json`

4. **Configurar variables de entorno:**
   ```bash
   cp .env.example .env.local
   ```
   
   Edita `.env.local` con tus credenciales:
   ```
   NODE_ENV=development
   BASIC_AUTH_USERNAME=tu_usuario
   BASIC_AUTH_PASSWORD=tu_contraseña_segura
   ```

## 🚀 Uso

### Inicio Rápido

1. **Iniciar el servidor de desarrollo:**
   ```bash
   npm run dev
   ```

2. **Acceder al dashboard:**
   - Abre tu navegador en `http://localhost:3000`
   - Serás redirigido automáticamente al login
   - Usa las credenciales configuradas

### 🔄 Cambio de Ambiente

**¡Súper simple!** Solo usa el select en la esquina superior derecha del dashboard:

1. **Selecciona el ambiente:**
   - 🔧 Desarrollo
   - 🚀 Producción

2. **El cambio se aplica inmediatamente** sin reiniciar el servidor

### 📱 Enviar Notificaciones

1. **Completar el formulario:**
   - **Título:** Título de la notificación
   - **Mensaje:** Contenido del mensaje
   - **Tokens:** Lista de tokens Firebase (uno por línea)

2. **Hacer clic en "Enviar Notificaciones"**

3. **Revisar el reporte de resultados**

## 🔧 Configuración por Ambiente

### Desarrollo
- **Delay entre notificaciones:** 100ms (más rápido)
- **Título:** "Dashboard de Notificaciones Push - DEV"
- **Firebase:** `service-account-key-dev.json`

### Producción
- **Delay entre notificaciones:** 500ms (más conservador)
- **Título:** "Dashboard de Notificaciones Push"
- **Firebase:** `service-account-key-prod.json`

## 📱 Obtener Tokens Firebase

Para obtener tokens de dispositivos, necesitas implementar el SDK de Firebase en tu aplicación móvil:

### Android (Kotlin/Java)
```kotlin
FirebaseMessaging.getInstance().token.addOnCompleteListener { task ->
    if (!task.isSuccessful) {
        Log.w(TAG, "Fetching FCM registration token failed", task.exception)
        return@addOnCompleteListener
    }
    
    // Get new FCM registration token
    val token = task.result
    Log.d(TAG, "FCM Registration Token: $token")
    
    // Enviar token a tu servidor
    sendTokenToServer(token)
}
```

### iOS (Swift)
```swift
Messaging.messaging().token { token, error in
    if let error = error {
        print("Error fetching FCM registration token: \(error)")
    } else if let token = token {
        print("FCM registration token: \(token)")
        // Enviar token a tu servidor
        sendTokenToServer(token)
    }
}
```

## 🔧 Estructura del Proyecto

```
push-notifications-app/
├── src/
│   ├── config/
│   │   └── index.ts              # Configuración centralizada
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/             # API de autenticación
│   │   │   ├── config/           # API de configuración
│   │   │   └── notifications/    # API de notificaciones
│   │   ├── dashboard/
│   │   │   └── page.tsx          # Dashboard principal con select
│   │   ├── login/                # Página de login
│   │   └── page.tsx              # Página de inicio
│   └── middleware.ts              # Middleware de autenticación
├── service-account-key-dev.json   # Clave de servicio desarrollo
├── service-account-key-prod.json # Clave de servicio producción
├── .env.example                  # Variables de entorno de ejemplo
└── README.md
```

## 🔒 Seguridad

- **Autenticación BasicAuth:** Protege el acceso al dashboard
- **Validación de entrada:** Todos los campos son validados
- **Manejo de errores:** Errores manejados de forma segura
- **Rate limiting:** Pausa entre envíos para evitar throttling
- **Configuración separada:** Ambientes completamente aislados

## 🚨 Consideraciones Importantes

1. **Archivos de clave de servicio:** Nunca subas los archivos `service-account-key-*.json` al repositorio
2. **Credenciales:** Cambia las credenciales por defecto en producción
3. **Rate limiting:** Firebase tiene límites de envío, considera implementar colas
4. **Tokens inválidos:** Los tokens pueden expirar, implementa renovación automática
5. **Cambio de ambiente:** Los cambios se aplican inmediatamente sin reiniciar el servidor

## 📊 Monitoreo

El dashboard muestra:
- Total de tokens procesados
- Número de notificaciones enviadas exitosamente
- Número de fallos
- Lista detallada de tokens fallidos
- **Ambiente actual** en tiempo real

## 🛠️ Desarrollo

```bash
# Modo desarrollo
npm run dev

# Construir para producción
npm run build

# Iniciar en producción
npm run start

# Linting
npm run lint
```

## 📝 Licencia

Este proyecto está bajo la Licencia MIT.

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:
1. Fork el proyecto
2. Crea una rama para tu feature
3. Commit tus cambios
4. Push a la rama
5. Abre un Pull Request

## 📞 Soporte

Si tienes problemas o preguntas:
1. Revisa la documentación de Firebase
2. Verifica la configuración de tu proyecto
3. Revisa los logs del servidor
4. Usa el select de ambiente para verificar el ambiente actual
5. Abre un issue en el repositorio
