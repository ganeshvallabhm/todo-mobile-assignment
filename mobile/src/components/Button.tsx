import React from 'react';
import {
  Pressable,
  Text,
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { spacing, radius, fontSize, fontWeight } from '../theme/theme';

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'outline' | 'ghost' | 'danger';
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
}

const Button: React.FC<ButtonProps> = ({
  label,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  style,
}) => {
  const { palette } = useTheme();
  const isDisabled = disabled || loading;

  const styles = StyleSheet.create({
    base: {
      height: 52,
      borderRadius: radius.md,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: spacing.xl,
    },
    primary: {
      backgroundColor: palette.primary,
    },
    outline: {
      backgroundColor: 'transparent',
      borderWidth: 1.5,
      borderColor: palette.primary,
    },
    ghost: {
      backgroundColor: 'transparent',
    },
    danger: {
      backgroundColor: palette.error,
    },
    disabled: {
      opacity: 0.5,
    },
    pressed: {
      opacity: 0.85,
    },
    label: {
      fontSize: fontSize.base,
      fontWeight: fontWeight.semibold,
    },
    primaryLabel: { color: palette.white },
    outlineLabel: { color: palette.primary },
    ghostLabel: { color: palette.primary },
    dangerLabel: { color: palette.white },
  });

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.base,
        styles[variant],
        isDisabled && styles.disabled,
        pressed && !isDisabled && styles.pressed,
        style,
      ]}>
      {loading ? (
        <ActivityIndicator
          color={variant === 'primary' ? palette.white : palette.primary}
          size="small"
        />
      ) : (
        <Text style={[styles.label, styles[`${variant}Label`] as TextStyle]}>
          {label}
        </Text>
      )}
    </Pressable>
  );
};

export default Button;
