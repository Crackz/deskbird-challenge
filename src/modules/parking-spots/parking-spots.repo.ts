import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { BaseRepo } from "src/common/repos/base.repo";
import { Repository } from "typeorm";
import { ParkingSpotEntity } from "./entities/parking-spot.entity";

@Injectable()
export class ParkingSpotsRepo extends BaseRepo<ParkingSpotEntity> {
  constructor(
    @InjectRepository(ParkingSpotEntity)
    private repo: Repository<ParkingSpotEntity>
  ) {
    super(repo);
  }
}
