# 📱 Push Notifications Dashboard

Dashboard web para enviar notificaciones push a través de Firebase Cloud Messaging (FCM) con autenticación BasicAuth.

## 🚀 Características

- ✅ Interfaz web moderna y responsive
- ✅ Autenticación BasicAuth
- ✅ Envío masivo de notificaciones push
- ✅ Manejo de errores y reportes detallados
- ✅ Integración con Firebase Admin SDK
- ✅ Soporte para múltiples tokens

## 📋 Requisitos Previos

1. **Node.js** (versión 18 o superior)
2. **Cuenta de Firebase** con proyecto configurado
3. **Clave de servicio de Firebase** (archivo JSON)

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
   - Selecciona tu proyecto
   - Ve a "Configuración del proyecto" > "Cuentas de servicio"
   - Genera una nueva clave privada
   - Descarga el archivo JSON
   - Renómbralo a `service-account-key.json` y colócalo en la raíz del proyecto

4. **Configurar variables de entorno:**
   ```bash
   cp .env.example .env.local
   ```
   
   Edita `.env.local` con tus credenciales:
   ```
   BASIC_AUTH_USERNAME=tu_usuario
   BASIC_AUTH_PASSWORD=tu_contraseña_segura
   SERVICE_ACCOUNT_PATH_PROD=./service-account-key.json
   ```

## 🚀 Uso

1. **Iniciar el servidor de desarrollo:**
   ```bash
   npm run dev
   ```

2. **Acceder al dashboard:**
   - Abre tu navegador en `http://localhost:3000`
   - Serás redirigido automáticamente al login
   - Usa las credenciales configuradas en `.env.local`

3. **Enviar notificaciones:**
   - Completa el formulario con:
     - **Título:** Título de la notificación
     - **Mensaje:** Contenido del mensaje
     - **Tokens:** Lista de tokens Firebase (uno por línea)
   - Haz clic en "Enviar Notificaciones"
   - Revisa el reporte de resultados

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
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/           # API de autenticación
│   │   │   └── notifications/  # API de notificaciones
│   │   ├── dashboard/          # Dashboard principal
│   │   ├── login/              # Página de login
│   │   └── page.tsx            # Página de inicio
│   └── middleware.ts           # Middleware de autenticación
├── service-account-key.json    # Clave de servicio de Firebase
├── .env.example               # Variables de entorno de ejemplo
└── README.md
```

## 🔒 Seguridad

- **Autenticación BasicAuth:** Protege el acceso al dashboard
- **Validación de entrada:** Todos los campos son validados
- **Manejo de errores:** Errores manejados de forma segura
- **Rate limiting:** Pausa entre envíos para evitar throttling

## �� Consideraciones Importantes

1. **Archivo de clave de servicio:** Nunca subas `service-account-key.json` al repositorio
2. **Credenciales:** Cambia las credenciales por defecto en producción
3. **Rate limiting:** Firebase tiene límites de envío, considera implementar colas
4. **Tokens inválidos:** Los tokens pueden expirar, implementa renovación automática

## 📊 Monitoreo

El dashboard muestra:
- Total de tokens procesados
- Número de notificaciones enviadas exitosamente
- Número de fallos
- Lista detallada de tokens fallidos

## 🛠️ Desarrollo

```bash
# Modo desarrollo
npm run dev

# Construir para producción
npm run build

# Iniciar en producción
npm start

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
4. Abre un issue en el repositorio
# fmc-backoffice-notificator
