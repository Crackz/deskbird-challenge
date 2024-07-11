import { Test, TestingModule } from "@nestjs/testing";
import { Principal } from "src/common/models/principal.model";
import { UserEntity } from "src/modules/users/entities/user.entity";
import { BookingsController } from "../bookings.controller";
import { BookingsService } from "../bookings.service";
import { CreateBookingDto } from "../dtos/create-booking.dto";
import { UpdateBookingDto } from "../dtos/update-booking.dto";
import { getBookingsDtosStub } from "./stubs/bookings-dtos.stub";
import { getParkingSpotEntityStub } from "./stubs/parking-spot-entity.stub";
import { getUser1Stub } from "./stubs/user.stub";
import { getBookingEntitiesStub } from "./stubs/booking-entities.stub";
import { UsersService } from "src/modules/users/users.service";
import { CaslModule } from "nest-casl";
import { bookingsPermissions } from "../bookings.permission";
import { AUTHENTICATED_USER_ATTRIBUTE_NAME } from "src/common/constants";
import { UserRole } from "src/modules/users/interfaces/users.interface";
import { getAdminStub } from "./stubs/admin.stub";

describe("BookingsController", () => {
  let controller: BookingsController;
  let bookingsService: jest.Mocked<BookingsService>;

  const mockBookingsService = {
    getAll: jest.fn(),
    create: jest.fn(),
    patchOne: jest.fn(),
    deleteOne: jest.fn(),
  };

  const mockUsersService = {
    findByToken: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        CaslModule.forRoot<UserRole>({
          getUserFromRequest: (request) =>
            request[AUTHENTICATED_USER_ATTRIBUTE_NAME],
        }),
        CaslModule.forFeature({ permissions: bookingsPermissions }),
      ],
      controllers: [BookingsController],
      providers: [
        {
          provide: BookingsService,
          useValue: mockBookingsService,
        },
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    controller = module.get<BookingsController>(BookingsController);
    bookingsService = module.get(BookingsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getAll", () => {
    it("should return an array of bookings", async () => {
      const parkingSpotId = getParkingSpotEntityStub().id;
      const bookingsDtos = getBookingsDtosStub();

      bookingsService.getAll.mockResolvedValue(bookingsDtos);

      const result = await controller.getAll(parkingSpotId);

      expect(bookingsService.getAll).toHaveBeenCalledWith(parkingSpotId);
      expect(result).toEqual(bookingsDtos);
    });
  });

  describe("create", () => {
    it("should create a new booking if it's created by a user", async () => {
      const parkingSpotId = getParkingSpotEntityStub().id;
      const bookingDto = getBookingsDtosStub()[0];
      const principal: Principal = {
        user: getUser1Stub(),
      };

      const createBookingDto: CreateBookingDto = {
        startDateInTimestampMillis: new Date(bookingDto.startDate).valueOf(),
        endDateInTimestampMillis: new Date(bookingDto.endDate).valueOf(),
      };

      bookingsService.create.mockResolvedValue(bookingDto);

      const result = await controller.create(
        parkingSpotId,
        createBookingDto,
        principal
      );

      expect(bookingsService.create).toHaveBeenCalledWith(
        parkingSpotId,
        createBookingDto,
        principal.user
      );
      expect(result).toEqual(bookingDto);
    });

    it("should create a new booking if it's created by an admin", async () => {
      const parkingSpotId = getParkingSpotEntityStub().id;
      const bookingDto = getBookingsDtosStub()[0];
      const principal: Principal = {
        user: getAdminStub(),
      };

      const createBookingDto: CreateBookingDto = {
        startDateInTimestampMillis: new Date(bookingDto.startDate).valueOf(),
        endDateInTimestampMillis: new Date(bookingDto.endDate).valueOf(),
      };

      bookingsService.create.mockResolvedValue(bookingDto);

      const result = await controller.create(
        parkingSpotId,
        createBookingDto,
        principal
      );

      expect(bookingsService.create).toHaveBeenCalledWith(
        parkingSpotId,
        createBookingDto,
        principal.user
      );
      expect(result).toEqual(bookingDto);
    });
  });

  // TODO: Handle patch, delete booking (similar to the bookings service tests)
});
