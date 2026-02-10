import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthUser } from '../../../features/auth/interface/auth.user.interface';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../../decorators/auth.decorator';
import {Request} from 'express';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
  ) {}

  canActivate(
    context: ExecutionContext
  ): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles || requiredRoles.length === 0) return true;

    const req: Request = context.switchToHttp().getRequest();

    const user: AuthUser | undefined = req.user;

    if (user === undefined) return false;

    // console.log(user.roles);

    const userRoles: string[] = user?.roles ?? [];

    // console.log(requiredRoles, userRoles);

    // console.log(requiredRoles.some((r) => userRoles.includes(r)));
    return requiredRoles.some((r) => userRoles.includes(r));
  }
}
