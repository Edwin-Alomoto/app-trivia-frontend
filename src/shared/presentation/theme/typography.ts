import { TextStyle } from 'react-native';

export type TextVariant = 'h1' | 'h2' | 'subtitle' | 'body' | 'caption';

export type TypographyScale = Record<TextVariant, TextStyle>;

export const typography: TypographyScale = {
  h1: {
    fontFamily: 'Inter_700Bold',
    fontSize: 28,
    lineHeight: 34,
  },
  h2: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 24,
    lineHeight: 30,
  },
  subtitle: {
    fontFamily: 'Inter_500Medium',
    fontSize: 16,
    lineHeight: 22,
  },
  body: {
    fontFamily: 'Inter_400Regular',
    fontSize: 15,
    lineHeight: 22,
  },
  caption: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    lineHeight: 16,
  },
};

export const getVariantStyle = (variant: TextVariant): TextStyle => typography[variant];


