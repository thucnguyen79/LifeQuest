import { getDatabase, initializeLocalDatabase } from '@/data/local/database';
import type { Player, PlayerClass } from '@/data/models/player';

type PlayerRow = {
  id: string;
  name: string;
  selected_class: PlayerClass;
  level: number;
  current_xp: number;
  total_xp: number;
  coins: number;
  strength: number;
  intelligence: number;
  focus: number;
  wisdom: number;
  charisma: number;
  discipline: number;
  created_at: string;
  updated_at: string;
};

function toPlayer(row: PlayerRow): Player {
  return {
    id: row.id,
    name: row.name,
    selectedClass: row.selected_class,
    level: row.level,
    currentXp: row.current_xp,
    totalXp: row.total_xp,
    coins: row.coins,
    strength: row.strength,
    intelligence: row.intelligence,
    focus: row.focus,
    wisdom: row.wisdom,
    charisma: row.charisma,
    discipline: row.discipline,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export const playerRepository = {
  getById(id: string) {
    initializeLocalDatabase();

    const row = getDatabase().getFirstSync<PlayerRow>('SELECT * FROM players WHERE id = ?', id);
    return row ? toPlayer(row) : null;
  },

  getCurrent() {
    initializeLocalDatabase();

    const row = getDatabase().getFirstSync<PlayerRow>(
      'SELECT * FROM players ORDER BY created_at ASC LIMIT 1',
    );
    return row ? toPlayer(row) : null;
  },

  upsert(player: Player) {
    initializeLocalDatabase();

    getDatabase().runSync(
      `
      INSERT OR REPLACE INTO players (
        id,
        name,
        selected_class,
        level,
        current_xp,
        total_xp,
        coins,
        strength,
        intelligence,
        focus,
        wisdom,
        charisma,
        discipline,
        created_at,
        updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      player.id,
      player.name,
      player.selectedClass,
      player.level,
      player.currentXp,
      player.totalXp,
      player.coins,
      player.strength,
      player.intelligence,
      player.focus,
      player.wisdom,
      player.charisma,
      player.discipline,
      player.createdAt,
      player.updatedAt,
    );
  },

  remove(id: string) {
    initializeLocalDatabase();
    getDatabase().runSync('DELETE FROM players WHERE id = ?', id);
  },
};
