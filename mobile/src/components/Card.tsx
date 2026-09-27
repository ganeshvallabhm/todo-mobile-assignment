import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { radius, spacing, shadow } from '../theme/theme';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  padded?: boolean;
}

const Card: React.FC<CardProps> = ({ children, style, padded = true }) => {
  const { palette } = useTheme();

  const styles = StyleSheet.create({
    card: {
      backgroundColor: palette.surface,
      borderRadius: radius.lg,
      borderWidth: 1,
      borderColor: palette.border,
      ...shadow.sm,
    },
    padded: {
      padding: spacing.base,
    },
  });

  return <View style={[styles.card, padded && styles.padded, style]}>{children}</View>;
};

export default Card;
