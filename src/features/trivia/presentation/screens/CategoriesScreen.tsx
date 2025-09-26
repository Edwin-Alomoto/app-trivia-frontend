import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  Animated,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { getVariantStyle } from '@theme/typography';
import { Button } from '@shared/presentation/components/ui/Button';
import { Category } from '@/shared/domain/types';

import { useAppDispatch } from '../../../../hooks/useAppDispatch';
import { useAppSelector } from '../../../../hooks/useAppSelector';
import { fetchCategories } from '../../../../store/slices/triviaSlice';
import { useCategoriesViewModel } from '../../domain/hooks/useCategoriesViewModel';
import { categoriesScreenStyles } from './styles/CategoriesScreen.styles';
import { CategoryCard } from '../components/CategoryCard';
import { DifficultyFilter } from '../components/DifficultyFilter';
import { Header } from '../components/Header';
import { ErrorState } from '../components/ErrorState';
import { getCategoryGradientByName } from '../utils';


const { width: _width, height: _height } = Dimensions.get('window');

export const CategoriesScreen: React.FC = () => {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const { categories, isLoading, error } = useAppSelector((state) => state.trivia);
  const vm = useCategoriesViewModel();
  const [refreshing, setRefreshing] = useState(false);
  const [selectedDifficulty, setSelectedDifficulty] = useState<'all' | 'easy' | 'medium' | 'hard'>('all');
  const [hasError, setHasError] = useState(false);

  // Animaciones
  const fadeAnim = useState(new Animated.Value(0))[0];
  const slideAnim = useState(new Animated.Value(50))[0];
  const scaleAnim = useState(new Animated.Value(0.9))[0];
  const pulseAnim = useState(new Animated.Value(1))[0];

  const loadCategories = useCallback(async () => {
    try {
      setHasError(false);
      await dispatch(fetchCategories()).unwrap();
    } catch (err) {
      console.error('Error cargando categorías:', err);
      setHasError(true);
    }
  }, [dispatch]);

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
  }, [fadeAnim, slideAnim, scaleAnim, pulseAnim, vm, loadCategories]);

  // Detectar errores
  useEffect(() => {
    if (error) {
      setHasError(true);
    } else {
      setHasError(false);
    }
  }, [error]);

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

  const _getDifficultyColor = (difficulty: string) => {
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


  const filteredCategories = vm
    ? vm.filteredCategories
    : (selectedDifficulty === 'all' 
      ? categories 
      : categories.filter((cat: any) => cat.difficulty === selectedDifficulty));

  const renderCategoryCard = (category: Category, _index: number) => (
    <CategoryCard
      key={category.id}
      category={category}
      fadeAnim={fadeAnim}
      slideAnim={slideAnim}
      scaleAnim={scaleAnim}
      pulseAnim={pulseAnim}
      onPress={handleCategoryPress}
      getCategoryGradientByName={getCategoryGradientByName}
      getDifficultyIcon={getDifficultyIcon}
      getDifficultyText={getDifficultyText}
    />
  );

  // Estado de error de conexión
  if (hasError && !isLoading) {
    return (
      <SafeAreaView style={categoriesScreenStyles.container}>
      <Header
        title="Categorías"
        subtitle="Empieza a jugar"
        onBackPress={() => (navigation as any).goBack()}
        fadeAnim={fadeAnim}
        slideAnim={slideAnim}
      />

        <ErrorState
          onRetry={handleRetry}
          fadeAnim={fadeAnim}
          slideAnim={slideAnim}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={categoriesScreenStyles.container}>
      <Header
        title="Categorías"
        subtitle="Empieza a jugar"
        onBackPress={() => (navigation as any).goBack()}
        fadeAnim={fadeAnim}
        slideAnim={slideAnim}
      />

      {/* Difficulty Filter */}
      <DifficultyFilter
        selectedDifficulty={selectedDifficulty}
        onDifficultyChange={setSelectedDifficulty}
        fadeAnim={fadeAnim}
        slideAnim={slideAnim}
      />

      <ScrollView
        style={categoriesScreenStyles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        <Animated.View 
          style={[
            categoriesScreenStyles.categoriesContainer,
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
                categoriesScreenStyles.emptyState,
                {
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }],
                },
              ]}
            >
              <View style={categoriesScreenStyles.emptyStateIcon}>
                <Ionicons name="search-outline" size={64} color="#6c757d" />
              </View>
              <Text style={[getVariantStyle('h2'), categoriesScreenStyles.emptyStateTitle]}>No se encontraron categorías</Text>
              <Text style={[getVariantStyle('body'), categoriesScreenStyles.emptyStateSubtitle]}>
                Intenta cambiar el filtro de dificultad
              </Text>
              <Button
                title="Ver todas las categorías"
                onPress={() => setSelectedDifficulty('all')}
                variant="outline"
                style={categoriesScreenStyles.emptyStateButton}
              />
            </Animated.View>
          )}
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
};
