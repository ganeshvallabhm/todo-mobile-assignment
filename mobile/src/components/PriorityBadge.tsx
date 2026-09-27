import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Priority } from '../types/task';
import { useTheme } from '../context/ThemeContext';
import { spacing, radius, fontSize, fontWeight } from '../theme/theme';

interface PriorityBadgeProps {
  priority: Priority | 'urgent';
  size?: 'sm' | 'md';
}

const PriorityBadge: React.FC<PriorityBadgeProps> = ({
  priority,
  size = 'md',
}) => {
  const { palette } = useTheme();
  const PRIORITY_CONFIG: Record<
    Priority | 'urgent',
    { label: string; bg: string; text: string; indicator: string }
  > = {
    urgent: { label: 'Urgent', ...palette.priority.urgent },
    high: { label: 'High', ...palette.priority.high },
    medium: { label: 'Medium', ...palette.priority.medium },
    low: { label: 'Low', ...palette.priority.low },
  };

  const cfg = PRIORITY_CONFIG[priority] ?? PRIORITY_CONFIG.medium;

  const styles = StyleSheet.create({
    badge: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs,
      borderRadius: radius.full,
      gap: spacing.xs,
    },
    sm: {
      paddingHorizontal: 6,
      paddingVertical: 3,
    },
    dot: {
      width: 6,
      height: 6,
      borderRadius: 3,
    },
    text: {
      fontSize: fontSize.xs,
      fontWeight: fontWeight.semibold,
    },
    textSm: {
      fontSize: 10,
    },
  });

  return (
    <View style={[styles.badge, { backgroundColor: cfg.bg }, size === 'sm' && styles.sm]}>
      <View style={[styles.dot, { backgroundColor: cfg.indicator }]} />
      <Text style={[styles.text, { color: cfg.text }, size === 'sm' && styles.textSm]}>
        {cfg.label}
      </Text>
    </View>
  );
};

export default PriorityBadge;
