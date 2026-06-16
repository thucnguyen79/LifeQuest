import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { colors } from '@/core/theme/colors';
import { spacing } from '@/core/theme/spacing';

type GamePanelTone = 'dark' | 'parchment' | 'surface';

type GamePanelProps = {
  children: React.ReactNode;
  accent?: boolean;
  style?: StyleProp<ViewStyle>;
  tone?: GamePanelTone;
};

export function GamePanel({ children, accent = false, style, tone = 'surface' }: GamePanelProps) {
  return (
    <View style={[styles.panel, styles[tone], accent ? styles.accent : null, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    padding: spacing.lg,
  },
  accent: {
    borderColor: colors.gold,
    borderLeftWidth: 5,
  },
  dark: {
    backgroundColor: colors.panelDeep,
    borderColor: colors.accent,
  },
  parchment: {
    backgroundColor: colors.panel,
  },
  surface: {
    backgroundColor: colors.surface,
  },
});
