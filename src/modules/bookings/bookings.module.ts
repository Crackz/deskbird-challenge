import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CaslModule } from "nest-casl";
import { UsersModule } from "../users/users.module";
import { BookingsController } from "./bookings.controller";
import { bookingsPermissions } from "./bookings.permission";
import { BookingsRepo } from "./bookings.repo";
import { BookingsService } from "./bookings.service";
import { BookingEntity } from "./entities/booking.entity";
import { ParkingSpotsModule } from "../parking-spots/parking-spots.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([BookingEntity]),
    CaslModule.forFeature({ permissions: bookingsPermissions }),
    UsersModule,
    ParkingSpotsModule,
  ],
  controllers: [BookingsController],
  providers: [BookingsService, BookingsRepo],
})
export class BookingsModule {}
