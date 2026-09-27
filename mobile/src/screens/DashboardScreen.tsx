import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  ScrollView,
  TextInput,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import MaterialIcons from '@react-native-vector-icons/material-icons';
import { taskApi } from '../api/taskApi';
import { Task } from '../types/task';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import TaskCard from '../components/TaskCard';
import FilterPill from '../components/FilterPill';
import ProgressCard from '../components/ProgressCard';
import EmptyState from '../components/EmptyState';
import { spacing, fontSize, fontWeight, radius } from '../theme/theme';
import { RootStackParamList } from '../navigation/RootNavigator';

type Nav = NativeStackNavigationProp<RootStackParamList>;
type Filter = 'all' | 'pending' | 'completed' | 'urgent';

const FILTERS: { key: Filter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'pending', label: 'Pending' },
  { key: 'completed', label: 'Completed' },
  { key: 'urgent', label: 'Urgent' },
];

const getGreeting = (): string => {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
};

const todayStr = (): string =>
  new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

const DashboardScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const { user } = useAuth();
  const { palette } = useTheme();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<Filter>('all');
  const [error, setError] = useState('');

  const fetchTasks = useCallback(async () => {
    try {
      setError('');
      const res = await taskApi.getTasks();
      setTasks(res.data.data);
    } catch {
      setError('Failed to load tasks. Check your connection.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // Reload tasks every time this screen comes into focus
  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      fetchTasks();
    }, [fetchTasks]),
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchTasks();
  };

  const handleToggle = async (task: Task) => {
    // Optimistic update
    setTasks(prev =>
      prev.map(t => (t._id === task._id ? { ...t, completed: !t.completed } : t)),
    );
    try {
      await taskApi.toggleTask(task._id);
    } catch {
      // Revert on failure
      setTasks(prev =>
        prev.map(t => (t._id === task._id ? { ...t, completed: task.completed } : t)),
      );
    }
  };

  // Filter + search
  const filtered = tasks.filter(t => {
    const matchSearch =
      !search ||
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      (t.description ?? '').toLowerCase().includes(search.toLowerCase());
    const matchFilter =
      filter === 'all' ||
      (filter === 'completed' && t.completed) ||
      (filter === 'pending' && !t.completed) ||
      (filter === 'urgent' && t.priority === 'high' && !t.completed);
    return matchSearch && matchFilter;
  });

  const completed = tasks.filter(t => t.completed).length;
  const initials = user?.name
    ? user.name
        .split(' ')
        .map(w => w[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'U';

  const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: palette.background },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      paddingHorizontal: spacing.base,
      paddingTop: spacing.sm,
      paddingBottom: spacing.base,
    },
    headerLeft: { flex: 1 },
    dateStr: {
      fontSize: fontSize.xs,
      color: palette.textTertiary,
      marginBottom: 2,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    greeting: {
      fontSize: fontSize.lg,
      fontWeight: fontWeight.bold,
      color: palette.textPrimary,
    },
    greetingName: { color: palette.primary },
    avatar: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: palette.primary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    avatarText: {
      color: palette.white,
      fontWeight: fontWeight.bold,
      fontSize: fontSize.sm,
    },
    searchRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginHorizontal: spacing.base,
      backgroundColor: palette.surface,
      borderRadius: radius.md,
      borderWidth: 1,
      borderColor: palette.border,
      paddingHorizontal: spacing.md,
      marginBottom: spacing.md,
    },
    searchInput: {
      flex: 1,
      height: 44,
      fontSize: fontSize.base,
      color: palette.textPrimary,
    },
    clearBtn: { padding: 4 },
    clearText: { color: palette.textTertiary, fontSize: 14 },
    filterRow: {
      paddingHorizontal: spacing.base,
      paddingBottom: spacing.md,
    },
    sectionTitle: {
      fontSize: fontSize.md,
      fontWeight: fontWeight.bold,
      color: palette.textPrimary,
      paddingHorizontal: spacing.base,
      marginBottom: spacing.sm,
    },
    taskCount: { color: palette.textTertiary, fontWeight: fontWeight.regular },
    spinner: { marginTop: spacing.xl },
    errorText: {
      color: palette.error,
      textAlign: 'center',
      marginTop: spacing.md,
      paddingHorizontal: spacing.base,
    },
    listContent: { paddingBottom: 120 },
    emptyContainer: { flexGrow: 1, paddingBottom: 120 },
    fab: {
      position: 'absolute',
      bottom: 80,
      right: spacing.lg,
      width: 60,
      height: 60,
      borderRadius: 30,
      backgroundColor: palette.primary,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: palette.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.4,
      shadowRadius: 8,
      elevation: 8,
    },
    fabPressed: { opacity: 0.85 },
    fabIcon: { color: palette.white, fontSize: 32, lineHeight: 36 },
    bottomNav: {
      flexDirection: 'row',
      backgroundColor: palette.surface,
      borderTopWidth: 1,
      borderTopColor: palette.border,
      paddingTop: spacing.sm,
      paddingBottom: spacing.base,
    },
    navItem: { flex: 1, alignItems: 'center' },
    navIcon: { fontSize: 22, marginBottom: 2 },
    navIconActive: { fontSize: 22, marginBottom: 2 },
    navLabel: { fontSize: fontSize.xs, color: palette.textTertiary },
    navLabelActive: { fontSize: fontSize.xs, color: palette.primary, fontWeight: fontWeight.semibold },
  });

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <FlatList
        data={filtered}
        keyExtractor={item => item._id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={palette.primary} />
        }
        ListHeaderComponent={
          <>
            {/* Header */}
            <View style={styles.header}>
              <View style={styles.headerLeft}>
                <Text style={styles.dateStr}>{todayStr()}</Text>
                <Text style={styles.greeting}>
                  {getGreeting()},{' '}
                  <Text style={styles.greetingName}>{user?.name?.split(' ')[0] ?? 'there'}</Text>
                </Text>
              </View>
              <Pressable
                onPress={() => navigation.navigate('Profile')}
                style={styles.avatar}>
                <Text style={styles.avatarText}>{initials}</Text>
              </Pressable>
            </View>

            {/* Progress card */}
            <ProgressCard completed={completed} total={tasks.length} />

            {/* Search */}
            <View style={styles.searchRow}>
              <TextInput
                style={styles.searchInput}
                placeholder="Search tasks…"
                placeholderTextColor={palette.textTertiary}
                value={search}
                onChangeText={setSearch}
              />
              {search ? (
                <Pressable onPress={() => setSearch('')} style={styles.clearBtn}>
                  <Text style={styles.clearText}>✕</Text>
                </Pressable>
              ) : null}
            </View>

            {/* Filters — use ScrollView to avoid nested VirtualizedList warning */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.filterRow}>
              {FILTERS.map(f => (
                <FilterPill
                  key={f.key}
                  label={f.label}
                  active={filter === f.key}
                  onPress={() => setFilter(f.key)}
                />
              ))}
            </ScrollView>

            <Text style={styles.sectionTitle}>
              My Tasks{' '}
              <Text style={styles.taskCount}>({filtered.length})</Text>
            </Text>

            {loading && (
              <ActivityIndicator
                color={palette.primary}
                style={styles.spinner}
              />
            )}

            {error ? <Text style={styles.errorText}>{error}</Text> : null}
          </>
        }
        renderItem={({ item }) => (
          <TaskCard
            task={item}
            onPress={() => navigation.navigate('TaskDetail', { taskId: item._id })}
            onToggle={() => handleToggle(item)}
          />
        )}
        ListEmptyComponent={
          !loading ? (
            <EmptyState
              emoji="🎯"
              title="No tasks here"
              subtitle={
                filter !== 'all'
                  ? 'Try a different filter'
                  : 'Tap + to add your first task'
              }
            />
          ) : <View />
        }
        contentContainerStyle={filtered.length === 0 && !loading ? styles.emptyContainer : styles.listContent}
      />

      {/* FAB */}
      <Pressable
        onPress={() => navigation.navigate('AddTask')}
        style={({ pressed }) => [styles.fab, pressed && styles.fabPressed]}>
        <Text style={styles.fabIcon}>+</Text>
      </Pressable>

      {/* Bottom nav */}
      <View style={styles.bottomNav}>
        <Pressable style={styles.navItem}>
          <MaterialIcons name="home" size={22} color={palette.primary} style={styles.navIconActive} />
          <Text style={styles.navLabelActive}>Home</Text>
        </Pressable>
        <Pressable
          onPress={() => navigation.navigate('AddTask')}
          style={styles.navItem}>
          <MaterialIcons name="add-circle-outline" size={22} color={palette.textTertiary} style={styles.navIcon} />
          <Text style={styles.navLabel}>Add Task</Text>
        </Pressable>
        <Pressable
          onPress={() => navigation.navigate('Profile')}
          style={styles.navItem}>
          <MaterialIcons name="person" size={22} color={palette.textTertiary} style={styles.navIcon} />
          <Text style={styles.navLabel}>Profile</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

export default DashboardScreen;
