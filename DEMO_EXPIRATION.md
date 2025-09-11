# Sistema de Caducidad del Demo - RF-13

## Descripción
Este sistema implementa la **RF-13: Caducidad Demo** que maneja automáticamente la expiración del período de prueba y la migración de puntos.

## Funcionalidades Implementadas

### 1. Verificación Automática de Caducidad
- **Al iniciar la app**: Se verifica si el demo ha expirado
- **Al cargar pantallas**: Se verifica el estado del demo
- **Verificación periódica**: Cada vez que se accede al hook `useDemoStatus`

### 2. Alertas de Expiración
- **3 días antes**: Banner azul de advertencia
- **1 día antes**: Banner naranja de último día
- **Al expirar**: Alerta modal con opciones

### 3. Manejo de Expiración
- **Si se suscribe**: Migra puntos demo a reales
- **Si no se suscribe**: Elimina puntos demo
- **Estado actualizado**: Cambia a 'expired' o 'subscribed'

## Componentes Creados

### 1. `DemoExpirationBanner`
- Muestra advertencias de caducidad
- Colores dinámicos según días restantes
- Botón de suscripción integrado

### 2. `AppInitializer`
- Verifica caducidad al cargar la app
- Se ejecuta automáticamente en el App.tsx

### 3. Async Thunks en `authSlice`
- `checkDemoExpiration`: Verifica estado de caducidad
- `handleDemoExpiration`: Maneja expiración
- `migrateDemoPoints`: Migra puntos demo a reales

## Flujo de Funcionamiento

### Usuario Demo Normal
1. Usuario activa modo demo (7 días)
2. Sistema verifica caducidad automáticamente
3. Muestra banner de advertencia cuando quedan ≤3 días
4. Al expirar, muestra alerta con opciones

### Usuario que se Suscribe
1. Al hacer clic en "Suscribirse"
2. Sistema migra puntos demo a reales
3. Cambia estado a 'subscribed'
4. Muestra confirmación de migración

### Usuario que No se Suscribe
1. Al hacer clic en "Continuar sin demo"
2. Sistema elimina puntos demo
3. Cambia estado a 'expired'
4. Usuario pierde acceso a funcionalidades premium

## Integración con Funcionalidades Existentes

### No Afecta:
- ✅ Sistema de puntos existente
- ✅ Funcionalidades de trivia
- ✅ Sistema de premios y sorteos
- ✅ Autenticación y registro
- ✅ Notificaciones

### Se Integra con:
- ✅ `useDemoStatus` hook existente
- ✅ `DemoRestrictionBanner` existente
- ✅ Sistema de navegación
- ✅ Estado de Redux

## Configuración

### Duración del Demo
```typescript
// En activateDemoMode (authSlice.ts)
demoExpiresAt.setDate(demoExpiresAt.getDate() + 7); // 7 días
```

### Días de Advertencia
```typescript
// En DemoExpirationBanner.tsx
if (daysLeft > 3) return null; // Solo mostrar si quedan ≤3 días
```

### Puntos Iniciales Demo
```typescript
// En activateDemoMode (authSlice.ts)
points: 100, // Puntos iniciales de demo
```

## Pruebas

### Para Probar la Caducidad:
1. Activar modo demo
2. Cambiar fecha del sistema a 7 días después
3. Reiniciar la app
4. Verificar que se muestre alerta de expiración

### Para Probar Advertencias:
1. Activar modo demo
2. Cambiar fecha a 1-3 días antes de expirar
3. Verificar que se muestre banner de advertencia

## Seguridad

- ✅ Verificación en el cliente y servidor
- ✅ Persistencia en SecureStore
- ✅ Manejo de errores robusto
- ✅ No afecta datos de otros usuarios

## Compatibilidad

- ✅ React Native
- ✅ Expo
- ✅ Redux Toolkit
- ✅ TypeScript
- ✅ Navegación existente
