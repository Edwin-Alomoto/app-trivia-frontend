import { StyleSheet, Dimensions } from 'react-native';
import { colors } from '@theme/colors';
import { commonStyles, dimensions } from './common';

const { width, height } = dimensions;

export const loginStyles = StyleSheet.create({
  // Container styles
  container: {
    ...commonStyles.container,
    backgroundColor: 'transparent',
  },
  backgroundLayer: {
    ...commonStyles.backgroundLayer,
  },
  blobTop: {
    ...commonStyles.blobTop,
  },
  blobCenter: {
    ...commonStyles.blobCenter,
  },
  blobBottom: {
    ...commonStyles.blobBottom,
  },
  keyboardAvoidingView: {
    ...commonStyles.keyboardAvoidingView,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 32,
  },

  // Header styles
  header: {
    alignItems: 'center',
    paddingTop: 80,
    paddingBottom: 40,
  },
  logoContainer: {
    alignItems: 'center',
  },
  logoWrapper: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.primary100,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 50,
  },
  logo: {
    fontSize: 36,
  },
  logoImage: {
    width: 96,
    height: 96,
    marginBottom: 16,
  },
  title: {
    color: colors.gold,
    textAlign: 'center',
  },
  subtitle: {
    color: '#ffffff',
    textAlign: 'center',
    marginTop: 8,
  },
  appName: {
    marginBottom: 6,
  },
  tagline: {
    textAlign: 'center',
  },

  // Form styles
  formContainer: {
    flex: 1,
  },
  formCard: {
    paddingVertical: 20,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    minHeight: 52,
  },
  inputFocused: {
    borderColor: colors.primary600,
    backgroundColor: colors.surface,
    shadowColor: colors.primary600,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  inputError: {
    borderColor: colors.error,
    backgroundColor: '#fef2f2',
  },
  animatedInputWrapper: {
    borderRadius: 12,
  },
  textInput: {
    flex: 1,
    fontSize: 15,
    color: colors.textPrimary,
    marginLeft: 12,
    paddingVertical: 0,
  },
  eyeButton: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  errorText: {
    color: colors.error,
    marginTop: 6,
    marginLeft: 4,
  },

  // Remember me styles
  rememberMeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 28,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#cbd5e1',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: colors.primary600,
    borderColor: colors.primary600,
  },
  rememberMeText: {
    color: colors.textSecondary,
  },

  // Button styles
  loginButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 20,
    backgroundColor: colors.primary600,
  },
  loginButtonDisabled: {
    opacity: 0.5,
    backgroundColor: colors.muted,
  },
  loginButtonContent: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  loginButtonText: {
    color: colors.onPrimary,
  },

  // Forgot password styles
  forgotPasswordContainer: {
    alignItems: 'center',
    marginBottom: 28,
  },
  forgotPasswordText: {
    color: colors.primary600,
    fontWeight: '500',
  },

  // Footer styles
  footer: {
    ...commonStyles.footer,
  },
  footerText: {
    color: colors.textSecondary,
  },
  linkText: {
    color: colors.primary600,
    fontWeight: '600',
  },

  // Input variants
  simpleInput: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    color: colors.textPrimary,
    minHeight: 56,
  },
  basicInput: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    color: colors.textPrimary,
    minHeight: 56,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    minHeight: 56,
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    color: colors.textPrimary,
  },
  boldText: {
    fontWeight: '600',
  },
});
