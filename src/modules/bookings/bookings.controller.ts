import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
import {
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiSecurity,
  ApiTags,
  ApiUnauthorizedResponse,
  ApiUnprocessableEntityResponse,
} from "@nestjs/swagger";
import { AccessGuard, Actions, UseAbility } from "nest-casl";
import { API_KEY_TOKEN } from "src/common/constants";
import { Principal } from "src/common/models/principal.model";
import { OpenApi } from "src/common/utils";
import { CurrentPrincipal } from "../auth/decorators/principal.decorator";
import { TokenAuthGuard } from "../auth/guards/auth.guard";
import { BookingsService } from "./bookings.service";
import { BookingDto } from "./dtos/booking.dto";
import { CreateBookingDto } from "./dtos/create-booking.dto";
import { UpdateBookingDto } from "./dtos/update-booking.dto";
import { BookingEntity } from "./entities/booking.entity";
import { ErrorMessages } from "src/common/interfaces/api-errors.interface";

@ApiTags("Bookings")
@ApiSecurity(API_KEY_TOKEN)
@ApiUnauthorizedResponse(OpenApi.getApiUnauthorizedResponseErrorOpts())
@ApiForbiddenResponse(OpenApi.getApiForbiddenResponseErrorOpts())
@Controller("/parking-spots/:parkingSpotId/bookings")
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @ApiNotFoundResponse(
    OpenApi.getApiErrorOpts([
      {
        param: "parkingSpotId",
        message: ErrorMessages.NOT_FOUND,
      },
    ])
  )
  @UseGuards(TokenAuthGuard, AccessGuard)
  @UseAbility(Actions.read, BookingEntity)
  @Get("/")
  async getAll(
    @Param("parkingSpotId") parkingSpotId: string
  ): Promise<BookingDto[]> {
    return await this.bookingsService.getAll(parkingSpotId);
  }

  @ApiBadRequestResponse(
    OpenApi.getApiErrorOpts([
      {
        message: "startDate must be greater than endDate",
        param: "invalidStartDate",
      },
      {
        message: "endDate must be a date in the future",
        param: "invalidEndDate",
      },
      {
        message: "found an existing booking with the given dates",
        param: "overlappingBooking",
      },
    ])
  )
  @ApiNotFoundResponse(
    OpenApi.getApiErrorOpts([
      {
        param: "parkingSpotId",
        message: ErrorMessages.NOT_FOUND,
      },
    ])
  )
  @ApiUnprocessableEntityResponse(OpenApi.getApiUnprocessableEntityErrorOpts())
  @UseGuards(TokenAuthGuard, AccessGuard)
  @UseAbility(Actions.create, BookingEntity)
  @Post("/")
  async create(
    @Param("parkingSpotId") parkingSpotId: string,
    @Body() createBookingDto: CreateBookingDto,
    @CurrentPrincipal() principal: Principal
  ): Promise<BookingDto> {
    return await this.bookingsService.create(
      parkingSpotId,
      createBookingDto,
      principal.user
    );
  }

  @ApiBadRequestResponse(
    OpenApi.getApiErrorOpts([
      {
        message: "startDate must be greater than endDate",
        param: "invalidStartDate",
      },
      {
        message: "endDate must be a date in the future",
        param: "invalidEndDate",
      },
      {
        message: "found an existing booking with the given dates",
        param: "overlappingBooking",
      },
    ])
  )
  @ApiNotFoundResponse(
    OpenApi.getApiErrorOpts([
      {
        param: "parkingSpotId",
        message: ErrorMessages.NOT_FOUND,
      },
      {
        param: "bookingId",
        message: ErrorMessages.NOT_FOUND,
      },
    ])
  )
  @ApiUnprocessableEntityResponse(OpenApi.getApiUnprocessableEntityErrorOpts())
  @ApiNoContentResponse(OpenApi.getApiNoContentResponseErrorOpts())
  @UseGuards(TokenAuthGuard, AccessGuard)
  @UseAbility(Actions.update, BookingEntity)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Patch("/:bookingId")
  async patch(
    @Param("parkingSpotId") parkingSpotId: string,
    @Param("bookingId") bookingId: string,
    @Body() updateBookingDto: UpdateBookingDto,
    @CurrentPrincipal() principal: Principal
  ): Promise<void> {
    await this.bookingsService.patchOne(
      parkingSpotId,
      bookingId,
      updateBookingDto,
      principal.user
    );
  }

  @ApiNotFoundResponse(
    OpenApi.getApiErrorOpts([
      {
        param: "parkingSpotId",
        message: ErrorMessages.NOT_FOUND,
      },
      {
        param: "bookingId",
        message: ErrorMessages.NOT_FOUND,
      },
    ])
  )
  @ApiNoContentResponse(OpenApi.getApiNoContentResponseErrorOpts())
  @UseGuards(TokenAuthGuard, AccessGuard)
  @UseAbility(Actions.delete, BookingEntity)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete("/:bookingId")
  async delete(
    @Param("parkingSpotId") parkingSpotId: string,
    @Param("bookingId") bookingId: string,
    @CurrentPrincipal() principal: Principal
  ): Promise<void> {
    await this.bookingsService.deleteOne(
      parkingSpotId,
      bookingId,
      principal.user
    );
  }
}
