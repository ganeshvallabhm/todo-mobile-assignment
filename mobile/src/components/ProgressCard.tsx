import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Card from './Card';
import { useTheme } from '../context/ThemeContext';
import { spacing, radius, fontSize, fontWeight } from '../theme/theme';

interface ProgressCardProps {
  completed: number;
  total: number;
}

const ProgressCard: React.FC<ProgressCardProps> = ({ completed, total }) => {
  const { palette } = useTheme();
  const pct = total === 0 ? 0 : Math.round((completed / total) * 100);

  const styles = StyleSheet.create({
    card: {
      marginHorizontal: spacing.base,
      marginBottom: spacing.base,
      padding: spacing.lg,
      backgroundColor: palette.mode === 'dark' ? '#312E81' : '#F5F3FF',
      borderColor: palette.mode === 'dark' ? '#818CF8' : '#DDD6FE',
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: spacing.md,
    },
    title: {
      fontSize: fontSize.md,
      fontWeight: fontWeight.bold,
      color: palette.textPrimary,
    },
    subtitle: {
      fontSize: fontSize.sm,
      color: palette.textSecondary,
      marginTop: 2,
    },
    percentBadge: {
      backgroundColor: palette.primary,
      borderRadius: radius.md,
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs,
    },
    percentText: {
      fontSize: fontSize.sm,
      fontWeight: fontWeight.bold,
      color: palette.white,
    },
    track: {
      height: 8,
      backgroundColor: palette.mode === 'dark' ? '#4F46E5' : '#DDD6FE',
      borderRadius: radius.full,
      overflow: 'hidden',
      marginBottom: spacing.sm,
    },
    fill: {
      height: 8,
      backgroundColor: palette.primary,
      borderRadius: radius.full,
    },
    hint: {
      fontSize: fontSize.sm,
      color: palette.textSecondary,
    },
  });

  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Today's Progress</Text>
          <Text style={styles.subtitle}>
            {completed} of {total} tasks completed
          </Text>
        </View>
        <View style={styles.percentBadge}>
          <Text style={styles.percentText}>{pct}%</Text>
        </View>
      </View>

      <View style={styles.track}>
        <View style={[styles.fill, { width: `${pct}%` }]} />
      </View>

      <Text style={styles.hint}>
        {pct === 100
          ? '🎉 All done for today!'
          : pct >= 50
          ? '🔥 Great progress, keep going!'
          : '💪 Let\'s get started!'}
      </Text>
    </Card>
  );
};

export default ProgressCard;
