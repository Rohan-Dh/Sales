import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { Permission } from '../../../database/entities/permission.entity';
import { Repository } from 'typeorm';
import { Request } from 'express';
import { AuthUser } from '../../../features/auth/interface/auth.user.interface';
import { PERMS_KEY } from '../../decorators/auth.decorator';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    @InjectRepository(Permission)
    private readonly permRepo: Repository<Permission>,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPerm = this.reflector.getAllAndOverride<string[]>(PERMS_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // console.log("hello");

    if (!requiredPerm) return true;

    const request: Request = context.switchToHttp().getRequest();
    const user: AuthUser | undefined = request?.user;

    if (user === undefined) return false;

    const userRoles: string[] = user?.roles ?? [];
    if (userRoles.length === 0) return false;

    const dbPermissions = await this.permRepo
      .createQueryBuilder('permission')
      .innerJoin('role_permissions', 'rp', 'rp.permissionId = permission.id')
      .innerJoin('role', 'role', 'role.id = rp.roleId')
      .where('role.name IN (:...userRoles)', { userRoles })
      .select(['permission.code'])
      .distinct(true)
      .getMany();

    const userPermissionCodes = dbPermissions.map((p) => p.code.toUpperCase());

    // console.log(userPermissionCodes);

    return requiredPerm.some((p) =>
      userPermissionCodes.includes(p.toUpperCase()),
    );
  }
}
