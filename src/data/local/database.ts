import * as SQLite from 'expo-sqlite';

const databaseName = 'lifequest.db';
const schemaVersion = 1;

let database: SQLite.SQLiteDatabase | null = null;
let initialized = false;

export function getDatabase() {
  database ??= SQLite.openDatabaseSync(databaseName);
  return database;
}

export function initializeLocalDatabase() {
  if (initialized) {
    return;
  }

  const db = getDatabase();

  db.execSync(`
    PRAGMA journal_mode = WAL;
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS app_metadata (
      key TEXT PRIMARY KEY NOT NULL,
      value TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS players (
      id TEXT PRIMARY KEY NOT NULL,
      name TEXT NOT NULL,
      selected_class TEXT NOT NULL,
      level INTEGER NOT NULL,
      current_xp INTEGER NOT NULL,
      total_xp INTEGER NOT NULL,
      coins INTEGER NOT NULL,
      strength INTEGER NOT NULL,
      intelligence INTEGER NOT NULL,
      focus INTEGER NOT NULL,
      wisdom INTEGER NOT NULL,
      charisma INTEGER NOT NULL,
      discipline INTEGER NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS habits (
      id TEXT PRIMARY KEY NOT NULL,
      title TEXT NOT NULL,
      category TEXT NOT NULL,
      difficulty TEXT NOT NULL,
      frequency_type TEXT NOT NULL,
      selected_weekdays TEXT NOT NULL,
      target_count INTEGER,
      reminder_time TEXT,
      is_active INTEGER NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS quests (
      id TEXT PRIMARY KEY NOT NULL,
      habit_id TEXT NOT NULL,
      title TEXT NOT NULL,
      date TEXT NOT NULL,
      xp_reward INTEGER NOT NULL,
      coin_reward INTEGER NOT NULL,
      status TEXT NOT NULL,
      completed_at TEXT,
      FOREIGN KEY (habit_id) REFERENCES habits (id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_quests_date ON quests (date);
    CREATE INDEX IF NOT EXISTS idx_quests_habit_id ON quests (habit_id);

    CREATE TABLE IF NOT EXISTS streaks (
      habit_id TEXT PRIMARY KEY NOT NULL,
      current_streak INTEGER NOT NULL,
      longest_streak INTEGER NOT NULL,
      last_completed_date TEXT,
      FOREIGN KEY (habit_id) REFERENCES habits (id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS pets (
      id TEXT PRIMARY KEY NOT NULL,
      name TEXT NOT NULL,
      type TEXT NOT NULL,
      level INTEGER NOT NULL,
      xp INTEGER NOT NULL,
      mood TEXT NOT NULL,
      growth_stage TEXT NOT NULL
    );
  `);

  db.runSync(
    'INSERT OR REPLACE INTO app_metadata (key, value) VALUES (?, ?)',
    'schema_version',
    String(schemaVersion),
  );

  initialized = true;
}
