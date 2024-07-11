import { ADMIN_AUTH_TOKEN } from "src/common/constants";
import { UserEntity } from "src/modules/users/entities/user.entity";
import { UserRole } from "src/modules/users/interfaces/users.interface";

export const getAdminStub = (): UserEntity => ({
  id: "admin-id",
  email: "admin-email@x.com",
  firstName: "admin-first-name",
  lastName: "admin-last-name",
  roles: [UserRole.ADMIN],
  token: ADMIN_AUTH_TOKEN,
  createdAt: new Date(),
  updatedAt: new Date(),
});
