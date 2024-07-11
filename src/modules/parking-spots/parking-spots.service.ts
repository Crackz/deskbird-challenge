import { Injectable } from "@nestjs/common";
import { ParkingSpotsRepo } from "./parking-spots.repo";
import { ParkingSpotDto } from "./dtos/parking-spot.dto";
import { ParkingSpotEntity } from "./entities/parking-spot.entity";
import { BaseService } from "src/common/services/base.service";

@Injectable()
export class ParkingSpotsService extends BaseService<ParkingSpotEntity> {
  constructor(private readonly parkingSpotsRepo: ParkingSpotsRepo) {
    super(parkingSpotsRepo);
  }

  private mapToDto(parkingSpot: ParkingSpotEntity): ParkingSpotDto {
    return {
      id: parkingSpot.id,
      name: parkingSpot.name,
    };
  }

  async getAll(): Promise<ParkingSpotDto[]> {
    const parkingSports = await this.parkingSpotsRepo.find();
    return parkingSports.map((parkingSpot) => this.mapToDto(parkingSpot));
  }
}
