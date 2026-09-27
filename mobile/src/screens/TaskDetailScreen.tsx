import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { taskApi } from '../api/taskApi';
import { Task, Priority } from '../types/task';
import PriorityBadge from '../components/PriorityBadge';
import Button from '../components/Button';
import Input from '../components/Input';
import { useTheme } from '../context/ThemeContext';
import { formatDisplayDateTime } from '../utils/date';
import { spacing, fontSize, fontWeight, radius, shadow } from '../theme/theme';
import { RootStackParamList } from '../navigation/RootNavigator';

type Route = RouteProp<RootStackParamList, 'TaskDetail'>;
type UIPriority = 'low' | 'medium' | 'high' | 'urgent';
const toApiPriority = (p: UIPriority): Priority => (p === 'urgent' ? 'high' : p);

const TaskDetailScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<Route>();
  const { palette } = useTheme();
  const { taskId } = route.params;

  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');

  // Edit fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dateTime, setDateTime] = useState('');
  const [deadline, setDeadline] = useState('');
  const [priority, setPriority] = useState<UIPriority>('medium');
  const PRIORITY_OPTIONS: { label: string; value: UIPriority; color: string }[] = [
    { label: 'Low', value: 'low', color: palette.priority.low.indicator },
    { label: 'Medium', value: 'medium', color: palette.priority.medium.indicator },
    { label: 'High', value: 'high', color: palette.priority.high.indicator },
    { label: 'Urgent', value: 'urgent', color: palette.priority.urgent.indicator },
  ];

  const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: palette.background },
    flex: { flex: 1 },
    center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    topBar: {
      flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
      paddingHorizontal: spacing.base, paddingVertical: spacing.md,
      backgroundColor: palette.surface, borderBottomWidth: 1, borderBottomColor: palette.border,
    },
    backBtn: { width: 64 },
    backText: { color: palette.primary, fontSize: fontSize.base, fontWeight: fontWeight.semibold },
    topTitle: { fontSize: fontSize.md, fontWeight: fontWeight.bold, color: palette.textPrimary },
    editBtn: { width: 64, alignItems: 'flex-end' },
    editBtnText: { color: palette.primary, fontSize: fontSize.base, fontWeight: fontWeight.semibold },
    scroll: { padding: spacing.base, paddingBottom: spacing.xxxl },
    errorBanner: {
      backgroundColor: palette.errorBg, color: palette.error,
      padding: spacing.md, borderRadius: 8, fontSize: fontSize.sm, marginBottom: spacing.md,
    },
    statusBadge: {
      alignSelf: 'flex-start', paddingHorizontal: spacing.md,
      paddingVertical: spacing.xs, borderRadius: radius.full, marginBottom: spacing.md,
    },
    statusDone: { backgroundColor: '#D1FAE5' },
    statusPending: { backgroundColor: palette.subtleSurface },
    statusText: { fontSize: fontSize.sm, fontWeight: fontWeight.semibold },
    statusTextDone: { color: '#065F46' },
    statusTextPending: { color: palette.textSecondary },
    title: { fontSize: fontSize.xl, fontWeight: fontWeight.bold, color: palette.textPrimary, marginBottom: spacing.sm },
    titleDone: { textDecorationLine: 'line-through', color: palette.textTertiary },
    row: { flexDirection: 'row', marginBottom: spacing.base },
    metaCard: {
      backgroundColor: palette.surface, borderRadius: radius.md,
      borderWidth: 1, borderColor: palette.border,
      padding: spacing.md, marginBottom: spacing.sm, ...shadow.sm,
    },
    metaLabel: { fontSize: fontSize.xs, color: palette.textTertiary, fontWeight: fontWeight.semibold, marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.5 },
    metaValue: { fontSize: fontSize.base, color: palette.textPrimary },
    actionBtn: { marginTop: spacing.sm },
    multiline: { height: 80, textAlignVertical: 'top', paddingTop: spacing.sm },
    fieldLabel: { fontSize: fontSize.sm, fontWeight: fontWeight.semibold, color: palette.textSecondary, marginBottom: spacing.sm },
    priorityRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.xl },
    priorityBtn: {
      flexDirection: 'row', alignItems: 'center',
      paddingHorizontal: spacing.md, paddingVertical: spacing.sm,
      borderRadius: radius.full, borderWidth: 1.5, borderColor: palette.border,
      backgroundColor: palette.subtleSurface, gap: spacing.xs,
    },
    priorityDot: { width: 8, height: 8, borderRadius: 4 },
    priorityLabel: { fontSize: fontSize.sm, color: palette.textSecondary },
    saveBtn: { marginTop: spacing.sm },
    errorText: { color: palette.error, fontSize: fontSize.base, marginBottom: spacing.md },
    backLink: { color: palette.primary, fontSize: fontSize.base },
  });

  const loadTask = useCallback(async () => {
    try {
      const res = await taskApi.getTask(taskId);
      const t = res.data.data;
      setTask(t);
      setTitle(t.title);
      setDescription(t.description ?? '');
      setDateTime(t.dateTime ? t.dateTime.slice(0, 16).replace('T', ' ') : '');
      setDeadline(t.deadline ? t.deadline.slice(0, 16).replace('T', ' ') : '');
      setPriority(t.priority);
    } catch {
      setError('Could not load task.');
    } finally {
      setLoading(false);
    }
  }, [taskId]);

  useEffect(() => {
    loadTask();
  }, [loadTask]);

  const handleToggle = async () => {
    if (!task) return;
    try {
      const res = await taskApi.toggleTask(task._id);
      setTask(res.data.data);
    } catch {
      Alert.alert('Error', 'Could not update task.');
    }
  };

  const parseDate = (val: string): string | undefined => {
    if (!val.trim()) return undefined;
    const d = new Date(val.trim());
    return isNaN(d.getTime()) ? undefined : d.toISOString();
  };

  const handleSave = async () => {
    if (!task) return;
    if (!title.trim()) { setError('Title is required'); return; }
    const dtISO = parseDate(dateTime);
    const dlISO = parseDate(deadline);
    setSaving(true);
    try {
      const res = await taskApi.updateTask(task._id, {
        title: title.trim(),
        description: description.trim() || undefined,
        dateTime: dtISO,
        deadline: dlISO,
        priority: toApiPriority(priority),
      });
      setTask(res.data.data);
      setEditing(false);
    } catch (err: any) {
      setError(err?.response?.data?.message ?? 'Update failed.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = () => {
    Alert.alert('Delete Task', 'This cannot be undone. Continue?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          if (!task) return;
          setDeleting(true);
          try {
            await taskApi.deleteTask(task._id);
            navigation.goBack();
          } catch {
            Alert.alert('Error', 'Could not delete task.');
            setDeleting(false);
          }
        },
      },
    ]);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={palette.primary} size="large" />
      </View>
    );
  }

  if (!task) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Task not found.</Text>
        <Pressable onPress={() => navigation.goBack()}>
          <Text style={styles.backLink}>← Go back</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      {/* Top bar */}
      <View style={styles.topBar}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>‹ Back</Text>
        </Pressable>
        <Text style={styles.topTitle}>{editing ? 'Edit Task' : 'Task Detail'}</Text>
        <Pressable
          onPress={() => { setEditing(e => !e); setError(''); }}
          style={styles.editBtn}>
          <Text style={styles.editBtnText}>{editing ? 'Cancel' : 'Edit'}</Text>
        </Pressable>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flex}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          {error ? <Text style={styles.errorBanner}>{error}</Text> : null}

          {editing ? (
            /* ── Edit mode ── */
            <>
              <Input label="Title *" value={title} onChangeText={setTitle} />
              <Input label="Description" value={description} onChangeText={setDescription} multiline numberOfLines={3} style={styles.multiline} />
              <Input label="Date & Time (YYYY-MM-DD HH:MM)" value={dateTime} onChangeText={setDateTime} placeholder="e.g. 2026-09-30 09:00" />
              <Input label="Deadline (YYYY-MM-DD HH:MM)" value={deadline} onChangeText={setDeadline} placeholder="e.g. 2026-09-30 17:00" />

              <Text style={styles.fieldLabel}>Priority</Text>
              <View style={styles.priorityRow}>
                {PRIORITY_OPTIONS.map(opt => (
                  <Pressable
                    key={opt.value}
                    onPress={() => setPriority(opt.value)}
                    style={[
                      styles.priorityBtn,
                      priority === opt.value && { borderColor: opt.color, backgroundColor: opt.color + '18' },
                    ]}>
                    <View style={[styles.priorityDot, { backgroundColor: opt.color }]} />
                    <Text style={[styles.priorityLabel, priority === opt.value && { color: opt.color, fontWeight: fontWeight.bold }]}>
                      {opt.label}
                    </Text>
                  </Pressable>
                ))}
              </View>

              <Button label="Save Changes" onPress={handleSave} loading={saving} style={styles.saveBtn} />
            </>
          ) : (
            /* ── View mode ── */
            <>
              {/* Status badge */}
              <View style={[styles.statusBadge, task.completed ? styles.statusDone : styles.statusPending]}>
                <Text style={[styles.statusText, task.completed ? styles.statusTextDone : styles.statusTextPending]}>
                  {task.completed ? '✓ Completed' : '○ Pending'}
                </Text>
              </View>

              {/* Title */}
              <Text style={[styles.title, task.completed && styles.titleDone]}>
                {task.title}
              </Text>

              {/* Priority */}
              <View style={styles.row}>
                <PriorityBadge priority={task.priority} />
              </View>

              {/* Meta rows */}
              {task.description ? (
                <View style={styles.metaCard}>
                  <Text style={styles.metaLabel}>Description</Text>
                  <Text style={styles.metaValue}>{task.description}</Text>
                </View>
              ) : null}

              <View style={styles.metaCard}>
                <Text style={styles.metaLabel}>Date & Time</Text>
                <Text style={styles.metaValue}>{formatDisplayDateTime(task.dateTime)}</Text>
              </View>

              <View style={styles.metaCard}>
                <Text style={styles.metaLabel}>Deadline</Text>
                <Text style={styles.metaValue}>{formatDisplayDateTime(task.deadline)}</Text>
              </View>

              <View style={styles.metaCard}>
                <Text style={styles.metaLabel}>Created</Text>
                <Text style={styles.metaValue}>{formatDisplayDateTime(task.createdAt)}</Text>
              </View>

              {/* Actions */}
              <Button
                label={task.completed ? 'Mark Incomplete' : 'Mark Complete'}
                onPress={handleToggle}
                variant={task.completed ? 'outline' : 'primary'}
                style={styles.actionBtn}
              />

              <Button
                label={deleting ? 'Deleting…' : 'Delete Task'}
                onPress={handleDelete}
                variant="danger"
                disabled={deleting}
                style={styles.actionBtn}
              />
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default TaskDetailScreen;
