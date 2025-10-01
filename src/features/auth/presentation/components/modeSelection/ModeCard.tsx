import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@theme/colors';
import { getVariantStyle } from '@theme/typography';

interface ModeCardProps {
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  features: string[];
  onPress: () => void;
  isSelected?: boolean;
  variant?: 'demo' | 'subscription';
  style?: any;
}

export const ModeCard: React.FC<ModeCardProps> = ({
  title,
  subtitle,
  description,
  icon,
  features,
  onPress,
  isSelected = false,
  variant = 'demo',
  style,
}) => {
  const isSubscription = variant === 'subscription';
  const dynamicCardStyle = isSubscription
    ? { backgroundColor: colors.primary600, borderColor: colors.primary600 }
    : { backgroundColor: colors.primary100, borderColor: colors.primary200 };
  const dynamicSelectedStyle = isSubscription
    ? { borderColor: colors.primary800 }
    : { borderColor: colors.primary400 };
  const titleColor = isSubscription ? colors.onPrimary : colors.textPrimary;
  const subtitleColor = isSubscription ? colors.onPrimary : colors.textSecondary;
  const descriptionColor = isSubscription ? colors.onPrimary : colors.textSecondary;
  const featureTextColor = isSubscription ? colors.onPrimary : colors.textPrimary;
  const iconColor = colors.gold;
  // Checks diferenciados por modo: Demo = morado fuerte, Premium = morado pálido
  const checkColor = isSubscription ? colors.primary200 : colors.primary600;
  return (
    <TouchableOpacity
      style={[
        styles.card,
        dynamicCardStyle,
        isSelected && [styles.cardSelected, dynamicSelectedStyle],
        style,
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Ionicons name={icon as any} size={32} color={iconColor} />
        </View>
        <View style={styles.titleContainer}>
          <Text style={[getVariantStyle('h3'), styles.title, { color: titleColor }]}>
            {title}
          </Text>
          <Text style={[getVariantStyle('body'), styles.subtitle, { color: subtitleColor }]}>
            {subtitle}
          </Text>
        </View>
      </View>
      
      <Text style={[getVariantStyle('body'), styles.description, { color: descriptionColor }]}>
        {description}
      </Text>
      
      <View style={styles.features}>
        {features.map((feature, index) => (
          <View key={index} style={styles.featureItem}>
            <Ionicons name="checkmark" size={16} color={checkColor} />
            <Text style={[getVariantStyle('body'), styles.featureText, { color: featureTextColor }]}>
              {feature}
            </Text>
          </View>
        ))}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: colors.border,
  },
  cardSelected: {
    borderColor: colors.primary600,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    marginRight: 12,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    marginBottom: 4,
  },
  subtitle: {
  },
  description: {
    marginBottom: 16,
    lineHeight: 20,
  },
  features: {
    marginTop: 8,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  featureText: {
    marginLeft: 8,
    flex: 1,
  },
});
