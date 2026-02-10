import { Controller, Get, Query } from '@nestjs/common';
import LeaderboardContract from './contract/leaderboard.contract';
import { ApiQuery } from '@nestjs/swagger';
import {
  JwtProtect,
  PermissionProtect,
  RolesProtect,
} from '../../common/decorators/auth.decorator';
import { RolesEnum } from '../../common/enum/role.enum';
import { PermissionEnum } from '../../common/enum/permission.enum';

@JwtProtect()
@RolesProtect(RolesEnum.ADMIN)
@Controller('leaderboard')
export class LeaderboardController {
  constructor(private readonly leaderboard: LeaderboardContract) {}

  @PermissionProtect(PermissionEnum.VIEW_LEADERBOARD)
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'offset', required: false })
  @Get()
  async getLeaderboard(
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    const l = Math.min(Math.max(parseInt(limit ?? '50', 10), 1), 500);
    const o = Math.max(parseInt(offset ?? '0', 10), 0);

    const data = await this.leaderboard.getLeaderBoard(l, o);

    return {
      limit: l,
      offset: o,
      results: data,
    };
  }
}
