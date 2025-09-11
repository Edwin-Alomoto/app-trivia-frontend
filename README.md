# 🎯 WinUp - App de Trivia

Una aplicación móvil completa de trivia desarrollada con React Native y Expo, que permite a los usuarios jugar trivias, ganar puntos y canjear premios.

## 🚀 Características

### ✅ Casos de Uso Implementados

- **UC-01** ✅ Registrarse (solo email)
- **UC-02** ✅ Iniciar sesión (solo email)
- **UC-03** ✅ Recuperar contraseña (UI preparada)
- **UC-04** ✅ Ver categorías y seleccionar trivia
- **UC-05** ✅ Jugar trivia y acumular puntos
- **UC-06** ✅ Ver saldo de puntos y progreso
- **UC-07** ✅ Comprar puntos
- **UC-08** ✅ Participar en sorteos
- **UC-09** ✅ Canjear premios
- **UC-10** ✅ Ver ganadores y mis participaciones
- **UC-11** ✅ Gestionar perfil
- **UC-12** ✅ Recibir notificaciones
- **UC-13** ✅ Usar Modo Demo
- **UC-14** ✅ Responder encuestas
- **UC-15** ✅ Selección de Modo (solo para cuentas no suscritas)

### 🎮 Funcionalidades Principales

- **Autenticación completa** con registro e inicio de sesión
- **Sistema de suscripción** con modo demo y suscripción completa
- **6 categorías de trivia** con diferentes niveles de dificultad
- **Sistema de puntos dual** (demo y real)
- **Juego de trivia interactivo** con temporizador y animaciones
- **Sistema de compra de puntos** con pasarelas de pago
- **Sorteos y premios** con participación y canje
- **Encuestas** con recompensas de puntos
- **Interfaz moderna y minimalista** con animaciones suaves
- **Navegación por tabs** intuitiva
- **Estado global** con Redux Toolkit
- **Persistencia de datos** con SecureStore
- **Sincronización offline** para respuestas de trivia

## 📱 Capturas de Pantalla

### Pantallas de Autenticación
- Login minimalista con validación de formularios
- Registro con requisitos de contraseña y términos
- Selección de modo (Demo/Suscripción)
- Recuperación de contraseña

### Pantalla Principal
- Dashboard con saldo de puntos (demo/real)
- Acciones rápidas para jugar y encuestas
- Categorías populares
- Estadísticas de progreso
- Banner de restricciones para modo demo

### Juego de Trivia
- Preguntas con múltiples opciones
- Temporizador por pregunta
- Animaciones de puntuación con partículas
- Feedback háptico
- Progreso visual
- Desglose de puntos al finalizar

### Sistema de Puntos
- Historial de transacciones
- Progreso hacia premios y sorteos
- Compra de puntos con paquetes
- Diferencia entre puntos demo y real

## 🛠️ Tecnologías Utilizadas

- **React Native** - Framework principal
- **Expo** - Plataforma de desarrollo
- **TypeScript** - Tipado estático
- **Redux Toolkit** - Gestión de estado
- **React Navigation** - Navegación
- **Expo Linear Gradient** - Gradientes
- **React Native Reanimated** - Animaciones
- **Expo Haptics** - Feedback táctil
- **Expo SecureStore** - Almacenamiento seguro
- **Expo StatusBar** - Control de barra de estado

## 📦 Instalación

### Prerrequisitos

- Node.js (versión 16 o superior)
- npm o yarn
- Expo CLI
- Android Studio (para Android) o Xcode (para iOS)

### Pasos de Instalación

1. **Clonar el repositorio**
   ```bash
   git clone <url-del-repositorio>
   cd trivia-plataform/trivia-app
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Iniciar la aplicación**
   ```bash
   npx expo start
   ```

4. **Ejecutar en dispositivo/emulador**
   - Presiona `a` para Android
   - Presiona `i` para iOS
   - Escanea el QR con la app Expo Go en tu dispositivo

## 🎯 Cómo Jugar

1. **Regístrate o inicia sesión** en la aplicación
2. **Selecciona tu modo** (Demo o Suscripción)
3. **Explora las categorías** disponibles
4. **Selecciona una categoría** que te interese
5. **Responde las preguntas** antes de que se acabe el tiempo
6. **Gana puntos** por cada respuesta correcta
7. **Participa en encuestas** para ganar puntos adicionales
8. **Canjea tus puntos** por premios o participa en sorteos

## 🏗️ Estructura del Proyecto

```
src/
├── components/
│   ├── animations/          # Componentes de animación
│   │   ├── PointsCounter.tsx
│   │   └── PointsParticles.tsx
│   └── ui/                  # Componentes de UI reutilizables
│       ├── Button.tsx
│       ├── Input.tsx
│       ├── Card.tsx
│       └── DemoRestrictionBanner.tsx
├── hooks/                   # Hooks personalizados
│   ├── useAppDispatch.ts
│   ├── useAppSelector.ts
│   └── useDemoStatus.ts
├── navigation/              # Configuración de navegación
│   └── AppNavigator.tsx
├── screens/                 # Pantallas de la aplicación
│   ├── auth/               # Pantallas de autenticación
│   │   ├── LoginScreen.tsx
│   │   ├── RegisterScreen.tsx
│   │   ├── ForgotPasswordScreen.tsx
│   │   └── ModeSelectionScreen.tsx
│   ├── main/               # Pantallas principales
│   │   ├── HomeScreen.tsx
│   │   └── CategoriesScreen.tsx
│   ├── game/               # Pantallas del juego
│   │   └── TriviaGameScreen.tsx
│   ├── points/             # Pantallas de puntos
│   │   └── PointsHistoryScreen.tsx
│   ├── purchases/          # Pantallas de compras
│   │   └── BuyPointsScreen.tsx
│   ├── surveys/            # Pantallas de encuestas
│   │   └── SurveysScreen.tsx
│   ├── raffles/            # Pantallas de sorteos
│   │   ├── RafflesScreen.tsx
│   │   └── MyRafflesScreen.tsx
│   ├── rewards/            # Pantallas de premios
│   │   ├── RewardsScreen.tsx
│   │   └── MyRewardsScreen.tsx
│   ├── profile/            # Pantallas de perfil
│   │   └── ProfileScreen.tsx
│   └── notifications/      # Pantallas de notificaciones
│       └── NotificationsScreen.tsx
├── store/                  # Configuración de Redux
│   ├── index.ts
│   └── slices/             # Slices de Redux
│       ├── authSlice.ts
│       ├── triviaSlice.ts
│       ├── pointsSlice.ts
│       ├── purchasesSlice.ts
│       ├── surveysSlice.ts
│       ├── rafflesSlice.ts
│       ├── rewardsSlice.ts
│       ├── profileSlice.ts
│       └── notificationsSlice.ts
└── types/                  # Definiciones de tipos TypeScript
    └── index.ts
```

## 🔧 Configuración

### Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
# Configuración de la API (cuando se implemente)
API_URL=https://tu-api.com
API_KEY=tu-api-key

# Configuración de notificaciones
EXPO_PUSH_TOKEN=tu-push-token

# Configuración de pagos
STRIPE_PUBLISHABLE_KEY=tu-stripe-key
```

### Configuración de Expo

El archivo `app.json` contiene la configuración de Expo:

```json
{
  "expo": {
    "name": "TriviaMaster",
    "slug": "trivia-master",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#f8fafc"
    },
    "updates": {
      "fallbackToCacheTimeout": 0
    },
    "assetBundlePatterns": [
      "**/*"
    ],
    "ios": {
      "supportsTablet": true
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#f8fafc"
      }
    },
    "web": {
      "favicon": "./assets/favicon.png"
    }
  }
}
```

## 🚀 Despliegue

### Para Producción

1. **Construir la aplicación**
   ```bash
   expo build:android  # Para Android
   expo build:ios      # Para iOS
   ```

2. **Publicar en las tiendas**
   - Google Play Store para Android
   - App Store para iOS

### Para Desarrollo

```bash
# Modo desarrollo
npx expo start

# Modo desarrollo con caché limpio
npx expo start --clear

# Modo desarrollo en túnel
npx expo start --tunnel
```

## 🧪 Testing

### Ejecutar Tests

```bash
# Tests unitarios
npm test

# Tests de integración
npm run test:integration

# Tests E2E
npm run test:e2e
```

## 📊 Estado del Proyecto

### ✅ Completado
- [x] Estructura base del proyecto
- [x] Sistema de autenticación completo
- [x] Navegación principal con tabs
- [x] Pantallas de trivia con animaciones
- [x] Sistema de puntos dual (demo/real)
- [x] UI/UX moderna y minimalista
- [x] Gestión de estado con Redux Toolkit
- [x] Sistema de compra de puntos
- [x] Sorteos y premios
- [x] Encuestas con recompensas
- [x] Modo demo con restricciones
- [x] Sincronización offline
- [x] Animaciones de puntos y partículas
- [x] Feedback háptico
- [x] Validación de formularios
- [x] Persistencia de datos

### 🚧 En Desarrollo
- [ ] Integración con API real
- [ ] Sistema de notificaciones push
- [ ] Integración con pasarelas de pago reales
- [ ] Sistema de sorteos con backend
- [ ] Catálogo de premios dinámico

### 📋 Pendiente
- [ ] Tests automatizados
- [ ] Optimización de rendimiento
- [ ] Accesibilidad completa
- [ ] Internacionalización
- [ ] Modo offline completo
- [ ] Analytics y métricas
- [ ] Sistema de logros
- [ ] Multiplayer/competencia

## 🔐 Credenciales de Prueba

### Login
- **Email:** `usuario@ejemplo.com`
- **Contraseña:** `12345678`

### Registro
- Usa cualquier email válido
- La contraseña debe cumplir los requisitos de seguridad

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## 👥 Autores

- **Edwin** - *Desarrollo inicial* - [Edwin](https://github.com/Edwin)

## 🙏 Agradecimientos

- Expo por la excelente plataforma de desarrollo
- React Native por el framework móvil
- La comunidad de desarrolladores móviles
- Redux Toolkit por la gestión de estado simplificada

## 📞 Soporte

Si tienes alguna pregunta o problema:

- 📧 Email: soporte@winup.com
- 💬 Discord: [Servidor de Discord](https://discord.gg/winup)
- 📱 Twitter: [@WinUpApp](https://twitter.com/WinUpApp)

---

**¡Disfruta jugando WinUp! 🎯✨**

## 🧱 Arquitectura MVVM (Adaptada a React Native)

### Capas

- View: `src/screens/*` y `src/components/ui/*` (UI pura y eventos)
- ViewModel: `src/viewmodels/<feature>/*` (estado derivado, orquestación, validaciones)
- Model: `src/store/slices/*` (Redux Toolkit) + `src/services/*` (acceso a datos, storage)

### Puntos clave

- Feature flag: `src/config/featureFlags.ts` controla adopción gradual (p. ej. `useMVVMLogin`)
- DI/Servicios: `src/services/container.ts` expone `getServices()` y `setServices()`
- Autenticación (servicio): `src/services/auth/*` (`IAuthService`, `HttpAuthService`)
- Validación: `src/validators/auth.ts` con Zod (`loginSchema` y tipos inferidos)
- ViewModel ejemplo: `src/viewmodels/auth/useLoginViewModel.ts`
- Navegación tipada: `src/navigation/types.ts` (`useAppNavigation`)
- Redux tipado: thunks y selectores memoizados en `authSlice.ts`

### Alias de paths

Configurados en TypeScript (`tsconfig.json`) y Babel (`babel.config.js`):

```
@ -> src
@components -> src/components
@screens -> src/screens
@store -> src/store
@services -> src/services
@viewmodels -> src/viewmodels
@hooks -> src/hooks
@types -> src/types
@navigation -> src/navigation
@validators -> src/validators
@config -> src/config
@assets -> assets
```

### Estándares de UI

- `Button` y `Input` con props consistentes, accesibilidad y estados (`loading`, `error`, `helperText`, `leftIcon`, etc.)

### Reglas de lint/format

- ESLint: `.eslintrc.js` (base React Native, react-hooks, import/order)
- Prettier: `.prettierrc` (estilo consistente del código)

## 🧭 Plan de migración a MVVM (incremental y seguro)

1. Autenticación (piloto)
   - Añadir `useLoginViewModel` y validación con Zod
   - Integrar tras un feature flag (por defecto desactivado)
2. Registro
   - Crear `useRegisterViewModel`, servicio y validaciones
3. Dominios principales
   - Migrar `Points`, `Raffles`, `Rewards` gradualmente (pantalla por pantalla)
4. Endurecer contratos
   - Selectores y thunks tipados como API del dominio
5. Pruebas
   - Unitarias para ViewModels y servicios; smoke tests de pantallas

### Cómo activar el piloto de Login (opcional)

Edita `src/config/featureFlags.ts` y ajusta:

```ts
export const featureFlags = {
  useMVVMLogin: true,
};
```

Esto no cambia la lógica de negocio; solo hace que `LoginScreen` use el ViewModel en lugar del manejo local.