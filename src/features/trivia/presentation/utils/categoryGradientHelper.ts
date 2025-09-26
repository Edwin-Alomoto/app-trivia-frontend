/**
 * Utility functions for category gradient generation
 */

/**
 * Intensificar color del gradiente de cada card
 * @param hex - Color hexadecimal en formato #RRGGBB
 * @param percent - Porcentaje de oscurecimiento (0-1)
 * @returns Color hexadecimal oscurecido
 */
export const darkenHexColor = (hex: string, percent: number): string => {
  try {
    const raw = hex.replace('#', '');
    if (raw.length !== 6) return hex;
    const num = parseInt(raw, 16);
    let r = Math.floor(num / 65536) % 256;
    let g = Math.floor(num / 256) % 256;
    let b = num % 256;
    const factor = 1 - Math.min(Math.max(percent, 0), 1);
    r = Math.max(0, Math.min(255, Math.floor(r * factor)));
    g = Math.max(0, Math.min(255, Math.floor(g * factor)));
    b = Math.max(0, Math.min(255, Math.floor(b * factor)));
    const out = r * 65536 + g * 256 + b;
    return `#${out.toString(16).padStart(6, '0')}`;
  } catch {
    return hex;
  }
};

/**
 * Computa un gradiente basado en un color base
 * @param baseColor - Color base para el gradiente
 * @returns Array con dos colores para el gradiente
 */
export const computeCategoryGradient = (baseColor: string): [string, string] => {
  return [baseColor, darkenHexColor(baseColor, 0.2)];
};

/**
 * Gradientes iguales a los de premios, mapeados por nombre de categoría
 * @param name - Nombre de la categoría
 * @returns Array con dos colores para el gradiente
 */
export const getCategoryGradientByName = (name: string): [string, string] => {
  const normalized = name.toLowerCase();
  
  if (normalized.includes('entreten')) return ['#ff6b6b', '#ee5a52'];
  if (normalized.includes('ciencia')) return ['#66bb6a', '#4caf50'];
  if (normalized.includes('deporte')) return ['#42a5f5', '#2196f3'];
  if (normalized.includes('geograf')) return ['#ffa726', '#ff9800'];
  if (normalized.includes('arte') || normalized.includes('literat')) return ['#ab47bc', '#9c27b0'];
  if (normalized.includes('historia')) return ['#26a69a', '#009688'];
  
  return computeCategoryGradient('#667eea');
};
