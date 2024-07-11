import { UserEntity } from "src/modules/users/entities/user.entity";

export interface IPrincipal {
  user: UserEntity;
}
