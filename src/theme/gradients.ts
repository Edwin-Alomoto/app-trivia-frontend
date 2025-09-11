import { colors } from './colors';

export const gradients = {
  brand: [colors.primary700, colors.primary500] as const,
  brandAlt: [colors.primary800, colors.primary600] as const,
  header: [colors.primary800, colors.primary500] as const,
};

export type AppGradients = typeof gradients;


