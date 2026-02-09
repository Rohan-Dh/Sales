import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Sales } from '../../database/entities/sales.entity';
import { Repository } from 'typeorm';
import SaleContract from './contract/sale.contract';
import { CreateSaleDto } from './dto/create-sale.dto';

@Injectable()
export class SalesService extends SaleContract {
  constructor(
    @InjectRepository(Sales) private readonly saleRepo: Repository<Sales>,
  ) {
    super();
  }
  async createOne(dto: CreateSaleDto): Promise<Sales> {
    const sale = this.saleRepo.create({
      agentName: dto.agentName.trim(),
      amountSold: dto.amountSold.toFixed(2),
      salesCount: dto.salesCount,
    });
    return this.saleRepo.save(sale);
  }
  createMany(records: CreateSaleDto[]): Promise<Sales[]> {
    const entities = records.map((dto) => this.saleRepo.create({
      agentName: dto.agentName.trim(),
      amountSold: dto.amountSold.toFixed(2),
      salesCount: dto.salesCount,
    }));
    return this.saleRepo.save(entities);
  }
}
