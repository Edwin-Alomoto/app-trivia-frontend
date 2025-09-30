import { StyleSheet } from 'react-native';
import { colors } from '@theme/colors';

import { commonStyles } from './common';

export const registerStyles = StyleSheet.create({
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
    paddingHorizontal: 24,
  },

  // Header styles
  header: {
    alignItems: 'center',
    paddingBottom: 5,
  },
  logoContainer: {
    alignItems: 'center',
  },
  logoWrapper: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    fontSize: 40,
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
  appName: {
    marginBottom: 8,
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
  animatedInputWrapper: {
    borderRadius: 12,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    minHeight: 56,
  },
  inputFocused: {
    borderColor: colors.primary600,
    backgroundColor: '#ffffff',
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
  textInput: {
    flex: 1,
    color: colors.textPrimary,
    marginLeft: 12,
    paddingVertical: 0,
  },
  eyeButton: {
    padding: 6,
  },
  errorText: {
    color: colors.error,
    marginTop: 8,
    marginLeft: 4,
  },

  // Password strength styles
  strengthContainer: {
    marginTop: 16,
    marginBottom: 20,
  },
  strengthBar: {
    height: 6,
    backgroundColor: colors.border,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 10,
  },
  strengthFill: {
    height: '100%',
    borderRadius: 3,
  },
  strengthText: {
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },
  requirementsContainer: {
    marginTop: 16,
  },
  requirementsTitle: {
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 12,
  },
  requirementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  requirementText: {
    color: colors.textSecondary,
    marginLeft: 10,
  },

  // Terms and conditions styles
  termsContainer: {
    marginTop: 8,
    marginBottom: 32,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#cbd5e1',
    marginRight: 12,
    marginTop: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#6366f1',
    borderColor: '#6366f1',
  },
  termsText: {
    flex: 1,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  termsLink: {
    color: colors.primary600,
    fontWeight: '500',
  },

  // Button styles
  registerButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 24,
    backgroundColor: colors.primary600,
  },
  registerButtonDisabled: {
    opacity: 0.5,
    backgroundColor: colors.muted,
  },
  registerButtonContent: {
    paddingVertical: 18,
    alignItems: 'center',
  },
  registerButtonText: {
    color: colors.onPrimary,
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

  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  verificationModal: {
    width: '85%',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  genderModal: {
    width: '85%',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  genderOption: {
    paddingVertical: 12,
  },

  // Verification modal styles
  verificationHeader: {
    padding: 28,
    alignItems: 'center',
    backgroundColor: '#f0fdf4',
  },
  verificationTitle: {
    fontWeight: '600',
    color: colors.textPrimary,
    marginTop: 12,
    marginBottom: 8,
  },
  verificationSubtitle: {
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 12,
  },
  verificationEmail: {
    fontWeight: '600',
    color: colors.primary600,
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
  },
  verificationContent: {
    padding: 28,
  },
  verificationSteps: {
    marginBottom: 28,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primary600,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  stepText: {
    color: colors.textPrimary,
    flex: 1,
  },
  simpleInput: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    color: colors.textPrimary,
    minHeight: 56,
  },
  pickerContainer: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    minHeight: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pickerText: {
    color: colors.textPrimary,
  },
  pickerPlaceholder: {
    color: colors.muted,
  },
  dropdownPanel: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    marginTop: 8,
    overflow: 'hidden',
  },
  dropdownOption: {
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  boldText: {
    fontWeight: '600',
  },
  verificationActions: {
    gap: 16,
  },
  verificationButton: {
    backgroundColor: colors.primary600,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 10,
    alignItems: 'center',
  },
  verificationButtonText: {
    color: colors.onPrimary,
    fontWeight: '600',
  },
  resendButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.primary600,
    backgroundColor: '#ffffff',
  },
  resendButtonDisabled: {
    opacity: 0.6,
    borderColor: '#cbd5e1',
  },
  resendButtonText: {
    color: colors.primary600,
    marginLeft: 8,
  },
});
