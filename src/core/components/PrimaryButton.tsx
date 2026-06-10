import { Pressable, StyleSheet, Text } from 'react-native';

import { colors } from '@/core/theme/colors';

type PrimaryButtonProps = {
  label: string;
  onPress: () => void;
};

export function PrimaryButton({ label, onPress }: PrimaryButtonProps) {
  return (
    <Pressable onPress={onPress} style={styles.button}>
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    backgroundColor: colors.ink,
    borderRadius: 8,
    justifyContent: 'center',
    minHeight: 54,
  },
  label: {
    color: colors.surface,
    fontSize: 16,
    fontWeight: '900',
  },
});
