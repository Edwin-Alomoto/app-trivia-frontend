import { StyleSheet } from 'react-native';
import { colors } from '@theme/colors';

import { commonStyles } from './common';

export const forgotPasswordStyles = StyleSheet.create({
  // Container styles
  container: {
    ...commonStyles.container,
    backgroundColor: 'transparent',
  },
  keyboardAvoidingView: {
    ...commonStyles.keyboardAvoidingView,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
  },

  // Header styles
  header: {
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 10,
  },
  logoContainer: {
    alignItems: 'center',
  },
  logoImage: {
    marginTop: 30,
    width: 180,
    height: 65,
    marginBottom: 15,
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

  // Form styles
  formContainer: {
    flex: 1,
  },
  formCard: {
    paddingVertical: 20,
  },
  inputContainer: {
    marginBottom: 16,
    paddingHorizontal: 0,
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
  animatedInputWrapper: {
    borderRadius: 12,
  },
  errorText: {
    color: colors.error,
    marginTop: 6,
    marginLeft: 4,
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

  // Footer styles
  forgotPasswordContainer: {
    alignItems: 'center',
    marginBottom: 28,
  },
  forgotPasswordText: {
    color: colors.primary600,
    fontWeight: '500',
  },
  footer: {
    ...commonStyles.footer,
  },
  footerText: {
    color: '#ffffff',
  },
  linkText: {
    color: colors.gold,
    fontWeight: '600',
  },
  successContainer: {
    alignItems: 'center',
    paddingVertical: 20,
    marginBottom: 20,
  },
  successIcon: {
    marginBottom: 16,
  },
  successTitle: {
    color: colors.textPrimary,
    marginBottom: 8,
  },
  successSubtitle: {
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 4,
  },
  successEmail: {
    color: colors.primary600,
    fontWeight: '600',
    marginBottom: 16,
  },
  successInstructions: {
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  boldText: {
    fontWeight: '600',
  },
});
