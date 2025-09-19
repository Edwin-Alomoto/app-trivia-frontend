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
  style,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.card,
        isSelected && styles.cardSelected,
        style,
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Ionicons name={icon as any} size={32} color={colors.primary600} />
        </View>
        <View style={styles.titleContainer}>
          <Text style={[getVariantStyle('h3'), styles.title]}>
            {title}
          </Text>
          <Text style={[getVariantStyle('body'), styles.subtitle]}>
            {subtitle}
          </Text>
        </View>
      </View>
      
      <Text style={[getVariantStyle('body'), styles.description]}>
        {description}
      </Text>
      
      <View style={styles.features}>
        {features.map((feature, index) => (
          <View key={index} style={styles.featureItem}>
            <Ionicons name="checkmark" size={16} color="#10B981" />
            <Text style={[getVariantStyle('body'), styles.featureText]}>
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
    backgroundColor: '#f0f4ff',
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
    color: colors.textPrimary,
    marginBottom: 4,
  },
  subtitle: {
    color: colors.textSecondary,
  },
  description: {
    color: colors.textSecondary,
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
    color: colors.textPrimary,
    marginLeft: 8,
    flex: 1,
  },
});
