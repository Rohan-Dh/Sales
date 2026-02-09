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
    const query = this.saleRepo
      .createQueryBuilder()
      .select('s.agentName', 'agentName')
      .addSelect('SUM(CAST(s.amountSold AS numeric))', 'totalSalesAmount')
      .addSelect('SUM(s.salesCount)', 'totalSalesCount')
      .from('sales', 's')
      .groupBy('s.agentName')
      .orderBy('"totalSalesAmount"', 'DESC')
      .addOrderBy('"agentName"', 'ASC')
      .limit(limit)
      .offset(offset);

    const rows = await query.getRawMany<{
      agentName: string;
      totalSalesAmount: number;
      totalSalesCount: number;
    }>()

    console.log(rows);

    let rank = 0;
    let prevAmount: number | null = null;

    return rows.map((r, idx) => {
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
