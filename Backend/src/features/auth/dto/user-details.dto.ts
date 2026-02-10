import {
  IsEmail,
  IsNotEmpty,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UserDetailsDto {
  @ApiProperty({ example: 'Rohan Dhungana' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'rohandhungana2002@gmail.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
