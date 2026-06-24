import * as SQLite from 'expo-sqlite';

const databaseName = 'lifequest.db';
const schemaVersion = 5;

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
      priority TEXT NOT NULL DEFAULT 'normal',
      energy TEXT NOT NULL DEFAULT 'medium',
      estimated_minutes INTEGER,
      bonus_objective TEXT,
      reminder_time TEXT,
      is_active INTEGER NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS quests (
      id TEXT PRIMARY KEY NOT NULL,
      habit_id TEXT NOT NULL,
      category TEXT NOT NULL DEFAULT 'deepWork',
      title TEXT NOT NULL,
      date TEXT NOT NULL,
      xp_reward INTEGER NOT NULL,
      coin_reward INTEGER NOT NULL,
      target_count INTEGER NOT NULL DEFAULT 1,
      progress_count INTEGER NOT NULL DEFAULT 0,
      priority TEXT NOT NULL DEFAULT 'normal',
      energy TEXT NOT NULL DEFAULT 'medium',
      estimated_minutes INTEGER,
      bonus_objective TEXT,
      bonus_completed INTEGER NOT NULL DEFAULT 0,
      rerolled_at TEXT,
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

    CREATE TABLE IF NOT EXISTS daily_adventures (
      date TEXT PRIMARY KEY NOT NULL,
      zone_id TEXT NOT NULL,
      node_progress INTEGER NOT NULL,
      node_target INTEGER NOT NULL,
      cleared INTEGER NOT NULL,
      updated_at TEXT NOT NULL
    );
  `);

  const habitColumns = db.getAllSync<{ name: string }>('PRAGMA table_info(habits)');
  const habitColumnNames = new Set(habitColumns.map((column) => column.name));

  if (!habitColumnNames.has('priority')) {
    db.execSync("ALTER TABLE habits ADD COLUMN priority TEXT NOT NULL DEFAULT 'normal'");
  }

  if (!habitColumnNames.has('energy')) {
    db.execSync("ALTER TABLE habits ADD COLUMN energy TEXT NOT NULL DEFAULT 'medium'");
  }

  if (!habitColumnNames.has('estimated_minutes')) {
    db.execSync('ALTER TABLE habits ADD COLUMN estimated_minutes INTEGER');
  }

  if (!habitColumnNames.has('bonus_objective')) {
    db.execSync('ALTER TABLE habits ADD COLUMN bonus_objective TEXT');
  }

  const questColumns = db.getAllSync<{ name: string }>('PRAGMA table_info(quests)');
  const questColumnNames = new Set(questColumns.map((column) => column.name));

  if (!questColumnNames.has('target_count')) {
    db.execSync('ALTER TABLE quests ADD COLUMN target_count INTEGER NOT NULL DEFAULT 1');
  }

  if (!questColumnNames.has('category')) {
    db.execSync("ALTER TABLE quests ADD COLUMN category TEXT NOT NULL DEFAULT 'deepWork'");
  }

  if (!questColumnNames.has('progress_count')) {
    db.execSync('ALTER TABLE quests ADD COLUMN progress_count INTEGER NOT NULL DEFAULT 0');
  }

  if (!questColumnNames.has('priority')) {
    db.execSync("ALTER TABLE quests ADD COLUMN priority TEXT NOT NULL DEFAULT 'normal'");
  }

  if (!questColumnNames.has('energy')) {
    db.execSync("ALTER TABLE quests ADD COLUMN energy TEXT NOT NULL DEFAULT 'medium'");
  }

  if (!questColumnNames.has('estimated_minutes')) {
    db.execSync('ALTER TABLE quests ADD COLUMN estimated_minutes INTEGER');
  }

  if (!questColumnNames.has('bonus_objective')) {
    db.execSync('ALTER TABLE quests ADD COLUMN bonus_objective TEXT');
  }

  if (!questColumnNames.has('bonus_completed')) {
    db.execSync('ALTER TABLE quests ADD COLUMN bonus_completed INTEGER NOT NULL DEFAULT 0');
  }

  if (!questColumnNames.has('rerolled_at')) {
    db.execSync('ALTER TABLE quests ADD COLUMN rerolled_at TEXT');
  }

  db.runSync(
    'INSERT OR REPLACE INTO app_metadata (key, value) VALUES (?, ?)',
    'schema_version',
    String(schemaVersion),
  );

  initialized = true;
}
