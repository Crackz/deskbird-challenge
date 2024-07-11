import { USERS_MODEL_NAME } from "src/common/constants";
import { BaseEntity } from "src/common/entities/base.entity";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { UserRole } from "../interfaces/users.interface";

@Entity({ name: USERS_MODEL_NAME })
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  readonly id: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column("enum", { array: true, enum: UserRole })
  roles: UserRole[];

  @Column()
  token: string;
}
