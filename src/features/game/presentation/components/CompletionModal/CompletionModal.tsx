import React from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { getVariantStyle } from '@theme/typography';
import { gradients } from '@theme/gradients';
import { colors } from '@theme/colors';
import { completionModalStyles } from './CompletionModal.styles';

interface CompletionModalProps {
  showCompletionModal: boolean;
  isTriviaComplete: boolean;
  finalScore: number;
  correctAnswersCount: number;
  currentSession?: {
    questions?: any[];
  };
  answeredQuestions: Set<number>;
  setShowCompletionModal: (show: boolean) => void;
  handleReplay: () => void;
  dispatch: any;
  navigation: any;
}

export const CompletionModal: React.FC<CompletionModalProps> = ({
  showCompletionModal,
  isTriviaComplete,
  finalScore,
  correctAnswersCount,
  currentSession,
  answeredQuestions,
  setShowCompletionModal,
  handleReplay,
  dispatch,
  navigation,
}) => {
  const handleExit = () => {
    setShowCompletionModal(false);
    dispatch.resetSession();
    navigation.goBack();
  };

  return (
    <Modal
      visible={showCompletionModal}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setShowCompletionModal(false)}
    >
      <View style={completionModalStyles.modalOverlay}>
        <View style={[
          completionModalStyles.completionModalContainer,
          isTriviaComplete ? completionModalStyles.completeModalContainer : completionModalStyles.incompleteModalContainer
        ]}>
          <LinearGradient
            colors={gradients.brand as [string, string]}
            style={[completionModalStyles.completionModalHeader, completionModalStyles.inlinePadding]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={completionModalStyles.completionModalHeaderContent}>
              <View style={completionModalStyles.completionModalTitleContainer}>
                <Ionicons 
                  name={isTriviaComplete ? "trophy" : "warning"} 
                  size={isTriviaComplete ? 32 : 28} 
                  color={colors.onPrimary} 
                  style={completionModalStyles.completionModalTitleIcon} 
                />
                <Text style={[getVariantStyle('subtitle'), completionModalStyles.completionModalTitle, completionModalStyles.inlineFontSize24, { color: colors.onPrimary }]}>
                  {isTriviaComplete ? "¡Trivia Completada!" : "Trivia Incompleta"}
                </Text>
              </View>
            </View>
            <Text style={[getVariantStyle('body'), completionModalStyles.completionModalSubtitle, completionModalStyles.inlineFontSize14, { color: colors.onPrimary }]}>
              {isTriviaComplete 
                ? "¡Felicitaciones! Has contestado todas las preguntas y obtenido los puntos completos" 
                : "Debes contestar todas las preguntas para obtener los puntos. Inténtalo de nuevo."
              }
            </Text>
          </LinearGradient>

          <ScrollView 
            style={[completionModalStyles.completionModalScroll, !isTriviaComplete && completionModalStyles.inlineMaxHeight60]}
            contentContainerStyle={[completionModalStyles.completionModalContent, completionModalStyles.inlinePadding]}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Animación de puntos ganados - solo si la trivia fue completada */}
            {isTriviaComplete && (
              <View style={[completionModalStyles.completionPointsAnimation, completionModalStyles.inlineMarginBottom12]}>
                <LinearGradient
                  colors={['#F59E0B', '#FBBF24', '#FCD34D']}
                  style={[completionModalStyles.completionPointsCircle, completionModalStyles.modalImage72]}
                >
                  <Ionicons name="star" size={36} color="#fff" />
                </LinearGradient>
                <Text style={[getVariantStyle('subtitle'), completionModalStyles.completionPointsText, completionModalStyles.modalFontSize24]}>
                  +{finalScore}
                </Text>
                <Text style={[getVariantStyle('caption'), completionModalStyles.completionPointsLabel, completionModalStyles.modalFontSize12]}>
                  puntos acumulados
                </Text>
              </View>
            )}
            
            {/* Mensaje para trivia incompleta */}
            {!isTriviaComplete && (
              <View style={[completionModalStyles.completionPointsAnimation, completionModalStyles.modalMarginBottom20]}>
                <View style={[completionModalStyles.completionPointsCircle, completionModalStyles.modalImage80]}>
                  <Ionicons name="close" size={30} color="#fff" />
                </View>
                <Text style={[getVariantStyle('subtitle'), completionModalStyles.completionPointsText, completionModalStyles.modalFontSize24Red]}>
                  0
                </Text>
                <Text style={[getVariantStyle('caption'), completionModalStyles.completionPointsLabel, completionModalStyles.modalFontSize12Red]}>
                  puntos otorgados
                </Text>
              </View>
            )}
          </ScrollView>

          {/* Detalle de puntos por pregunta - solo si la trivia fue completada */}
          {isTriviaComplete && (
            <View style={[completionModalStyles.pointsBreakdown, completionModalStyles.modalPaddingYellow]}>
              <Text style={[getVariantStyle('subtitle'), completionModalStyles.pointsBreakdownTitle, completionModalStyles.modalFontSize13]}>
                Desglose de puntos:
              </Text>
              <View style={[completionModalStyles.pointsBreakdownItem, completionModalStyles.modalMarginBottom4]}>
                <Ionicons name="trophy" size={18} color="#F59E0B" />
                <Text style={[getVariantStyle('body'), completionModalStyles.pointsBreakdownText, completionModalStyles.modalColorDark]}>
                  Aciertos: <Text style={[completionModalStyles.pointsValue, completionModalStyles.modalColorDark]}>{correctAnswersCount}</Text>
                </Text>
              </View>
              <View style={[completionModalStyles.pointsBreakdownItem, completionModalStyles.modalMarginBottom4]}>
                <Ionicons name="clipboard" size={18} color="#3B82F6" />
                <Text style={[getVariantStyle('body'), completionModalStyles.pointsBreakdownText, completionModalStyles.modalColorDark]}>
                  Correctas: <Text style={[completionModalStyles.pointsValue, completionModalStyles.modalColorDark]}>{correctAnswersCount}</Text>/{currentSession?.questions?.length || 0}
                </Text>
              </View>
              <View style={[completionModalStyles.pointsBreakdownItem, completionModalStyles.modalMarginBottom4]}>
                <Ionicons name="hourglass" size={18} color="#F59E0B" />
                <Text style={[getVariantStyle('body'), completionModalStyles.pointsBreakdownText, completionModalStyles.modalColorDark]}>
                  Pendientes: <Text style={[completionModalStyles.pointsValue, completionModalStyles.modalColorDark]}>{(currentSession?.questions?.length || 0) - answeredQuestions.size}</Text>
                </Text>
              </View>
            </View>
          )}
          
          {/* Información de completitud */}
          {!isTriviaComplete && (
            <View style={[completionModalStyles.pointsBreakdown, completionModalStyles.modalPaddingHorizontal24]}>
              <Text style={[getVariantStyle('subtitle'), completionModalStyles.pointsBreakdownTitle, completionModalStyles.modalFontSize13]}>
                Información:
              </Text>
              <View style={[completionModalStyles.pointsBreakdownItem, completionModalStyles.modalMarginBottom4]}> 
                <Ionicons name="trophy" size={18} color="#F59E0B" />
                <Text style={[getVariantStyle('body'), completionModalStyles.pointsBreakdownText, completionModalStyles.modalColorDark]}> 
                  Aciertos: {correctAnswersCount}
                </Text>
              </View>
              <View style={[completionModalStyles.pointsBreakdownItem, completionModalStyles.modalMarginBottom4]}>
                <Ionicons name="clipboard" size={18} color="#3B82F6" />
                <Text style={[getVariantStyle('body'), completionModalStyles.pointsBreakdownText, completionModalStyles.modalColorDark]}> 
                  Correctas: {correctAnswersCount}/{currentSession?.questions?.length || 0}
                </Text>
              </View>
              <View style={[completionModalStyles.pointsBreakdownItem, completionModalStyles.modalMarginBottom4]}>
                <Ionicons name="hourglass" size={18} color="#F59E0B" />
                <Text style={[getVariantStyle('body'), completionModalStyles.pointsBreakdownText, completionModalStyles.modalColorDark]}> 
                  Pendientes: {(currentSession?.questions?.length || 0) - answeredQuestions.size}
                </Text>
              </View>
            </View>
          )}

          {/* Footer compacto con acciones */}
          <View style={[completionModalStyles.completionModalFooter, completionModalStyles.inlinePadding]}>
            <View style={completionModalStyles.completionFooterActions}>
              <TouchableOpacity 
                style={[completionModalStyles.completionSecondaryButton, !isTriviaComplete && completionModalStyles.modalPaddingVertical10]} 
                onPress={handleExit}
              >
                <Text style={completionModalStyles.completionSecondaryButtonText}>Salir</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[completionModalStyles.completionPrimaryButton, !isTriviaComplete && completionModalStyles.modalPaddingVertical0]} 
                onPress={handleReplay}
              >
                <LinearGradient 
                  colors={['#10B981', '#34D399']} 
                  style={[completionModalStyles.completionPrimaryButtonGradient, !isTriviaComplete && completionModalStyles.modalPaddingVertical10]}
                >
                  <Ionicons name="refresh" size={16} color="#fff" style={completionModalStyles.completionContinueButtonIcon} />
                  <Text style={[completionModalStyles.completionPrimaryButtonText, !isTriviaComplete && completionModalStyles.modalFontSize14]}>
                    Jugar de nuevo
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};
