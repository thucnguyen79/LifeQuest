import { Redirect, router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { AppScreen } from '@/core/components/AppScreen';
import { characterClasses } from '@/core/constants/gameRules';
import { colors } from '@/core/theme/colors';
import { spacing } from '@/core/theme/spacing';
import type { PlayerClass } from '@/data/models/player';
import { useLifeQuestStore } from '@/store/useLifeQuestStore';

const classes = Object.entries(characterClasses) as Array<
  [PlayerClass, (typeof characterClasses)[PlayerClass]]
>;

export default function ClassSelectionScreen() {
  const draftPlayerName = useLifeQuestStore((state) => state.draftPlayerName);
  const createPlayer = useLifeQuestStore((state) => state.createPlayer);
  const player = useLifeQuestStore((state) => state.player);

  if (player) {
    return <Redirect href="/dashboard" />;
  }

  if (!draftPlayerName) {
    return <Redirect href="/onboarding/name" />;
  }

  const selectClass = (selectedClass: PlayerClass) => {
    createPlayer(draftPlayerName, selectedClass);
    router.replace('/dashboard');
  };

  return (
    <AppScreen canGoBack>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View>
          <Text style={styles.eyebrow}>Class Selection</Text>
          <Text style={styles.title}>Choose your path</Text>
          <Text style={styles.body}>Each class starts with a small bonus to its primary stat.</Text>
        </View>

        <View style={styles.classList}>
          {classes.map(([key, classMeta]) => (
            <Pressable key={key} onPress={() => selectClass(key)} style={styles.classCard}>
              <View style={styles.icon}>
                <Text style={styles.iconText}>{classMeta.icon}</Text>
              </View>
              <View style={styles.classCopy}>
                <Text style={styles.className}>{classMeta.name}</Text>
                <Text style={styles.classDescription}>{classMeta.description}</Text>
                <Text style={styles.primaryStat}>Primary: {classMeta.primaryStat}</Text>
              </View>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.lg,
    paddingBottom: spacing.xl,
  },
  eyebrow: {
    color: colors.accent,
    fontSize: 13,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  title: {
    color: colors.ink,
    fontSize: 34,
    fontWeight: '900',
    marginTop: spacing.xs,
  },
  body: {
    color: colors.muted,
    fontSize: 16,
    lineHeight: 24,
    marginTop: spacing.sm,
  },
  classList: {
    gap: spacing.md,
  },
  classCard: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing.md,
    padding: spacing.md,
  },
  icon: {
    alignItems: 'center',
    backgroundColor: colors.goldSoft,
    borderRadius: 8,
    height: 56,
    justifyContent: 'center',
    width: 56,
  },
  iconText: {
    color: colors.ink,
    fontSize: 24,
    fontWeight: '900',
  },
  classCopy: {
    flex: 1,
    gap: 3,
  },
  className: {
    color: colors.ink,
    fontSize: 18,
    fontWeight: '900',
  },
  classDescription: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 20,
  },
  primaryStat: {
    color: colors.accent,
    fontSize: 13,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
});
