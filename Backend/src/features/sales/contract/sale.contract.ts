import { CreateSaleDto } from '../dto/create-sale.dto';
import { Sales } from '../../../database/entities/sales.entity';

export default abstract class SaleContract {
  abstract createOne(dto: CreateSaleDto): Promise<Sales>;
  abstract createMany(records: CreateSaleDto[] ): Promise<Sales[]>;
}