import { Injectable, OnApplicationBootstrap } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NodeEnvironment } from "src/common/constants";
import { EnvironmentVariables } from "src/common/env/environment-variables";
import { DeepWritable } from "src/common/types/writable";
import { ParkingSpotEntity } from "../entities/parking-spot.entity";
import { ParkingSpotsRepo } from "../parking-spots.repo";

@Injectable()
export class ParkingSportsSeedService implements OnApplicationBootstrap {
  constructor(
    private readonly configService: ConfigService<EnvironmentVariables>,
    private readonly parkingSportsRepo: ParkingSpotsRepo
  ) {}

  private async shouldSeed(): Promise<boolean> {
    const count = await this.parkingSportsRepo.count();
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
    const parkingSpots: DeepWritable<ParkingSpotEntity>[] = [];

    for (let i = 1; i <= 10; i++) {
      parkingSpots.push({
        name: `Parking Spot ${i}`,
      });
    }

    await this.parkingSportsRepo.insert(parkingSpots);
  }
}
