import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';

import { colors } from '@/core/theme/colors';

type RuneTone = 'accent' | 'dark' | 'ember' | 'gold' | 'mint' | 'sky';

type RuneIconProps = {
  label: string;
  size?: 'md' | 'lg' | 'sm';
  style?: StyleProp<ViewStyle>;
  tone?: RuneTone;
};

export function RuneIcon({ label, size = 'md', style, tone = 'gold' }: RuneIconProps) {
  return (
    <View style={[styles.icon, styles[size], styles[tone], style]}>
      <View style={styles.slash} />
      <Text style={[styles.text, size === 'lg' ? styles.largeText : null]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  icon: {
    alignItems: 'center',
    borderRadius: 8,
    justifyContent: 'center',
    overflow: 'hidden',
    position: 'relative',
  },
  sm: {
    height: 32,
    width: 32,
  },
  md: {
    height: 48,
    width: 48,
  },
  lg: {
    height: 72,
    width: 72,
  },
  accent: {
    backgroundColor: colors.accent,
  },
  dark: {
    backgroundColor: colors.panelDeep,
  },
  ember: {
    backgroundColor: colors.ember,
  },
  gold: {
    backgroundColor: colors.gold,
  },
  mint: {
    backgroundColor: colors.mint,
  },
  sky: {
    backgroundColor: colors.sky,
  },
  slash: {
    backgroundColor: colors.surface,
    height: 96,
    opacity: 0.22,
    position: 'absolute',
    right: -18,
    transform: [{ rotate: '24deg' }],
    width: 20,
  },
  text: {
    color: colors.ink,
    fontSize: 16,
    fontWeight: '900',
    zIndex: 1,
  },
  largeText: {
    fontSize: 24,
  },
});
