import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { spacing, radius, fontSize, fontWeight } from '../theme/theme';

interface FilterPillProps {
  label: string;
  active: boolean;
  onPress: () => void;
}

const FilterPill: React.FC<FilterPillProps> = ({ label, active, onPress }) => {
  const { palette } = useTheme();

  const styles = StyleSheet.create({
    pill: {
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      borderRadius: radius.full,
      backgroundColor: palette.subtleSurface,
      borderWidth: 1,
      borderColor: palette.border,
      marginRight: spacing.sm,
    },
    active: {
      backgroundColor: palette.primary,
      borderColor: palette.primary,
    },
    label: {
      fontSize: fontSize.sm,
      fontWeight: fontWeight.medium,
      color: palette.textSecondary,
    },
    activeLabel: {
      color: palette.white,
    },
  });

  return (
    <Pressable
      onPress={onPress}
      style={[styles.pill, active && styles.active]}>
      <Text style={[styles.label, active && styles.activeLabel]}>{label}</Text>
    </Pressable>
  );
};

export default FilterPill;
