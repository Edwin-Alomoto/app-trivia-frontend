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
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { getVariantStyle } from '../../theme/typography';

import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useAppSelector } from '../../hooks/useAppSelector';
import { fetchTransactions, fetchPointBalance } from '../../store/slices/pointsSlice';
import { featureFlags } from '../../config/featureFlags';
import { usePointsViewModel } from '../../viewmodels/points/usePointsViewModel';
import { PointTransaction } from '../../types';
import { useDemoStatus } from '../../hooks/useDemoStatus';

const { width, height } = Dimensions.get('window');

export const PointsHistoryScreen: React.FC = () => {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const { transactions, balance, isLoading } = useAppSelector((state) => state.points);
  const vm = featureFlags.useMVVMPoints ? usePointsViewModel() : null;
  const { isDemoUser } = useDemoStatus();
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<'all' | 'earned' | 'spent' | 'purchased'>('all');

  // Animaciones
  const fadeAnim = useState(new Animated.Value(0))[0];
  const slideAnim = useState(new Animated.Value(50))[0];
  const scaleAnim = useState(new Animated.Value(0.9))[0];

  useEffect(() => {
    if (!vm) {
      loadData();
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

  const loadData = async () => {
    await Promise.all([
      dispatch(fetchTransactions()),
      dispatch(fetchPointBalance()),
    ]);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    if (vm) {
      await vm.refresh();
    } else {
      await loadData();
    }
    setRefreshing(false);
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'earned':
        return 'trending-up';
      case 'spent':
        return 'trending-down';
      case 'purchased':
        return 'card';
      default:
        return 'help-circle';
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'earned':
        return ['#10b981', '#34d399'];
      case 'spent':
        return ['#ef4444', '#f87171'];
      case 'purchased':
        return ['#3b82f6', '#60a5fa'];
      default:
        return ['#6b7280', '#9ca3af'];
    }
  };

  const getTransactionText = (type: string) => {
    switch (type) {
      case 'earned':
        return 'Ganados';
      case 'spent':
        return 'Gastados';
      case 'purchased':
        return 'Comprados';
      default:
        return 'Desconocido';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Hace un momento';
    } else if (diffInHours < 24) {
      return `Hace ${diffInHours} hora${diffInHours > 1 ? 's' : ''}`;
    } else if (diffInHours < 48) {
      return 'Ayer';
    } else {
      return date.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
    }
  };

  const filteredTransactions = filter === 'all' 
    ? (vm ? vm.transactions : transactions)
    : (vm ? vm.transactions : transactions).filter((t: any) => t.type === filter);

  const renderTransaction = ({ item, index }: { item: PointTransaction; index: number }) => (
    <Animated.View
      style={{
        opacity: fadeAnim,
        transform: [
          { translateY: slideAnim },
          { scale: scaleAnim },
        ],
      }}
    >
      <Card style={styles.transactionCard}>
        <View style={styles.transactionContent}>
          <LinearGradient
            colors={getTransactionColor(item.type) as [string, string, string]}
            style={styles.transactionIcon}
          >
            <Ionicons 
              name={getTransactionIcon(item.type) as any} 
              size={24} 
              color="#fff" 
            />
          </LinearGradient>
          
          <View style={styles.transactionDetails}>
            <Text style={[getVariantStyle('body'), styles.transactionDescription]}>{item.description}</Text>
            <Text style={[getVariantStyle('caption'), styles.transactionDate]}>{formatDate(item.timestamp)}</Text>
            <Text style={[getVariantStyle('caption'), styles.transactionType]}>{getTransactionText(item.type)}</Text>
          </View>
          
          <View style={styles.transactionAmount}>
            <Text style={[
              styles.transactionAmountText,
              { color: item.amount > 0 ? '#10b981' : '#ef4444' }
            ]}>
              {item.amount > 0 ? '+' : ''}{item.amount.toLocaleString()}
            </Text>
            <Text style={[getVariantStyle('caption'), styles.transactionAmountLabel]}>puntos</Text>
          </View>
        </View>
      </Card>
    </Animated.View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header (igual al de Categorías) */}
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
              <Text style={[getVariantStyle('h1'), styles.title]}>Historial de Puntos</Text>
              <Text style={[getVariantStyle('subtitle'), styles.subtitle]}>Ver todas tus transacciones</Text>
            </View>
          </View>
        </View>
      </Animated.View>

      {/* Balance Summary */}
      <Animated.View
        style={[
          styles.summaryContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
          },
        ]}
      >
        <Card style={styles.summaryCard}>
          <View style={styles.summaryGradient}>
            <Text style={[getVariantStyle('h2'), styles.summaryTitle]}>Balance Total</Text>
            <Text style={[getVariantStyle('h1'), styles.summaryAmount]}>{(vm ? vm.balance.total : balance.total).toLocaleString()}</Text>
            <Text style={[getVariantStyle('caption'), styles.summaryLabel]}>puntos disponibles</Text>
            
            <View style={styles.summaryBreakdown}>
              <View style={styles.summaryItem}>
                <Text style={[getVariantStyle('h2'), styles.summaryItemValue]}>+{balance.earned.toLocaleString()}</Text>
                <Text style={[getVariantStyle('caption'), styles.summaryItemLabel]}>Ganados</Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={[getVariantStyle('h2'), styles.summaryItemValue]}>-{balance.spent.toLocaleString()}</Text>
                <Text style={[getVariantStyle('caption'), styles.summaryItemLabel]}>Gastados</Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={[getVariantStyle('h2'), styles.summaryItemValue]}>+{balance.purchased.toLocaleString()}</Text>
                <Text style={[getVariantStyle('caption'), styles.summaryItemLabel]}>Comprados</Text>
              </View>
            </View>
          </View>
        </Card>
      </Animated.View>



      {/* Filter Buttons */}
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
            { key: 'all', label: 'Todas', icon: 'list-outline' },
            { key: 'earned', label: 'Ganados', icon: 'trending-up' },
            { key: 'spent', label: 'Gastados', icon: 'trending-down' },
            { key: 'purchased', label: 'Comprados', icon: 'card' },
          ].map((filterOption) => (
            <TouchableOpacity
              key={filterOption.key}
              style={[
                styles.filterButton,
                filter === filterOption.key && styles.filterButtonActive
              ]}
              onPress={() => setFilter(filterOption.key as any)}
            >
              <LinearGradient
                colors={
                  filter === filterOption.key 
                    ? ['#667eea', '#764ba2'] 
                    : ['#f8f9fa', '#e9ecef']
                }
                style={styles.filterButtonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Ionicons
                  name={filterOption.icon as any}
                  size={16}
                  color={filter === filterOption.key ? '#fff' : '#6c757d'}
                />
                <Text style={[
                  getVariantStyle('body'),
                  styles.filterButtonText,
                  filter === filterOption.key && styles.filterButtonTextActive
                ]}>
                  {filterOption.label}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </Animated.View>

      {/* Transactions List */}
      <FlatList
        data={filteredTransactions}
        renderItem={renderTransaction}
        keyExtractor={(item) => item.id}
        style={styles.transactionsList}
        contentContainerStyle={styles.transactionsContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => (
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
              <Ionicons name="receipt-outline" size={64} color="#6c757d" />
            </View>
            <Text style={[getVariantStyle('h2'), styles.emptyStateTitle]}>No hay transacciones</Text>
            <Text style={[getVariantStyle('body'), styles.emptyStateSubtitle]}>
              Aquí aparecerán tus movimientos de puntos
            </Text>
            <Button
              title="Jugar Trivia"
              onPress={() => navigation.navigate('Categories' as never)}
              gradient
              style={styles.emptyStateButton}
            />
          </Animated.View>
        )}
      />
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
    marginRight: 10,
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
  summaryContainer: {
    marginTop: -10,
    zIndex: 2,
  },
  summaryCard: {
    margin: 20,
    padding: 0,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  summaryGradient: {
    padding: 24,
    alignItems: 'center',
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2d3748',
    marginBottom: 8,
  },
  summaryAmount: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#2d3748',
    marginBottom: 4,
    textShadowColor: 'transparent',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 0,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#718096',
    opacity: 1,
    marginBottom: 20,
  },
  summaryBreakdown: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  summaryItem: {
    alignItems: 'center',
    flex: 1,
  },
  summaryItemValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2d3748',
    marginBottom: 4,
  },
  summaryItemLabel: {
    fontSize: 12,
    color: '#718096',
    opacity: 1,
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
  transactionsList: {
    flex: 1,
  },
  transactionsContainer: {
    padding: 20,
  },
  transactionCard: {
    marginBottom: 16,
    padding: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  transactionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  transactionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionDescription: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2d3748',
    marginBottom: 4,
  },
  transactionDate: {
    fontSize: 14,
    color: '#718096',
    marginBottom: 2,
  },
  transactionType: {
    fontSize: 12,
    color: '#a0aec0',
    fontWeight: '500',
  },
  transactionAmount: {
    alignItems: 'flex-end',
  },
  transactionAmountText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  transactionAmountLabel: {
    fontSize: 12,
    color: '#718096',
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
});
