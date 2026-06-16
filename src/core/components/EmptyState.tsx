import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '@/core/theme/colors';
import { spacing } from '@/core/theme/spacing';

import { GamePanel } from './GamePanel';
import { RuneIcon } from './RuneIcon';

type EmptyStateProps = {
  actionLabel?: string;
  body: string;
  mark?: string;
  onAction?: () => void;
  title: string;
  visual?: ReactNode;
};

export function EmptyState({ actionLabel, body, mark = '?', onAction, title, visual }: EmptyStateProps) {
  return (
    <GamePanel accent tone="parchment" style={styles.panel}>
      {visual ?? <RuneIcon label={mark} size="lg" tone="dark" />}
      <View style={styles.copy}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.body}>{body}</Text>
        {actionLabel && onAction ? (
          <Pressable onPress={onAction} style={styles.button}>
            <Text style={styles.buttonText}>{actionLabel}</Text>
          </Pressable>
        ) : null}
      </View>
    </GamePanel>
  );
}

const styles = StyleSheet.create({
  panel: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.md,
  },
  copy: {
    flex: 1,
    gap: spacing.xs,
  },
  title: {
    color: colors.ink,
    fontSize: 20,
    fontWeight: '900',
  },
  body: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 20,
  },
  button: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: colors.panelDeep,
    borderRadius: 8,
    justifyContent: 'center',
    marginTop: spacing.xs,
    minHeight: 40,
    paddingHorizontal: spacing.md,
  },
  buttonText: {
    color: colors.surface,
    fontSize: 14,
    fontWeight: '900',
  },
});
