import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AppScreen } from '@/core/components/AppScreen';
import { colors } from '@/core/theme/colors';
import { spacing } from '@/core/theme/spacing';

type PlaceholderScreenProps = {
  title: string;
  eyebrow: string;
  body: string;
};

export function PlaceholderScreen({ title, eyebrow, body }: PlaceholderScreenProps) {
  return (
    <AppScreen canGoBack>
      <View style={styles.card}>
        <Text style={styles.eyebrow}>{eyebrow}</Text>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.body}>{body}</Text>
        <Pressable onPress={() => router.replace('/dashboard')} style={styles.button}>
          <Text style={styles.buttonText}>Return to Dashboard</Text>
        </Pressable>
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    gap: spacing.md,
    padding: spacing.lg,
  },
  eyebrow: {
    color: colors.accent,
    fontSize: 13,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  title: {
    color: colors.ink,
    fontSize: 30,
    fontWeight: '900',
  },
  body: {
    color: colors.muted,
    fontSize: 16,
    lineHeight: 24,
  },
  button: {
    alignItems: 'center',
    backgroundColor: colors.ink,
    borderRadius: 8,
    justifyContent: 'center',
    minHeight: 48,
  },
  buttonText: {
    color: colors.surface,
    fontSize: 15,
    fontWeight: '900',
  },
});
