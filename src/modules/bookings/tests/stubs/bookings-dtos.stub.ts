import * as dayjs from "dayjs";
import { BookingDto } from "../../dtos/booking.dto";

export const getBookingsDtosStub = (): BookingDto[] => [
  {
    id: "6db359a2-233c-408c-9fc6-651a7eec9ae1",
    startDate: dayjs().toISOString(),
    endDate: dayjs().add(1, "day").toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "6db359a2-233c-408c-9fc6-651a7eec9ae2",
    startDate: dayjs().add(2, "day").toISOString(),
    endDate: dayjs().add(3, "day").toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];
