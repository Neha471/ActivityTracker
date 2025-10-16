import bcrypt from 'bcryptjs';
import * as queries from './queries/user.queries';
import db from '../config/database';

export interface User {
  id: number;
  email: string;
  password_hash: string;
  first_name: string | null;
  last_name: string | null;
  is_active: boolean;
  is_verified: boolean;
  last_login: Date | null;
  created_at: Date;
  updated_at: Date;
}

export interface CreateUserInput {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export interface UpdateUserInput {
  firstName?: string;
  lastName?: string;
  isActive?: boolean;
}

class UserRepository {
  private static readonly SALT_ROUNDS = 10;

  async createUser(data: CreateUserInput): Promise<Omit<User, 'password_hash'>> {
    const hashedPassword = await bcrypt.hash(data.password, UserRepository.SALT_ROUNDS);
    
    const result = await db.query(queries.CREATE_USER, [
      data.email.toLowerCase(),
      hashedPassword,
      data.firstName || null,
      data.lastName || null,
      false // is_verified
    ]);

    return result.rows[0];
  }

  async findById(id: number): Promise<User | null> {
    const result = await db.query(queries.FIND_USER_BY_ID, [id]);
    return result.rows[0] || null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const result = await db.query(queries.FIND_USER_BY_EMAIL, [email.toLowerCase()]);
    return result.rows[0] || null;
  }

  async updateUser(id: number, data: UpdateUserInput): Promise<Omit<User, 'password_hash'> | null> {
    const result = await db.query(queries.UPDATE_USER, [
      id,
      data.firstName || null,
      data.lastName || null,
      data.isActive ?? undefined
    ]);

    return result.rows[0] || null;
  }

  async updatePassword(id: number, newPassword: string): Promise<boolean> {
    const hashedPassword = await bcrypt.hash(newPassword, UserRepository.SALT_ROUNDS);
    const result = await db.query(queries.UPDATE_PASSWORD, [id, hashedPassword]);
    return result.rowCount > 0;
  }

  async deleteUser(id: number): Promise<boolean> {
    const result = await db.query(queries.DELETE_USER, [id]);
    return result.rowCount > 0;
  }

  async verifyPassword(user: User, password: string): Promise<boolean> {
    return bcrypt.compare(password, user.password_hash);
  }
}

export default new UserRepository();
