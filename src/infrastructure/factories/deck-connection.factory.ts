import { DeckConnectionService } from '@/application/services/deck-connection.service';
import { KVDeckConnectionRepository } from '@/infrastructure/repositories/kv-deck-connection.repository';

export function createDeckConnectionService(): DeckConnectionService {
  const repository = new KVDeckConnectionRepository();
  return new DeckConnectionService(repository);
} 