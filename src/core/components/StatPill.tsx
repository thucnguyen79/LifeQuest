import { StyleSheet, Text, View } from 'react-native';

import { colors } from '@/core/theme/colors';
import { spacing } from '@/core/theme/spacing';

type StatPillProps = {
  label: string;
  value: number;
};

export function StatPill({ label, value }: StatPillProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: colors.panel,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    flexBasis: '30%',
    flexGrow: 1,
    justifyContent: 'center',
    minHeight: 72,
    padding: spacing.sm,
  },
  label: {
    color: colors.accent,
    fontSize: 12,
    fontWeight: '900',
  },
  value: {
    color: colors.ink,
    fontSize: 22,
    fontWeight: '900',
    marginTop: 2,
  },
});
