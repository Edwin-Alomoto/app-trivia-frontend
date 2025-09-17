import React from 'react';
import { View, StyleSheet, Dimensions, ViewStyle } from 'react-native';

const { width, height } = Dimensions.get('window');

type Props = {
  variant?: 'auth' | 'surface';
  style?: ViewStyle;
};

const DecorativeBlobs: React.FC<Props> = ({ variant = 'auth', style }) => {
  const colors = variant === 'auth'
    ? {
        top: 'rgba(210, 180, 254, 0.08)',
        center: 'rgba(230, 213, 255, 0.06)',
        bottom: 'rgba(230, 213, 255, 0.06)'
      }
    : {
        top: 'rgba(210, 180, 254, 0.06)',
        center: 'rgba(230, 213, 255, 0.04)',
        bottom: 'rgba(230, 213, 255, 0.04)'
      };

  return (
    <View pointerEvents="none" style={[StyleSheet.absoluteFillObject, style]}>
      <View style={[styles.blobTop, { backgroundColor: colors.top }]} />
      <View style={[styles.blobCenter, { backgroundColor: colors.center }]} />
      <View style={[styles.blobBottom, { backgroundColor: colors.bottom }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  blobTop: {
    position: 'absolute',
    width: width * 1.2,
    height: width * 1.2,
    borderRadius: (width * 1.2) / 2,
    top: -width * 0.4,
    left: -width * 0.3,
  },
  blobCenter: {
    position: 'absolute',
    width: width * 0.9,
    height: width * 0.9,
    borderRadius: (width * 0.9) / 2,
    top: height * 0.18,
    alignSelf: 'center',
  },
  blobBottom: {
    position: 'absolute',
    width: width * 1.4,
    height: width * 1.4,
    borderRadius: (width * 1.4) / 2,
    bottom: -width * 0.6,
    right: -width * 0.4,
  },
});

export default DecorativeBlobs;


