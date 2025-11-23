// Couleurs pour le mode clair
export const LIGHT_COLORS = {
  primary: '#4A90E2',
  secondary: '#50C878',
  accent: '#FF6B6B',
  background: '#F8F9FA',
  white: '#FFFFFF',
  black: '#000000',
  text: '#2C3E50',
  textLight: '#7F8C8D',
  border: '#E0E0E0',
  success: '#27AE60',
  error: '#E74C3C',
  warning: '#F39C12',
  gradient1: '#667eea',
  gradient2: '#764ba2',
  card: '#FFFFFF',
};

// Couleurs pour le mode sombre
export const DARK_COLORS = {
  primary: '#4A90E2',
  secondary: '#50C878',
  accent: '#FF6B6B',
  background: '#121212',
  white: '#1E1E1E',
  black: '#FFFFFF',
  text: '#FFFFFF',
  textLight: '#B0B0B0',
  border: '#333333',
  success: '#27AE60',
  error: '#E74C3C',
  warning: '#F39C12',
  gradient1: '#667eea',
  gradient2: '#764ba2',
  card: '#1E1E1E',
};

export const getColors = (isDarkMode: boolean) => {
  return isDarkMode ? DARK_COLORS : LIGHT_COLORS;
};
