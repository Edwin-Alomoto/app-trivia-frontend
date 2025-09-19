import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Dimensions,
  Modal,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import { Card } from '@shared/presentation/components/ui/Card';
import { useAppDispatch } from '@shared/domain/hooks/useAppDispatch';
import { useAppSelector } from '@shared/domain/hooks/useAppSelector';
import { CredibilityContent, Testimonial, Winner, fetchTestimonials, markAsViewed } from '@store/slices/testimonialsSlice';
import { featureFlags } from '@config/featureFlags';
import { useTestimonialsViewModel } from '../../domain/hooks/useTestimonialsViewModel';

const { width } = Dimensions.get('window');

export const TestimonialsScreen: React.FC = () => {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const { testimonials, winners, credibilityContent, isLoading, error } = useAppSelector((state: any) => state.testimonials);
  const vm = featureFlags.useMVVMTestimonials ? useTestimonialsViewModel() : null;
  
  const [selectedContent, setSelectedContent] = useState<CredibilityContent | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [imageLoading, setImageLoading] = useState<{[key: string]: boolean}>({});
  const [imageError, setImageError] = useState<{[key: string]: boolean}>({});
  
  // Animaciones
  const fadeAnim = useState(new Animated.Value(0))[0];
  const slideAnim = useState(new Animated.Value(30))[0];
  const scaleAnim = useState(new Animated.Value(0.9))[0];

  useEffect(() => {
    if (vm) {
      vm.refresh();
    } else {
      loadTestimonials();
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
      if (credibilityContent.length === 0 && !isLoading) {
        loadTestimonials();
      }
    }
  }, [vm, credibilityContent.length, isLoading]);

  const loadTestimonials = async () => {
    try {
      const result = await dispatch(fetchTestimonials()).unwrap();
      void result;
    } catch (error) {
      console.error('Error cargando testimonios:', error);
    }
  };

  const handleImageLoadStart = (imageId: string) => {
    setImageLoading(prev => ({ ...prev, [imageId]: true }));
    setImageError(prev => ({ ...prev, [imageId]: false }));
  };

  const handleImageLoadEnd = (imageId: string) => {
    setImageLoading(prev => ({ ...prev, [imageId]: false }));
  };

  const handleImageError = (imageId: string) => {
    setImageLoading(prev => ({ ...prev, [imageId]: false }));
    setImageError(prev => ({ ...prev, [imageId]: true }));
  };

  const getFallbackImage = (type: string) => {
    const fallbackImages = {
      winner: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&auto=format',
      delivery: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&auto=format',
      milestone: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&h=400&fit=crop&auto=format',
      brand: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop&auto=format',
      other: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&auto=format',
    };
    return fallbackImages[type as keyof typeof fallbackImages] || fallbackImages.other;
  };

  const handleContentPress = async (content: CredibilityContent) => {
    setSelectedContent(content);
    setShowDetailModal(true);
    
    // Marcar como visto
    if (content.type === 'testimonial') {
      await dispatch(markAsViewed(content.data.id));
    }
  };

  const getContentIcon = (type: string) => {
    switch (type) {
      case 'winner':
        return 'trophy';
      case 'delivery':
        return 'checkmark-circle';
      case 'milestone':
        return 'star';
      case 'brand':
        return 'shield-checkmark';
      default:
        return 'chatbubbles';
    }
  };

  const getContentColor = (type: string) => {
    switch (type) {
      case 'winner':
        return ['#fbbf24', '#f59e0b', '#d97706'];
      case 'delivery':
        return ['#10b981', '#34d399', '#6ee7b7'];
      case 'milestone':
        return ['#8b5cf6', '#a855f7', '#c084fc'];
      case 'brand':
        return ['#3b82f6', '#1d4ed8', '#60a5fa'];
      default:
        return ['#667eea', '#764ba2', '#f093fb'];
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

  const filters = [
    { key: 'all', label: 'Todo', icon: 'grid-outline' },
    { key: 'winners', label: 'Ganadores', icon: 'trophy' },
    { key: 'testimonials', label: 'Testimonios', icon: 'chatbubbles' },
  ];

  // Simplificar la lógica de filtrado
  const getFilteredContent = (): CredibilityContent[] => {
    if (selectedFilter === 'winners') {
      return (vm ? vm.credibilityContent : credibilityContent).filter((content: any) => content.type === 'winner');
    } else if (selectedFilter === 'testimonials') {
      return (vm ? vm.credibilityContent : credibilityContent).filter((content: any) => content.type === 'testimonial');
    }
    return vm ? vm.credibilityContent : credibilityContent;
  };

  const filteredContent = getFilteredContent();

  const isTestimonialContent = (c: CredibilityContent): c is CredibilityContent & { data: Testimonial } => c.type === 'testimonial';
  const isWinnerContent = (c: CredibilityContent): c is CredibilityContent & { data: Winner } => c.type === 'winner';

  const renderContentCard = (content: CredibilityContent) => {
    const isTestimonial = content.type === 'testimonial';
    const t = isTestimonial ? (content.data as Testimonial) : undefined;
    const w = !isTestimonial ? (content.data as Winner) : undefined;
    const imageId = `${content.id}-${isTestimonial ? 'testimonial' : 'winner'}`;
    const imageUrl = isTestimonial ? t?.authorImage : w?.image;
    
    
    
    return (
      <View key={content.id} style={styles.contentCard}>
        <TouchableOpacity onPress={() => handleContentPress(content)}>
          <View style={styles.card}>
            {/* Imagen prominente en la parte superior */}
            <View style={styles.cardImageContainer}>
              <Image
                source={{ 
                  uri: imageError[imageId]
                    ? getFallbackImage(isTestimonial ? (t?.type || 'brand') : 'winner')
                    : (imageUrl || getFallbackImage(isTestimonial ? (t?.type || 'brand') : 'winner'))
                }}
                style={styles.cardImage}
                resizeMode="cover"
                onLoadStart={() => handleImageLoadStart(imageId)}
                onLoadEnd={() => handleImageLoadEnd(imageId)}
                onError={() => handleImageError(imageId)}
              />
              {imageLoading[imageId] && (
                <View style={styles.imageLoadingContainer}>
                  <Ionicons name="sync" size={24} color="#fff" />
                </View>
              )}
              <View style={styles.cardImageOverlay}>
                <View style={styles.cardHeader}>
                  <View style={styles.cardIconContainer}>
                    <Ionicons 
                      name={getContentIcon(isTestimonial ? (t?.type || 'brand') : 'winner') as any} 
                      size={24} 
                      color="#fff" 
                    />
                  </View>
                  <View style={styles.cardPoints}>
                    <Text style={styles.cardPointsText}>
                      {isTestimonial ? (t?.viewCount ?? 0) : 'Ganador'}
                    </Text>
                    <Text style={styles.cardPointsLabel}>
                      {isTestimonial ? 'vistas' : 'Verificado'}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
            
            {/* Contenido en la parte inferior */}
            <LinearGradient
              colors={getContentColor(isTestimonial ? (t?.type || 'brand') : 'winner') as [string, string, string]}
              style={styles.cardContentSection}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.cardContentHeader}>
                <Text style={styles.cardTitle}>
                  {isTestimonial ? (t?.title || '') : `${w?.name ?? 'Usuario'} ganó ${w?.prize ?? ''}`}
                </Text>
                <Text style={styles.cardDescription}>
                  {isTestimonial
                    ? (t?.content || '')
                    : (w?.testimonial || `Ganó ${w?.prize ?? ''} en el sorteo ${w?.raffleName ?? ''}`)}
                </Text>
              </View>
              
              <View style={styles.cardFooter}>
                <View style={styles.cardCategory}>
                  <Text style={styles.cardCategoryText}>
                    {isTestimonial ? 'Testimonio' : 'Ganador'}
                  </Text>
                </View>
                
                <View style={styles.cardMeta}>
                  <Ionicons name="calendar" size={14} color="#fff" />
                  <Text style={styles.cardDate}>
                    {formatDate(isTestimonial ? (t?.date || new Date().toISOString()) : (w?.drawDate || new Date().toISOString()))}
                  </Text>
                </View>
              </View>
            </LinearGradient>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <LinearGradient
          colors={['#667eea', '#764ba2', '#f093fb']}
          style={styles.header}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.headerContent}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
            <View style={styles.headerInfo}>
              <Text style={styles.headerTitle}>Testimonios & Ganadores</Text>
              <Text style={styles.headerSubtitle}>
                Historias reales de nuestros usuarios
              </Text>
            </View>
            <View style={styles.headerIcon}>
              <Ionicons name="trophy" size={32} color="#fff" />
            </View>
          </View>
        </LinearGradient>

        {/* Filters */}
        <View style={styles.filterContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterScroll}
          >
            {filters.map((filter) => (
              <TouchableOpacity
                key={filter.key}
                style={[
                  styles.filterButton,
                  selectedFilter === filter.key && styles.filterButtonActive
                ]}
                onPress={() => setSelectedFilter(filter.key)}
              >
                <LinearGradient
                  colors={
                    selectedFilter === filter.key 
                      ? ['#667eea', '#764ba2', '#f093fb'] 
                      : ['#f8f9fa', '#e9ecef']
                  }
                  style={styles.filterButtonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Ionicons
                    name={filter.icon as any}
                    size={16}
                    color={selectedFilter === filter.key ? '#fff' : '#6c757d'}
                  />
                  <Text style={[
                    styles.filterButtonText,
                    selectedFilter === filter.key && styles.filterButtonTextActive
                  ]}>
                    {filter.label}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Content */}
        <View style={styles.content}>
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <Ionicons name="refresh" size={48} color="#9ca3af" />
              <Text style={styles.loadingText}>Cargando testimonios...</Text>
            </View>
          ) : filteredContent.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="chatbubbles-outline" size={64} color="#9ca3af" />
              <Text style={styles.emptyTitle}>No hay contenido disponible</Text>
              <Text style={styles.emptySubtitle}>
                Vuelve más tarde para ver nuevos testimonios
              </Text>
              <Text style={styles.debugText}>
                Debug: {credibilityContent.length} credibilityContent, {testimonials.length} testimonials, {winners.length} winners
              </Text>
            </View>
          ) : (
            <View style={styles.contentContainer}>
              {filteredContent.slice(0, 3).map((content: CredibilityContent) => renderContentCard(content))}
            </View>
          )}
        </View>
      </ScrollView>

             {/* Modal de Detalle */}
       <Modal
         visible={showDetailModal}
         transparent
         animationType="slide"
         onRequestClose={() => setShowDetailModal(false)}
       >
         <View style={styles.modalOverlay}>
           <View style={styles.detailModalContent}>
             {selectedContent && (
               <>
                 {/* Imagen prominente en el modal */}
                 <View style={styles.detailModalImageContainer}>
                   <Image
                     source={{ 
                       uri: imageError[`modal-${selectedContent.id}`] 
                         ? getFallbackImage(selectedContent.type === 'testimonial' ? (selectedContent.data as Testimonial).type : 'winner') 
                         : ((selectedContent.type === 'testimonial' 
                              ? (selectedContent.data as Testimonial).authorImage 
                              : (selectedContent.data as Winner).image) || getFallbackImage('winner'))
                     }}
                     style={styles.detailModalImage}
                     resizeMode="cover"
                     onLoadStart={() => handleImageLoadStart(`modal-${selectedContent.id}`)}
                     onLoadEnd={() => handleImageLoadEnd(`modal-${selectedContent.id}`)}
                     onError={() => handleImageError(`modal-${selectedContent.id}`)}
                   />
                   {imageLoading[`modal-${selectedContent.id}`] && (
                     <View style={styles.modalImageLoadingContainer}>
                       <Ionicons name="sync" size={32} color="#fff" />
                     </View>
                   )}
                   <View style={styles.detailModalImageOverlay}>
                     <View style={styles.detailModalHeader}>
                       <Text style={styles.detailModalTitle}>
                         {selectedContent.type === 'testimonial' ? (selectedContent.data as Testimonial).title : `${(selectedContent.data as Winner).name} - Ganador`}
                       </Text>
                       <TouchableOpacity
                         onPress={() => setShowDetailModal(false)}
                         style={styles.closeButton}
                       >
                         <Ionicons name="close" size={24} color="#fff" />
                       </TouchableOpacity>
                     </View>
                   </View>
                 </View>
                 
                 {/* Contenido del modal */}
                 <LinearGradient
                   colors={getContentColor(selectedContent.type === 'testimonial' ? (selectedContent.data as Testimonial).type : 'winner') as [string, string, string]}
                   style={styles.detailModalGradient}
                   start={{ x: 0, y: 0 }}
                   end={{ x: 1, y: 1 }}
                 >
                   <View style={styles.detailModalBody}>
                     <View style={styles.detailAuthor}>
                       <View style={styles.detailAuthorInfo}>
                         <Text style={styles.detailAuthorName}>
                           {selectedContent.type === 'testimonial' ? (selectedContent.data as Testimonial).author : (selectedContent.data as Winner).name}
                         </Text>
                         <Text style={styles.detailAuthorPrize}>
                           {selectedContent.type === 'testimonial' ? (selectedContent.data as Testimonial).prize : (selectedContent.data as Winner).prize}
                         </Text>
                       </View>
                       <View style={styles.verifiedBadge}>
                         <Ionicons name="checkmark-circle" size={20} color="#fff" />
                       </View>
                     </View>
                     
                     <Text style={styles.detailContent}>
                       {selectedContent.type === 'testimonial' 
                         ? (selectedContent.data as Testimonial).content 
                         : ((selectedContent.data as Winner).testimonial || `Ganó ${(selectedContent.data as Winner).prize} en el sorteo ${(selectedContent.data as Winner).raffleName}`)}
                     </Text>
                     
                     <View style={styles.detailMeta}>
                       <View style={styles.detailMetaItem}>
                         <Ionicons name="calendar" size={16} color="#fff" />
                         <Text style={styles.detailMetaText}>
                           {formatDate(selectedContent.type === 'testimonial' ? (selectedContent.data as Testimonial).date : (selectedContent.data as Winner).drawDate)}
                         </Text>
                       </View>
                       {selectedContent.type === 'testimonial' && (
                         <View style={styles.detailMetaItem}>
                           <Ionicons name="eye" size={16} color="#fff" />
                           <Text style={styles.detailMetaText}>
                             {(selectedContent.data as Testimonial).viewCount} visualizaciones
                           </Text>
                         </View>
                       )}
                     </View>
                   </View>
                 </LinearGradient>
               </>
             )}
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
    padding: 20,
    paddingTop: 10,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    padding: 8,
  },
  headerInfo: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
  },
  headerIcon: {
    padding: 8,
  },
  filterContainer: {
    backgroundColor: '#fff',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  filterScroll: {
    paddingHorizontal: 20,
  },
  filterButton: {
    marginRight: 12,
    borderRadius: 20,
    overflow: 'hidden',
  },
  filterButtonActive: {
    shadowColor: '#667eea',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  filterButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  filterButtonText: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: '600',
    color: '#6c757d',
  },
  filterButtonTextActive: {
    color: '#fff',
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
  contentContainer: {
    gap: 16,
  },
  contentCard: {
    marginBottom: 16,
  },
  card: {
    padding: 0,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  cardImageContainer: {
    position: 'relative',
    height: 200,
    width: '100%',
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  cardImageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    padding: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardIconContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    padding: 8,
  },
  cardPoints: {
    alignItems: 'center',
  },
  cardPointsText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  cardPointsLabel: {
    fontSize: 12,
    color: '#fff',
    opacity: 0.8,
  },
  imageLoadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  cardContentSection: {
    padding: 20,
  },
  cardContentHeader: {
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
    lineHeight: 20,
    marginBottom: 16,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardCategory: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  cardCategoryText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },
  cardMeta: {
    alignItems: 'flex-end',
  },
  cardDate: {
    fontSize: 12,
    color: '#fff',
    opacity: 0.8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  detailModalContent: {
    width: width * 0.9,
    maxHeight: '80%',
    borderRadius: 16,
    overflow: 'hidden',
  },
  detailModalImageContainer: {
    position: 'relative',
    height: 250,
    width: '100%',
  },
  detailModalImage: {
    width: '100%',
    height: '100%',
  },
  detailModalImageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    padding: 24,
  },
  detailModalGradient: {
    padding: 24,
  },
  detailModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  detailModalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    flex: 1,
  },
  closeButton: {
    padding: 4,
  },
  detailModalBody: {
    flex: 1,
  },
  detailAuthor: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  detailAuthorImageContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    overflow: 'hidden',
    marginRight: 16,
    position: 'relative',
  },
  detailAuthorImage: {
    width: '100%',
    height: '100%',
  },
  modalImageLoadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  detailAuthorInfo: {
    flex: 1,
  },
  detailAuthorName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  detailAuthorPrize: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
  },
  verifiedBadge: {
    padding: 4,
  },
  detailContent: {
    fontSize: 16,
    color: '#fff',
    lineHeight: 24,
    marginBottom: 20,
  },
  detailMeta: {
    gap: 12,
  },
  detailMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailMetaText: {
    fontSize: 14,
    color: '#fff',
    marginLeft: 8,
  },
});
