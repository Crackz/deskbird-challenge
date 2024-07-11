import { InferSubjects } from "@casl/ability";
import { Actions, Permissions } from "nest-casl";
import { UserRole } from "../users/interfaces/users.interface";
import { ParkingSpotEntity } from "./entities/parking-spot.entity";

export type Subjects = InferSubjects<typeof ParkingSpotEntity>;

export const parkingSpotsPermissions: Permissions<UserRole, Subjects, Actions> =
  {
    everyone({ can }) {
      can(Actions.read, ParkingSpotEntity);
    },
  };
