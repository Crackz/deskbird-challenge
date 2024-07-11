import { HttpStatus, INestApplication, ShutdownSignal } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Test, TestingModule } from "@nestjs/testing";
import { getDataSourceToken } from "@nestjs/typeorm";
import * as dayjs from "dayjs";
import { AppModule } from "src/app.module";
import {
  ADMIN_AUTH_TOKEN,
  USER1_AUTH_TOKEN,
  USER2_AUTH_TOKEN,
} from "src/common/constants";
import { EnvironmentVariables } from "src/common/env/environment-variables";
import { HttpExceptionsFilter } from "src/common/filters/http-exceptions.filter";
import { ErrorMessages } from "src/common/interfaces/api-errors.interface";
import { DefaultValidationPipe } from "src/common/pipes/default-validation.pipe";
import { DeepWritable } from "src/common/types/writable";
import { BookingsRepo } from "src/modules/bookings/bookings.repo";
import { CreateBookingDto } from "src/modules/bookings/dtos/create-booking.dto";
import { UpdateBookingDto } from "src/modules/bookings/dtos/update-booking.dto";
import { ParkingSpotEntity } from "src/modules/parking-spots/entities/parking-spot.entity";
import { ParkingSpotsRepo } from "src/modules/parking-spots/parking-spots.repo";
import { UserEntity } from "src/modules/users/entities/user.entity";
import { UserRole } from "src/modules/users/interfaces/users.interface";
import { UsersRepo } from "src/modules/users/users.repo";
import * as request from "supertest";
import { DataSource } from "typeorm";
import { TestUtils } from "./shared/test-utils";
import { getParkingSpotEntityStub } from "./stubs/parking-spot-entity.stub";

describe("BookingsController (e2e)", () => {
  let app: INestApplication;
  let dataSource: DataSource;
  let parkingSpotsRepo: ParkingSpotsRepo;
  let bookingsRepo: BookingsRepo;
  let usersRepo: UsersRepo;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new DefaultValidationPipe());
    app.useGlobalFilters(new HttpExceptionsFilter());
    app.enableShutdownHooks([ShutdownSignal.SIGTERM, ShutdownSignal.SIGINT]);

    dataSource = moduleFixture.get<DataSource>(getDataSourceToken());

    usersRepo = app.get<UsersRepo>(UsersRepo);
    parkingSpotsRepo = app.get<ParkingSpotsRepo>(ParkingSpotsRepo);
    bookingsRepo = app.get<BookingsRepo>(BookingsRepo);
    const configService =
      app.get<ConfigService<EnvironmentVariables>>(ConfigService);

    await app.listen(configService.get("SERVER_PORT"));
  });

  afterEach(async () => {
    await TestUtils.clearAllDbTables(dataSource);
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await app.close();
  });

  describe("/parking-spots/:parkingSpotId/bookings (GET)", () => {
    it("should return 401 if x api key is not in header", async () => {
      const res = await request(app.getHttpServer())
        .get(`/parking-spots/${getParkingSpotEntityStub().id}/bookings`)
        .expect(HttpStatus.UNAUTHORIZED);

      expect(res.body).toMatchObject({
        error: {
          errors: [
            {
              message: ErrorMessages.UNAUTHORIZED,
            },
          ],
        },
      });
    });

    it("should return 401 if x api key is invalid", async () => {
      const res = await request(app.getHttpServer())
        .get(`/parking-spots/${getParkingSpotEntityStub().id}/bookings`)
        .set("x-api-key", "invalid")
        .expect(HttpStatus.UNAUTHORIZED);

      expect(res.body).toMatchObject({
        error: {
          errors: [
            {
              message: ErrorMessages.UNAUTHORIZED,
            },
          ],
        },
      });
    });

    it("should return 404 if parking spot is not found", async () => {
      const user: DeepWritable<UserEntity> = {
        firstName: "User First Name 1",
        lastName: "User Last Name 1",
        email: "user1@test.com",
        roles: [UserRole.USER],
        token: USER1_AUTH_TOKEN,
      };

      await usersRepo.create(user);

      const res = await request(app.getHttpServer())
        .get(`/parking-spots/${getParkingSpotEntityStub().id}/bookings`)
        .set("x-api-key", user.token)
        .expect(HttpStatus.NOT_FOUND);

      expect(res.body).toMatchObject({
        error: {
          errors: [
            {
              message: ErrorMessages.NOT_FOUND,
              param: "parkingSpotId",
            },
          ],
        },
      });
    });
  });

  describe("/parking-spots/:parkingSpotId/bookings (POST)", () => {
    it("should return 401 if x api key is not in header", async () => {
      const createBookingDto: CreateBookingDto = {
        startDateInTimestampMillis: dayjs().valueOf(),
        endDateInTimestampMillis: dayjs().add(1, "hour").valueOf(),
      };

      const res = await request(app.getHttpServer())
        .post(`/parking-spots/${getParkingSpotEntityStub().id}/bookings`)
        .send(createBookingDto)
        .expect(HttpStatus.UNAUTHORIZED);

      expect(res.body).toMatchObject({
        error: {
          errors: [
            {
              message: ErrorMessages.UNAUTHORIZED,
            },
          ],
        },
      });
    });

    it("should return 401 if x api key is invalid", async () => {
      const createBookingDto: CreateBookingDto = {
        startDateInTimestampMillis: dayjs().valueOf(),
        endDateInTimestampMillis: dayjs().add(1, "hour").valueOf(),
      };

      const res = await request(app.getHttpServer())
        .post(`/parking-spots/${getParkingSpotEntityStub().id}/bookings`)
        .set("x-api-key", "invalid")
        .send(createBookingDto)
        .expect(HttpStatus.UNAUTHORIZED);

      expect(res.body).toMatchObject({
        error: {
          errors: [
            {
              message: ErrorMessages.UNAUTHORIZED,
            },
          ],
        },
      });
    });

    // TODO: handle not found parking spot, invalid start date and end date

    it("should create new booking if it's requested by a user", async () => {
      const startDate = dayjs();
      const endDate = dayjs().add(1, "hour");

      const createBookingDto: CreateBookingDto = {
        startDateInTimestampMillis: startDate.valueOf(),
        endDateInTimestampMillis: endDate.valueOf(),
      };

      const user: DeepWritable<UserEntity> = {
        firstName: "User First Name 1",
        lastName: "User Last Name 1",
        email: "user1@test.com",
        roles: [UserRole.USER],
        token: USER1_AUTH_TOKEN,
      };

      const parkingSpot: DeepWritable<ParkingSpotEntity> = {
        name: "Test Parking Spot",
      };

      const [createdUser, createdParkingSpot] = await Promise.all([
        usersRepo.create(user),
        parkingSpotsRepo.create(parkingSpot),
      ]);

      const res = await request(app.getHttpServer())
        .post(`/parking-spots/${createdParkingSpot.id}/bookings`)
        .set("x-api-key", createdUser.token)
        .send(createBookingDto);

      expect(res.body).toMatchObject({
        id: expect.any(String),
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      });
    });

    // TODO: create new booking if it's requested by an admin
  });

  describe("/parking-spots/:parkingSpotId/bookings/:bookingId (PATCH)", () => {
    // TODO: handle auth
    // TODO: handle not found parking spot, invalid start date and end date
    // TODO: handle booking overlap

    it("should update a booking by a user", async () => {
      const startDate = dayjs();
      const endDate = dayjs().add(1, "hour");

      const updateBookingDto: UpdateBookingDto = {
        startDateInTimestampMillis: startDate.valueOf(),
        endDateInTimestampMillis: endDate.valueOf(),
      };

      const user: DeepWritable<UserEntity> = {
        firstName: "User First Name 1",
        lastName: "User Last Name 1",
        email: "user1@test.com",
        roles: [UserRole.USER],
        token: USER1_AUTH_TOKEN,
      };

      const parkingSpot: DeepWritable<ParkingSpotEntity> = {
        name: "Test Parking Spot",
      };

      const [createdUser, createdParkingSpot] = await Promise.all([
        usersRepo.create(user),
        parkingSpotsRepo.create(parkingSpot),
      ]);

      const existingBooking = await bookingsRepo.create({
        startDate: startDate.toDate(),
        endDate: endDate.toDate(),
        parkingSpotId: createdParkingSpot.id,
        userId: createdUser.id,
      });

      await request(app.getHttpServer())
        .patch(
          `/parking-spots/${createdParkingSpot.id}/bookings/${existingBooking.id}`
        )
        .set("x-api-key", createdUser.token)
        .send(updateBookingDto)
        .expect(HttpStatus.NO_CONTENT);
    });

    it("should update a booking created by a user when it's requested by an admin", async () => {
      const startDate = dayjs();
      const endDate = dayjs().add(1, "hour");

      const updateBookingDto: UpdateBookingDto = {
        startDateInTimestampMillis: startDate.valueOf(),
        endDateInTimestampMillis: endDate.valueOf(),
      };

      const user: DeepWritable<UserEntity> = {
        firstName: "User First Name 1",
        lastName: "User Last Name 1",
        email: "user1@test.com",
        roles: [UserRole.USER],
        token: USER1_AUTH_TOKEN,
      };

      const admin: DeepWritable<UserEntity> = {
        firstName: "Admin First Name 1",
        lastName: "Admin Last Name 1",
        email: "admin@test.com",
        roles: [UserRole.ADMIN],
        token: ADMIN_AUTH_TOKEN,
      };

      const parkingSpot: DeepWritable<ParkingSpotEntity> = {
        name: "Test Parking Spot",
      };

      const [createdUser, createdAdmin, createdParkingSpot] = await Promise.all(
        [
          usersRepo.create(user),
          usersRepo.create(admin),
          parkingSpotsRepo.create(parkingSpot),
        ]
      );

      const existingBooking = await bookingsRepo.create({
        startDate: startDate.toDate(),
        endDate: endDate.toDate(),
        parkingSpotId: createdParkingSpot.id,
        userId: createdUser.id,
      });

      await request(app.getHttpServer())
        .patch(
          `/parking-spots/${createdParkingSpot.id}/bookings/${existingBooking.id}`
        )
        .set("x-api-key", createdAdmin.token)
        .send(updateBookingDto)
        .expect(HttpStatus.NO_CONTENT);
    });

    it("should throw 403 when trying to update a booking created by a user when it's requested by a different user", async () => {
      const startDate = dayjs();
      const endDate = dayjs().add(1, "hour");

      const updateBookingDto: UpdateBookingDto = {
        startDateInTimestampMillis: startDate.valueOf(),
        endDateInTimestampMillis: endDate.valueOf(),
      };

      const user1: DeepWritable<UserEntity> = {
        firstName: "User First Name 1",
        lastName: "User Last Name 1",
        email: "user1@test.com",
        roles: [UserRole.USER],
        token: USER1_AUTH_TOKEN,
      };

      const user2: DeepWritable<UserEntity> = {
        firstName: "User First Name 2",
        lastName: "User Last Name 2",
        email: "user2@test.com",
        roles: [UserRole.USER],
        token: USER2_AUTH_TOKEN,
      };

      const parkingSpot: DeepWritable<ParkingSpotEntity> = {
        name: "Test Parking Spot",
      };

      const [createdUser, createdAnotherUser, createdParkingSpot] =
        await Promise.all([
          usersRepo.create(user1),
          usersRepo.create(user2),
          parkingSpotsRepo.create(parkingSpot),
        ]);

      const existingBooking = await bookingsRepo.create({
        startDate: startDate.toDate(),
        endDate: endDate.toDate(),
        parkingSpotId: createdParkingSpot.id,
        userId: createdUser.id,
      });

      const res = await request(app.getHttpServer())
        .patch(
          `/parking-spots/${createdParkingSpot.id}/bookings/${existingBooking.id}`
        )
        .set("x-api-key", createdAnotherUser.token)
        .send(updateBookingDto)
        .expect(HttpStatus.FORBIDDEN);

      expect(res.body).toMatchObject({
        error: {
          errors: [
            {
              message: "You are not allowed to update this resource",
            },
          ],
        },
      });
    });

    // TODO: add more tests for authorization
  });

  // TODO: add tests for delete booking
});
