import { StyleSheet } from 'react-native';

export const answerOptionsStyles = StyleSheet.create({
  answersContainer: {
    marginBottom: 24,
  },
  answerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    borderWidth: 2,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  answerContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  answerLetter: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  answerLetterText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2d3748',
  },
  answerText: {
    flex: 1,
    fontSize: 16,
    color: '#2d3748',
    lineHeight: 24,
  },
  answerIcon: {
    marginLeft: 8,
  },
  noOptionsContainer: {
    padding: 20,
    alignItems: 'center',
  },
  noOptionsText: {
    fontSize: 16,
    color: '#6c757d',
  },
});
