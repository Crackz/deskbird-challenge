import { Test, TestingModule } from "@nestjs/testing";
import { ApiErrors } from "src/common/utils";
import { ParkingSpotsService } from "src/modules/parking-spots/parking-spots.service";
import { UserEntity } from "src/modules/users/entities/user.entity";
import { UserRole } from "src/modules/users/interfaces/users.interface";
import { BookingsRepo } from "../bookings.repo";
import { BookingsService } from "../bookings.service";
import { BookingEntity } from "../entities/booking.entity";
import { ParkingSpotEntity } from "src/modules/parking-spots/entities/parking-spot.entity";
import { getBookingEntitiesStub } from "./stubs/booking-entities.stub";
import { getParkingSpotEntityStub } from "./stubs/parking-spot-entity.stub";
import { ErrorMessages } from "src/common/interfaces/api-errors.interface";
import * as dayjs from "dayjs";
import { CreateBookingDto } from "../dtos/create-booking.dto";
import { getAdminStub as getAdminEntityStub } from "./stubs/admin.stub";
import { getUser1Stub, getUser2Stub } from "./stubs/user.stub";
import { UpdateBookingDto } from "../dtos/update-booking.dto";

describe("BookingsService", () => {
  let service: BookingsService;
  let bookingsRepo: jest.Mocked<BookingsRepo>;
  let parkingSpotsService: jest.Mocked<ParkingSpotsService>;

  const mockBookingsRepo = {
    findOneByDateRange: jest.fn(),
    find: jest.fn(),
    create: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    deleteById: jest.fn(),
  };

  const mockParkingSpotsService = {
    checkExist: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookingsService,
        { provide: BookingsRepo, useValue: mockBookingsRepo },
        { provide: ParkingSpotsService, useValue: mockParkingSpotsService },
      ],
    }).compile();

    service = module.get<BookingsService>(BookingsService);
    bookingsRepo = module.get(BookingsRepo);
    parkingSpotsService = module.get(ParkingSpotsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getAll", () => {
    it("should return all bookings for a parking spot", async () => {
      const parkingSpotEntityStub = getParkingSpotEntityStub();
      const bookingsEntitiesStub = getBookingEntitiesStub();
      parkingSpotsService.checkExist.mockResolvedValue(parkingSpotEntityStub);
      bookingsRepo.find.mockResolvedValue(bookingsEntitiesStub);

      const result = await service.getAll(parkingSpotEntityStub.id);

      expect(parkingSpotsService.checkExist).toHaveBeenCalledWith(
        parkingSpotEntityStub.id,
        expect.any(Object)
      );
      expect(bookingsRepo.find).toHaveBeenCalledTimes(1);
      expect(result).toHaveLength(2);
      expect(result).toMatchObject([
        {
          id: bookingsEntitiesStub[0].id,
          startDate: bookingsEntitiesStub[0].startDate.toISOString(),
          endDate: bookingsEntitiesStub[0].endDate.toISOString(),
          createdAt: bookingsEntitiesStub[0].createdAt.toISOString(),
          updatedAt: bookingsEntitiesStub[0].updatedAt.toISOString(),
        },
        {
          id: bookingsEntitiesStub[1].id,
          startDate: bookingsEntitiesStub[1].startDate.toISOString(),
          endDate: bookingsEntitiesStub[1].endDate.toISOString(),
          createdAt: bookingsEntitiesStub[1].createdAt.toISOString(),
          updatedAt: bookingsEntitiesStub[1].updatedAt.toISOString(),
        },
      ]);
    });

    it("should throw an error if parking spot does not exist", async () => {
      const parkingSpotEntityStub = getParkingSpotEntityStub();
      const notFoundError = ApiErrors.NotFound({
        param: "parkingSpotId",
        message: ErrorMessages.NOT_FOUND,
      });

      parkingSpotsService.checkExist.mockRejectedValue(notFoundError);

      await expect(service.getAll(parkingSpotEntityStub.id)).rejects.toThrow(
        notFoundError
      );
    });
  });

  describe("create", () => {
    it("should create a new booking when it's created by an admin user", async () => {
      const startDate = dayjs().subtract(1, "hour");
      const endDate = dayjs().add(1, "hour");
      const user = getAdminEntityStub();
      const parkingSpot = getParkingSpotEntityStub();

      const createBookingDto: CreateBookingDto = {
        startDateInTimestampMillis: startDate.valueOf(),
        endDateInTimestampMillis: endDate.valueOf(),
      };

      const mockedBookingEntity = getBookingEntitiesStub()[0];

      parkingSpotsService.checkExist.mockResolvedValue(parkingSpot);
      bookingsRepo.findOneByDateRange.mockResolvedValue(null);
      bookingsRepo.create.mockResolvedValue(mockedBookingEntity);

      const result = await service.create(
        parkingSpot.id,
        createBookingDto,
        user
      );

      expect(parkingSpotsService.checkExist).toHaveBeenCalledWith(
        parkingSpot.id,
        expect.any(Object)
      );
      expect(bookingsRepo.findOneByDateRange).toHaveBeenCalled();
      expect(bookingsRepo.create).toHaveBeenCalledWith(
        expect.objectContaining({
          parkingSpotId: parkingSpot.id,
          userId: user.id,
          startDate: startDate.toDate(),
          endDate: endDate.toDate(),
        })
      );
      expect(result).toMatchObject({
        id: mockedBookingEntity.id,
        startDate: mockedBookingEntity.startDate.toISOString(),
        endDate: mockedBookingEntity.endDate.toISOString(),
        createdAt: mockedBookingEntity.createdAt.toISOString(),
        updatedAt: mockedBookingEntity.updatedAt.toISOString(),
      });
    });

    it("should create a new booking when it's created by a user", async () => {
      const startDate = dayjs().subtract(1, "hour");
      const endDate = dayjs().add(1, "hour");
      const user = getUser1Stub();
      const parkingSpot = getParkingSpotEntityStub();

      const createBookingDto: CreateBookingDto = {
        startDateInTimestampMillis: startDate.valueOf(),
        endDateInTimestampMillis: endDate.valueOf(),
      };

      const mockedBookingEntity = getBookingEntitiesStub()[0];

      parkingSpotsService.checkExist.mockResolvedValue(parkingSpot);
      bookingsRepo.findOneByDateRange.mockResolvedValue(null);
      bookingsRepo.create.mockResolvedValue(mockedBookingEntity);

      const result = await service.create(
        parkingSpot.id,
        createBookingDto,
        user
      );

      expect(parkingSpotsService.checkExist).toHaveBeenCalledWith(
        parkingSpot.id,
        expect.any(Object)
      );
      expect(bookingsRepo.findOneByDateRange).toHaveBeenCalled();
      expect(bookingsRepo.create).toHaveBeenCalledWith(
        expect.objectContaining({
          parkingSpotId: parkingSpot.id,
          userId: user.id,
          startDate: startDate.toDate(),
          endDate: endDate.toDate(),
        })
      );
      expect(result).toMatchObject({
        id: mockedBookingEntity.id,
        startDate: mockedBookingEntity.startDate.toISOString(),
        endDate: mockedBookingEntity.endDate.toISOString(),
        createdAt: mockedBookingEntity.createdAt.toISOString(),
        updatedAt: mockedBookingEntity.updatedAt.toISOString(),
      });
    });

    it("should throw an error if parking spot does not exist", async () => {
      const startDate = dayjs().subtract(1, "hour");
      const endDate = dayjs().add(1, "hour");
      const user = getUser1Stub();
      const parkingSpot = getParkingSpotEntityStub();
      const notFoundError = ApiErrors.NotFound({
        param: "parkingSpotId",
        message: ErrorMessages.NOT_FOUND,
      });

      const createBookingDto: CreateBookingDto = {
        startDateInTimestampMillis: startDate.valueOf(),
        endDateInTimestampMillis: endDate.valueOf(),
      };

      parkingSpotsService.checkExist.mockRejectedValue(notFoundError);

      await expect(
        service.create(parkingSpot.id, createBookingDto, user)
      ).rejects.toThrow(notFoundError);
    });

    it("should throw an error if start date is invalid", async () => {
      const user = getUser1Stub();
      const parkingSpot = getParkingSpotEntityStub();

      const createBookingDto: CreateBookingDto = {
        startDateInTimestampMillis: dayjs().add(1, "hour").valueOf(),
        endDateInTimestampMillis: dayjs().subtract(1, "hour").valueOf(),
      };

      parkingSpotsService.checkExist.mockResolvedValue(parkingSpot);

      await expect(
        service.create(parkingSpot.id, createBookingDto, user)
      ).rejects.toThrow(
        ApiErrors.BadRequest({
          message: "startDate must be greater than endDate",
          param: "invalidStartDate",
        })
      );
    });

    // TODO: Handle invalid end date

    it("should throw an error if there start date is overlapping with another booking", async () => {
      const endDate = dayjs().add(1, "hour");
      const user = getUser1Stub();
      const parkingSpot = getParkingSpotEntityStub();
      const mockedBookingEntity = getBookingEntitiesStub()[0];

      const createBookingDto: CreateBookingDto = {
        startDateInTimestampMillis: mockedBookingEntity.startDate.valueOf(),
        endDateInTimestampMillis: endDate.valueOf(),
      };

      parkingSpotsService.checkExist.mockResolvedValue(parkingSpot);
      bookingsRepo.findOneByDateRange.mockResolvedValue(mockedBookingEntity);

      await expect(
        service.create(parkingSpot.id, createBookingDto, user)
      ).rejects.toThrow(
        ApiErrors.BadRequest({
          message: "found an existing booking with the given dates",
          param: "overlappingBooking",
        })
      );
    });

    // TODO: Handle end date overlapping with another booking
  });

  describe("patchOne", () => {
    it("should update an existing booking", async () => {
      const startDate = dayjs().subtract(1, "hour");
      const endDate = dayjs().add(1, "hour");
      const user = getAdminEntityStub();
      const parkingSpot = getParkingSpotEntityStub();
      const booking = getBookingEntitiesStub()[0];

      const updateBookingDto: UpdateBookingDto = {
        startDateInTimestampMillis: startDate.valueOf(),
        endDateInTimestampMillis: endDate.valueOf(),
      };

      parkingSpotsService.checkExist.mockResolvedValue(parkingSpot);
      bookingsRepo.findOneByDateRange.mockResolvedValue(null);
      jest.spyOn(service, "checkExist").mockResolvedValue(booking);

      await service.patchOne(
        parkingSpot.id,
        booking.id,
        updateBookingDto,
        user
      );

      expect(parkingSpotsService.checkExist).toHaveBeenCalledWith(
        parkingSpot.id,
        expect.any(Object)
      );
      expect(service.checkExist).toHaveBeenCalledWith(
        booking.id,
        expect.any(Object)
      );
      expect(bookingsRepo.findOneByDateRange).toHaveBeenCalled();
      expect(bookingsRepo.findByIdAndUpdate).toHaveBeenCalledWith(
        booking.id,
        expect.objectContaining({
          startDate: startDate.toDate(),
          endDate: endDate.toDate(),
        })
      );
    });

    it("should throw an error if booking doesn't belong to the requested user", async () => {
      const startDate = dayjs().subtract(1, "hour");
      const endDate = dayjs().add(1, "hour");
      const user = getUser2Stub();
      const parkingSpot = getParkingSpotEntityStub();
      const booking = getBookingEntitiesStub()[0];

      const updateBookingDto: UpdateBookingDto = {
        startDateInTimestampMillis: startDate.valueOf(),
        endDateInTimestampMillis: endDate.valueOf(),
      };

      parkingSpotsService.checkExist.mockResolvedValue(parkingSpot);
      bookingsRepo.findOneByDateRange.mockResolvedValue(null);
      jest.spyOn(service, "checkExist").mockResolvedValue(booking);

      await expect(
        service.patchOne(parkingSpot.id, booking.id, updateBookingDto, user)
      ).rejects.toThrow(
        ApiErrors.Forbidden("You are not allowed to update this resource")
      );
    });
  });

  // TODO: Handle delete booking (similar to the above tests)
  // TODO: Handle more cases and private methods
});
