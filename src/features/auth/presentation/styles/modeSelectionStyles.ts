import { StyleSheet } from 'react-native';
import { colors } from '@theme/colors';
import { commonStyles } from './common';

export const modeSelectionStyles = StyleSheet.create({
  // Container styles
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  backgroundLayer: {
    ...commonStyles.backgroundLayer,
  },
  blobTop: {
    position: 'absolute',
    width: 400,
    height: 400,
    borderRadius: 200,
    top: -150,
    left: -100,
    backgroundColor: 'rgba(210, 180, 254, 0.06)',
  },
  blobCenter: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    top: 120,
    alignSelf: 'center',
    backgroundColor: 'rgba(230, 213, 255, 0.04)',
  },
  blobBottom: {
    position: 'absolute',
    width: 500,
    height: 500,
    borderRadius: 250,
    bottom: -200,
    right: -150,
    backgroundColor: 'rgba(230, 213, 255, 0.04)',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40,
  },

  // Header styles
  header: {
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 15,
  },
  logoContainer: {
    alignItems: 'center',
  },
  logoImage: {
    marginTop: 10,
    width: 180,
    height: 65,
    marginBottom: 15,
  },
  logoWrapper: {
    backgroundColor: '#e0e7ff',
    borderRadius: 20,
    padding: 12,
    marginBottom: 16,
  },
  logo: {
    fontSize: 48,
  },
  appName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  tagline: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 8,
    fontWeight: '600',
  },
  title: {
    color: colors.gold,
    textAlign: 'center',
  },

  // Cards styles
  cardsContainer: {
    paddingHorizontal: 32,
    marginBottom: 2,
  },
  cardWrapper: {
    marginBottom: 20,
  },
  modeCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  premiumCard: {
    backgroundColor: colors.primary100, // morado pálido para demo por defecto, se aplicará en el card demo
    borderColor: colors.primary200,
  },
  modeCardSelected: {
    shadowColor: '#6366f1',
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
    borderColor: '#6366f1',
    borderWidth: 2,
  },
  modeCardContent: {
    alignItems: 'center',
    position: 'relative',
  },
  modeIconContainer: {
    backgroundColor: '#ffff',
    borderRadius: 16,
    padding: 12,
    marginBottom: 16,
  },
  modeTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
    textAlign: 'center',
  },
  modeSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 20,
    textAlign: 'center',
  },

  // Features styles
  featuresContainer: {
    width: '100%',
    marginBottom: 20,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  featureText: {
    fontSize: 14,
    color: '#4b5563',
    marginLeft: 10,
    fontWeight: '500',
  },
  featureDisabled: {
    opacity: 0.6,
  },

  // Badge styles
  demoBadge: {
    backgroundColor: '#e0e7ff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    position: 'absolute',
    top: -8,
    right: -8,
  },
  demoBadgeText: {
    color: '#6366f1',
    fontSize: 10,
    fontWeight: 'bold',
  },
  priceBadge: {
    backgroundColor: '#dcfce7',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    alignItems: 'center',
  },
  priceBadgeText: {
    color: '#10b981',
    fontSize: 14,
    fontWeight: 'bold',
  },
  priceBadgeSubtext: {
    color: '#059669',
    fontSize: 10,
    fontWeight: '500',
    marginTop: 2,
  },

  // Info styles
  infoContainer: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  infoCard: {
    backgroundColor: colors.primary900,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.gold,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.gold,
    marginLeft: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#ffffff',
    lineHeight: 20,
  },

  // Button styles
  continueButton: {
    backgroundColor: colors.primary600,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 32,
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 20,
  },
  continueButtonDisabled: {
    backgroundColor: colors.muted,
    opacity: 0.6,
  },
  continueButtonText: {
    color: colors.onPrimary,
    fontSize: 16,
    fontWeight: '600',
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
  marginBottom8: {
    marginBottom: 8,
  },
  centerText4: {
    textAlign: 'center',
    marginBottom: 4,
  },
  centerText20: {
    textAlign: 'center',
    marginBottom: 20,
  },
  marginLeft10: {
    marginLeft: 10,
  },
  lineHeight20: {
    lineHeight: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  demoModal: {
    width: '85%',
    backgroundColor: colors.primary100, // mismo color base que el card demo
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.primary200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  demoModalHeader: {
    padding: 28,
    alignItems: 'center',
    backgroundColor: colors.primary200,

  },
  demoModalTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: colors.textPrimary,
    marginTop: 12,
    marginBottom: 8,
  },
  demoModalSubtitle: {
    fontSize: 14,
    color: colors.onPrimary,
    textAlign: 'center',
  },
  demoModalContent: {
    padding: 28,
  },
  demoFeatures: {
    marginBottom: 28,
  },
  demoFeaturesTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 16,
  },
  demoFeaturesList: {
    marginBottom: 20,
  },
  demoFeatureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  demoFeatureText: {
    fontSize: 14,
    color: colors.textPrimary,
    marginLeft: 12,
  },
  demoWarning: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(239, 184, 16, 0.1)',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.gold,
    marginTop: 16,
  },
  demoWarningText: {
    fontSize: 12,
    color: colors.textPrimary,
    marginLeft: 10,
    flex: 1,
    lineHeight: 18,
  },
  demoActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  demoCancelButton: {
    flex: 1,
    backgroundColor: colors.primary600,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 0,
  },
  demoCancelButtonText: {
    fontSize: 16,
    color: colors.onPrimary,
    fontWeight: '600',
  },
  demoConfirmButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary600,
    paddingVertical: 14,
    borderRadius: 10,
    borderWidth: 0,
  },
  demoConfirmButtonText: {
    fontSize: 16,
    color: colors.onPrimary,
    fontWeight: '600',
    marginLeft: 8,
  },
  subscriptionModal: {
    width: '85%',
    backgroundColor: colors.primary900,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.gold,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  subscriptionModalHeader: {
    padding: 28,
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  subscriptionModalTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: colors.gold,
    marginTop: 12,
    marginBottom: 8,
  },
  subscriptionModalSubtitle: {
    fontSize: 14,
    color: colors.onPrimary,
    textAlign: 'center',
  },
  subscriptionModalContent: {
    padding: 28,
  },
  subscriptionFeatures: {
    marginBottom: 28,
  },
  subscriptionFeaturesTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.gold,
    marginBottom: 16,
  },
  subscriptionFeaturesList: {
    marginBottom: 20,
  },
  subscriptionFeatureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  subscriptionFeatureText: {
    fontSize: 14,
    color: colors.onPrimary,
    marginLeft: 12,
  },
  subscriptionPrice: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.06)',
    paddingVertical: 16,
    borderRadius: 10,
    marginTop: 16,
    borderWidth: 1,
    borderColor: colors.gold,
  },
  subscriptionPriceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 4,
  },
  subscriptionPriceAmount: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.onPrimary,
  },
  subscriptionPricePeriod: {
    fontSize: 16,
    color: colors.onPrimary,
    marginLeft: 4,
  },
  subscriptionPriceRenewal: {
    fontSize: 12,
    color: colors.onPrimary,
  },
  subscriptionActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  subscriptionCancelButton: {
    flex: 1,
    backgroundColor: colors.primary600,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 0,
  },
  subscriptionCancelButtonText: {
    fontSize: 16,
    color: colors.onPrimary,
    fontWeight: '600',
  },
  subscriptionConfirmButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary600,
    paddingVertical: 14,
    borderRadius: 10,
    borderWidth: 0,
  },
  subscriptionConfirmButtonText: {
    fontSize: 16,
    color: colors.onPrimary,
    fontWeight: '600',
    marginLeft: 8,
  },
  // Loader styles
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  loaderContent: {
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 30,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.gold,
  },
  loaderText: {
    color: colors.gold,
    marginTop: 16,
    textAlign: 'center',
  },
  loaderSubtext: {
    color: colors.onPrimary,
    marginTop: 8,
    textAlign: 'center',
    opacity: 0.8,
  },
});
