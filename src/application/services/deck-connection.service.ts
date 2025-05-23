import { DeckConnection, DeckConnectionRepository, DeckField } from '@/domain/types/deck';

export class DeckConnectionService {
  constructor(private readonly repository: DeckConnectionRepository) {}

  async createConnection(connection_id: string, access_token: string, fields: DeckField[]): Promise<DeckConnection> {
    return this.repository.save({
      connection_id,
      access_token,
      fields,
      status: 'active',
    });
  }

  async getConnection(id: string): Promise<DeckConnection> {
    const connection = await this.repository.findById(id);
    if (!connection) {
      throw new Error(`Connection ${id} not found`);
    }
    return connection;
  }

  async updateConnectionStatus(id: string, status: DeckConnection['status']): Promise<DeckConnection> {
    return this.repository.update(id, { status });
  }

  async listConnections(): Promise<DeckConnection[]> {
    return this.repository.list();
  }

  async deleteConnection(id: string): Promise<void> {
    await this.repository.delete(id);
  }
} 