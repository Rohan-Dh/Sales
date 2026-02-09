import { ApiProperty } from '@nestjs/swagger';
import { CreateSaleDto } from './create-sale.dto';
import { ArrayMinSize, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateSaleBatchDto {
  @ApiProperty({type: [CreateSaleDto]})
  @ArrayMinSize(1)
  @ValidateNested({each: true})
  @Type(() => CreateSaleDto)
  records: CreateSaleDto[];
}