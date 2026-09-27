import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  Switch,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { taskApi } from '../api/taskApi';
import { Task } from '../types/task';
import Button from '../components/Button';
import { spacing, fontSize, fontWeight, radius, shadow } from '../theme/theme';

const ProfileScreen: React.FC = () => {
  const navigation = useNavigation();
  const { user, logout } = useAuth();
  const { palette, isDark, toggleTheme } = useTheme();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [notifications, setNotifications] = useState(true);

  useEffect(() => {
    taskApi
      .getTasks()
      .then(res => setTasks(res.data.data))
      .catch(() => {});
  }, []);

  const completed = tasks.filter(t => t.completed).length;
  const active = tasks.filter(t => !t.completed).length;

  const initials = user?.name
    ? user.name
        .split(' ')
        .map(w => w[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'U';

  const handleLogout = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: async () => {
          await logout();
          // RootNavigator will automatically show Login when user becomes null
        },
      },
    ]);
  };

  const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: palette.background },
    topBar: {
      flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
      paddingHorizontal: spacing.base, paddingVertical: spacing.md,
      backgroundColor: palette.surface, borderBottomWidth: 1, borderBottomColor: palette.border,
    },
    backBtn: { width: 64 },
    backText: { color: palette.primary, fontSize: fontSize.base, fontWeight: fontWeight.semibold },
    topTitle: { fontSize: fontSize.md, fontWeight: fontWeight.bold, color: palette.textPrimary },
    scroll: { padding: spacing.base, paddingBottom: spacing.xxxl },
    profileCard: {
      alignItems: 'center', backgroundColor: palette.surface,
      borderRadius: radius.lg, borderWidth: 1, borderColor: palette.border,
      padding: spacing.xl, marginBottom: spacing.base, ...shadow.sm,
    },
    avatarLg: {
      width: 80, height: 80, borderRadius: 40,
      backgroundColor: palette.primary,
      alignItems: 'center', justifyContent: 'center',
      marginBottom: spacing.md,
    },
    avatarText: { color: palette.white, fontSize: fontSize.xl, fontWeight: fontWeight.bold },
    name: { fontSize: fontSize.lg, fontWeight: fontWeight.bold, color: palette.textPrimary, marginBottom: 4 },
    email: { fontSize: fontSize.base, color: palette.textSecondary },
    statsRow: { flexDirection: 'row', marginBottom: spacing.xl },
    statCard: {
      flex: 1, alignItems: 'center',
      backgroundColor: palette.surface, borderRadius: radius.md,
      borderWidth: 1, borderColor: palette.border, padding: spacing.md, ...shadow.sm,
    },
    statMiddle: { marginHorizontal: spacing.sm },
    statNumber: { fontSize: fontSize.xxl, fontWeight: fontWeight.extrabold, color: palette.textPrimary },
    statLabel: { fontSize: fontSize.xs, color: palette.textTertiary, marginTop: 2 },
    sectionTitle: { fontSize: fontSize.base, fontWeight: fontWeight.bold, color: palette.textPrimary, marginBottom: spacing.sm },
    settingsCard: {
      backgroundColor: palette.surface, borderRadius: radius.lg,
      borderWidth: 1, borderColor: palette.border, marginBottom: spacing.xl, ...shadow.sm,
    },
    settingRow: {
      flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
      padding: spacing.base,
    },
    settingLabel: { fontSize: fontSize.base, fontWeight: fontWeight.medium, color: palette.textPrimary },
    settingHint: { fontSize: fontSize.xs, color: palette.textTertiary, marginTop: 2 },
    divider: { height: 1, backgroundColor: palette.border, marginHorizontal: spacing.base },
    logoutBtn: { marginBottom: spacing.base },
    version: { textAlign: 'center', fontSize: fontSize.xs, color: palette.textTertiary },
  });

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* Top bar */}
      <View style={styles.topBar}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>‹ Back</Text>
        </Pressable>
        <Text style={styles.topTitle}>Profile</Text>
        <View style={{ width: 64 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Avatar + user info */}
        <View style={styles.profileCard}>
          <View style={styles.avatarLg}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <Text style={styles.name}>{user?.name ?? '—'}</Text>
          <Text style={styles.email}>{user?.email ?? '—'}</Text>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{completed}</Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>
          <View style={[styles.statCard, styles.statMiddle]}>
            <Text style={[styles.statNumber, { color: palette.primary }]}>
              {active}
            </Text>
            <Text style={styles.statLabel}>Active</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{tasks.length}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
        </View>

        {/* Settings */}
        <Text style={styles.sectionTitle}>Settings</Text>

        <View style={styles.settingsCard}>
          <View style={styles.settingRow}>
            <View>
              <Text style={styles.settingLabel}>Notifications</Text>
              <Text style={styles.settingHint}>Task reminders and alerts</Text>
            </View>
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ true: palette.primary, false: palette.border }}
              thumbColor={palette.white}
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.settingRow}>
            <View>
              <Text style={styles.settingLabel}>Dark Mode</Text>
              <Text style={styles.settingHint}>Local UI preference</Text>
            </View>
            <Switch
              value={isDark}
              onValueChange={() => toggleTheme()}
              trackColor={{ true: palette.primary, false: palette.border }}
              thumbColor={palette.white}
            />
          </View>
        </View>

        {/* Sign out */}
        <Button
          label="Sign Out"
          onPress={handleLogout}
          variant="outline"
          style={styles.logoutBtn}
        />

        <Text style={styles.version}>TaskFlow v1.0 · Internship Assignment</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileScreen;
