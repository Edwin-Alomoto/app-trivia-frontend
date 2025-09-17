import { StyleSheet, ImageStyle } from 'react-native';

export const questionCardStyles = StyleSheet.create({
  questionCard: {
    marginBottom: 24,
  },
  questionGradient: {
    padding: 20,
    borderRadius: 16,
  },
  categoryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  categoryIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#667eea',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  categoryIcon: {
    fontSize: 20,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2d3748',
  },
  difficultyChip: {
    marginLeft: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
  },
  difficultyChipText: {
    fontSize: 12,
    fontWeight: '600',
  },
  difficultyEasy: {
    backgroundColor: '#ecfdf5',
    borderColor: '#a7f3d0',
  },
  difficultyEasyText: {
    color: '#065f46',
  },
  difficultyMedium: {
    backgroundColor: '#fffbeb',
    borderColor: '#fde68a',
  },
  difficultyMediumText: {
    color: '#92400e',
  },
  difficultyHard: {
    backgroundColor: '#fef2f2',
    borderColor: '#fecaca',
  },
  difficultyHardText: {
    color: '#7f1d1d',
  },
  questionText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#2d3748',
    lineHeight: 32,
    marginBottom: 16,
  },
  imageContainer: {
    marginVertical: 16,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#f8f9fa',
  },
  questionImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
  } as ImageStyle,
});
