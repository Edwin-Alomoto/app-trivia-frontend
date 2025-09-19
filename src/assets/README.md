# Assets

Esta carpeta contiene todos los assets de la aplicación.

## Estructura

- `icon.png` - Icono principal de la aplicación
- `adaptive-icon.png` - Icono adaptativo para Android
- `favicon.png` - Favicon para web
- `splash-icon.png` - Icono de splash screen

## Uso

### En componentes React Native:
```typescript
import { Icon, AdaptiveIcon } from '@assets';
// o
import Icon from '@assets/icon.png';
```

### En configuración de Expo:
Los assets están configurados en `app.json` y se cargan automáticamente.

## Configuración

- **Metro**: Configurado en `metro.config.js` para reconocer assets
- **Babel**: Configurado en `babel.config.js` para resolver `@assets/*`
- **TypeScript**: Configurado en `tsconfig.json` para resolver `@assets/*`
- **Expo**: Configurado en `app.json` para iconos y splash screen
