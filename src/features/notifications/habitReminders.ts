import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

import type { Habit, Weekday } from '@/data/models/habit';
import { habitRepository } from '@/data/repositories/habitRepository';

export type ReminderPermissionStatus = 'idle' | 'granted' | 'denied' | 'unavailable' | 'error';

export type ReminderScheduleResult = {
  enabled: boolean;
  scheduledCount: number;
  status: ReminderPermissionStatus;
  message: string;
};

type ReminderTime = {
  hour: number;
  minute: number;
};

const reminderTimePattern = /^([01]\d|2[0-3]):([0-5]\d)$/;
const habitReminderChannelId = 'habit-reminders';

if (Platform.OS !== 'web') {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });
}

export function parseReminderTime(value?: string | null): ReminderTime | null {
  if (!value) {
    return null;
  }

  const match = reminderTimePattern.exec(value.trim());

  if (!match) {
    return null;
  }

  return {
    hour: Number.parseInt(match[1], 10),
    minute: Number.parseInt(match[2], 10),
  };
}

export function isValidReminderTime(value: string) {
  return value.trim().length === 0 || parseReminderTime(value) !== null;
}

function toExpoWeekday(weekday: Weekday) {
  return weekday === 7 ? 1 : weekday + 1;
}

function getHabitsWithReminder() {
  return habitRepository
    .listActive()
    .map((habit) => ({ habit, reminderTime: parseReminderTime(habit.reminderTime) }))
    .filter(
      (entry): entry is { habit: Habit; reminderTime: ReminderTime } =>
        entry.reminderTime !== null,
    );
}

async function scheduleHabitReminder(habit: Habit, reminderTime: ReminderTime) {
  const content = {
    title: 'LifeQuest Reminder',
    body: `Quest ready: ${habit.title}`,
    data: {
      habitId: habit.id,
      route: '/dashboard',
    },
  };

  if (habit.frequencyType === 'daily') {
    await Notifications.scheduleNotificationAsync({
      content,
      identifier: `habit-${habit.id}-daily`,
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        channelId: habitReminderChannelId,
        hour: reminderTime.hour,
        minute: reminderTime.minute,
      },
    });

    return 1;
  }

  let scheduledCount = 0;

  for (const weekday of habit.selectedWeekdays) {
    await Notifications.scheduleNotificationAsync({
      content,
      identifier: `habit-${habit.id}-weekday-${weekday}`,
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
        channelId: habitReminderChannelId,
        weekday: toExpoWeekday(weekday),
        hour: reminderTime.hour,
        minute: reminderTime.minute,
      },
    });
    scheduledCount += 1;
  }

  return scheduledCount;
}

export async function syncHabitReminderNotifications(
  enabled: boolean,
): Promise<ReminderScheduleResult> {
  if (!enabled) {
    if (Platform.OS !== 'web') {
      await Notifications.cancelAllScheduledNotificationsAsync();
    }

    return {
      enabled: false,
      scheduledCount: 0,
      status: 'idle',
      message: 'Daily reminders are off.',
    };
  }

  if (Platform.OS === 'web') {
    return {
      enabled: false,
      scheduledCount: 0,
      status: 'unavailable',
      message: 'Local notifications are available on mobile builds, not web preview.',
    };
  }

  try {
    const currentPermission = await Notifications.getPermissionsAsync();
    const permission =
      currentPermission.status === 'granted'
        ? currentPermission
        : await Notifications.requestPermissionsAsync();

    if (permission.status !== 'granted') {
      return {
        enabled: false,
        scheduledCount: 0,
        status: 'denied',
        message: 'Notification permission was not granted.',
      };
    }

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync(habitReminderChannelId, {
        name: 'Habit reminders',
        importance: Notifications.AndroidImportance.DEFAULT,
      });
    }

    await Notifications.cancelAllScheduledNotificationsAsync();

    let scheduledCount = 0;

    for (const { habit, reminderTime } of getHabitsWithReminder()) {
      scheduledCount += await scheduleHabitReminder(habit, reminderTime);
    }

    return {
      enabled: true,
      scheduledCount,
      status: 'granted',
      message:
        scheduledCount > 0
          ? `${scheduledCount} habit reminders scheduled.`
          : 'Notifications are on. Add reminder times to habits to schedule alerts.',
    };
  } catch {
    return {
      enabled: false,
      scheduledCount: 0,
      status: 'error',
      message: 'Could not schedule reminders on this device.',
    };
  }
}
