import { IsEmail, IsNotEmpty, IsString, IsStrongPassword } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UserLoginDto {
  @ApiProperty({ example: 'rohandhungana2002@gmail.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 'StrongP@ssw0rd123',
    description: 'Must satisfy IsStrongPassword()',
  })
  @IsString()
  @IsNotEmpty()
  @IsStrongPassword()
  password: string;
}