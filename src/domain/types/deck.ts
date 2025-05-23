export type DeckField = {
  field_name: string;
  field_value: string;
};

export type DeckConnection = {
  id: string;
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

const testData: Omit<DeckConnection, 'id' | 'created_at' | 'updated_at'> = {
  access_token: "test_access_token",
  fields: [
    { field_name: "email", field_value: "test@example.com" },
    { field_name: "account_id", field_value: "12345" }
  ],
  status: "active"
};

type DeckConnectionTest = {
  access_token: string;
  fields: DeckField[];
  status: 'active' | 'inactive' | 'error';
};

type RedisTestResult = {
  success: boolean;
  key: string;
  stored: DeckConnectionTest;
  retrieved: DeckConnectionTest;
}; 