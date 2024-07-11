import { Injectable } from "@nestjs/common";
import { UserEntity } from "./entities/user.entity";
import { UsersRepo } from "./users.repo";

@Injectable()
export class UsersService {
  constructor(private readonly usersRepo: UsersRepo) {}

  async findByToken(token: string): Promise<UserEntity | null> {
    return await this.usersRepo.findOne({ token: token });
  }
}
