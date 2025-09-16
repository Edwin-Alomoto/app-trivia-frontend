import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
  Animated,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { getVariantStyle } from '@theme/typography';

import { Card } from '@shared/presentation/components/ui/Card';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useAppSelector } from '../../hooks/useAppSelector';
import { Survey, fetchSurveys, submitSurvey } from '../../store/slices/surveysSlice';
import { featureFlags } from '../../config/featureFlags';
import { useSurveysViewModel } from '../../viewmodels/surveys/useSurveysViewModel';

const { width } = Dimensions.get('window');

interface SurveyResponse {
  questionId: string;
  answer: string | number | string[];
}

export const SurveysScreen: React.FC = () => {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const { surveys, isLoading, error } = useAppSelector((state: any) => state.surveys);
  const vm = featureFlags.useMVVMSurveys ? useSurveysViewModel() : null;
  
  const [selectedSurvey, setSelectedSurvey] = useState<Survey | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState<SurveyResponse[]>([]);
  const [showSurveyModal, setShowSurveyModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [pointsEarned, setPointsEarned] = useState(0);
  
  // Animaciones
  const fadeAnim = useState(new Animated.Value(0))[0];
  const slideAnim = useState(new Animated.Value(30))[0];
  const scaleAnim = useState(new Animated.Value(0.9))[0];

  useEffect(() => {
    if (vm) {
      vm.refresh();
    } else {
      loadSurveys();
    }
    
    // Animaciones de entrada
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Recargar cuando cambie el estado
  useEffect(() => {
    if (!vm) {
      if (surveys.length === 0 && !isLoading) {
        loadSurveys();
      }
    }
  }, [vm, surveys.length, isLoading]);

  const loadSurveys = async () => {
    try {
      const result = await dispatch(fetchSurveys()).unwrap();
      void result;
    } catch (error) {
      console.error('Error cargando encuestas:', error);
    }
  };

  const handleStartSurvey = (survey: Survey) => {
    setSelectedSurvey(survey);
    setCurrentQuestionIndex(0);
    setResponses([]);
    setShowSurveyModal(true);
  };

  const handleAnswerQuestion = (questionId: string, answer: string | number | string[]) => {
    const existingResponseIndex = responses.findIndex(r => r.questionId === questionId);
    
    if (existingResponseIndex >= 0) {
      const updatedResponses = [...responses];
      updatedResponses[existingResponseIndex] = { questionId, answer };
      setResponses(updatedResponses);
    } else {
      setResponses([...responses, { questionId, answer }]);
    }
  };

  const handleNextQuestion = () => {
    if (!selectedSurvey) return;
    if (currentQuestionIndex < selectedSurvey.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      handleSubmitSurvey();
    }
  };

  const handleSubmitSurvey = async () => {
    if (!selectedSurvey) return;
    try {
      const result = await dispatch(submitSurvey({
        surveyId: selectedSurvey.id,
        responses,
      })).unwrap();
      
      setPointsEarned(result.pointsEarned);
      setShowSurveyModal(false);
      setShowSuccessModal(true);
      
      // Recargar encuestas
      await loadSurveys();
    } catch (error) {
      Alert.alert('Error', 'No se pudo enviar la encuesta');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const renderSurveyCard = (survey: Survey) => {
    console.log('DEBUG - Renderizando encuesta:', {
      id: survey.id,
      title: survey.title,
      description: survey.description
    });
    
    return (
      <Animated.View key={survey.id} style={styles.surveyCard}>
        <TouchableOpacity
          onPress={() => handleStartSurvey(survey)}
          activeOpacity={0.85}
          accessibilityRole="button"
          accessibilityLabel={`Abrir encuesta ${survey.title}`}
        >
          <View style={styles.card}>
            <LinearGradient
              colors={['#667eea', '#764ba2']}
              style={styles.cardGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.cardHeader}>
                <View style={styles.cardIconContainer}>
                  <Ionicons name="clipboard" size={24} color="#fff" />
                </View>
                <View style={styles.cardInfo}>
                  <Text style={[getVariantStyle('h2'), styles.cardTitle]}>{survey.title}</Text>
                  <Text style={[getVariantStyle('body'), styles.cardSubtitle]}>{survey.description}</Text>
                </View>
                <View style={styles.cardBadge}>
                  <Text style={[getVariantStyle('caption'), styles.cardBadgeText]}>+{survey.pointsReward}</Text>
                </View>
              </View>

              <View style={styles.cardFooter}>
                <View style={styles.cardMeta}>
                  <Ionicons name="calendar" size={14} color="#fff" />
                  <Text style={[getVariantStyle('caption'), styles.cardMetaText]}>{formatDate(survey.expiresAt)}</Text>
                </View>
              </View>
            </LinearGradient>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header (mismo diseño que Sorteos) */}
        <Animated.View 
          style={[
            styles.header,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <View style={styles.headerGradient}>
            <View style={styles.headerContent}>
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => navigation.goBack()}
                accessibilityRole="button"
                accessibilityLabel="Volver"
              >
                <Ionicons name="arrow-back" size={24} color="#000" />
              </TouchableOpacity>
              <View style={styles.headerInfo}>
                <Text style={[getVariantStyle('h1'), styles.title]}>Encuestas</Text>
                <Text style={[getVariantStyle('subtitle'), styles.subtitle]}>
                  {(vm ? vm.surveys : surveys).length} encuestas disponibles
                </Text>
              </View>
            </View>
          </View>
        </Animated.View>

        {/* Content */}
        <View style={styles.content}>
          {(vm ? vm.isLoading : isLoading) ? (
            <View style={styles.loadingContainer}>
              <Ionicons name="refresh" size={48} color="#9ca3af" />
              <Text style={styles.loadingText}>Cargando encuestas...</Text>
            </View>
          ) : (vm ? vm.surveys : surveys).length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="clipboard-outline" size={64} color="#9ca3af" />
              <Text style={styles.emptyTitle}>No hay encuestas disponibles</Text>
              <Text style={styles.emptySubtitle}>
                Vuelve más tarde para ver nuevas encuestas
              </Text>
              <Text style={styles.debugText}>
                Debug: {(vm ? vm.surveys : surveys).length} encuestas cargadas
              </Text>
            </View>
          ) : (
            <View style={styles.surveysContainer}>
              {(vm ? vm.surveys : surveys).slice(0, 3).map((survey: Survey) => renderSurveyCard(survey))}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Modal de Encuesta */}
      <Modal
        visible={showSurveyModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowSurveyModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.surveyModalContent}>
            {selectedSurvey && (
              <LinearGradient
                colors={['#667eea', '#764ba2', '#f093fb']}
                style={styles.surveyModalGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View style={styles.surveyModalHeader}>
                  <Text style={styles.surveyModalTitle}>
                    {selectedSurvey.title}
                  </Text>
                  <TouchableOpacity
                    onPress={() => setShowSurveyModal(false)}
                    style={styles.closeButton}
                  >
                    <Ionicons name="close" size={24} color="#fff" />
                  </TouchableOpacity>
                </View>
                
                <View style={styles.surveyModalBody}>
                  <Text style={styles.surveyModalDescription}>
                    {selectedSurvey.description}
                  </Text>
                  
                  <View style={styles.progressContainer}>
                    <View style={styles.progressBar}>
                      <View 
                        style={[
                          styles.progressFill, 
                          { width: `${((currentQuestionIndex + 1) / selectedSurvey.questions.length) * 100}%` }
                        ]} 
                      />
                    </View>
                    <Text style={styles.progressText}>
                      {currentQuestionIndex + 1} de {selectedSurvey.questions.length}
                    </Text>
                  </View>
                  
                  <Text style={styles.questionText}>
                    {selectedSurvey.questions[currentQuestionIndex]?.text}
                  </Text>
                  
                  <View style={styles.answerContainer}>
                    {selectedSurvey.questions[currentQuestionIndex]?.type === 'multiple_choice' && (
                      selectedSurvey.questions[currentQuestionIndex]?.options?.map((option: string, index: number) => (
                        <TouchableOpacity
                          key={index}
                          style={styles.optionButton}
                          onPress={() => handleAnswerQuestion(
                            selectedSurvey.questions[currentQuestionIndex].id, 
                            option
                          )}
                        >
                          <Text style={styles.optionText}>{option}</Text>
                        </TouchableOpacity>
                      ))
                    )}
                    
                    {selectedSurvey.questions[currentQuestionIndex]?.type === 'text' && (
                      <TextInput
                        style={styles.textInput}
                        placeholder="Escribe tu respuesta..."
                        placeholderTextColor="#9ca3af"
                        multiline
                        numberOfLines={4}
                        onChangeText={(text) => handleAnswerQuestion(
                          selectedSurvey.questions[currentQuestionIndex].id, 
                          text
                        )}
                      />
                    )}
                    
                    {selectedSurvey.questions[currentQuestionIndex]?.type === 'rating' && (
                      <View style={styles.ratingContainer}>
                        {[1, 2, 3, 4, 5].map((rating) => (
                          <TouchableOpacity
                            key={rating}
                            style={styles.ratingButton}
                            onPress={() => handleAnswerQuestion(
                              selectedSurvey.questions[currentQuestionIndex].id, 
                              rating
                            )}
                          >
                            <Ionicons 
                              name="star" 
                              size={24} 
                              color={rating <= 3 ? '#fbbf24' : '#9ca3af'} 
                            />
                          </TouchableOpacity>
                        ))}
                      </View>
                    )}
                  </View>
                  
                  <TouchableOpacity
                    style={styles.submitButton}
                    onPress={handleNextQuestion}
                  >
                    <Text style={styles.submitButtonText}>
                      {currentQuestionIndex < selectedSurvey.questions.length - 1 ? 'Siguiente' : 'Enviar'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </LinearGradient>
            )}
          </View>
        </View>
      </Modal>

      {/* Modal de Éxito */}
      <Modal
        visible={showSuccessModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowSuccessModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.successModalContainer}>
            <LinearGradient
              colors={['#10b981', '#34d399', '#6ee7b7']}
              style={styles.successModalGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.successModalHeader}>
                <Ionicons name="checkmark-circle" size={64} color="#fff" />
                <Text style={styles.successModalTitle}>¡Encuesta Completada!</Text>
              </View>
              
              <View style={styles.successModalBody}>
                <Text style={styles.successModalText}>
                  Gracias por tu participación
                </Text>
                
                <View style={styles.pointsEarnedContainer}>
                  <LinearGradient
                    colors={['rgba(255, 255, 255, 0.2)', 'rgba(255, 255, 255, 0.1)']}
                    style={styles.pointsEarnedGradient}
                  >
                    <Text style={styles.pointsEarnedText}>+{pointsEarned} puntos</Text>
                  </LinearGradient>
                </View>
                
                <View style={styles.successInfoContainer}>
                  <View style={styles.successInfoItem}>
                    <Ionicons name="checkmark" size={16} color="#fff" />
                    <Text style={styles.successInfoText}>Respuestas guardadas</Text>
                  </View>
                </View>
              </View>
              
              <TouchableOpacity
                style={styles.closeSuccessButton}
                onPress={() => setShowSuccessModal(false)}
              >
                <Text style={styles.closeSuccessButtonText}>Cerrar</Text>
              </TouchableOpacity>
            </LinearGradient>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    marginBottom: 0,
  },
  headerGradient: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    alignItems: 'center',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    padding: 8,
    marginRight: 12,
  },
  headerInfo: {
    flex: 1,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    fontFamily: 'Inter_700Bold',
    color: '#000',
    marginBottom: 3,
    textShadowColor: 'transparent',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 0,
    textAlign: 'left',
    marginRight:10,
  },
  subtitle: {
    fontSize: 16,
    color: '#000',
    opacity: 1,
    textAlign: 'left',
    textShadowColor: 'transparent',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 0,
    fontFamily: 'Inter_500Medium',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  loadingText: {
    fontSize: 16,
    color: '#9ca3af',
    marginTop: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#374151',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    paddingHorizontal: 40,
    marginBottom: 16,
  },
  debugText: {
    fontSize: 12,
    color: '#9ca3af',
    textAlign: 'center',
  },
  surveysContainer: {
    gap: 10,
  },
  surveyCard: {
    marginBottom: 10,
  },
  card: {
    padding: 0,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  cardGradient: {
    padding: 20,
    borderRadius: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  cardInfo: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.92,
    lineHeight: 20,
  },
  cardBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
  },
  cardBadgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#fff',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  cardMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardMetaText: {
    fontSize: 12,
    color: '#fff',
    marginLeft: 6,
    opacity: 0.9,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  surveyModalContent: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.3,
    shadowRadius: 30,
    elevation: 20,
  },
  surveyModalGradient: {
    padding: 24,
    position: 'relative',
    overflow: 'hidden',
  },
  surveyModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  surveyModalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    flex: 1,
    textAlign: 'center',
  },
  closeButton: {
    padding: 12,
    borderRadius: 20,
  },
  surveyModalBody: {
    marginBottom: 24,
  },
  surveyModalDescription: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
    lineHeight: 22,
    marginBottom: 16,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#fff',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '600',
  },
  questionText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  answerContainer: {
    marginBottom: 20,
  },
  textInput: {
    borderWidth: 2,
    borderColor: '#e5e7eb',
    borderRadius: 16,
    padding: 16,
    fontSize: 16,
    color: '#1f2937',
    backgroundColor: '#fff',
    minHeight: 120,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    borderRadius: 16,
    backgroundColor: '#fff',
    marginBottom: 12,
  },
  optionText: {
    fontSize: 16,
    color: '#374151',
    marginLeft: 12,
    flex: 1,
  },
  ratingContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 16,
  },
  ratingButton: {
    padding: 8,
    marginHorizontal: 4,
  },
  submitButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  successModalContainer: {
    width: width * 0.9,
    maxWidth: 400,
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.3,
    shadowRadius: 30,
    elevation: 20,
  },
  successModalGradient: {
    padding: 32,
    alignItems: 'center',
  },
  successModalHeader: {
    alignItems: 'center',
    marginBottom: 16,
  },
  successModalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 16,
  },
  successModalBody: {
    alignItems: 'center',
    marginBottom: 24,
  },
  successModalText: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 24,
    textAlign: 'center',
  },
  pointsEarnedContainer: {
    marginBottom: 24,
  },
  pointsEarnedGradient: {
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  pointsEarnedText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  successInfoContainer: {
    marginTop: 16,
  },
  successInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  successInfoText: {
    fontSize: 14,
    color: '#fff',
    marginLeft: 8,
    opacity: 0.9,
  },
  closeSuccessButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  closeSuccessButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
});
