import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View, type ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors } from '@/core/theme/colors';
import { spacing } from '@/core/theme/spacing';

type AppScreenProps = {
  children: React.ReactNode;
  canGoBack?: boolean;
  style?: ViewStyle;
};

export function AppScreen({ children, canGoBack = false, style }: AppScreenProps) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={[styles.container, style]}>
        {canGoBack ? (
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backButtonText}>Back</Text>
          </Pressable>
        ) : null}
        {children}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: colors.background,
    flex: 1,
  },
  container: {
    alignSelf: 'center',
    flex: 1,
    maxWidth: 860,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    width: '100%',
  },
  backButton: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    justifyContent: 'center',
    marginBottom: spacing.lg,
    minHeight: 40,
    paddingHorizontal: spacing.md,
  },
  backButtonText: {
    color: colors.ink,
    fontWeight: '800',
  },
});
