import { StyleSheet, ImageStyle } from 'react-native';

export const triviaGameScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f5f9',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: '#6c757d',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: '#dc3545',
    marginBottom: 20,
    textAlign: 'center',
  },
  errorButton: {
    marginTop: 20,
    backgroundColor: '#667eea',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  errorButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
    borderRadius: 16,
    marginHorizontal: 12,
    marginTop: 8,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 6,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backButton: {
    padding: 8,
  },
  progressContainer: {
    flex: 1,
    marginHorizontal: 20,
  },
  progressText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  progressBar: {
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 2,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#fff',
    borderRadius: 2,
  },
  completionText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2,
    textAlign: 'center',
  },
  timerContainer: {
    position: 'relative',
  },
  timerGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  timerText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  timerRing: {
    position: 'absolute',
    top: -2,
    left: -2,
    right: -2,
    bottom: -2,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  timerRingFill: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#fff',
    borderTopColor: 'transparent',
    borderRightColor: 'transparent',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  contentContainer: {
    paddingBottom: 24,
  },
  questionCard: {
    marginBottom: 24,
  },
  questionGradient: {
    padding: 20,
    borderRadius: 16,
  },
  categoryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  categoryIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#667eea',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  categoryIcon: {
    fontSize: 20,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2d3748',
  },
  difficultyChip: {
    marginLeft: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
  },
  difficultyChipText: {
    fontSize: 12,
    fontWeight: '600',
  },
  difficultyEasy: {
    backgroundColor: '#ecfdf5',
    borderColor: '#a7f3d0',
  },
  difficultyEasyText: {
    color: '#065f46',
  },
  difficultyMedium: {
    backgroundColor: '#fffbeb',
    borderColor: '#fde68a',
  },
  difficultyMediumText: {
    color: '#92400e',
  },
  difficultyHard: {
    backgroundColor: '#fef2f2',
    borderColor: '#fecaca',
  },
  difficultyHardText: {
    color: '#7f1d1d',
  },
  questionText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#2d3748',
    lineHeight: 32,
    marginBottom: 16,
  },
  imageContainer: {
    marginVertical: 16,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#f8f9fa',
  },
  questionImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
  } as ImageStyle,
  answersContainer: {
    marginBottom: 24,
  },
  answerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    borderWidth: 2,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  answerContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  answerLetter: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  answerLetterText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2d3748',
  },
  answerText: {
    flex: 1,
    fontSize: 16,
    color: '#2d3748',
    lineHeight: 24,
  },
  answerIcon: {
    marginLeft: 8,
  },
  noOptionsContainer: {
    padding: 20,
    alignItems: 'center',
  },
  noOptionsText: {
    fontSize: 16,
    color: '#6c757d',
  },
  actionsContainer: {
    marginTop: 'auto',
  },
  actionButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  hintButton: {
    flex: 1,
    marginRight: 12,
  },
  hintButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  hintButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  hintInfo: {
    marginTop: 8,
    alignItems: 'center',
  },
  hintInfoChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fffbeb',
    borderWidth: 1,
    borderColor: '#f59e0b',
    borderRadius: 999,
    paddingVertical: 6,
    paddingHorizontal: 10,
    gap: 6,
  },
  hintInfoText: {
    color: '#92400e',
    fontSize: 12,
    fontWeight: '600',
  },
  skipButton: {
    flex: 1,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#667eea',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  skipButtonText: {
    color: '#667eea',
    fontSize: 14,
    fontWeight: '600',
  },
  scoreAnimation: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -50 }, { translateY: -50 }],
    zIndex: 1000,
  },
  scoreAnimationGradient: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  scoreAnimationText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  // Estilos del Modal de Trivia Completada
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
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
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
  completionStatsSection: {
    marginBottom: 32,
  },
  completionStatsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  completionStatsIcon: {
    marginRight: 12,
  },
  completionStatsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2d3748',
  },
  completionStatsGrid: {
    flexDirection: 'row',
    gap: 16,
  },
  completionStatCard: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  completionStatGradient: {
    padding: 20,
    alignItems: 'center',
    borderRadius: 16,
  },
  completionStatValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 8,
    marginBottom: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  completionStatLabel: {
    fontSize: 12,
    color: '#fff',
    textAlign: 'center',
    opacity: 0.9,
  },
  completionMotivationSection: {
    marginBottom: 32,
  },
  completionMotivationGradient: {
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
  },
  completionMotivationIcon: {
    marginBottom: 12,
  },
  completionMotivationTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2d3748',
    marginBottom: 8,
  },
  completionMotivationText: {
    fontSize: 16,
    color: '#4a5568',
    textAlign: 'center',
    lineHeight: 24,
  },
  completionNextSteps: {
    marginBottom: 24,
  },
  completionNextStepsGradient: {
    padding: 24,
    borderRadius: 16,
  },
  completionNextStepsIcon: {
    marginBottom: 12,
  },
  completionNextStepsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2d3748',
    marginBottom: 16,
  },
  completionNextStepsList: {
    gap: 12,
  },
  completionNextStepItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  completionNextStepText: {
    fontSize: 16,
    color: '#4a5568',
    marginLeft: 12,
    flex: 1,
    lineHeight: 22,
  },
  completionModalFooter: {
    padding: 24,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    backgroundColor: '#fafafa',
  },
  completionContinueButton: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  completionContinueButtonGradient: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: 'center',
    flexDirection: 'row',
  },
  completionContinueButtonIcon: {
    marginRight: 8,
  },
  completionContinueButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
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
  },
  // Estilos para el desglose de puntos
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
  pointsBreakdownDivider: {
    height: 1,
    backgroundColor: '#C7D2FE',
    marginVertical: 8,
    opacity: 0.8,
  },
  // Minimal modal styles
  simpleModalContent: {
    padding: 20,
    alignItems: 'center',
    gap: 12,
  },
  simpleModalTitle: {
    color: '#111827',
  },
  simpleModalText: {
    color: '#374151',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  simplePrimaryButton: {
    backgroundColor: '#10B981',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  simplePrimaryButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  simpleSecondaryButton: {
    backgroundColor: '#f3f4f6',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  simpleSecondaryButtonText: {
    color: '#111827',
    fontWeight: '600',
  },
  // Estilos inline que se movieron del componente
  inlineText: {
    color: '#64748b',
    textAlign: 'center',
  },
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
  inlineImage72: {
    width: 72,
    height: 72,
    borderRadius: 36,
  },
  inlineMarginBottom20: {
    marginBottom: 20,
  },
  inlineImage80: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#ef4444',
  },
  inlineFontSize24Red: {
    fontSize: 24,
    color: '#ef4444',
  },
  inlineFontSize12Red: {
    fontSize: 12,
    color: '#ef4444',
  },
  inlinePaddingYellow: {
    padding: 12,
    backgroundColor: '#FFFBEB',
    borderColor: '#FCD34D',
  },
  inlineFontSize13: {
    fontSize: 13,
    color: '#1F2937',
  },
  inlineMarginBottom4: {
    marginBottom: 4,
  },
  inlineColorDark: {
    color: '#1F2937',
  },
  inlinePaddingHorizontal24: {
    padding: 12,
    backgroundColor: '#FFFBEB',
    borderColor: '#FCD34D',
    paddingHorizontal: 24,
  },
  inlinePaddingConditional: {
    padding: 12,
  },
  inlinePaddingVertical10: {
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  inlinePaddingVertical0: {
    paddingVertical: 0,
  },
  // Estilos para el modal de completado
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
