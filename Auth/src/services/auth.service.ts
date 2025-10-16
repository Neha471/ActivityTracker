import { Request } from 'express';
import jwt from 'jsonwebtoken';
import { HttpException } from '../middlewares/error.middleware';
import refreshTokenRepository from '../repositories/refresh-token.repository';
import userRepository, { CreateUserInput } from '../repositories/user.repository';

class AuthService {
  private readonly JWT_SECRET: string;
  private readonly JWT_EXPIRES_IN: string;

  constructor() {
    this.JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
    this.JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';
  }

  private generateJwtToken(user: { id: number; email: string }): string {
    const payload = { 
      id: user.id, 
      email: user.email 
    };

    return jwt.sign(
      payload,
      this.JWT_SECRET,
      { expiresIn: this.JWT_EXPIRES_IN } as jwt.SignOptions
    );
  }

  private getIpAddress(req: Request): string {
    return (req.headers['x-forwarded-for'] as string)?.split(',')[0] || 
           req.socket.remoteAddress || 
           'unknown';
  }

  async register(userData: CreateUserInput) {
    const existingUser = await userRepository.findByEmail(userData.email);
    if (existingUser) {
      throw new HttpException(400, 'Email already in use');
    }
    const user = await userRepository.createUser(userData);
    
    const token = this.generateJwtToken(user);
    
    return {
      user,
      token
    };
  }

  async login(email: string, password: string, req: Request) {
    const user = await userRepository.findByEmail(email);
    if (!user) {
      throw new HttpException(401, 'Invalid credentials');
    }
    const isPasswordValid = await userRepository.verifyPassword(user, password);
    if (!isPasswordValid) {
      throw new HttpException(401, 'Invalid credentials');
    }

    if (!user.is_active) {
      throw new HttpException(403, 'Account is deactivated');
    }
    const token = this.generateJwtToken(user);
    const refreshToken = await refreshTokenRepository.createToken(user.id, this.getIpAddress(req));
    
    return {
      user: {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        is_verified: user.is_verified
      },
      token,
      refreshToken: refreshToken.token
    };
  }

  async refreshToken(token: string, req: Request) {
    const refreshToken = await refreshTokenRepository.getToken(token);
    if (!refreshToken) {
      throw new HttpException(401, 'Invalid token');
    }
    const user = await userRepository.findById(refreshToken.user_id);
    if (!user) {
      throw new HttpException(401, 'User not found');
    }
    const newToken = this.generateJwtToken(user);
    const newRefreshToken = await refreshTokenRepository.createToken(user.id, this.getIpAddress(req));
    await refreshTokenRepository.revokeToken(token, this.getIpAddress(req));

    return {
      token: newToken,
      refreshToken: newRefreshToken.token
    };
  }

  async revokeToken(token: string, req: Request): Promise<boolean> {
    return refreshTokenRepository.revokeToken(token, this.getIpAddress(req));
  }

  async revokeAllTokens(userId: number, req: Request): Promise<boolean> {
    return refreshTokenRepository.revokeAllUserTokens(userId, this.getIpAddress(req));
  }

  verifyToken(token: string): { id: number; email: string } | null {
    try {
      return jwt.verify(token, this.JWT_SECRET) as { id: number; email: string };
    } catch (error) {
      return null;
    }
  }

  async getCurrentUser(userId: number) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new HttpException(404, 'User not found');
    }
    
    return {
      id: user.id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      isActive: user.is_active,
      isVerified: user.is_verified,
      createdAt: user.created_at,
      updatedAt: user.updated_at
    };
  }
}

export default new AuthService();
