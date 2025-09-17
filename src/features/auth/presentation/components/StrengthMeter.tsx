import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { getVariantStyle } from '@theme/typography';

type Props = {
  strength: number; // 0-100
  containerStyle?: ViewStyle;
};

const StrengthMeter: React.FC<Props> = ({ strength, containerStyle }) => {
  const getStrengthColor = () => {
    if (strength >= 80) return '#10B981';
    if (strength >= 60) return '#F59E0B';
    if (strength >= 40) return '#F97316';
    return '#EF4444';
  };

  const getStrengthText = () => {
    if (strength >= 80) return 'Muy fuerte';
    if (strength >= 60) return 'Fuerte';
    if (strength >= 40) return 'Media';
    if (strength >= 20) return 'Débil';
    return 'Muy débil';
  };

  return (
    <View style={[styles.container, containerStyle]}>
      <View style={styles.bar}>
        <View style={[styles.fill, { width: `${Math.max(0, Math.min(100, strength))}%`, backgroundColor: getStrengthColor() }]} />
      </View>
      <Text style={[getVariantStyle('caption'), styles.text, { color: getStrengthColor() }]}>{getStrengthText()}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
    marginBottom: 8,
  },
  bar: {
    height: 6,
    borderRadius: 6,
    backgroundColor: '#e5e7eb',
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 6,
  },
  text: {
    marginTop: 6,
  },
});

export default StrengthMeter;


