/**
 * Modern Todo App Color Palette
 * Soft, accessible design with beautiful gradients and gentle contrasts
 */

// Primary brand colors - soft and modern
const primaryLight = '#6366f1'; // Soft indigo
const primaryDark = '#a855f7'; // Soft purple

// Accent colors for categories and highlights
const accentColors = {
  work: '#ef4444', // Soft red
  personal: '#f59e0b', // Warm amber
  health: '#10b981', // Emerald green
  shopping: '#8b5cf6', // Violet
  leisure: '#06b6d4', // Cyan
  urgent: '#f97316', // Orange
};

export const Colors = {
  light: {
    // Basic colors
    text: '#1f2937', // Dark gray for better readability
    textSecondary: '#6b7280', // Medium gray
    textMuted: '#9ca3af', // Light gray
    background: '#ffffff',
    backgroundSecondary: '#f9fafb', // Very light gray
    backgroundTertiary: '#f3f4f6', // Light gray for cards
    
    // Primary colors
    primary: primaryLight,
    primaryLight: '#a5b4fc', // Light indigo
    primaryDark: '#4338ca', // Dark indigo
    
    // UI elements
    surface: '#ffffff',
    surfaceSecondary: '#f8fafc',
    border: '#e5e7eb',
    borderLight: '#f3f4f6',
    shadow: 'rgba(0, 0, 0, 0.1)',
    overlay: 'rgba(0, 0, 0, 0.5)',
    
    // Status colors
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',
    
    // Tab navigation
    tint: primaryLight,
    icon: '#6b7280',
    tabIconDefault: '#9ca3af',
    tabIconSelected: primaryLight,
    tabBackground: 'rgba(255, 255, 255, 0.95)',
    
    // Category colors
    categories: accentColors,
    
    // Todo priority colors
    priority: {
      low: '#10b981',
      medium: '#f59e0b',
      high: '#ef4444',
    },
  },
  dark: {
    // Basic colors
    text: '#f9fafb', // Light gray
    textSecondary: '#d1d5db', // Medium light gray
    textMuted: '#9ca3af', // Medium gray
    background: '#111827', // Very dark blue-gray
    backgroundSecondary: '#1f2937', // Dark blue-gray
    backgroundTertiary: '#374151', // Medium dark gray
    
    // Primary colors
    primary: primaryDark,
    primaryLight: '#c4b5fd', // Light purple
    primaryDark: '#7c3aed', // Dark purple
    
    // UI elements
    surface: '#1f2937',
    surfaceSecondary: '#111827',
    border: '#374151',
    borderLight: '#4b5563',
    shadow: 'rgba(0, 0, 0, 0.3)',
    overlay: 'rgba(0, 0, 0, 0.7)',
    
    // Status colors (adjusted for dark mode)
    success: '#34d399',
    warning: '#fbbf24',
    error: '#f87171',
    info: '#60a5fa',
    
    // Tab navigation
    tint: primaryDark,
    icon: '#9ca3af',
    tabIconDefault: '#6b7280',
    tabIconSelected: primaryDark,
    tabBackground: 'rgba(31, 41, 55, 0.95)',
    
    // Category colors (brighter for dark mode)
    categories: {
      work: '#f87171',
      personal: '#fbbf24',
      health: '#34d399',
      shopping: '#a78bfa',
      leisure: '#22d3ee',
      urgent: '#fb923c',
    },
    
    // Todo priority colors
    priority: {
      low: '#34d399',
      medium: '#fbbf24',
      high: '#f87171',
    },
  },
};

// Gradient definitions for modern UI
export const Gradients = {
  primary: ['#6366f1', '#8b5cf6'],
  success: ['#10b981', '#34d399'],
  warning: ['#f59e0b', '#fbbf24'],
  error: ['#ef4444', '#f87171'],
  sunset: ['#f97316', '#f59e0b'],
  ocean: ['#06b6d4', '#3b82f6'],
  purple: ['#8b5cf6', '#a855f7'],
};

// Shadow styles for consistent elevation
export const Shadows = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 8,
  },
};
