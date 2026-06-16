import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';
import Svg, { Circle, Defs, G, Path, Rect, Stop, LinearGradient } from 'react-native-svg';

import { colors } from '@/core/theme/colors';

export type GameIconName =
  | 'bell'
  | 'book'
  | 'chest'
  | 'coin'
  | 'compass'
  | 'focus'
  | 'flame'
  | 'gear'
  | 'habit'
  | 'moon'
  | 'petDragon'
  | 'privacy'
  | 'reset'
  | 'scroll'
  | 'shield'
  | 'sound'
  | 'spark';

type GameIconProps = {
  name: GameIconName;
  size?: number;
  style?: StyleProp<ViewStyle>;
  tone?: 'dark' | 'gold' | 'mint' | 'plain' | 'sky';
};

type IconPalette = {
  accent: string;
  dark: string;
  light: string;
  mid: string;
  soft: string;
};

const palettes: Record<NonNullable<GameIconProps['tone']>, IconPalette> = {
  dark: {
    accent: colors.gold,
    dark: colors.ink,
    light: colors.mint,
    mid: colors.accent,
    soft: '#17362E',
  },
  gold: {
    accent: colors.gold,
    dark: colors.ink,
    light: colors.goldSoft,
    mid: colors.ember,
    soft: '#FFF0BF',
  },
  mint: {
    accent: colors.mint,
    dark: colors.ink,
    light: '#D9FFF1',
    mid: colors.accent,
    soft: '#C9F3E4',
  },
  plain: {
    accent: colors.gold,
    dark: colors.ink,
    light: colors.surface,
    mid: colors.accent,
    soft: colors.panel,
  },
  sky: {
    accent: colors.sky,
    dark: colors.ink,
    light: colors.skySoft,
    mid: colors.accent,
    soft: '#C6EAF4',
  },
};

export function GameIcon({ name, size = 48, style, tone = 'gold' }: GameIconProps) {
  const Icon = iconMap[name];
  const palette = palettes[tone];

  return (
    <View style={[styles.frame, { height: size, width: size }, style]}>
      <Svg height={size} viewBox="0 0 64 64" width={size}>
        <Defs>
          <LinearGradient id="tileShade" x1="0" x2="1" y1="0" y2="1">
            <Stop offset="0" stopColor={palette.light} stopOpacity="1" />
            <Stop offset="1" stopColor={palette.accent} stopOpacity="1" />
          </LinearGradient>
        </Defs>
        <Icon palette={palette} />
      </Svg>
    </View>
  );
}

type IconProps = {
  palette: IconPalette;
};

function BaseTile({ palette }: IconProps) {
  return (
    <>
      <Rect fill={palette.soft} height="56" rx="10" width="56" x="4" y="4" />
      <Path d="M49 5h11v45L38 60H17z" fill={palette.dark} opacity="0.1" />
    </>
  );
}

function BellIcon({ palette }: IconProps) {
  return (
    <>
      <BaseTile palette={palette} />
      <Path d="M20 37h24l-3-5v-9c0-6-4-10-9-10s-9 4-9 10v9z" fill={palette.dark} />
      <Path d="M28 41h8c0 3-2 5-4 5s-4-2-4-5z" fill={palette.mid} />
      <Path d="M32 10v5" stroke={palette.accent} strokeLinecap="round" strokeWidth="5" />
    </>
  );
}

function BookIcon({ palette }: IconProps) {
  return (
    <>
      <BaseTile palette={palette} />
      <Path d="M16 17c7-3 12-1 16 3 4-4 9-6 16-3v30c-7-3-12-1-16 3-4-4-9-6-16-3z" fill={palette.light} />
      <Path d="M32 20v30" stroke={palette.dark} strokeLinecap="round" strokeWidth="4" />
      <Path d="M21 24h6M37 24h6M21 31h6M37 31h6" stroke={palette.mid} strokeLinecap="round" strokeWidth="3" />
    </>
  );
}

function ChestIcon({ palette }: IconProps) {
  return (
    <>
      <BaseTile palette={palette} />
      <Path d="M14 28h36v18a5 5 0 0 1-5 5H19a5 5 0 0 1-5-5z" fill={palette.mid} />
      <Path d="M18 18h28a5 5 0 0 1 5 5v7H13v-7a5 5 0 0 1 5-5z" fill={palette.accent} />
      <Path d="M31 18h5v33h-5z" fill={palette.light} opacity="0.85" />
      <Rect fill={palette.dark} height="13" rx="3" width="14" x="25" y="31" />
      <Circle cx="32" cy="37" fill={palette.accent} r="2.4" />
    </>
  );
}

function CoinIcon({ palette }: IconProps) {
  return (
    <>
      <BaseTile palette={palette} />
      <Circle cx="32" cy="32" fill={palette.accent} r="18" />
      <Circle cx="32" cy="32" fill="none" r="12" stroke={palette.light} strokeWidth="4" />
      <Path d="M32 22v20M25 32h14" stroke={palette.dark} strokeLinecap="round" strokeWidth="4" />
    </>
  );
}

function CompassIcon({ palette }: IconProps) {
  return (
    <>
      <BaseTile palette={palette} />
      <Circle cx="32" cy="32" fill={palette.light} r="18" stroke={palette.dark} strokeWidth="4" />
      <Path d="M39 18 34 35 20 44l5-17z" fill={palette.accent} />
      <Path d="M25 27 34 35 39 18z" fill={palette.mid} />
      <Circle cx="32" cy="32" fill={palette.dark} r="3" />
    </>
  );
}

function FocusIcon({ palette }: IconProps) {
  return (
    <>
      <BaseTile palette={palette} />
      <Circle cx="32" cy="32" fill="none" r="18" stroke={palette.dark} strokeWidth="5" />
      <Circle cx="32" cy="32" fill="none" r="9" stroke={palette.mid} strokeWidth="5" />
      <Circle cx="32" cy="32" fill={palette.accent} r="4" />
      <Path d="M32 10v8M32 46v8M10 32h8M46 32h8" stroke={palette.dark} strokeLinecap="round" strokeWidth="4" />
    </>
  );
}

function FlameIcon({ palette }: IconProps) {
  return (
    <>
      <BaseTile palette={palette} />
      <Path d="M34 12c5 7 13 13 13 24 0 9-6 16-15 16s-15-7-15-16c0-7 4-13 10-18-1 7 3 10 7 12 3-5 4-10 0-18z" fill={palette.mid} />
      <Path d="M32 31c4 4 7 7 7 12 0 5-3 8-7 8s-7-3-7-8c0-4 3-8 7-12z" fill={palette.accent} />
    </>
  );
}

function GearIcon({ palette }: IconProps) {
  return (
    <>
      <BaseTile palette={palette} />
      <G fill={palette.dark}>
        <Path d="M29 11h6l2 7 7-2 4 6-5 5 5 5-4 6-7-2-2 7h-6l-2-7-7 2-4-6 5-5-5-5 4-6 7 2z" />
      </G>
      <Circle cx="32" cy="32" fill={palette.light} r="9" />
      <Circle cx="32" cy="32" fill={palette.mid} r="4" />
    </>
  );
}

function HabitIcon({ palette }: IconProps) {
  return (
    <>
      <BaseTile palette={palette} />
      <Path d="M18 16h28v33H18z" fill={palette.light} />
      <Path d="M24 16v-4M40 16v-4" stroke={palette.dark} strokeLinecap="round" strokeWidth="5" />
      <Path d="M24 28h16M24 36h11" stroke={palette.mid} strokeLinecap="round" strokeWidth="4" />
      <Path d="m23 45 5 5 12-14" fill="none" stroke={palette.accent} strokeLinecap="round" strokeLinejoin="round" strokeWidth="5" />
    </>
  );
}

function MoonIcon({ palette }: IconProps) {
  return (
    <>
      <BaseTile palette={palette} />
      <Path d="M41 43c-13 1-22-8-20-21 2 5 7 9 14 9 6 0 10-3 13-7 2 8-1 16-7 19z" fill={palette.light} stroke={palette.dark} strokeWidth="4" />
      <Circle cx="44" cy="19" fill={palette.accent} r="3" />
      <Circle cx="20" cy="42" fill={palette.mid} r="2.5" />
    </>
  );
}

function PetDragonIcon({ palette }: IconProps) {
  return (
    <>
      <BaseTile palette={palette} />
      <Circle cx="32" cy="32" fill={palette.dark} opacity="0.18" r="22" />
      <Path d="M14 33 26 25v18zM50 33 38 25v18z" fill={colors.sky} opacity="0.95" />
      <Rect fill={palette.light} height="30" rx="13" stroke={colors.surface} strokeWidth="4" width="34" x="15" y="22" />
      <Path d="M24 20c0-6 7-8 7-2v7h-7zM33 18c0-6 7-4 7 1v7h-7z" fill={palette.accent} />
      <Circle cx="27" cy="34" fill={palette.dark} r="3.2" />
      <Circle cx="39" cy="34" fill={palette.dark} r="3.2" />
      <Path d="M29 44h10" stroke={colors.ember} strokeLinecap="round" strokeWidth="4" />
    </>
  );
}

function PrivacyIcon({ palette }: IconProps) {
  return (
    <>
      <BaseTile palette={palette} />
      <Path d="M32 12 48 19v11c0 11-6 19-16 23-10-4-16-12-16-23V19z" fill={palette.dark} />
      <Path d="M25 32h14v13H25z" fill={palette.light} />
      <Path d="M28 32v-5c0-3 2-6 4-6s4 3 4 6v5" fill="none" stroke={palette.accent} strokeLinecap="round" strokeWidth="4" />
    </>
  );
}

function ResetIcon({ palette }: IconProps) {
  return (
    <>
      <BaseTile palette={palette} />
      <Path d="M21 24a14 14 0 1 1-1 16" fill="none" stroke={palette.dark} strokeLinecap="round" strokeWidth="5" />
      <Path d="M20 15v12h12" fill="none" stroke={palette.mid} strokeLinecap="round" strokeLinejoin="round" strokeWidth="5" />
      <Path d="M27 37h10" stroke={colors.danger} strokeLinecap="round" strokeWidth="5" />
    </>
  );
}

function ScrollIcon({ palette }: IconProps) {
  return (
    <>
      <BaseTile palette={palette} />
      <Path d="M18 17h26c3 0 5 2 5 5v23H20c-3 0-5-2-5-5V20c0-2 1-3 3-3z" fill={palette.light} />
      <Path d="M44 17c-3 0-5 2-5 5v4h10v-4c0-3-2-5-5-5z" fill={palette.accent} />
      <Path d="M23 29h14M23 37h18" stroke={palette.dark} strokeLinecap="round" strokeWidth="4" />
    </>
  );
}

function ShieldIcon({ palette }: IconProps) {
  return (
    <>
      <BaseTile palette={palette} />
      <Path d="M32 11 48 18v12c0 11-6 18-16 23-10-5-16-12-16-23V18z" fill={palette.mid} />
      <Path d="M32 17v28" stroke={palette.light} strokeLinecap="round" strokeWidth="4" />
      <Path d="M24 31h16" stroke={palette.accent} strokeLinecap="round" strokeWidth="5" />
    </>
  );
}

function SoundIcon({ palette }: IconProps) {
  return (
    <>
      <BaseTile palette={palette} />
      <Path d="M16 29h9l12-10v26L25 35h-9z" fill={palette.dark} />
      <Path d="M43 24c4 4 4 12 0 16M49 19c7 8 7 18 0 26" fill="none" stroke={palette.mid} strokeLinecap="round" strokeWidth="4" />
    </>
  );
}

function SparkIcon({ palette }: IconProps) {
  return (
    <>
      <BaseTile palette={palette} />
      <Path d="M32 10 37 27 54 32 37 37 32 54 27 37 10 32 27 27z" fill={palette.accent} />
      <Path d="M32 21 35 29 43 32 35 35 32 43 29 35 21 32 29 29z" fill={palette.light} />
    </>
  );
}

const iconMap: Record<GameIconName, (props: IconProps) => ReactNode> = {
  bell: BellIcon,
  book: BookIcon,
  chest: ChestIcon,
  coin: CoinIcon,
  compass: CompassIcon,
  focus: FocusIcon,
  flame: FlameIcon,
  gear: GearIcon,
  habit: HabitIcon,
  moon: MoonIcon,
  petDragon: PetDragonIcon,
  privacy: PrivacyIcon,
  reset: ResetIcon,
  scroll: ScrollIcon,
  shield: ShieldIcon,
  sound: SoundIcon,
  spark: SparkIcon,
};

const styles = StyleSheet.create({
  frame: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
