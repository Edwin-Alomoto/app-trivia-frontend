import { colors } from './colors';

export const gradients = {
  brand: [colors.primary700, colors.primary500] as const,
  brandAlt: [colors.primary800, colors.primary600] as const,
  header: [colors.primary800, colors.primary500] as const,
  // Nuevos gradientes solicitados
  purple: [colors.primary600, colors.primary400] as const,
  gold: ['#cfae0e', colors.gold] as const,
  // bronze removido según solicitud
};

export type AppGradients = typeof gradients;


