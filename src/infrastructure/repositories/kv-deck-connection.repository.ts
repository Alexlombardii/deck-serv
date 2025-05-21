import { Redis } from '@upstash/redis';
import { DeckConnection, DeckConnectionRepository } from '@/domain/types/deck';
import { v4 as uuidv4 } from 'uuid';

const CONNECTION_PREFIX = 'deck:connection:';

export class KVDeckConnectionRepository implements DeckConnectionRepository {
  private readonly redis: Redis;

  constructor(redis: Redis) {
    this.redis = redis;
  }

  private generateKey(id: string): string {
    return `${CONNECTION_PREFIX}${id}`;
  }

  async save(connection: Omit<DeckConnection, 'id' | 'created_at' | 'updated_at'>): Promise<DeckConnection> {
    const id = uuidv4();
    const now = new Date().toISOString();
    const newConnection: DeckConnection = {
      ...connection,
      id,
      created_at: now,
      updated_at: now,
    };

    await this.redis.set(this.generateKey(id), JSON.stringify(newConnection));
    return newConnection;
  }

  async findById(id: string): Promise<DeckConnection | null> {
    const data = await this.redis.get<string>(this.generateKey(id));
    if (!data) return null;
    return JSON.parse(data) as DeckConnection;
  }

  async update(id: string, data: Partial<DeckConnection>): Promise<DeckConnection> {
    const existing = await this.findById(id);
    if (!existing) {
      throw new Error(`Connection ${id} not found`);
    }

    const updated: DeckConnection = {
      ...existing,
      ...data,
      updated_at: new Date().toISOString(),
    };

    await this.redis.set(this.generateKey(id), JSON.stringify(updated));
    return updated;
  }

  async list(): Promise<DeckConnection[]> {
    const keys = await this.redis.keys(`${CONNECTION_PREFIX}*`);
    if (keys.length === 0) return [];

    const connections = await Promise.all(
      keys.map(async (key) => {
        const data = await this.redis.get<string>(key);
        return data ? JSON.parse(data) as DeckConnection : null;
      })
    );

    return connections.filter((conn): conn is DeckConnection => conn !== null);
  }

  async delete(id: string): Promise<void> {
    await this.redis.del(this.generateKey(id));
  }
} 