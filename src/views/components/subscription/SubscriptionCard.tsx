import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FeatureItem } from './FeatureItem';
import { theme } from '../../styles/theme';

interface SubscriptionCardProps {
  type: 'demo' | 'premium';
  onSelect: () => void;
}

export const SubscriptionCard: React.FC<SubscriptionCardProps> = ({ type, onSelect }) => {
  const isDemo = type === 'demo';
  
  const demoFeatures = [
    { text: 'Trivia ilimitada', included: true },
    { text: 'Puntos de prueba', included: true },
    { text: 'Premios y sorteos', included: false },
  ];

  const premiumFeatures = [
    { text: 'Trivia ilimitada', included: true },
    { text: 'Puntos canjeables', included: true },
    { text: 'Premios y sorteos', included: true },
    { text: 'Encuestas exclusivas', included: true },
  ];

  const features = isDemo ? demoFeatures : premiumFeatures;

  return (
    <TouchableOpacity 
      style={[
        styles.card, 
        isDemo ? styles.demoCard : styles.premiumCard
      ]} 
      onPress={onSelect}
      activeOpacity={0.8}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Ionicons
            name={isDemo ? 'play' : 'diamond'}
            size={isDemo ? 24 : 32}
            color={isDemo ? theme.colors.primary.light : '#10B981'}
          />
        </View>
        {isDemo && (
          <View style={styles.freeBadge}>
            <Text style={styles.freeText}>GRATIS</Text>
          </View>
        )}
        {!isDemo && (
          <View style={styles.recommendedBadge}>
            <Text style={styles.recommendedText}>RECOMENDADO</Text>
          </View>
        )}
      </View>

      {/* Title and Subtitle */}
      <Text style={styles.title}>
        {isDemo ? 'Modo Demo' : 'Suscripción Premium'}
      </Text>
      <Text style={styles.subtitle}>
        {isDemo ? 'Prueba gratis por 7 días' : 'Acceso completo mensual'}
      </Text>

      {/* Features */}
      <View style={styles.featuresContainer}>
        {features.map((feature, index) => (
          <FeatureItem
            key={index}
            text={feature.text}
            included={feature.included}
          />
        ))}
      </View>

      {/* Price for Premium */}
      {!isDemo && (
        <View style={styles.priceContainer}>
          <View style={styles.priceBadge}>
            <Text style={styles.priceText}>$9.99/mes</Text>
            <Text style={styles.priceSubtext}>Renovable mensualmente</Text>
          </View>
          <View style={styles.premiumBadge}>
            <Text style={styles.premiumBadgeText}>¡MÁS POPULAR!</Text>
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.secondary.lightest,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: theme.colors.primary.light,
    padding: theme.spacing.xl,
    marginVertical: theme.spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 10,
  },
  demoCard: {
    borderWidth: 1,
    borderColor: theme.colors.primary.lighter,
  },
  premiumCard: {
    borderColor: '#10B981',
    borderWidth: 2,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.6,
    shadowRadius: 16,
    elevation: 15,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.md,
    position: 'relative',
  },
  iconContainer: {
    width: 48,
    height: 48,
    backgroundColor: theme.colors.secondary.light,
    borderRadius: theme.borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  freeBadge: {
    backgroundColor: theme.colors.primary.lighter,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 4,
    borderRadius: 12,
    position: 'absolute',
    top: 0,
    right: 0,
  },
  freeText: {
    color: theme.colors.secondary.lightest,
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  recommendedBadge: {
    backgroundColor: '#10B981',
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 4,
    borderRadius: 12,
    position: 'absolute',
    top: 0,
    right: 0,
  },
  recommendedText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: theme.colors.text.primary,
    textAlign: 'center',
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
  },
  featuresContainer: {
    marginBottom: theme.spacing.lg,
  },
  priceContainer: {
    alignItems: 'center',
  },
  priceBadge: {
    backgroundColor: '#dcfce7',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
  },
  priceText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#166534',
  },
  priceSubtext: {
    fontSize: 12,
    color: '#166534',
    marginTop: 2,
  },
  premiumBadge: {
    backgroundColor: '#10B981',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    marginTop: theme.spacing.sm,
    alignItems: 'center',
  },
  premiumBadgeText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#000',
    textAlign: 'center',
  },
});
