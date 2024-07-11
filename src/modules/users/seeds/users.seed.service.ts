import { Injectable, OnApplicationBootstrap } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import {
  ADMIN_AUTH_TOKEN,
  NodeEnvironment,
  USER1_AUTH_TOKEN,
  USER2_AUTH_TOKEN,
} from "src/common/constants";
import { EnvironmentVariables } from "src/common/env/environment-variables";
import { DeepWritable } from "src/common/types/writable";
import { UserEntity } from "../entities/user.entity";
import { UserRole } from "../interfaces/users.interface";
import { UsersRepo } from "../users.repo";

@Injectable()
export class UsersSeedService implements OnApplicationBootstrap {
  constructor(
    private readonly configService: ConfigService<EnvironmentVariables>,
    private readonly usersRepo: UsersRepo
  ) {}

  private async shouldSeed(): Promise<boolean> {
    const count = await this.usersRepo.count();
    return count > 0 ? false : true;
  }

  async onApplicationBootstrap() {
    const isDevelopmentEnvironment =
      this.configService.get("NODE_ENV") === NodeEnvironment.DEVELOPMENT;
    if (!isDevelopmentEnvironment) {
      return;
    }

    const shouldSeed = await this.shouldSeed();
    if (!shouldSeed) {
      return;
    }

    await this.run();
  }

  async run(): Promise<void> {
    const admin: DeepWritable<UserEntity> = {
      firstName: "Admin First Name",
      lastName: "Admin Last Name",
      email: "admin@test.com",
      roles: [UserRole.ADMIN],
      token: ADMIN_AUTH_TOKEN,
    };

    const user1: DeepWritable<UserEntity> = {
      firstName: "User First Name 1",
      lastName: "User Last Name 1",
      email: "user1@test.com",
      roles: [UserRole.USER],
      token: USER1_AUTH_TOKEN,
    };

    const user2: DeepWritable<UserEntity> = {
      firstName: "User First Name 2",
      lastName: "User Last Name 2",
      email: "user2@test.com",
      roles: [UserRole.USER],
      token: USER2_AUTH_TOKEN,
    };

    await this.usersRepo.insert([admin, user1, user2]);
  }
}
