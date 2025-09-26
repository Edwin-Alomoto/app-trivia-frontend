import { StyleSheet } from 'react-native';

export const pointsAnimationStyles = StyleSheet.create({
  scoreAnimation: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -50 }, { translateY: -50 }],
    zIndex: 1000,
  },
  scoreAnimationGradient: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  scoreAnimationText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
});
