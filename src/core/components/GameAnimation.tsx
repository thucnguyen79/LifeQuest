import { useEffect } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import LottieView from 'lottie-react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { colors } from '@/core/theme/colors';

import { GameIcon } from './GameIcon';

const petIdleAnimation = require('../../../assets/lottie/pet-idle.json');
const levelUpAnimation = require('../../../assets/lottie/level-up.json');

type PetIdleAnimationProps = {
  size?: number;
};

export function PetIdleAnimation({ size = 136 }: PetIdleAnimationProps) {
  const lift = useSharedValue(0);

  useEffect(() => {
    lift.value = withRepeat(
      withSequence(
        withTiming(-8, { duration: 1300, easing: Easing.inOut(Easing.quad) }),
        withTiming(0, { duration: 1300, easing: Easing.inOut(Easing.quad) }),
      ),
      -1,
      true,
    );
  }, [lift]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: lift.value }, { rotate: `${lift.value * -0.25}deg` }],
  }));

  if (Platform.OS !== 'web') {
    return (
      <LottieView
        autoPlay
        loop
        source={petIdleAnimation}
        style={{ height: size, width: size }}
      />
    );
  }

  return (
    <View style={[styles.stage, { height: size, width: size }]}>
      <Animated.View style={[styles.aura, animatedStyle]} />
      <Animated.View style={animatedStyle}>
        <GameIcon name="petDragon" size={size * 0.94} tone="mint" />
      </Animated.View>
    </View>
  );
}

type LevelUpBurstProps = {
  size?: number;
};

export function LevelUpBurst({ size = 120 }: LevelUpBurstProps) {
  const scale = useSharedValue(0.82);
  const rotate = useSharedValue(0);
  const spark = useSharedValue(0);

  useEffect(() => {
    scale.value = withRepeat(
      withSequence(
        withTiming(1.08, { duration: 520, easing: Easing.out(Easing.cubic) }),
        withTiming(0.96, { duration: 520, easing: Easing.inOut(Easing.quad) }),
      ),
      -1,
      true,
    );
    rotate.value = withRepeat(withTiming(360, { duration: 4200, easing: Easing.linear }), -1);
    spark.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 360, easing: Easing.out(Easing.cubic) }),
        withDelay(180, withTiming(0.2, { duration: 620, easing: Easing.in(Easing.quad) })),
      ),
      -1,
      false,
    );
  }, [rotate, scale, spark]);

  const burstStyle = useAnimatedStyle(() => ({
    opacity: 0.72 + spark.value * 0.28,
    transform: [{ scale: scale.value }, { rotate: `${rotate.value}deg` }],
  }));

  if (Platform.OS !== 'web') {
    return (
      <LottieView
        autoPlay
        loop
        source={levelUpAnimation}
        style={{ height: size, width: size }}
      />
    );
  }

  return (
    <View style={[styles.stage, { height: size, width: size }]}>
      <Animated.View style={[styles.burstRing, burstStyle]} />
      <GameIcon name="spark" size={size * 0.72} tone="gold" />
    </View>
  );
}

type QuestCompleteBurstProps = {
  size?: number;
};

export function QuestCompleteBurst({ size = 34 }: QuestCompleteBurstProps) {
  const scale = useSharedValue(0.7);
  const opacity = useSharedValue(0.55);

  useEffect(() => {
    scale.value = withRepeat(
      withSequence(
        withTiming(1.08, { duration: 420, easing: Easing.out(Easing.cubic) }),
        withTiming(0.88, { duration: 520, easing: Easing.inOut(Easing.quad) }),
      ),
      -1,
      true,
    );
    opacity.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 420, easing: Easing.out(Easing.cubic) }),
        withTiming(0.48, { duration: 520, easing: Easing.inOut(Easing.quad) }),
      ),
      -1,
      true,
    );
  }, [opacity, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  return (
    <View style={[styles.questBurstStage, { height: size, width: size }]}>
      <Animated.View style={[styles.questBurst, animatedStyle]} />
      <GameIcon name="spark" size={size * 0.78} tone="gold" />
    </View>
  );
}

const styles = StyleSheet.create({
  stage: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  aura: {
    backgroundColor: colors.mint,
    borderRadius: 999,
    height: '68%',
    opacity: 0.24,
    position: 'absolute',
    width: '68%',
  },
  burstRing: {
    backgroundColor: colors.goldSoft,
    borderColor: colors.gold,
    borderRadius: 999,
    borderWidth: 3,
    height: '82%',
    position: 'absolute',
    width: '82%',
  },
  questBurstStage: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  questBurst: {
    backgroundColor: colors.goldSoft,
    borderRadius: 999,
    height: '76%',
    position: 'absolute',
    width: '76%',
  },
});
