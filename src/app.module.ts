import { Logger, Module, OnModuleInit } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CaslModule } from "nest-casl";
import { DataSource } from "typeorm";
import {
  AUTHENTICATED_USER_ATTRIBUTE_NAME,
  NodeEnvironment,
} from "./common/constants";
import { EnvironmentVariables } from "./common/env/environment-variables";
import { validateEnvironmentVariables } from "./common/env/validation";
import { envFilePaths } from "./config";
import { typeormConfig } from "./config/typeorm";
import { ParkingSpotsModule } from "./modules/parking-spots/parking-spots.module";
import { UserRole } from "./modules/users/interfaces/users.interface";
import { UsersModule } from "./modules/users/users.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: envFilePaths,
      load: [typeormConfig],
      validate: validateEnvironmentVariables,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return configService.get("typeorm");
      },
    }),
    UsersModule,
    ParkingSpotsModule,
    CaslModule.forRoot<UserRole>({
      getUserFromRequest: (request) =>
        request[AUTHENTICATED_USER_ATTRIBUTE_NAME],
    }),
  ],
})
export class AppModule implements OnModuleInit {
  private readonly logger = new Logger(AppModule.name);

  constructor(
    private dataSource: DataSource,
    private configService: ConfigService<EnvironmentVariables>
  ) {}
  async onModuleInit() {
    if (
      this.configService.get("NODE_ENV") === NodeEnvironment.DEVELOPMENT ||
      this.configService.get("NODE_ENV") === NodeEnvironment.TESTING
    ) {
      await this.dataSource.runMigrations();
      this.logger.log("Migrations Are Executed");
    }
  }
}
