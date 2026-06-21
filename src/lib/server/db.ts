import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_PATH = process.env.DATABASE_URL?.replace('file:', '') || path.join(DATA_DIR, 'veloragreen.db');

let db: Database.Database | null = null;

function getDbInstance(): Database.Database {
  if (!db) {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    db = new Database(DB_PATH);
    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');
    initSchema(db);
    seedIfEmpty(db);
  }
  return db;
}

function initSchema(database: Database.Database) {
  database.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      password TEXT,
      googleId TEXT UNIQUE,
      avatar TEXT DEFAULT '👤',
      totalKg REAL DEFAULT 0,
      createdAt INTEGER DEFAULT (strftime('%s','now') * 1000)
    );

    CREATE TABLE IF NOT EXISTS calculations (
      id TEXT PRIMARY KEY,
      userId TEXT,
      total REAL NOT NULL,
      breakdown TEXT NOT NULL,
      dailyAverage REAL NOT NULL,
      treesNeeded INTEGER NOT NULL,
      country TEXT,
      timestamp INTEGER NOT NULL DEFAULT (strftime('%s','now') * 1000),
      FOREIGN KEY (userId) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS badges (
      id TEXT PRIMARY KEY,
      userId TEXT,
      badgeId TEXT NOT NULL,
      name TEXT NOT NULL,
      description TEXT,
      icon TEXT DEFAULT '🏆',
      earnedAt INTEGER NOT NULL DEFAULT (strftime('%s','now') * 1000),
      FOREIGN KEY (userId) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS challenges (
      id TEXT PRIMARY KEY,
      userId TEXT,
      challengeId TEXT NOT NULL,
      startedAt INTEGER NOT NULL DEFAULT (strftime('%s','now') * 1000),
      completedAt INTEGER,
      streak INTEGER DEFAULT 0,
      FOREIGN KEY (userId) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS leaderboard (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      avatar TEXT DEFAULT '🌿',
      totalKg REAL DEFAULT 0,
      badges INTEGER DEFAULT 0,
      streak INTEGER DEFAULT 0,
      country TEXT DEFAULT 'US'
    );

    CREATE INDEX IF NOT EXISTS idx_calculations_user ON calculations(userId);
    CREATE INDEX IF NOT EXISTS idx_badges_user ON badges(userId);
    CREATE INDEX IF NOT EXISTS idx_leaderboard_score ON leaderboard(totalKg ASC);
  `);
}

function seedIfEmpty(database: Database.Database) {
  const count = database.prepare('SELECT COUNT(*) as c FROM leaderboard').get() as { c: number };
  if (count.c > 0) return;

  const insert = database.prepare(
    'INSERT INTO leaderboard (id, name, avatar, totalKg, badges, streak, country) VALUES (?, ?, ?, ?, ?, ?, ?)'
  );
  const seed: [string, string, string, number, number, number, string][] = [
    ['u1', 'EcoEmma', '🌿', 1200, 9, 21, 'DE'],
    ['u2', 'GreenGuru', '🍃', 1450, 8, 18, 'IN'],
    ['u3', 'CarbonKing', '👑', 1800, 7, 14, 'GB'],
    ['u4', 'PlantPower', '🌱', 1950, 7, 12, 'US'],
    ['u5', 'SolarSister', '☀️', 2100, 6, 10, 'AU'],
    ['u6', 'WindWalker', '💨', 2300, 6, 9, 'DK'],
    ['u7', 'BikeBoss', '🚲', 2450, 5, 8, 'NL'],
    ['u8', 'RecycleQueen', '♻️', 2600, 5, 7, 'SE'],
    ['u9', 'ZeroHero', '🦸', 2800, 5, 6, 'JP'],
    ['u10', 'NatureLover', '🌳', 2950, 4, 5, 'CA'],
    ['u11', 'EcoNewbie', '🌱', 3200, 4, 4, 'FR'],
    ['u12', 'GreenTeen', '🎓', 3400, 3, 3, 'KR'],
    ['u13', 'TreeHugger', '🤗', 3600, 3, 3, 'BR'],
    ['u14', 'OceanGuard', '🌊', 3800, 3, 2, 'NZ'],
    ['u15', 'SunnyDays', '🌞', 4000, 2, 2, 'ES'],
  ];

  const tx = database.transaction(() => {
    for (const row of seed) {
      insert.run(...row);
    }
  });
  tx();
}

const api = {
  get<T>(collection: string, id?: string): Promise<T | T[] | null> {
    const database = getDbInstance();
    try {
      if (id) {
        const row = database.prepare(`SELECT * FROM ${collection} WHERE id = ?`).get(id) as T | undefined;
        return Promise.resolve(row ?? null);
      }
      const rows = database.prepare(`SELECT * FROM ${collection}`).all() as T[];
      return Promise.resolve(rows);
    } catch {
      return Promise.resolve(null);
    }
  },

  set<T extends Record<string, unknown>>(collection: string, id: string, value: T): Promise<void> {
    const database = getDbInstance();
    try {
      const keys = Object.keys(value).filter(k => k !== 'id');
      const cols = keys.join(', ');
      const placeholders = keys.map(() => '?').join(', ');
      const vals = keys.map(k => value[k]);

      database.prepare(
        `INSERT OR REPLACE INTO ${collection} (id, ${cols}) VALUES (?, ${placeholders})`
      ).run(id, ...vals);

      return Promise.resolve();
    } catch (error) {
      console.error(`DB set error:`, error);
      return Promise.resolve();
    }
  },

  delete(collection: string, id: string): Promise<void> {
    const database = getDbInstance();
    try {
      database.prepare(`DELETE FROM ${collection} WHERE id = ?`).run(id);
      return Promise.resolve();
    } catch {
      return Promise.resolve();
    }
  },

  list<T>(collection: string): Promise<T[]> {
    const database = getDbInstance();
    try {
      const rows = database.prepare(`SELECT * FROM ${collection}`).all() as T[];
      return Promise.resolve(rows);
    } catch {
      return Promise.resolve([]);
    }
  },

  query<T>(sql: string, params: unknown[] = []): Promise<T[]> {
    const database = getDbInstance();
    try {
      const rows = database.prepare(sql).all(...params) as T[];
      return Promise.resolve(rows);
    } catch {
      return Promise.resolve([]);
    }
  },
};

export function getDb() {
  return api;
}
