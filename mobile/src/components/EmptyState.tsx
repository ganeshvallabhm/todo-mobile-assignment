import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { spacing, fontSize, fontWeight } from '../theme/theme';

interface EmptyStateProps {
  title: string;
  subtitle?: string;
  emoji?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  subtitle,
  emoji = '📋',
}) => {
  const { palette } = useTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: spacing.xxxl,
      paddingHorizontal: spacing.xl,
    },
    emoji: { fontSize: 52, marginBottom: spacing.base },
    title: {
      fontSize: fontSize.md,
      fontWeight: fontWeight.bold,
      color: palette.textPrimary,
      textAlign: 'center',
      marginBottom: spacing.sm,
    },
    subtitle: {
      fontSize: fontSize.base,
      color: palette.textSecondary,
      textAlign: 'center',
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>{emoji}</Text>
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
};

export default EmptyState;
