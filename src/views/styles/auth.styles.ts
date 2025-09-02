import { StyleSheet } from 'react-native';
import { theme } from './theme';

export const authStyles = StyleSheet.create({
  // Logo más moderno y atractivo
  logoContainer: {
    marginBottom: theme.spacing.xl,
    shadowColor: 'rgba(0, 0, 0, 0.15)',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    transform: [{ scale: 1.05 }],
  },
  
  // Textos más modernos y atractivos
  welcomeText: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1a202c',
    marginBottom: theme.spacing.md,
    textAlign: 'center',
    letterSpacing: -0.5,
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  subtitleText: {
    fontSize: 18,
    color: '#4a5568',
    textAlign: 'center',
    fontWeight: '500',
    letterSpacing: 0.2,
    lineHeight: 24,
    opacity: 0.9,
  },
  
  // Inputs más amplios y sutiles
  inputContainer: {
    marginBottom: theme.spacing.lg,
    width: '100%',
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4a5568',
    marginBottom: theme.spacing.sm,
    letterSpacing: 0.2,
  },
  input: {
    borderWidth: 2, // Borde más grueso para mejor definición
    borderRadius: 12, // Más redondeado para modernidad
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: 16,
    fontSize: 15,
    backgroundColor: '#ffffff',
    color: '#2d3748',
    borderColor: '#e2e8f0',
    shadowColor: 'rgba(0, 0, 0, 0.08)',
    shadowOffset: {
      width: 0,
      height: 4, // Sombra más profunda
    },
    shadowOpacity: 0.08,
    shadowRadius: 8, // Radio más grande
    elevation: 2, // Mayor elevación
    minHeight: 50,
  },
  
  // Password Input más moderno
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2, // Borde más grueso
    borderRadius: 12, // Más redondeado
    backgroundColor: '#ffffff',
    borderColor: '#e2e8f0',
    shadowColor: 'rgba(0, 0, 0, 0.08)',
    shadowOffset: {
      width: 0,
      height: 4, // Sombra más profunda
    },
    shadowOpacity: 0.08,
    shadowRadius: 8, // Radio más grande
    elevation: 2, // Mayor elevación
    minHeight: 50,
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: 16,
    fontSize: 15,
    color: '#2d3748',
  },
  eyeButton: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: 16,
  },
  eyeIcon: {
    fontSize: 18,
    opacity: 0.6,
  },
  
  // Enlaces más sutiles
  forgotPasswordContainer: {
    alignItems: 'flex-end',
    marginBottom: theme.spacing.xl,
  },
  forgotPasswordText: {
    color: '#805ad5',
    fontSize: 14,
    fontWeight: '600', // Más bold
    letterSpacing: 0.2, // Mejor espaciado
    textDecorationLine: 'underline', // Subrayado sutil
    textDecorationColor: '#805ad5',
    textDecorationStyle: 'solid',
  },
  
  // Botón más moderno con sombras mejoradas
  primaryButton: {
    backgroundColor: '#553c9a',
    borderRadius: 12, // Aumentado para más modernidad
    paddingVertical: 18,
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
    shadowColor: '#553c9a',
    shadowOffset: {
      width: 0,
      height: 8, // Sombra más profunda
    },
    shadowOpacity: 0.35, // Más opaca para mejor efecto
    shadowRadius: 16, // Radio más grande para sombra suave
    elevation: 12, // Mayor elevación en Android
    borderWidth: 0,
    transform: [{ scale: 1 }],
    minHeight: 56,
  },
  primaryButtonDisabled: {
    backgroundColor: '#cbd5e0',
    shadowOpacity: 0.1,
    transform: [{ scale: 0.98 }],
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  
  // Enlaces de registro más sutiles
  signUpText: {
    color: '#718096',
    fontSize: 14,
    fontWeight: '400',
  },
  signUpButtonText: {
    color: '#805ad5',
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.1,
  },
});
