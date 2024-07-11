import { InferSubjects } from "@casl/ability";
import { Actions, Permissions } from "nest-casl";
import { UserRole } from "../users/interfaces/users.interface";
import { BookingEntity } from "./entities/booking.entity";

export type Subjects = InferSubjects<typeof BookingEntity>;

export const bookingsPermissions: Permissions<UserRole, Subjects, Actions> = {
  everyone({ can }) {
    can(Actions.read, BookingEntity);
    can(Actions.create, BookingEntity);
    can(Actions.update, BookingEntity);
    can(Actions.delete, BookingEntity);
  },
};
