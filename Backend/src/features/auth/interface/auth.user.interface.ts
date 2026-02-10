import { RolesEnum } from '../../../common/enum/role.enum';

export interface AuthUser {
  username: string;
  email: string;
  roles: RolesEnum[];
}
