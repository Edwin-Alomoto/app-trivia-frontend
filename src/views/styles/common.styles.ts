import { StyleSheet, Dimensions } from 'react-native';
import { theme } from './theme';

const { height } = Dimensions.get('screen');

export const commonStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.secondary.background,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: theme.spacing.xxxl,
    minHeight: height, // Mantiene altura mínima para evitar que se mueva
  },
  headerSection: {
    alignItems: 'center',
    paddingTop: height * 0.08, // Mantenido el espaciado original
    paddingBottom: theme.spacing.xxxl, // Mantenido el espaciado original
  },
  formContainer: {
    paddingHorizontal: theme.spacing.xxl,
    marginBottom: theme.spacing.xxxl,
  },
  centerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.xxxl,
  },
});
