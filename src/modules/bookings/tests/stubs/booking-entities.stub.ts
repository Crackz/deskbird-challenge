import * as dayjs from "dayjs";
import { BookingEntity } from "../../entities/booking.entity";
import { getParkingSpotEntityStub } from "./parking-spot-entity.stub";
import { getUser1Stub, getUser2Stub } from "./user.stub";

export const getBookingEntitiesStub = (): BookingEntity[] => [
  {
    id: "6db359a2-233c-408c-9fc6-651a7eec9ae1",
    parkingSpotId: getParkingSpotEntityStub().id,
    parkingSpot: getParkingSpotEntityStub(),
    userId: getUser1Stub().id,
    startDate: dayjs().toDate(),
    endDate: dayjs().add(1, "day").toDate(),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "6db359a2-233c-408c-9fc6-651a7eec9ae2",
    parkingSpotId: getParkingSpotEntityStub().id,
    parkingSpot: getParkingSpotEntityStub(),
    userId: getUser2Stub().id,
    startDate: dayjs().add(2, "day").toDate(),
    endDate: dayjs().add(3, "day").toDate(),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];
