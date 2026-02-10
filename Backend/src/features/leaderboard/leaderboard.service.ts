import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Sales } from '../../database/entities/sales.entity';
import { Repository } from 'typeorm';
import LeaderboardContract from './contract/leaderboard.contract';
import LeaderboardRow from './interface/Leaderboard.interface';

@Injectable()
export class LeaderboardService extends LeaderboardContract {
  constructor(
    @InjectRepository(Sales) private readonly saleRepo: Repository<Sales>,
  ) {
    super();
  }
  async getLeaderBoard(limit: number = 50, offset: number = 0): Promise<LeaderboardRow[]> {
    const data = await this.saleRepo
      .createQueryBuilder('s')
      .leftJoin('s.user', 'u')
      .select('u.name', 'agentName')
      .addSelect('SUM(s.amountSold)', 'totalSalesAmount')
      .addSelect('SUM(s.salesCount)', 'totalSalesCount')
      .groupBy('u.name')
      .orderBy('"totalSalesAmount"', 'DESC')
      .addOrderBy('"agentName"', 'ASC')
      .limit(limit)
      .offset(offset)
      .getRawMany<{
        agentName: string;
        totalSalesAmount: string;
        totalSalesCount: string;
      }>();

    // console.log(data);

    let rank = 0;
    let prevAmount: number | null = null;

    return data.map((r) => {
      console.log(r);
      const amount = Number(r.totalSalesAmount);
      if (prevAmount === null || amount !== prevAmount) rank += 1;
      prevAmount = amount;

      return {
        rank,
        agentName: r.agentName,
        totalSalesAmount: amount,
        totalSalesCount: Number(r.totalSalesCount),
      };
    });
  }
}
