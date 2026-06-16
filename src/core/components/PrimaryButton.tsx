import { Pressable, StyleSheet, Text } from 'react-native';

import { colors } from '@/core/theme/colors';

type PrimaryButtonProps = {
  disabled?: boolean;
  label: string;
  onPress: () => void;
};

export function PrimaryButton({ disabled = false, label, onPress }: PrimaryButtonProps) {
  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      style={[styles.button, disabled ? styles.buttonDisabled : null]}
    >
      <Text style={[styles.label, disabled ? styles.labelDisabled : null]}>{label}</Text>
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
  buttonDisabled: {
    backgroundColor: colors.border,
  },
  label: {
    color: colors.surface,
    fontSize: 16,
    fontWeight: '900',
  },
  labelDisabled: {
    color: colors.muted,
  },
});
