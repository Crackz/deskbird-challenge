import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ParkingSpotEntity } from "./entities/parking-spot.entity";
import { ParkingSpotsRepo } from "./parking-spots.repo";
import { ParkingSpotsService } from "./parking-spots.service";
import { ParkingSportsSeedService } from "./seeds/parking-spots.seed.service";
import { ParkingSpotsController } from "./parking-spots.controller";
import { UsersModule } from "../users/users.module";
import { CaslModule } from "nest-casl";
import { parkingSpotsPermissions } from "./parking-spots.permission";

@Module({
  imports: [
    TypeOrmModule.forFeature([ParkingSpotEntity]),
    CaslModule.forFeature({ permissions: parkingSpotsPermissions }),
    UsersModule,
  ],
  controllers: [ParkingSpotsController],
  providers: [ParkingSpotsService, ParkingSportsSeedService, ParkingSpotsRepo],
  exports: [ParkingSpotsService],
})
export class ParkingSpotsModule {}
