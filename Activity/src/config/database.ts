import { Client } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const dbConfig = {
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432', 10),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  schema: 'neha',
  ssl: process.env.DB_SSL === 'true' ? {
    rejectUnauthorized: false
  } : false
};

class DatabaseClient {
  private client: Client;
  private static instance: DatabaseClient;

  private constructor() {
    this.client = new Client({
      ...dbConfig,
      application_name: 'activity-service',
    });
  }

  public static getInstance(): DatabaseClient {
    if (!DatabaseClient.instance) {
      DatabaseClient.instance = new DatabaseClient();
    }
    return DatabaseClient.instance;
  }

  public async connect(): Promise<void> {
    try {
      await this.client.connect();
      console.log('Connected to PostgreSQL database');
    } catch (error) {
      console.error('Error connecting to PostgreSQL database:', error);
      throw error;
    }
  }

  public async disconnect(): Promise<void> {
    try {
      await this.client.end();
      console.log('Disconnected from PostgreSQL database');
    } catch (error) {
      console.error('Error disconnecting from PostgreSQL database:', error);
      throw error;
    }
  }

  public async query(text: string, params?: any[]): Promise<any> {
    try {
      const start = Date.now();
      const res = await this.client.query(text, params);
      const duration = Date.now() - start;
      console.log('Executed query', { text, duration, rows: res.rowCount });
      return res;
    } catch (error) {
      console.error('Error executing query:', { text, error });
      throw error;
    }
  }

  public async beginTransaction() {
    await this.client.query('BEGIN');
  }

  public async commitTransaction() {
    await this.client.query('COMMIT');
  }

  public async rollbackTransaction() {
    await this.client.query('ROLLBACK');
  }

  public getClient() {
    return this.client;
  }
}

export const db = DatabaseClient.getInstance();
export default db;
