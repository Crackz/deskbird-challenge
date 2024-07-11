import { Module } from "@nestjs/common";
import { UsersService } from "./users.service";
import { UsersRepo } from "./users.repo";
import { UsersSeedService } from "./seeds/users.seed.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "./entities/user.entity";

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  providers: [UsersService, UsersSeedService, UsersRepo],
  exports: [UsersService],
})
export class UsersModule {}
