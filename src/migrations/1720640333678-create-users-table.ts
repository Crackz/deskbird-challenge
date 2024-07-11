import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUsersTable1720640333678 implements MigrationInterface {
  private usersTableName = "users";
  private roleEnumName = "role";

  public async up(queryRunner: QueryRunner): Promise<void> {
    const createRoleEnumQuery = `CREATE TYPE ${this.roleEnumName} AS ENUM ('ADMIN', 'USER');`;
    await queryRunner.query(createRoleEnumQuery);

    const createTableQuery = `
    CREATE TABLE "${this.usersTableName}" (
      "id" uuid PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
      "firstName" varchar NOT NULL,
      "lastName" varchar NOT NULL,
      "email" varchar(255) UNIQUE NOT NULL,
      "roles" ${this.roleEnumName}[] NOT NULL,
      "token" varchar NOT NULL,
      "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );`;

    await queryRunner.query(createTableQuery);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(this.usersTableName);
    await queryRunner.query(`DROP TYPE ${this.roleEnumName};`);
  }
}
