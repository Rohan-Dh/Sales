import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsNumber, IsPositive, IsString, Min } from 'class-validator';

export class CreateSaleDto {
  @ApiProperty({example: 'Ram Sharma'})
  @IsString()
  @IsNotEmpty()
  agentName: string;

  @ApiProperty({example: 120000})
  @IsNumber()
  @IsPositive()
  amountSold: number;

  @ApiProperty({example: 3, description: 'Number of sales'})
  @IsInt()
  @Min(1)
  salesCount: number;
}