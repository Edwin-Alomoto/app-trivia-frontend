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

## 📁 Organización de carpetas (detalle actual)

Esta sección describe cómo está organizada la base de código hoy, alineada al enfoque por features y MVVM adaptado.

```
src/
├── components/
│   ├── AppInitializer.tsx             # Inicialización global (providers, cargas iniciales)
│   ├── WinnerPaymentModal.tsx         # Modal compartido (legacy)
│   ├── animations/                    # Animaciones compartidas (legacy)
│   └── ui/                            # UI compartida (banners, etc.) (legacy)
│
├── config/
│   └── featureFlags.ts                # Flags para activar gradualmente MVVM/features
│
├── features/                          # Código por dominio (feature-first)
│   └── auth/
│       ├── data/                      # Data sources (API, mappers) [reservado]
│       ├── domain/
│       │   ├── hooks/                 # ViewModels/Hooks de dominio
│       │   │   ├── useLoginViewModel.ts
│       │   │   └── useRegisterViewModel.ts
│       │   ├── store/                 # Slice/Thunks/selectores de dominio
│       │   │   └── authSlice.ts
│       │   ├── types/                 # Tipos del dominio
│       │   │   ├── auth.ts
│       │   │   └── index.ts
│       │   └── validators/            # Validaciones (p. ej. Zod)
│       │       └── auth.ts
│       └── presentation/
│           ├── components/            # Componentes UI específicos de auth
│           │   ├── AnimatedButton.tsx
│           │   ├── AuthFooter.tsx
│           │   ├── DatePickerField.tsx
│           │   ├── DecorativeBlobs.tsx
│           │   ├── FormTextInput.tsx
│           │   ├── InlineDropdown.tsx
│           │   ├── LoginHeader.tsx
│           │   ├── PasswordInput.tsx
│           │   ├── RememberMeCheckbox.tsx
│           │   └── StrengthMeter.tsx
│           ├── screens/               # Pantallas de autenticación
│           │   ├── ForgotPasswordScreen.tsx
│           │   ├── LoginScreen.tsx
│           │   ├── ModeSelectionScreen.tsx
│           │   ├── RegisterScreen.tsx
│           │   └── styles/            # Estilos desacoplados por pantalla
│           │       ├── ForgotPasswordScreen.styles.ts
│           │       ├── LoginScreen.styles.ts
│           │       └── RegisterScreen.styles.ts
│
├── hooks/                             # Hooks compartidos (infra y utilitarios)
│   ├── useAppDispatch.ts
│   ├── useAppSelector.ts
│   ├── useDemoStatus.ts
│   ├── useSafeStateUpdate.ts
│   └── index.ts
│
├── navigation/                        # Navegación y tipos
│   ├── AppNavigator.tsx
│   └── types.ts
│
├── screens/                           # Pantallas legacy agrupadas por área
│   ├── game/                          # Juego de trivia
│   │   └── TriviaGameScreen.tsx
│   ├── main/                          # Home y categorías
│   │   ├── CategoriesScreen.tsx
│   │   └── HomeScreen.tsx
│   ├── notifications/
│   │   └── NotificationsScreen.tsx
│   ├── points/
│   │   └── PointsHistoryScreen.tsx
│   ├── profile/
│   │   ├── HelpScreen.tsx
│   │   ├── ProfileScreen.tsx
│   │   └── SettingsScreen.tsx
│   ├── purchases/
│   │   └── BuyPointsScreen.tsx
│   ├── raffles/
│   │   ├── MyRafflesScreen.tsx
│   │   ├── RafflesScreen.tsx
│   │   └── RouletteScreen.tsx
│   ├── rewards/
│   │   ├── MyRewardsScreen.tsx
│   │   └── RewardsScreen.tsx
│   ├── surveys/
│   │   └── SurveysScreen.tsx
│   └── testimonials/
│       └── TestimonialsScreen.tsx
│
├── services/                          # Acceso a datos e integración
│   ├── container.ts                   # Registro/obtención de servicios (DI simple)
│   ├── auth/                          # Servicio de auth (reservado)
│   ├── notifications/
│   │   ├── httpNotificationsService.ts
│   │   └── types.ts
│   ├── points/
│   │   ├── httpPointsService.ts
│   │   └── types.ts
│   ├── purchases/
│   │   ├── httpPurchasesService.ts
│   │   └── types.ts
│   ├── raffles/
│   │   ├── httpRafflesService.ts
│   │   └── types.ts
│   ├── rewards/
│   │   ├── httpRewardsService.ts
│   │   └── types.ts
│   ├── surveys/
│   │   ├── httpSurveysService.ts
│   │   └── types.ts
│   └── trivia/
│       ├── httpTriviaService.ts
│       └── types.ts
│
├── shared/                            # UI/temas/Tipos compartidos multi-feature
│   ├── domain/
│   │   └── types/
│   │       ├── common.ts
│   │       ├── index.ts
│   │       ├── navigation.ts
│   │       └── state.ts
│   └── presentation/
│       ├── animations/
│       │   ├── EntryAnimator.tsx
│       │   ├── FocusScaleView.tsx
│       │   ├── PointsCounter.tsx
│       │   └── PointsParticles.tsx
│       ├── components/
│       │   ├── ErrorBoundary.tsx
│       │   └── ui/
│       │       ├── Button.tsx
│       │       ├── Card.tsx
│       │       └── Input.tsx
│       └── theme/
│           ├── colors.ts
│           ├── gradients.ts
│           └── typography.ts
│
├── store/                             # Estado global (Redux Toolkit)
│   ├── index.ts
│   └── slices/
│       ├── notificationsSlice.ts
│       ├── pointsSlice.ts
│       ├── purchasesSlice.ts
│       ├── rafflesSlice.ts
│       ├── rewardsSlice.ts
│       ├── surveysSlice.ts
│       ├── testimonialsSlice.ts
│       └── triviaSlice.ts
│
├── theme/                             # Theming (legacy; en transición a shared/presentation/theme)
│   ├── colors.ts
│   ├── gradients.ts
│   └── typography.ts
│
└── viewmodels/                        # ViewModels compartidos por área (gradual)
    ├── main/
    │   └── useHomeViewModel.ts
    ├── notifications/
    │   └── useNotificationsViewModel.ts
    ├── points/
    │   └── usePointsViewModel.ts
    ├── profile/
    │   └── useProfileViewModel.ts
    ├── purchases/
    │   └── usePurchasesViewModel.ts
    ├── raffles/
    │   └── useRafflesViewModel.ts
    ├── rewards/
    │   └── useRewardsViewModel.ts
    ├── surveys/
    │   └── useSurveysViewModel.ts
    └── trivia/
        ├── useCategoriesViewModel.ts
        └── useTriviaGameViewModel.ts
```

Notas:
- La carpeta `features/*` es el destino preferido para nuevo código por dominio (presentación, dominio, data).
- Las carpetas `screens/*`, `components/*` y `theme/*` se mantienen por compatibilidad y migrarán gradualmente a `features/*` y `shared/*`.
- Los servicios HTTP por dominio viven en `services/<dominio>` y exponen contratos en `types.ts`.
- Los estilos de pantallas de autenticación están desacoplados en `src/features/auth/presentation/screens/styles`.

## 📘 Consumo (formato guía rápida)

### 1) Orden por carpetas (dónde crear/ubicar cada cosa)
- Dominio/feature: `src/features/<dominio>/`
  - Dominios y lógica: `domain/`
    - Contratos: `types/`
    - Validaciones: `validators/`
    - Estado y efectos: `store/`
    - Orquestación (ViewModels): `hooks/`
  - Presentación: `presentation/`
    - Componentes UI específicos: `components/`
    - Pantallas: `screens/`
    - Estilos de pantalla: `screens/styles/`
  - Data (adapters/datasources): `data/` (cuando aplique)
- Servicios HTTP por dominio: `src/services/<dominio>/`
  - Contratos del servicio: `types.ts`
  - Implementación HTTP: `http<Domain>Service.ts`
- Compartidos transversales: `src/shared/`
- Navegación: `src/navigation/`
- Estado global: `src/store/`
- Config/flags: `src/config/`
- Hooks infra: `src/hooks/`

### 2) Orden por archivos (secuencia para implementar/consumir)
1. Definir tipos del dominio
   - `src/features/<dominio>/domain/types/*.ts`
2. Definir validaciones (si aplica)
   - `src/features/<dominio>/domain/validators/*.ts`
3. Definir interfaz del servicio
   - `src/services/<dominio>/types.ts`
4. Implementar servicio HTTP
   - `src/services/<dominio>/http<Domain>Service.ts`
5. Crear/actualizar slice y thunks
   - `src/features/<dominio>/domain/store/<dominio>Slice.ts`
6. Crear ViewModel (hook)
   - `src/features/<dominio>/domain/hooks/use<Case>ViewModel.ts`
7. Construir componentes UI específicos
   - `src/features/<dominio>/presentation/components/*`
8. Implementar pantalla
   - `src/features/<dominio>/presentation/screens/<Screen>.tsx`
9. Agregar estilos
   - `src/features/<dominio>/presentation/screens/styles/<Screen>.styles.ts`
10. Registrar en navegación
   - `src/navigation/types.ts` y `src/navigation/AppNavigator.tsx`
11. Activar con feature flag (opcional)
   - `src/config/featureFlags.ts`

### Ejemplo ultra–resumido: Login
- Carpeta: `features/auth/*`
- Servicio: `services/auth` (contratos + `HttpAuthService`)
- Slice: `features/auth/domain/store/authSlice.ts`
- ViewModel: `features/auth/domain/hooks/useLoginViewModel.ts`
- Pantalla: `features/auth/presentation/screens/LoginScreen.tsx`
- Estilos: `features/auth/presentation/screens/styles/LoginScreen.styles.ts`

### 🔗 Flujo de consumo: Registro (feature-based layered)

- Backend
  - Endpoint: `POST https://backend-trivia-nest.onrender.com/auth/register`
  - Body: `first_name, last_name, address, username, email, password, phone, birth_date, gender, status`
  - Respuesta: `{ status, message, data{ user, accessToken, refreshToken, ... }, timestamp }`

- ApiClient (+Auth Interceptor)
  - `src/shared/config/env.ts` → baseURL y timeout
  - `src/shared/config/endpoints.ts` → `endpoints.auth.register = '/auth/register'`
  - `src/shared/infrastructure/http/ApiClient.ts` → cliente axios
  - `src/shared/infrastructure/http/interceptors/auth.interceptor.ts` → agrega `Authorization: Bearer <token>` si existe

- DataSource (HTTP)
  - `src/features/auth/data/datasources/AuthRemoteDataSource.ts`
  - `register(payload)` → `apiClient.post(endpoints.auth.register, payload)`

- DTOs
  - `src/features/auth/data/dtos/RegisterDTO.ts`
  - `RegisterRequest` (body enviado) y `RegisterResponse` con `data: Record<string, any>` (flexible)

- Mapper (DTO → Dominio)
  - `src/features/auth/data/mappers/auth.mapper.ts`
  - `mapRegisterResponseToUser(res)` → construye `User` de dominio y extrae tokens

- Repositorio
  - `src/features/auth/data/repositories/impl/AuthRepositoryHttp.ts`
  - `register(payload)` → orquesta datasource + mapper → `{ user, token, refreshToken }`

- Caso de Uso
  - `src/features/auth/domain/useCases/RegisterUseCase.ts`
  - `execute(payload)` → retorna `{ user, token, refreshToken }`

- Storage de tokens
  - `src/shared/storage/token.storage.ts` → `setAccessToken`, `setRefreshToken`, `getAccessToken`

- Hook (Presentación)
  - `src/features/auth/domain/hooks/useRegisterViewModel.ts`
  - `submit()` → valida form → arma `RegisterRequest` → `RegisterUseCase.execute` → guarda tokens → actualiza UI

- UI
  - `src/features/auth/presentation/screens/RegisterScreen.tsx` → usa el hook y maneja estados de carga/errores

Nota: si cambian campos del backend, ajusta `RegisterRequest` y el mapper; `RegisterResponse.data` es flexible.

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