import { Controller, Post, Body, Get, Req, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import type { Request } from 'express';

@Controller('api/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  /**
   * POST /api/auth/register
   * Register a new user
   */
  @Post('register')
  async register(
    @Body() body: { email: string; password: string; name: string },
  ) {
    const { email, password, name } = body;

    if (!email || !password || !name) {
      return {
        success: false,
        message: 'Email, password, and name are required',
      };
    }

    return await this.authService.register(email, password, name);
  }

  /**
   * POST /api/auth/login
   * Login user and get custom token
   */
  @Post('login')
  async login(@Body() body: { uid: string }) {
    const { uid } = body;

    if (!uid) {
      return {
        success: false,
        message: 'UID is required',
      };
    }

    return await this.authService.login(uid);
  }

  /**
   * POST /api/auth/verify
   * Verify ID token
   */
  @Post('verify')
  async verify(@Body() body: { idToken: string }) {
    const { idToken } = body;

    if (!idToken) {
      return {
        success: false,
        message: 'ID token is required',
      };
    }

    return await this.authService.verifyToken(idToken);
  }

  /**
   * GET /api/auth/profile
   * Get user profile (requires authorization header)
   */
  @Get('profile')
  async getProfile(@Req() request: Request) {
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException('No authorization header');
    }

    const token = authHeader.split(' ')[1];
    const result = await this.authService.verifyToken(token);

    if (!result.success || !result.userId) {
      throw new UnauthorizedException('Invalid token');
    }

    return await this.authService.getUserProfile(result.userId);
  }
}
