import { kv } from '@vercel/kv';
import { DeckConnection, DeckConnectionRepository } from '@/domain/types/deck';
import { v4 as uuidv4 } from 'uuid';

const CONNECTION_PREFIX = 'deck:connection:';

export class KVDeckConnectionRepository implements DeckConnectionRepository {
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

    await kv.set(this.generateKey(id), newConnection);
    return newConnection;
  }

  async findById(id: string): Promise<DeckConnection | null> {
    const connection = await kv.get<DeckConnection>(this.generateKey(id));
    return connection || null;
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

    await kv.set(this.generateKey(id), updated);
    return updated;
  }

  async list(): Promise<DeckConnection[]> {
    const keys = await kv.keys(`${CONNECTION_PREFIX}*`);
    const connections = await Promise.all(
      keys.map(key => kv.get<DeckConnection>(key))
    );
    return connections.filter((conn): conn is DeckConnection => conn !== null);
  }

  async delete(id: string): Promise<void> {
    await kv.del(this.generateKey(id));
  }
} 