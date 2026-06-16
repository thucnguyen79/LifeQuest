import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';

import { colors } from '@/core/theme/colors';
import { spacing } from '@/core/theme/spacing';

type GameBadgeTone = 'accent' | 'danger' | 'gold' | 'muted';

type GameBadgeProps = {
  label: string;
  tone?: GameBadgeTone;
  style?: StyleProp<ViewStyle>;
};

export function GameBadge({ label, tone = 'gold', style }: GameBadgeProps) {
  return (
    <View style={[styles.badge, styles[tone], style]}>
      <Text style={[styles.text, tone === 'danger' ? styles.dangerText : null]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignItems: 'center',
    borderRadius: 8,
    justifyContent: 'center',
    minHeight: 28,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  accent: {
    backgroundColor: colors.skySoft,
  },
  danger: {
    backgroundColor: colors.emberSoft,
  },
  gold: {
    backgroundColor: colors.goldSoft,
  },
  muted: {
    backgroundColor: colors.border,
  },
  text: {
    color: colors.ink,
    fontSize: 12,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  dangerText: {
    color: colors.danger,
  },
});
