# Push Notifications App


Aplicación web para enviar notificaciones push a dispositivos móviles Android/iOS usando Firebase Cloud Messaging (FCM). Permite gestionar tokens, seleccionar ambiente (desarrollo/producción), redactar mensajes y enviarlos de forma masiva, con reportes de éxito y error.

## Características

- **Autenticación segura** - Login protegido via creacion local en .env.local a cargo del desarrollador
- **Gestión de tokens FCM** - Añadir, editar y organizar tokens de dispositivos
- **Envío masivo** - Enviar notificaciones a múltiples dispositivos
- **Multi-ambiente** - Soporte para ambientes de desarrollo y producción
- **Reportes resultados** - Ver estadísticas de envíos exitosos y fallidos

## Configuración

### 1. Instalar dependencias
```bash
bun install
```

### 2. Variables de entorno

```env.local
# Configuración de ambiente

# Credenciales de autenticación (personalízalas por seguridad)
BASIC_AUTH_USERNAME=TuUsuario
BASIC_AUTH_PASSWORD=TuContraseñaSegura123!

# Firebase Development (obtén estos datos del console de Firebase)
FIREBASE_DEV_PROJECT_ID=tu-proyecto-dev-firebase
FIREBASE_DEV_PRIVATE_KEY_ID=id-de-clave-privada-dev
FIREBASE_DEV_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nTU_CLAVE_PRIVADA_DE_DESARROLLO_AQUI\n-----END PRIVATE KEY-----\n"
FIREBASE_DEV_CLIENT_EMAIL=firebase-adminsdk-xxxxx@tu-proyecto-dev.iam.gserviceaccount.com
FIREBASE_DEV_CLIENT_ID=tu-client-id-dev
FIREBASE_DEV_AUTH_URI=https://accounts.google.com/o/oauth2/auth
FIREBASE_DEV_TOKEN_URI=https://oauth2.googleapis.com/token
FIREBASE_DEV_AUTH_PROVIDER_X509_CERT_URL=https://www.googleapis.com/oauth2/v1/certs
FIREBASE_DEV_CLIENT_X509_CERT_URL=https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-xxxxx%40tu-proyecto-dev.iam.gserviceaccount.com
FIREBASE_DEV_UNIVERSE_DOMAIN=googleapis.com

# Firebase Production (obtén estos datos del console de Firebase para producción)
FIREBASE_PROD_PROJECT_ID=tu-proyecto-prod-firebase
FIREBASE_PROD_PRIVATE_KEY_ID=id-de-clave-privada-prod
FIREBASE_PROD_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nTU_CLAVE_PRIVADA_DE_PRODUCCION_AQUI\n-----END PRIVATE KEY-----\n"
FIREBASE_PROD_CLIENT_EMAIL=firebase-adminsdk-xxxxx@tu-proyecto-prod.iam.gserviceaccount.com
FIREBASE_PROD_CLIENT_ID=tu-client-id-prod
FIREBASE_PROD_AUTH_URI=https://accounts.google.com/o/oauth2/auth
FIREBASE_PROD_TOKEN_URI=https://oauth2.googleapis.com/token
FIREBASE_PROD_AUTH_PROVIDER_X509_CERT_URL=https://www.googleapis.com/oauth2/v1/certs
FIREBASE_PROD_CLIENT_X509_CERT_URL=https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-xxxxx%40tu-proyecto-prod.iam.gserviceaccount.com
FIREBASE_PROD_UNIVERSE_DOMAIN=googleapis.com
```

### 4. Ejecutar en desarrollo
```bash
bun dev
```

¡Y listo! La app estará disponible en `http://localhost:3000`


## Cómo Usar

1. **Login**: Accede con las credenciales configuradas en .env.local
2. **Configurar ambiente**: Selecciona desarrollo o producción
3. **Agregar tokens**: Ingresa tokens FCM de dispositivos
4. **Crear notificación**: Escribe título y mensaje
5. **Enviar**: ¡Presiona enviar y ve los resultados!

## Colaboración

Espero que les sea útil y facilite el trabajo diario.
Que siga creciendo si asi nos resulta conveniente.

---

*Iniciado por Luis Espinoza*


