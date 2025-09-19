import { StyleSheet } from 'react-native';
import { colors } from '@theme/colors';
import { commonStyles } from './common';

export const forgotPasswordStyles = StyleSheet.create({
  // Container styles
  container: {
    ...commonStyles.container,
  },
  keyboardAvoidingView: {
    ...commonStyles.keyboardAvoidingView,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
  },
  backgroundLayer: {
    ...commonStyles.backgroundLayer,
  },
  blobTop: {
    position: 'absolute',
    width: 600,
    height: 600,
    borderRadius: 300,
    top: -200,
    left: -150,
    backgroundColor: 'rgba(210, 180, 254, 0.08)',
  },
  blobCenter: {
    position: 'absolute',
    width: 450,
    height: 450,
    borderRadius: 225,
    top: 180,
    alignSelf: 'center',
    backgroundColor: 'rgba(230, 213, 255, 0.06)',
  },
  blobBottom: {
    position: 'absolute',
    width: 700,
    height: 700,
    borderRadius: 350,
    bottom: -300,
    right: -200,
    backgroundColor: 'rgba(230, 213, 255, 0.06)',
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
  logoImage: {
    width: 72,
    height: 72,
    marginBottom: 28,
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
    color: colors.textSecondary,
  },
  linkText: {
    color: colors.primary600,
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
