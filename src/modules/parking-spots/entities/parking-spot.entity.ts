import { PARKING_SPORTS_MODEL_NAME } from "src/common/constants";
import { BaseEntity } from "src/common/entities/base.entity";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: PARKING_SPORTS_MODEL_NAME })
export class ParkingSpotEntity extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  readonly id: string;

  @Column()
  name: string;
}
