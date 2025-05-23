export type DeckField = {
  field_name: string;
  field_value: string;
};

export type DeckConnection = {
  id: string;
  connection_id: string;
  access_token: string;
  fields: DeckField[];
  status: 'active' | 'inactive' | 'error';
  created_at: string;
  updated_at: string;
};

export interface DeckConnectionRepository {
  save(connection: Omit<DeckConnection, 'id' | 'created_at' | 'updated_at'>): Promise<DeckConnection>;
  findById(id: string): Promise<DeckConnection | null>;
  update(id: string, data: Partial<DeckConnection>): Promise<DeckConnection>;
  list(): Promise<DeckConnection[]>;
  delete(id: string): Promise<void>;
} 