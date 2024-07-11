import { Injectable } from "@nestjs/common";
import { ParkingSpotsRepo } from "./parking-spots.repo";
import { ParkingSpotDto } from "./dtos/parking-spot.dto";
import { ParkingSpotEntity } from "./entities/parking-spot.entity";

@Injectable()
export class ParkingSpotsService {
  constructor(private readonly parkingSpotsRepo: ParkingSpotsRepo) {}

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
