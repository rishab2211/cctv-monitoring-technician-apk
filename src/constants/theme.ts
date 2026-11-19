/**
 * @file constants/theme.ts
 * @description Sleek Dark-Mode Theme matching Customer & Operator apps
 */

export const COLORS = {
  background: '#0B0F19',
  cardBackground: '#131B2E',
  cardBorder: '#1E293B',
  primary: '#3B82F6',
  primaryDark: '#2563EB',
  primaryMuted: 'rgba(59, 130, 246, 0.15)',
  accent: '#10B981',
  accentMuted: 'rgba(16, 185, 129, 0.15)',
  warning: '#F59E0B',
  warningMuted: 'rgba(245, 158, 11, 0.15)',
  danger: '#EF4444',
  dangerMuted: 'rgba(239, 68, 68, 0.15)',
  textPrimary: '#F8FAFC',
  textSecondary: '#94A3B8',
  textMuted: '#64748B',
  white: '#FFFFFF',
  black: '#000000',
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const RADIUS = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  card: 16,
  button: 12,
  pill: 9999,
};

export const TYPOGRAPHY = {
  h1: { fontSize: 24, fontWeight: '700' as const, color: COLORS.textPrimary },
  h2: { fontSize: 20, fontWeight: '700' as const, color: COLORS.textPrimary },
  h3: { fontSize: 16, fontWeight: '600' as const, color: COLORS.textPrimary },
  body: { fontSize: 14, fontWeight: '400' as const, color: COLORS.textSecondary },
  bodySmall: { fontSize: 12, fontWeight: '400' as const, color: COLORS.textMuted },
  caption: { fontSize: 10, fontWeight: '500' as const, color: COLORS.textMuted },
};
