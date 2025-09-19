import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Animated,
  Dimensions,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { gradients } from '@theme/gradients';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { getVariantStyle } from '@theme/typography';

import { Card } from '@shared/presentation/components/ui/Card';
import { Button } from '@shared/presentation/components/ui/Button';
import { useAppDispatch } from '../../shared/domain/hooks/useAppDispatch';
import { useAppSelector } from '../../shared/domain/hooks/useAppSelector';
import { fetchCategories } from '../../app/store/slices/triviaSlice';
import { featureFlags } from '../../app/config/featureFlags';
import { useCategoriesViewModel } from '../../viewmodels/trivia/useCategoriesViewModel';
import { Category } from '../../types';

const { width, height } = Dimensions.get('window');

export const CategoriesScreen: React.FC = () => {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const { categories, isLoading, error } = useAppSelector((state) => state.trivia);
  const vm = featureFlags.useMVVMCategories ? useCategoriesViewModel() : null;
  const [refreshing, setRefreshing] = useState(false);
  const [selectedDifficulty, setSelectedDifficulty] = useState<'all' | 'easy' | 'medium' | 'hard'>('all');
  const [hasError, setHasError] = useState(false);

  // Animaciones
  const fadeAnim = useState(new Animated.Value(0))[0];
  const slideAnim = useState(new Animated.Value(50))[0];
  const scaleAnim = useState(new Animated.Value(0.9))[0];
  const pulseAnim = useState(new Animated.Value(1))[0];

  useEffect(() => {
    if (vm) {
      vm.refresh();
      setSelectedDifficulty(vm.selectedDifficulty);
    } else {
      loadCategories();
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

    // Animación de pulso para elementos interactivos
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  // Detectar errores
  useEffect(() => {
    if (error) {
      setHasError(true);
    } else {
      setHasError(false);
    }
  }, [error]);

  const loadCategories = async () => {
    try {
      setHasError(false);
      await dispatch(fetchCategories()).unwrap();
    } catch (error) {
      console.error('Error cargando categorías:', error);
      setHasError(true);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    if (vm) {
      await vm.refresh();
    } else {
      await loadCategories();
    }
    setRefreshing(false);
  };

  const handleRetry = () => {
    loadCategories();
  };

  const handleCategoryPress = (category: Category) => {
    (navigation as any).navigate('TriviaGame', { categoryId: category.id });
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return '#4CAF50';
      case 'medium':
        return '#FF9800';
      case 'hard':
        return '#F44336';
      default:
        return '#6c757d';
    }
  };

  const getDifficultyText = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'Fácil';
      case 'medium':
        return 'Medio';
      case 'hard':
        return 'Difícil';
      default:
        return 'Desconocido';
    }
  };

  const getDifficultyIcon = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'leaf-outline';
      case 'medium':
        return 'trending-up-outline';
      case 'hard':
        return 'flame-outline';
      default:
        return 'help-outline';
    }
  };

  // Intensificar color del gradiente de cada card
  const darkenHexColor = (hex: string, percent: number): string => {
    try {
      const raw = hex.replace('#', '');
      if (raw.length !== 6) return hex;
      const num = parseInt(raw, 16);
      let r = (num >> 16) & 0xff;
      let g = (num >> 8) & 0xff;
      let b = num & 0xff;
      const factor = 1 - Math.min(Math.max(percent, 0), 1);
      r = Math.max(0, Math.min(255, Math.floor(r * factor)));
      g = Math.max(0, Math.min(255, Math.floor(g * factor)));
      b = Math.max(0, Math.min(255, Math.floor(b * factor)));
      const out = (r << 16) | (g << 8) | b;
      return `#${out.toString(16).padStart(6, '0')}`;
    } catch {
      return hex;
    }
  };

  const computeCategoryGradient = (baseColor: string): [string, string] => {
    return [baseColor, darkenHexColor(baseColor, 0.2)];
  };

  // Gradientes iguales a los de premios, mapeados por nombre de categoría
  const getCategoryGradientByName = (name: string): [string, string] => {
    const normalized = name.toLowerCase();
    if (normalized.includes('entreten')) return ['#ff6b6b', '#ee5a52'];
    if (normalized.includes('ciencia')) return ['#66bb6a', '#4caf50'];
    if (normalized.includes('deporte')) return ['#42a5f5', '#2196f3'];
    if (normalized.includes('geograf')) return ['#ffa726', '#ff9800'];
    if (normalized.includes('arte') || normalized.includes('literat')) return ['#ab47bc', '#9c27b0'];
    if (normalized.includes('historia')) return ['#26a69a', '#009688'];
    return computeCategoryGradient('#667eea');
  };

  const filteredCategories = vm
    ? vm.filteredCategories
    : (selectedDifficulty === 'all' 
      ? categories 
      : categories.filter((cat: any) => cat.difficulty === selectedDifficulty));

  const renderCategoryCard = (category: Category, index: number) => (
    <Animated.View
      key={category.id}
      style={{
        opacity: fadeAnim,
        transform: [
          { translateY: slideAnim },
          { scale: scaleAnim },
        ],
      }}
    >
      <Card
        style={styles.categoryCard}
        onPress={() => handleCategoryPress(category)}
      >
        <LinearGradient
          colors={getCategoryGradientByName(category.name)}
          style={styles.categoryGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.categoryHeader}>
            <View style={styles.categoryIconContainer}>
              <Text style={styles.categoryIcon}>{category.icon}</Text>
            </View>
            <View style={styles.difficultyBadge}>
              <Ionicons 
                name={getDifficultyIcon(category.difficulty) as any} 
                size={12} 
                color="#fff" 
              />
              <Text style={[
                getVariantStyle('caption'),
                styles.difficultyText,
                { color: '#fff' }
              ]}>
                {getDifficultyText(category.difficulty)}
              </Text>
            </View>
          </View>
          
          <Text style={[getVariantStyle('h2'), styles.categoryName]}>{category.name}</Text>
          <Text style={[getVariantStyle('body'), styles.categoryDescription]}>{category.description}</Text>
          
          <View style={styles.categoryFooter}>
            <View style={styles.categoryStats}>
              <Ionicons name="help-circle-outline" size={16} color="#fff" />
              <Text style={[getVariantStyle('caption'), styles.categoryStatsText]}>
                {category.questionCount} preguntas
              </Text>
            </View>
            
            <Animated.View 
              style={[
                styles.playButton,
                {
                  transform: [{ scale: pulseAnim }],
                },
              ]}
            >
              <Ionicons name="play" size={20} color="#fff" />
            </Animated.View>
          </View>

          <View style={styles.categoryOverlay}>
            <View style={styles.overlayCircle1} />
            <View style={styles.overlayCircle2} />
          </View>
        </LinearGradient>
      </Card>
    </Animated.View>
  );

  // Estado de error de conexión
  if (hasError && !isLoading) {
    return (
      <SafeAreaView style={styles.container}>
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
                onPress={() => (navigation as any).goBack()}
                accessibilityRole="button"
                accessibilityLabel="Volver"
              >
                <Ionicons name="arrow-back" size={24} color="#000" />
              </TouchableOpacity>
              <View style={styles.headerInfo}>
                <Text style={[getVariantStyle('h1'), styles.title]}>Categorías</Text>
                <Text style={[getVariantStyle('subtitle'), styles.subtitle]}>Empieza a jugar</Text>
              </View>
            </View>
          </View>
        </Animated.View>

        <View style={styles.errorContainer}>
          <Animated.View 
            style={[
              styles.errorContent,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <View style={styles.errorIconContainer}>
              <Ionicons name="cloud-offline" size={80} color="#dc3545" />
            </View>
            <Text style={[getVariantStyle('h2'), styles.errorTitle]}>Sin conexión</Text>
            <Text style={[getVariantStyle('body'), styles.errorMessage]}>
              No se pudieron cargar las categorías. Verifica tu conexión a internet e intenta de nuevo.
            </Text>
            <Button
              title="Reintentar"
              onPress={handleRetry}
              variant="primary"
              style={styles.retryButton}
            />
          </Animated.View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
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
              onPress={() => (navigation as any).goBack()}
              accessibilityRole="button"
              accessibilityLabel="Volver"
            >
              <Ionicons name="arrow-back" size={24} color="#000" />
            </TouchableOpacity>
            <View style={styles.headerInfo}>
              <Text style={[getVariantStyle('h1'), styles.title]}>Categorías</Text>
              <Text style={[getVariantStyle('subtitle'), styles.subtitle]}>Empieza a jugar</Text>
            </View>
          </View>
        </View>
      </Animated.View>

      {/* Difficulty Filter Mejorado */}
      <Animated.View 
        style={[
          styles.filterContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScroll}
        >
          {[
            { key: 'all', label: 'Todas', icon: 'grid-outline' },
            { key: 'easy', label: 'Fácil', icon: 'leaf-outline' },
            { key: 'medium', label: 'Medio', icon: 'trending-up-outline' },
            { key: 'hard', label: 'Difícil', icon: 'flame-outline' },
          ].map((filter) => (
            <TouchableOpacity
              key={filter.key}
              style={[
                styles.filterButton,
                selectedDifficulty === filter.key && styles.filterButtonActive
              ]}
              onPress={() => setSelectedDifficulty(filter.key as any)}
            >
              <LinearGradient
                colors={
                  selectedDifficulty === filter.key 
                    ? ['#667eea', '#764ba2'] 
                    : ['#f8f9fa', '#e9ecef']
                }
                style={styles.filterButtonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Ionicons
                  name={filter.icon as any}
                  size={16}
                  color={selectedDifficulty === filter.key ? '#fff' : '#6c757d'}
                />
                <Text style={[
                  getVariantStyle('caption'),
                  styles.filterButtonText,
                  selectedDifficulty === filter.key && styles.filterButtonTextActive
                ]}>
                  {filter.label}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </Animated.View>

      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        <Animated.View 
          style={[
            styles.categoriesContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          {filteredCategories.map((category: any, index: number) => renderCategoryCard(category, index))}

          {filteredCategories.length === 0 && !isLoading && !hasError && (
            <Animated.View 
              style={[
                styles.emptyState,
                {
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }],
                },
              ]}
            >
              <View style={styles.emptyStateIcon}>
                <Ionicons name="search-outline" size={64} color="#6c757d" />
              </View>
              <Text style={[getVariantStyle('h2'), styles.emptyStateTitle]}>No se encontraron categorías</Text>
              <Text style={[getVariantStyle('body'), styles.emptyStateSubtitle]}>
                Intenta cambiar el filtro de dificultad
              </Text>
              <Button
                title="Ver todas las categorías"
                onPress={() => setSelectedDifficulty('all')}
                variant="outline"
                style={styles.emptyStateButton}
              />
            </Animated.View>
          )}
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
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
  },
  filterContainer: {
    backgroundColor: '#fff',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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
  scrollView: {
    flex: 1,
  },
  categoriesContainer: {
    padding: 20,
  },
  categoryCard: {
    marginBottom: 20,
    padding: 0,
    overflow: 'hidden',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  categoryGradient: {
    padding: 24,
    borderRadius: 20,
    position: 'relative',
    overflow: 'hidden',
  },
  categoryOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'none',
  },
  overlayCircle1: {
    position: 'absolute',
    top: -50,
    right: -50,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  overlayCircle2: {
    position: 'absolute',
    bottom: -30,
    left: -30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  categoryIconContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 16,
    padding: 12,
  },
  categoryIcon: {
    fontSize: 32,
  },
  difficultyBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  difficultyText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  categoryName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  categoryDescription: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
    marginBottom: 20,
    lineHeight: 22,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  categoryFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryStats: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  categoryStatsText: {
    marginLeft: 6,
    fontSize: 14,
    color: '#fff',
    fontWeight: '500',
  },
  playButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.35)',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 80,
  },
  emptyStateIcon: {
    backgroundColor: '#f8f9fa',
    borderRadius: 50,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2d3748',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyStateSubtitle: {
    fontSize: 16,
    color: '#718096',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  emptyStateButton: {
    borderRadius: 12,
    paddingHorizontal: 24,
  },
  // Estilos para estado de error
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorContent: {
    alignItems: 'center',
    maxWidth: 300,
  },
  errorIconContainer: {
    backgroundColor: '#fef2f2',
    borderRadius: 50,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#dc3545',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#dc3545',
    marginBottom: 12,
    textAlign: 'center',
  },
  errorMessage: {
    fontSize: 16,
    color: '#6c757d',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  retryButton: {
    borderRadius: 12,
    paddingHorizontal: 32,
    paddingVertical: 12,
  },
});
