import { DeckConnectionService } from '@/application/services/deck-connection.service';
import { KVDeckConnectionRepository } from '@/infrastructure/repositories/kv-deck-connection.repository';
import { redis } from '@/infrastructure/config/redis';

export function createDeckConnectionService(): DeckConnectionService {
  const repository = new KVDeckConnectionRepository(redis);
  return new DeckConnectionService(repository);
} 