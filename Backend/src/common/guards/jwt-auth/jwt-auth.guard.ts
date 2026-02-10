import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PROTECT_KEY } from '../../decorators/auth.decorator';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private  readonly reflector: Reflector
  ) {
  }
  async canActivate(
    context: ExecutionContext,
  ):Promise<boolean> {
    const protectEntity = this.reflector.getAllAndOverride<boolean>(PROTECT_KEY,[
      context.getHandler(),
      context.getClass(),
    ]);

    if(!protectEntity) return true;

    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractToken(request);

    if(!token) throw new UnauthorizedException('Missing access token');

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });

      request['user'] = payload;
      return true;
    }catch {
      throw new UnauthorizedException('Invalid access token')
    }
  }

  private extractToken(req: Request): string | null {
    const authHeader = req.headers.authorization;

    if(authHeader) {
      const [type, token] = authHeader.split(' ');
      if(type === 'Bearer') return token;
    }

    console.log(req.cookies.accessToken);
    return (req as any).cookies?.accessToken ?? null;
  }
}
