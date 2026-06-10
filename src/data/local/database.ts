import * as SQLite from 'expo-sqlite';

let database: SQLite.SQLiteDatabase | null = null;

export function getDatabase() {
  database ??= SQLite.openDatabaseSync('lifequest.db');
  return database;
}

export function initializeLocalDatabase() {
  const db = getDatabase();

  db.execSync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS app_metadata (
      key TEXT PRIMARY KEY NOT NULL,
      value TEXT NOT NULL
    );
  `);
}
