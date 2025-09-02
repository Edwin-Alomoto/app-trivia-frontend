import { StyleSheet, Dimensions } from 'react-native';
import { theme } from './theme';

const { height } = Dimensions.get('screen');

export const commonStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent', // Transparente para que se vea el fondo decorativo
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: theme.spacing.xxxl,
  },
  headerSection: {
    alignItems: 'center',
    paddingTop: height * 0.12,
    paddingBottom: theme.spacing.xxxl,
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
