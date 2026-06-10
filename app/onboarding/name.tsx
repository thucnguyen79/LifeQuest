import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

import { AppScreen } from '@/core/components/AppScreen';
import { PrimaryButton } from '@/core/components/PrimaryButton';
import { colors } from '@/core/theme/colors';
import { spacing } from '@/core/theme/spacing';
import { useLifeQuestStore } from '@/store/useLifeQuestStore';

export default function PlayerNameScreen() {
  const draftPlayerName = useLifeQuestStore((state) => state.draftPlayerName);
  const setDraftPlayerName = useLifeQuestStore((state) => state.setDraftPlayerName);
  const [name, setName] = useState(draftPlayerName);

  const normalizedName = name.trim();
  const canContinue = normalizedName.length >= 2;

  const continueToClassSelection = () => {
    if (!canContinue) {
      return;
    }

    setDraftPlayerName(normalizedName);
    router.push('/onboarding/class');
  };

  return (
    <AppScreen canGoBack>
      <View style={styles.container}>
        <View>
          <Text style={styles.eyebrow}>Create Player</Text>
          <Text style={styles.title}>Name your adventurer</Text>
          <Text style={styles.body}>This is the character that grows when you complete real habits.</Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>Player name</Text>
          <TextInput
            autoCapitalize="words"
            autoFocus
            maxLength={24}
            onChangeText={setName}
            onSubmitEditing={continueToClassSelection}
            placeholder="Adventurer"
            placeholderTextColor={colors.muted}
            returnKeyType="next"
            style={styles.input}
            value={name}
          />
        </View>

        <PrimaryButton label="Choose Class" onPress={continueToClassSelection} />
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: spacing.xl,
    justifyContent: 'space-between',
    paddingBottom: spacing.md,
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
  form: {
    gap: spacing.sm,
  },
  label: {
    color: colors.ink,
    fontSize: 14,
    fontWeight: '800',
  },
  input: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    color: colors.ink,
    fontSize: 18,
    fontWeight: '800',
    minHeight: 56,
    paddingHorizontal: spacing.md,
  },
});
