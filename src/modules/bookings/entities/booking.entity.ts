import { BOOKINGS_MODEL_NAME } from "src/common/constants";
import { BaseEntity } from "src/common/entities/base.entity";
import { ParkingSpotEntity } from "src/modules/parking-spots/entities/parking-spot.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: BOOKINGS_MODEL_NAME })
export class BookingEntity extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  readonly id: string;

  @Column({ type: "uuid" })
  userId: string;

  @Column({ type: "uuid" })
  parkingSpotId: string;

  @ManyToOne(() => ParkingSpotEntity, (parkingSpot) => parkingSpot.id, {
    onDelete: "CASCADE",
  })
  readonly parkingSpot: ParkingSpotEntity;

  @Column()
  startDate: Date;

  @Column()
  endDate: Date;
}
