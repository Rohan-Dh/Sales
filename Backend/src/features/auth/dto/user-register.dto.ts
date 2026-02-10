import { IsEmail, IsNotEmpty, IsString, IsStrongPassword } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UserRegisterDto {
  @ApiProperty({ example: 'Rohan' })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ example: 'Dhungana' })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({ example: 'rohandhungana2002@gmail.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'StrongP@ssw0rd123' })
  @IsStrongPassword()
  @IsNotEmpty()
  @IsString()
  password: string;

  @ApiProperty({
    example: 'StrongP@ssw0rd123',
    description: 'Must match password (validate in service/custom validator)',
  })
  @IsStrongPassword()
  @IsNotEmpty()
  @IsString()
  confirmPassword: string;
}