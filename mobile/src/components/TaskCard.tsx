import React from 'react';
import { Pressable, View, Text, StyleSheet } from 'react-native';
import { Task } from '../types/task';
import PriorityBadge from './PriorityBadge';
import { useTheme } from '../context/ThemeContext';
import { formatDisplayDateTime } from '../utils/date';
import { spacing, radius, fontSize, fontWeight, shadow } from '../theme/theme';

interface TaskCardProps {
  task: Task;
  onPress: () => void;
  onToggle: () => void;
}

const isOverdue = (deadline?: string): boolean => {
  if (!deadline) return false;
  return new Date(deadline) < new Date();
};

const TaskCard: React.FC<TaskCardProps> = ({ task, onPress, onToggle }) => {
  const { palette } = useTheme();
  const overdue = !task.completed && isOverdue(task.deadline);

  const styles = StyleSheet.create({
    card: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: palette.surface,
      borderRadius: radius.lg,
      borderWidth: 1,
      borderColor: palette.border,
      padding: spacing.md,
      marginHorizontal: spacing.base,
      marginBottom: spacing.sm,
      ...shadow.sm,
    },
    pressed: { opacity: 0.85 },
    checkbox: { marginRight: spacing.md },
    checkOuter: {
      width: 24,
      height: 24,
      borderRadius: 12,
      borderWidth: 2,
      borderColor: palette.border,
      alignItems: 'center',
      justifyContent: 'center',
    },
    checkOuterDone: {
      backgroundColor: palette.completed,
      borderColor: palette.completed,
    },
    checkMark: { color: palette.white, fontSize: 13, fontWeight: fontWeight.bold },
    content: { flex: 1 },
    title: {
      fontSize: fontSize.base,
      fontWeight: fontWeight.semibold,
      color: palette.textPrimary,
      marginBottom: 2,
    },
    titleDone: {
      textDecorationLine: 'line-through',
      color: palette.textTertiary,
    },
    description: {
      fontSize: fontSize.sm,
      color: palette.textSecondary,
      marginBottom: spacing.xs,
    },
    meta: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
      flexWrap: 'wrap',
    },
    date: {
      fontSize: fontSize.xs,
      color: palette.textTertiary,
    },
    overdue: { color: palette.error },
    chevron: {
      fontSize: 22,
      color: palette.textTertiary,
      marginLeft: spacing.sm,
    },
  });

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
      <Pressable onPress={onToggle} style={styles.checkbox} hitSlop={12}>
        <View
          style={[
            styles.checkOuter,
            task.completed && styles.checkOuterDone,
          ]}>
          {task.completed && <Text style={styles.checkMark}>✓</Text>}
        </View>
      </Pressable>

      <View style={styles.content}>
        <Text
          style={[styles.title, task.completed && styles.titleDone]}
          numberOfLines={1}>
          {task.title}
        </Text>

        {task.description ? (
          <Text style={styles.description} numberOfLines={1}>
            {task.description}
          </Text>
        ) : null}

        <View style={styles.meta}>
          <PriorityBadge priority={task.priority} size="sm" />

          {task.deadline ? (
            <Text
              style={[styles.date, overdue && styles.overdue]}>
              {overdue ? '⚠ ' : '📅 '}
              {formatDisplayDateTime(task.deadline)}
            </Text>
          ) : null}
        </View>
      </View>

      <Text style={styles.chevron}>›</Text>
    </Pressable>
  );
};

export default TaskCard;
