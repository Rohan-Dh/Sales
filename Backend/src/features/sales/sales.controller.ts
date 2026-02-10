import { Body, Controller, Post } from '@nestjs/common';
import SaleContract from './contract/sale.contract';
import { CreateSaleDto } from './dto/create-sale.dto';
import { CreateSaleBatchDto } from './dto/create-sale-batch.dto';
import {
  JwtProtect,
  PermissionProtect,
  RolesProtect,
} from '../../common/decorators/auth.decorator';
import { RolesEnum } from '../../common/enum/role.enum';
import { PermissionEnum } from '../../common/enum/permission.enum';

@JwtProtect()
@RolesProtect(RolesEnum.AGENT, RolesEnum.ADMIN)
@Controller('sales')
export class SalesController {
  constructor(private readonly sale: SaleContract) {
  }

  @PermissionProtect(PermissionEnum.CREATE_SINGLE_ENTRY)
  @Post()
  async singleSale(@Body() dto: CreateSaleDto) {
    const oneSale = await this.sale.createOne(dto);
    return {
      success: true,
      message: 'single sale created successfully.',
      sale: oneSale
    }
  }

  @PermissionProtect(PermissionEnum.CREATE_MULTIPLE_ENTRY)
  @Post('batch')
  async manySale(@Body() dto: CreateSaleBatchDto) {
    const manySale = await this.sale.createMany(dto.records);
    return {
      success: true,
      message: 'many sales created successfully.',
      sale: manySale,
    }
  }
}
