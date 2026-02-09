import { Module } from '@nestjs/common';
import { SalesController } from './sales.controller';
import { SalesService } from './sales.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sales } from '../../database/entities/sales.entity';
import SaleContract from './contract/sale.contract';

@Module({
  imports: [TypeOrmModule.forFeature([Sales])],
  controllers: [SalesController],
  providers: [
    {
      provide: SaleContract,
      useClass: SalesService,
    }
  ],
})
export class SalesModule {}
