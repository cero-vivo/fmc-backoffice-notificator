# 🎁 Push Notifications App - Regalo para el Equipo Móvil de Bizland

¡Hola equipo! 👋 

Con mucho cariño les comparto esta aplicación de notificaciones push desarrollada especialmente para el equipo móvil de Bizland. Espero que sea de gran utilidad para sus proyectos.

**Por Luis Espinoza** ❤️

---

## ✨ ¿Qué es esta aplicación?

Una aplicación web completa para gestionar y enviar notificaciones push a dispositivos móviles usando Firebase Cloud Messaging (FCM). Está diseñada con los colores corporativos de Bizland y lista para usar en múltiples ambientes.

## 🎨 Características Principales

- **🔐 Autenticación segura** - Login protegido para acceso controlado
- **📱 Gestión de tokens FCM** - Añadir, editar y organizar tokens de dispositivos
- **🚀 Envío masivo** - Enviar notificaciones a múltiples dispositivos simultáneamente
- **🌍 Multi-ambiente** - Soporte para desarrollo, staging y producción
- **📊 Reportes detallados** - Ver estadísticas de envíos exitosos y fallidos
- **🎨 Diseño Bizland** - Colores corporativos y diseño profesional
- **⚡ Tecnología moderna** - Next.js 15, React 19, TypeScript

## �️ Tecnologías Utilizadas

- **Framework**: Next.js 15.5.3 con Turbopack
- **Frontend**: React 19.1.0 + TypeScript
- **Backend**: Firebase Admin SDK 13.5.0
- **Styling**: CSS personalizado con variables Bizland
- **Icons**: Lucide React
- **Bundler**: Turbopack para desarrollo ultra-rápido

## 🎯 Configuración Rápida

### 1. Instalar dependencias
```bash
npm install
```

### 2. Configurar Firebase
Coloca tus archivos de service account en la raíz:
- `service-account-key-dev.json` (desarrollo)
- `service-account-key-prod.json` (producción)

### 3. Variables de entorno
Crea `.env.local`:
```env
NEXT_PUBLIC_APP_ENV=development
LOGIN_USERNAME=admin
LOGIN_PASSWORD=tu-password-seguro
```

### 4. Ejecutar en desarrollo
```bash
npm run dev
```

¡Y listo! La app estará disponible en `http://localhost:3000` 🎉

## 🚀 Scripts Disponibles

```bash
npm run dev      # Modo desarrollo con Turbopack
npm run build    # Compilar para producción  
npm run start    # Ejecutar versión de producción
npm run lint     # Verificar código
```

## 🎨 Colores de Bizland Incluidos

El diseño utiliza la paleta oficial de Bizland:

- **Primary Blue**: `hsl(217, 100%, 36.7%)` - El azul característico de Bizland
- **Secondary Teal**: `#3CDBC0` - Verde azulado para acentos
- **Surface**: `#F5F9FF` - Fondo suave y profesional
- **Success**: `#10B981` - Verde para confirmaciones
- **Error**: `#EF4444` - Rojo para errores
- **Warning**: `#F59E0B` - Naranja para advertencias

## 📱 Cómo Usar

1. **Login**: Accede con las credenciales configuradas
2. **Configurar ambiente**: Selecciona desarrollo o producción
3. **Agregar tokens**: Ingresa tokens FCM de dispositivos
4. **Crear notificación**: Escribe título y mensaje
5. **Enviar**: ¡Presiona enviar y ve los resultados!

## 🏗️ Estructura del Proyecto

```
src/
├── app/
│   ├── api/           # Endpoints del backend
│   ├── dashboard/     # Panel principal
│   ├── login/         # Página de autenticación
│   └── layout.tsx     # Layout principal
├── components/
│   └── TokenInput.tsx # Componente para gestionar tokens
└── config/
    └── index.ts       # Configuración y colores
```

## � Consejos para el Equipo

- **Testing**: Usa el ambiente de desarrollo para pruebas
- **Tokens**: Los tokens FCM se pueden obtener desde las apps móviles
- **Múltiples envíos**: La app maneja lotes grandes automáticamente
- **Errores**: Los detalles de errores se muestran para debugging
- **Seguridad**: Cambia las credenciales de login en producción

## 🤝 Colaboración

Este proyecto está diseñado para crecer con el equipo. Si necesitan nuevas características o tienen ideas de mejora, ¡estoy disponible para colaborar!

**Funcionalidades futuras que podríamos agregar**:
- 📊 Dashboard con métricas avanzadas
- 📅 Programación de notificaciones
- 👥 Gestión de usuarios múltiples
- 🔔 Templates de notificaciones
- 📈 Analytics de engagement

## 🙏 Agradecimientos

Gracias al equipo móvil de Bizland por la oportunidad de contribuir con esta herramienta. Espero que les sea muy útil y facilite su trabajo diario.

---

**¡Que tengan excelentes desarrollos!** 🚀

*Con cariño,*  
**Luis Espinoza** 💙

---

### 📞 Contacto

Si necesitan ayuda con la configuración o tienen preguntas sobre el código, no duden en contactarme. ¡Estoy aquí para apoyar! 

*Made with ❤️ for the Bizland Mobile Team*
