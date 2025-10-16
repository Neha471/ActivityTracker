import { randomBytes } from 'crypto';
import * as queries from './queries/user.queries';
import db from '../config/database';

export interface RefreshToken {
  id: number;
  user_id: number;
  token: string;
  expires_at: Date;
  created_at: Date;
  created_by_ip: string;
  revoked_at: Date | null;
  revoked_by_ip: string | null;
  replaced_by_token: string | null;
}

class RefreshTokenRepository {
  private static readonly TOKEN_LENGTH = 40;
  private static readonly EXPIRES_IN_DAYS = 7;

  generateToken(): { token: string; expiresAt: Date } {
    const token = randomBytes(RefreshTokenRepository.TOKEN_LENGTH).toString('hex');
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + RefreshTokenRepository.EXPIRES_IN_DAYS);

    return { token, expiresAt };
  }

  async createToken(userId: number, ipAddress: string): Promise<RefreshToken> {
    const { token, expiresAt } = this.generateToken();
    
    const result = await db.query(queries.CREATE_REFRESH_TOKEN, [
      userId,
      token,
      expiresAt,
      ipAddress
    ]);

    return result.rows[0];
  }

  async getToken(token: string): Promise<RefreshToken | null> {
    const result = await db.query(queries.FIND_REFRESH_TOKEN, [token]);
    return result.rows[0] || null;
  }

  async revokeToken(token: string, ipAddress: string): Promise<boolean> {
    const result = await db.query(queries.REVOKE_REFRESH_TOKEN, [token, ipAddress]);
    return result.rowCount > 0;
  }

  async revokeAllUserTokens(userId: number, ipAddress: string): Promise<boolean> {
    const result = await db.query(queries.REVOKE_USER_REFRESH_TOKENS, [userId, ipAddress]);
    return result.rowCount > 0;
  }
}

export default new RefreshTokenRepository();
