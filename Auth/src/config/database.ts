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
      application_name: 'auth-service',
    });
  }

  public static getInstance(): DatabaseClient {
    if (!DatabaseClient.instance) {
      DatabaseClient.instance = new DatabaseClient();
    }
    return DatabaseClient.instance;
  }

  private isConnected: boolean = false;
  private connectionPromise: Promise<void> | null = null;

  /**
   * Connects to the database if not already connected
   * @returns Promise that resolves when connected
   */
  public async connect(): Promise<void> {
    // If already connected, return immediately
    if (this.isConnected) {
      console.log('Database already connected');
      return Promise.resolve();
    }

    // If connection is in progress, return the existing promise
    if (this.connectionPromise) {
      return this.connectionPromise;
    }

    // Create a new connection promise
    this.connectionPromise = (async () => {
      try {
        console.log('Attempting to connect to the database...');
        await this.client.connect();
        // Set the search path to our schema
        await this.client.query(`SET search_path TO ${dbConfig.schema}`);
        this.isConnected = true;
        console.log('Database connected successfully');
        return;
      } catch (error) {
        console.error('Database connection error:', error);
        this.isConnected = false;
        this.connectionPromise = null;
        throw error;
      }
    })();

    return this.connectionPromise;
  }

  public async query(text: string, params?: any[]): Promise<any> {
    try {
      const start = Date.now();
      const res = await this.client.query(text, params);
      const duration = Date.now() - start;
      console.log('Executed query', { text, duration, rows: res.rowCount });
      return res;
    } catch (error) {
      console.error('Database query error:', error);
      throw error;
    }
  }

  public async close(): Promise<void> {
    try {
      if (this.isConnected) {
        await this.client.end();
        this.isConnected = false;
        this.connectionPromise = null;
        console.log('Database connection closed');
      }
    } catch (error) {
      console.error('Error closing database connection:', error);
      throw error;
    }
  }
}

export const db = DatabaseClient.getInstance();
export default db;
