import { HttpStatus, Injectable } from "@nestjs/common";
import * as dayjs from "dayjs";
import { Dayjs } from "dayjs";
import { BaseService } from "src/common/services/base.service";
import { ApiErrors } from "src/common/utils";
import { ParkingSpotsService } from "../parking-spots/parking-spots.service";
import { UserEntity } from "../users/entities/user.entity";
import { UserRole } from "../users/interfaces/users.interface";
import { BookingsRepo } from "./bookings.repo";
import { BookingDto } from "./dtos/booking.dto";
import { CreateBookingDto } from "./dtos/create-booking.dto";
import { UpdateBookingDto } from "./dtos/update-booking.dto";
import { BookingEntity } from "./entities/booking.entity";

@Injectable()
export class BookingsService extends BaseService<BookingEntity> {
  constructor(
    private readonly bookingsRepo: BookingsRepo,
    private readonly parkingSpotsService: ParkingSpotsService
  ) {
    super(bookingsRepo);
  }

  private checkBookingDates(startDate: Dayjs, endDate: Dayjs): void {
    // Info: I assume that it's okay to create a booking in the past

    if (startDate.isSame(endDate) || startDate.isAfter(endDate)) {
      throw ApiErrors.BadRequest({
        message: "startDate must be greater than endDate",
        param: "invalidStartDate",
      });
    }

    const nowDate = dayjs();
    if (endDate.isBefore(nowDate)) {
      throw ApiErrors.BadRequest({
        message: "endDate must be a date in the future",
        param: "invalidEndDate",
      });
    }
  }

  private async checkBookingOverlaps(
    startDate: Dayjs,
    endDate: Dayjs,
    opts?: { exceptId?: string }
  ): Promise<void> {
    const existBooking = await this.bookingsRepo.findOneByDateRange(
      startDate.toDate(),
      endDate.toDate(),
      opts
    );

    if (existBooking) {
      throw ApiErrors.BadRequest({
        message: "found an existing booking with the given dates",
        param: "overlappingBooking",
      });
    }
  }

  private mapToDto(booking: BookingEntity): BookingDto {
    return {
      id: booking.id,
      startDate: dayjs(booking.startDate).toISOString(),
      endDate: dayjs(booking.endDate).toISOString(),
      createdAt: dayjs(booking.createdAt).toISOString(),
      updatedAt: dayjs(booking.updatedAt).toISOString(),
    };
  }

  private checkAuthorization(currentUser: UserEntity, booking: BookingEntity) {
    if (currentUser.roles.includes(UserRole.ADMIN)) {
      return;
    }

    if (currentUser.id !== booking.userId) {
      throw ApiErrors.Forbidden("You are not allowed to update this resource");
    }
  }

  async getAll(parkingSlotId: string): Promise<BookingDto[]> {
    const parkingSpot = await this.parkingSpotsService.checkExist(
      parkingSlotId,
      { param: "parkingSpotId", statusCode: HttpStatus.NOT_FOUND }
    );

    const bookings = await this.bookingsRepo.find({
      parkingSpotId: parkingSpot.id,
    });

    return bookings.map((booking) => this.mapToDto(booking));
  }

  async create(
    parkingSlotId: string,
    createBookingDto: CreateBookingDto,
    currentUser: UserEntity
  ): Promise<BookingDto> {
    const parkingSpot = await this.parkingSpotsService.checkExist(
      parkingSlotId,
      { param: "parkingSpotId", statusCode: HttpStatus.NOT_FOUND }
    );

    const startDate = dayjs(createBookingDto.startDateInTimestampMillis);
    const endDate = dayjs(createBookingDto.endDateInTimestampMillis);

    this.checkBookingDates(startDate, endDate);
    await this.checkBookingOverlaps(startDate, endDate);

    const booking = await this.bookingsRepo.create({
      parkingSpotId: parkingSpot.id,
      userId: currentUser.id,
      startDate: startDate.toDate(),
      endDate: endDate.toDate(),
    });

    return this.mapToDto(booking);
  }

  async patchOne(
    parkingSlotId: string,
    bookingId: string,
    updateBookingDto: UpdateBookingDto,
    currentUser: UserEntity
  ): Promise<void> {
    const parkingSpot = await this.parkingSpotsService.checkExist(
      parkingSlotId,
      {
        param: "parkingSpotId",
        statusCode: HttpStatus.NOT_FOUND,
      }
    );

    const booking = await this.checkExist(bookingId, {
      param: "bookingId",
      statusCode: HttpStatus.NOT_FOUND,
    });

    if (booking.parkingSpotId !== parkingSpot.id) {
      throw ApiErrors.NotFound({ param: "bookingId" });
    }

    this.checkAuthorization(currentUser, booking);

    const startDate = dayjs(updateBookingDto.startDateInTimestampMillis);
    const endDate = dayjs(updateBookingDto.endDateInTimestampMillis);

    this.checkBookingDates(startDate, endDate);
    await this.checkBookingOverlaps(startDate, endDate, {
      exceptId: bookingId,
    });

    await this.bookingsRepo.findByIdAndUpdate(bookingId, {
      startDate: startDate.toDate(),
      endDate: endDate.toDate(),
    });
  }

  async deleteOne(
    parkingSlotId: string,
    bookingId: string,
    currentUser: UserEntity
  ): Promise<void> {
    const parkingSpot = await this.parkingSpotsService.checkExist(
      parkingSlotId,
      {
        param: "parkingSpotId",
        statusCode: HttpStatus.NOT_FOUND,
      }
    );

    const booking = await this.checkExist(bookingId, {
      param: "bookingId",
      statusCode: HttpStatus.NOT_FOUND,
    });

    if (booking.parkingSpotId !== parkingSpot.id) {
      throw ApiErrors.NotFound({ param: "bookingId" });
    }

    this.checkAuthorization(currentUser, booking);

    await this.bookingsRepo.deleteById(bookingId);
  }
}
