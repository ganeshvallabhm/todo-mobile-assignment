
import React from 'react';
import {
  ActivityIndicator,
  View,
  StyleSheet,
} from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import DashboardScreen from '../screens/DashboardScreen';
import AddTaskScreen from '../screens/AddTaskScreen';
import TaskDetailScreen from '../screens/TaskDetailScreen';
import ProfileScreen from '../screens/ProfileScreen';

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Dashboard: undefined;
  AddTask: undefined;
  TaskDetail: { taskId: string };
  Profile: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootNavigator: React.FC = () => {
  const { user, loading } = useAuth();
  const { palette } = useTheme();

  const styles = StyleSheet.create({
    loading: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: palette.background,
    },
  });

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator
          color={palette.primary}
          size="large"
        />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        {user ? (
          <>
            <Stack.Screen
              name="Dashboard"
              component={DashboardScreen}
            />

            <Stack.Screen
              name="AddTask"
              component={AddTaskScreen}
            />

            <Stack.Screen
              name="TaskDetail"
              component={TaskDetailScreen}
            />

            <Stack.Screen
              name="Profile"
              component={ProfileScreen}
            />
          </>
        ) : (
          <>
            <Stack.Screen
              name="Login"
              component={LoginScreen}
            />

            <Stack.Screen
              name="Register"
              component={RegisterScreen}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;