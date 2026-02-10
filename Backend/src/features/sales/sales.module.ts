import { Module } from '@nestjs/common';
import { SalesController } from './sales.controller';
import { SalesService } from './sales.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sales } from '../../database/entities/sales.entity';
import SaleContract from './contract/sale.contract';
import { User } from '../../database/entities/user.entity';
import { Role } from '../../database/entities/role.entity';
import { Permission } from '../../database/entities/permission.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Sales, User, Role, Permission])],
  controllers: [SalesController],
  providers: [
    {
      provide: SaleContract,
      useClass: SalesService,
    }
  ],
})
export class SalesModule {}
