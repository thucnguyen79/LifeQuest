import { StyleSheet, Text, View } from 'react-native';

import { colors } from '@/core/theme/colors';
import { spacing } from '@/core/theme/spacing';

type ProgressBarProps = {
  current: number;
  max: number;
  label: string;
};

export function ProgressBar({ current, max, label }: ProgressBarProps) {
  const progress = Math.min(Math.max(current / max, 0), 1);

  return (
    <View style={styles.wrapper}>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${progress * 100}%` }]} />
      </View>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: spacing.xs,
  },
  track: {
    backgroundColor: colors.border,
    borderRadius: 8,
    height: 12,
    overflow: 'hidden',
  },
  fill: {
    backgroundColor: colors.gold,
    borderRadius: 8,
    height: '100%',
  },
  label: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: '700',
  },
});
