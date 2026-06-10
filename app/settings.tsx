import { StyleSheet, Switch, Text, View } from 'react-native';

import { AppScreen } from '@/core/components/AppScreen';
import { colors } from '@/core/theme/colors';
import { spacing } from '@/core/theme/spacing';
import { useLifeQuestStore } from '@/store/useLifeQuestStore';

export default function SettingsScreen() {
  const notificationsEnabled = useLifeQuestStore((state) => state.notificationsEnabled);
  const toggleNotifications = useLifeQuestStore((state) => state.toggleNotifications);

  return (
    <AppScreen canGoBack>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>Settings</Text>
        <Text style={styles.title}>App Preferences</Text>
      </View>

      <View style={styles.card}>
        <View style={styles.settingCopy}>
          <Text style={styles.settingTitle}>Daily reminders</Text>
          <Text style={styles.settingBody}>Notification scheduling starts in a later task.</Text>
        </View>
        <Switch value={notificationsEnabled} onValueChange={toggleNotifications} />
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  header: {
    marginBottom: spacing.lg,
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
});
