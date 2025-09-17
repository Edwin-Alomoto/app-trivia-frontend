import { StyleSheet } from 'react-native';
import { colors } from '@theme/colors';

export const forgotPasswordScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
  },
  backgroundLayer: {
    ...StyleSheet.absoluteFillObject,
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
  forgotPasswordContainer: {
    alignItems: 'center',
    marginBottom: 28,
  },
  forgotPasswordText: {
    color: colors.primary600,
    fontWeight: '500',
  },
  successContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  successIcon: {
    marginBottom: 24,
  },
  successTitle: {
    fontWeight: 'bold',
    color: '#10B981',
    marginBottom: 16,
  },
  successSubtitle: {
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 8,
  },
  successEmail: {
    fontWeight: '600',
    color: colors.textPrimary,
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
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

