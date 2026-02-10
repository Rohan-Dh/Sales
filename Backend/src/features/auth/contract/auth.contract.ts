import { UserLoginDto } from '../dto/user-login.dto';
import { UserRegisterDto } from '../dto/user-register.dto';
import { UserDetailsDto } from '../dto/user-details.dto';

export default abstract class AuthContract {
  abstract login(
    data: UserLoginDto,
  ): Promise<{ accessToken: string; refreshToken: string }>;
  abstract signup(
    data: UserRegisterDto,
    isAdmin: boolean,
  ): Promise<UserDetailsDto>;
  abstract refresh(
    refreshToken: string,
  ): Promise<{ accessToken: string; refreshToken: string }>;
}