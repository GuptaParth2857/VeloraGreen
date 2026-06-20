import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');

function ensureDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function filePath(collection: string): string {
  return path.join(DATA_DIR, `${collection}.json`);
}

function readCollection<T>(collection: string): Map<string, T> {
  ensureDir();
  const fp = filePath(collection);
  if (!fs.existsSync(fp)) return new Map();
  try {
    const raw = fs.readFileSync(fp, 'utf-8');
    const obj = JSON.parse(raw);
    return new Map(Object.entries(obj));
  } catch {
    return new Map();
  }
}

function writeCollection<T>(collection: string, data: Map<string, T>): void {
  ensureDir();
  const obj = Object.fromEntries(data);
  fs.writeFileSync(filePath(collection), JSON.stringify(obj, null, 2), 'utf-8');
}

interface DatabaseAdapter {
  get<T>(collection: string, id?: string): Promise<T | T[] | null>;
  set<T>(collection: string, id: string, value: T): Promise<void>;
  delete(collection: string, id: string): Promise<void>;
  list<T>(collection: string): Promise<T[]>;
}

class JsonFileDatabase implements DatabaseAdapter {
  async get<T>(collection: string, id?: string): Promise<T | T[] | null> {
    const col = readCollection<T>(collection);
    if (id) return col.get(id) ?? null;
    return Array.from(col.values()) as T[];
  }

  async set<T>(collection: string, id: string, value: T): Promise<void> {
    const col = readCollection<T>(collection);
    col.set(id, value);
    writeCollection(collection, col);
  }

  async delete(collection: string, id: string): Promise<void> {
    const col = readCollection(collection);
    col.delete(id);
    writeCollection(collection, col);
  }

  async list<T>(collection: string): Promise<T[]> {
    const col = readCollection<T>(collection);
    return Array.from(col.values());
  }
}

let dbInstance: DatabaseAdapter | null = null;

export function getDb(): DatabaseAdapter {
  if (!dbInstance) {
    dbInstance = new JsonFileDatabase();
    runSeed(dbInstance);
  }
  return dbInstance;
}

async function runSeed(db: DatabaseAdapter) {
  const existing = await db.list('leaderboard');
  if (existing.length > 0) return;

  const mockUsers = [
    { id: 'u1', name: 'EcoEmma', avatar: '🌿', totalKg: 1200, badges: 9, streak: 21, country: 'DE' },
    { id: 'u2', name: 'GreenGuru', avatar: '🍃', totalKg: 1450, badges: 8, streak: 18, country: 'IN' },
    { id: 'u3', name: 'CarbonKing', avatar: '👑', totalKg: 1800, badges: 7, streak: 14, country: 'GB' },
    { id: 'u4', name: 'PlantPower', avatar: '🌱', totalKg: 1950, badges: 7, streak: 12, country: 'US' },
    { id: 'u5', name: 'SolarSister', avatar: '☀️', totalKg: 2100, badges: 6, streak: 10, country: 'AU' },
    { id: 'u6', name: 'WindWalker', avatar: '💨', totalKg: 2300, badges: 6, streak: 9, country: 'DK' },
    { id: 'u7', name: 'BikeBoss', avatar: '🚲', totalKg: 2450, badges: 5, streak: 8, country: 'NL' },
    { id: 'u8', name: 'RecycleQueen', avatar: '♻️', totalKg: 2600, badges: 5, streak: 7, country: 'SE' },
    { id: 'u9', name: 'ZeroHero', avatar: '🦸', totalKg: 2800, badges: 5, streak: 6, country: 'JP' },
    { id: 'u10', name: 'NatureLover', avatar: '🌳', totalKg: 2950, badges: 4, streak: 5, country: 'CA' },
    { id: 'u11', name: 'EcoNewbie', avatar: '🌱', totalKg: 3200, badges: 4, streak: 4, country: 'FR' },
    { id: 'u12', name: 'GreenTeen', avatar: '🎓', totalKg: 3400, badges: 3, streak: 3, country: 'KR' },
    { id: 'u13', name: 'TreeHugger', avatar: '🤗', totalKg: 3600, badges: 3, streak: 3, country: 'BR' },
    { id: 'u14', name: 'OceanGuard', avatar: '🌊', totalKg: 3800, badges: 3, streak: 2, country: 'NZ' },
    { id: 'u15', name: 'SunnyDays', avatar: '🌞', totalKg: 4000, badges: 2, streak: 2, country: 'ES' },
  ];
  for (const user of mockUsers) {
    await db.set('leaderboard', user.id, user);
  }
}
