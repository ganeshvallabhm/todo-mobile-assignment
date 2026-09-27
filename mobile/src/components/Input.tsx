import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TextInputProps,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { spacing, radius, fontSize, fontWeight } from '../theme/theme';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  rightIcon?: React.ReactNode;
}

const Input: React.FC<InputProps> = ({ label, error, rightIcon, style, multiline, ...rest }) => {
  const { palette } = useTheme();
  const [focused, setFocused] = useState(false);

  const styles = StyleSheet.create({
    wrapper: { marginBottom: spacing.base },
    label: {
      fontSize: fontSize.sm,
      fontWeight: fontWeight.semibold,
      color: palette.textSecondary,
      marginBottom: spacing.xs,
    },
    inputRow: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: palette.subtleSurface,
      borderRadius: radius.md,
      borderWidth: 1.5,
      borderColor: palette.border,
      paddingHorizontal: spacing.md,
    },
    inputRowMultiline: {
      alignItems: 'flex-start',
      paddingVertical: spacing.sm,
    },
    focused: {
      borderColor: palette.primary,
      backgroundColor: palette.surface,
    },
    hasError: {
      borderColor: palette.error,
    },
    input: {
      flex: 1,
      height: 52,
      fontSize: fontSize.base,
      color: palette.textPrimary,
    },
    rightIcon: { paddingLeft: spacing.sm },
    error: {
      fontSize: fontSize.xs,
      color: palette.error,
      marginTop: spacing.xs,
    },
  });

  return (
    <View style={styles.wrapper}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View
        style={[
          styles.inputRow,
          multiline && styles.inputRowMultiline,
          focused && styles.focused,
          error ? styles.hasError : null,
        ]}>
        <TextInput
          style={[styles.input, style]}
          placeholderTextColor={palette.textTertiary}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          multiline={multiline}
          {...rest}
        />
        {rightIcon && <View style={styles.rightIcon}>{rightIcon}</View>}
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
};

export default Input;
