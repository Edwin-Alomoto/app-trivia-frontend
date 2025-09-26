import { StyleSheet } from 'react-native';

export const completionModalStyles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  completionModalContainer: {
    width: '92%',
    maxHeight: '85%',
    backgroundColor: '#fff',
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.5,
    shadowRadius: 30,
    elevation: 20,
  },
  incompleteModalContainer: {
    width: '85%',
    maxHeight: '62%',
    borderRadius: 20,
  },
  completeModalContainer: {
    width: '88%',
    maxHeight: '78%',
    borderRadius: 22,
  },
  completionModalHeader: {
    padding: 24,
    position: 'relative',
  },
  completionModalHeaderContent: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  completionModalTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  completionModalTitleIcon: {
    marginRight: 12,
  },
  completionModalTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  completionModalSubtitle: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
    textAlign: 'center',
    lineHeight: 22,
  },
  completionModalContent: {
    padding: 24,
  },
  completionModalScroll: {
    width: '100%',
  },
  completionPointsAnimation: {
    alignItems: 'center',
    marginBottom: 32,
  },
  completionPointsCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  completionPointsText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#F59E0B',
    marginBottom: 4,
  },
  completionPointsLabel: {
    fontSize: 16,
    color: '#6c757d',
    fontWeight: '500',
  },
  pointsBreakdown: {
    padding: 16,
    marginHorizontal: 24,
    backgroundColor: '#EEF2FF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#C7D2FE',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  pointsBreakdownTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#3730A3',
    marginBottom: 10,
    textAlign: 'left',
  },
  pointsBreakdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  pointsBreakdownText: {
    fontSize: 14,
    color: '#3730A3',
    marginLeft: 8,
    flex: 1,
  },
  pointsValue: {
    color: '#3730A3',
    fontWeight: '700',
  },
  completionModalFooter: {
    padding: 24,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    backgroundColor: '#fafafa',
  },
  completionFooterActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  completionSecondaryButton: {
    flex: 1.5,
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  completionSecondaryButtonText: {
    color: '#111827',
    fontWeight: '600',
  },
  completionPrimaryButton: {
    flex: 2,
    borderRadius: 12,
    overflow: 'hidden',
  },
  completionPrimaryButtonGradient: {
    paddingVertical: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  completionPrimaryButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  completionContinueButtonIcon: {
    marginRight: 8,
  },
  // Estilos inline para el modal
  inlinePadding: {
    padding: 12,
  },
  inlineFontSize24: {
    fontSize: 24,
  },
  inlineFontSize14: {
    fontSize: 14,
  },
  inlineMaxHeight60: {
    maxHeight: '60%',
  },
  inlineMarginBottom12: {
    marginBottom: 12,
  },
  modalImage72: {
    width: 72,
    height: 72,
    borderRadius: 36,
  },
  modalImage80: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#ef4444',
  },
  modalFontSize24: {
    fontSize: 24,
  },
  modalFontSize12: {
    fontSize: 12,
  },
  modalFontSize24Red: {
    fontSize: 24,
    color: '#ef4444',
  },
  modalFontSize12Red: {
    fontSize: 12,
    color: '#ef4444',
  },
  modalMarginBottom20: {
    marginBottom: 20,
  },
  modalPaddingYellow: {
    padding: 12,
    backgroundColor: '#FFFBEB',
    borderColor: '#FCD34D',
  },
  modalFontSize13: {
    fontSize: 13,
    color: '#1F2937',
  },
  modalMarginBottom4: {
    marginBottom: 4,
  },
  modalColorDark: {
    color: '#1F2937',
  },
  modalPaddingHorizontal24: {
    padding: 12,
    backgroundColor: '#FFFBEB',
    borderColor: '#FCD34D',
    paddingHorizontal: 24,
  },
  modalPaddingVertical10: {
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  modalPaddingVertical0: {
    paddingVertical: 0,
  },
  modalFontSize14: {
    fontSize: 14,
  },
});
