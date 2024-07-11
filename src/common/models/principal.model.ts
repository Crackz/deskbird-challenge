import { UserEntity } from "src/modules/users/entities/user.entity";
import { IPrincipal } from "../interfaces/principal.interface";

export class Principal implements IPrincipal {
  constructor(public user: UserEntity) {}
}
