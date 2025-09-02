import { StyleSheet } from 'react-native';
import { theme } from './theme';

export const authStyles = StyleSheet.create({
  // Logo más sutil
  logoContainer: {
    marginBottom: theme.spacing.lg,
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  
  // Textos más sutiles
  welcomeText: {
    fontSize: 28,
    fontWeight: '600',
    color: '#2d3748',
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
    letterSpacing: -0.3,
  },
  subtitleText: {
    fontSize: 16,
    color: '#718096',
    textAlign: 'center',
    fontWeight: '400',
    letterSpacing: 0.1,
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
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: 16,
    fontSize: 15,
    backgroundColor: '#ffffff',
    color: '#2d3748',
    borderColor: '#e2e8f0',
    shadowColor: 'rgba(0, 0, 0, 0.05)',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
    minHeight: 50,
  },
  
  // Password Input más amplio
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: '#ffffff',
    borderColor: '#e2e8f0',
    shadowColor: 'rgba(0, 0, 0, 0.05)',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
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
    fontWeight: '500',
    letterSpacing: 0.1,
  },
  
  // Botón más amplio
  primaryButton: {
    backgroundColor: '#805ad5',
    borderRadius: 8,
    paddingVertical: 18,
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
    shadowColor: '#805ad5',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
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
