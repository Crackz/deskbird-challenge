import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { BaseRepo } from "src/common/repos/base.repo";
import { Repository } from "typeorm";
import { UserEntity } from "./entities/user.entity";

@Injectable()
export class UsersRepo extends BaseRepo<UserEntity> {
  constructor(
    @InjectRepository(UserEntity) private repo: Repository<UserEntity>
  ) {
    super(repo);
  }
}
