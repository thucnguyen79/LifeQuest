import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';

import { AppScreen } from '@/core/components/AppScreen';
import { colors } from '@/core/theme/colors';
import { spacing } from '@/core/theme/spacing';
import { useLifeQuestStore } from '@/store/useLifeQuestStore';

export default function SettingsScreen() {
  const [resetArmed, setResetArmed] = useState(false);
  const notificationsEnabled = useLifeQuestStore((state) => state.notificationsEnabled);
  const notificationsStatus = useLifeQuestStore((state) => state.notificationsStatus);
  const notificationsMessage = useLifeQuestStore((state) => state.notificationsMessage);
  const scheduledReminderCount = useLifeQuestStore((state) => state.scheduledReminderCount);
  const isSchedulingNotifications = useLifeQuestStore(
    (state) => state.isSchedulingNotifications,
  );
  const setNotificationsEnabled = useLifeQuestStore((state) => state.setNotificationsEnabled);
  const soundEnabled = useLifeQuestStore((state) => state.soundEnabled);
  const toggleSound = useLifeQuestStore((state) => state.toggleSound);
  const resetAppData = useLifeQuestStore((state) => state.resetAppData);

  const handleResetPress = async () => {
    if (!resetArmed) {
      setResetArmed(true);
      return;
    }

    await resetAppData();
    router.replace('/');
  };

  return (
    <AppScreen canGoBack>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.eyebrow}>Settings</Text>
          <Text style={styles.title}>App Preferences</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.settingCopy}>
            <Text style={styles.settingTitle}>Daily reminders</Text>
            <Text style={styles.settingBody}>{notificationsMessage}</Text>
            <Text style={styles.settingMeta}>
              {notificationsStatus} / {scheduledReminderCount} scheduled
            </Text>
          </View>
          <Switch
            disabled={isSchedulingNotifications}
            value={notificationsEnabled}
            onValueChange={setNotificationsEnabled}
          />
        </View>

        <View style={styles.card}>
          <View style={styles.settingCopy}>
            <Text style={styles.settingTitle}>Sound effects</Text>
            <Text style={styles.settingBody}>
              Placeholder toggle for future quest completion and reward sounds.
            </Text>
            <Text style={styles.settingMeta}>{soundEnabled ? 'enabled' : 'muted'}</Text>
          </View>
          <Switch value={soundEnabled} onValueChange={toggleSound} />
        </View>

        <View style={styles.cardStack}>
          <Text style={styles.settingTitle}>Privacy</Text>
          <Text style={styles.settingBody}>
            MVP data stays on this device. Backend sync and account privacy controls start after
            the local MVP is stable.
          </Text>
        </View>

        <View style={[styles.cardStack, styles.dangerCard]}>
          <Text style={styles.dangerTitle}>Reset local data</Text>
          <Text style={styles.settingBody}>
            Clears player, habits, quests, streak preview, pet progress, and scheduled reminders.
          </Text>
          {resetArmed ? (
            <Text style={styles.resetWarning}>Press confirm to permanently reset this MVP data.</Text>
          ) : null}
          <Pressable
            onPress={handleResetPress}
            style={[styles.resetButton, resetArmed ? styles.resetButtonArmed : null]}
          >
            <Text style={styles.resetButtonText}>
              {resetArmed ? 'Confirm Reset' : 'Arm Reset'}
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.md,
    paddingBottom: spacing.xl,
  },
  header: {
    marginBottom: spacing.sm,
  },
  eyebrow: {
    color: colors.accent,
    fontSize: 13,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  title: {
    color: colors.ink,
    fontSize: 28,
    fontWeight: '900',
    marginTop: spacing.xs,
  },
  card: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing.md,
    padding: spacing.lg,
  },
  cardStack: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    gap: spacing.sm,
    padding: spacing.lg,
  },
  settingCopy: {
    flex: 1,
  },
  settingTitle: {
    color: colors.ink,
    fontSize: 16,
    fontWeight: '900',
  },
  settingBody: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 20,
    marginTop: 4,
  },
  settingMeta: {
    color: colors.accent,
    fontSize: 12,
    fontWeight: '900',
    marginTop: spacing.xs,
    textTransform: 'uppercase',
  },
  dangerCard: {
    borderColor: '#E8B4AE',
  },
  dangerTitle: {
    color: '#A6423A',
    fontSize: 16,
    fontWeight: '900',
  },
  resetWarning: {
    color: '#A6423A',
    fontSize: 13,
    fontWeight: '800',
  },
  resetButton: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: colors.ink,
    borderRadius: 8,
    justifyContent: 'center',
    marginTop: spacing.xs,
    minHeight: 44,
    paddingHorizontal: spacing.md,
  },
  resetButtonArmed: {
    backgroundColor: '#A6423A',
  },
  resetButtonText: {
    color: colors.surface,
    fontSize: 14,
    fontWeight: '900',
  },
});
