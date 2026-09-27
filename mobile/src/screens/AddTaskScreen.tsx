import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Platform,
  StyleSheet,
  KeyboardAvoidingView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Input from '../components/Input';
import Button from '../components/Button';
import { taskApi } from '../api/taskApi';
import { Priority } from '../types/task';
import { useTheme } from '../context/ThemeContext';
import { spacing, fontSize, fontWeight, radius } from '../theme/theme';

// Map UI priority labels to backend values
type UIPriority = 'low' | 'medium' | 'high' | 'urgent';

// Urgent maps to high for backend
const toApiPriority = (p: UIPriority): Priority =>
  p === 'urgent' ? 'high' : p;

const AddTaskScreen: React.FC = () => {
  const navigation = useNavigation();
  const { palette } = useTheme();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dateTime, setDateTime] = useState('');
  const [deadline, setDeadline] = useState('');
  const [priority, setPriority] = useState<UIPriority>('medium');
  const [loading, setLoading] = useState(false);
  const [titleError, setTitleError] = useState('');
  const [error, setError] = useState('');

  const PRIORITY_OPTIONS_COLORS = [
    { label: 'Low', value: 'low' as UIPriority, color: palette.priority.low.indicator },
    { label: 'Medium', value: 'medium' as UIPriority, color: palette.priority.medium.indicator },
    { label: 'High', value: 'high' as UIPriority, color: palette.priority.high.indicator },
    { label: 'Urgent', value: 'urgent' as UIPriority, color: palette.priority.urgent.indicator },
  ];

  const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: palette.background },
    flex: { flex: 1 },
    topBar: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: spacing.base,
      paddingVertical: spacing.md,
      backgroundColor: palette.surface,
      borderBottomWidth: 1,
      borderBottomColor: palette.border,
    },
    backBtn: { width: 64 },
    backText: { color: palette.primary, fontSize: fontSize.base, fontWeight: fontWeight.semibold },
    topTitle: {
      fontSize: fontSize.md,
      fontWeight: fontWeight.bold,
      color: palette.textPrimary,
    },
    scroll: { padding: spacing.base, paddingBottom: spacing.xxxl },
    errorBanner: {
      backgroundColor: palette.errorBg,
      color: palette.error,
      padding: spacing.md,
      borderRadius: 8,
      fontSize: fontSize.sm,
      marginBottom: spacing.md,
    },
    multiline: { height: 80, textAlignVertical: 'top', paddingTop: spacing.sm },
    label: {
      fontSize: fontSize.sm,
      fontWeight: fontWeight.semibold,
      color: palette.textSecondary,
      marginBottom: spacing.sm,
    },
    priorityRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing.sm,
      marginBottom: spacing.xl,
    },
    priorityBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      borderRadius: radius.full,
      borderWidth: 1.5,
      borderColor: palette.border,
      backgroundColor: palette.subtleSurface,
      gap: spacing.xs,
    },
    priorityDot: { width: 8, height: 8, borderRadius: 4 },
    priorityLabel: { fontSize: fontSize.sm, color: palette.textSecondary },
    submitBtn: { marginTop: spacing.sm },
  });

  // Simple date validation for YYYY-MM-DD HH:MM format
  const parseLocalDate = (val: string): string | undefined => {
    if (!val.trim()) return undefined;
    const d = new Date(val.trim());
    if (isNaN(d.getTime())) return undefined;
    return d.toISOString();
  };

  const handleCreate = async () => {
    setTitleError('');
    setError('');

    if (!title.trim()) {
      setTitleError('Task title is required.');
      return;
    }

    const dtISO = parseLocalDate(dateTime);
    if (dateTime.trim() && !dtISO) {
      setError('Invalid date/time format. Use YYYY-MM-DD HH:MM');
      return;
    }

    const dlISO = parseLocalDate(deadline);
    if (deadline.trim() && !dlISO) {
      setError('Invalid deadline format. Use YYYY-MM-DD HH:MM');
      return;
    }

    setLoading(true);
    try {
      await taskApi.createTask({
        title: title.trim(),
        description: description.trim() || undefined,
        dateTime: dtISO,
        deadline: dlISO,
        priority: toApiPriority(priority),
      });
      navigation.goBack();
    } catch (err: any) {
      setError(err?.response?.data?.message ?? 'Failed to create task.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flex}>
        {/* Top bar */}
        <View style={styles.topBar}>
          <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Text style={styles.backText}>‹ Back</Text>
          </Pressable>
          <Text style={styles.topTitle}>New Task</Text>
          <View style={{ width: 64 }} />
        </View>

        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          {error ? <Text style={styles.errorBanner}>{error}</Text> : null}

          <Input
            label="Task Title *"
            value={title}
            onChangeText={setTitle}
            placeholder="What needs to be done?"
            error={titleError}
          />

          <Input
            label="Description"
            value={description}
            onChangeText={setDescription}
            placeholder="Add details (optional)"
            multiline
            numberOfLines={3}
            style={styles.multiline}
          />

          <Input
            label="Date & Time (YYYY-MM-DD HH:MM)"
            value={dateTime}
            onChangeText={setDateTime}
            placeholder="e.g. 2026-09-30 09:00"
            keyboardType="numbers-and-punctuation"
          />

          <Input
            label="Deadline (YYYY-MM-DD HH:MM)"
            value={deadline}
            onChangeText={setDeadline}
            placeholder="e.g. 2026-09-30 17:00"
            keyboardType="numbers-and-punctuation"
          />

          {/* Priority selector */}
          <Text style={styles.label}>Priority</Text>
          <View style={styles.priorityRow}>
            {PRIORITY_OPTIONS_COLORS.map(opt => (
              <Pressable
                key={opt.value}
                onPress={() => setPriority(opt.value)}
                style={[
                  styles.priorityBtn,
                  priority === opt.value && {
                    borderColor: opt.color,
                    backgroundColor: opt.color + '18',
                  },
                ]}>
                <View style={[styles.priorityDot, { backgroundColor: opt.color }]} />
                <Text
                  style={[
                    styles.priorityLabel,
                    priority === opt.value && { color: opt.color, fontWeight: fontWeight.bold },
                  ]}>
                  {opt.label}
                </Text>
              </Pressable>
            ))}
          </View>

          <Button
            label="Create Task"
            onPress={handleCreate}
            loading={loading}
            style={styles.submitBtn}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default AddTaskScreen;
