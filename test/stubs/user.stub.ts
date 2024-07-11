import { USER1_AUTH_TOKEN, USER2_AUTH_TOKEN } from "src/common/constants";
import { UserEntity } from "src/modules/users/entities/user.entity";
import { UserRole } from "src/modules/users/interfaces/users.interface";

export const getUser1Stub = (): UserEntity => ({
  id: "6db359a2-233c-408c-9fc6-651a7eec9aaa",
  email: "user1-email@x.com",
  firstName: "user1-first-name",
  lastName: "user1-last-name",
  roles: [UserRole.USER],
  token: USER1_AUTH_TOKEN,
  createdAt: new Date(),
  updatedAt: new Date(),
});

export const getUser2Stub = (): UserEntity => ({
  id: "6db359a2-233c-408c-9fc6-651a7eec9ae2",
  email: "user2-email@x.com",
  firstName: "user2-first-name",
  lastName: "user2-last-name",
  roles: [UserRole.USER],
  token: USER2_AUTH_TOKEN,
  createdAt: new Date(),
  updatedAt: new Date(),
});
