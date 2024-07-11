import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateBookingsTable1720692292303 implements MigrationInterface {
  private usersTableName = "users";
  private parkingSpotsTableName = "parking-spots";
  private bookingsTableName = "bookings";

  public async up(queryRunner: QueryRunner): Promise<void> {
    const createTableQuery = `
    CREATE TABLE "${this.bookingsTableName}" (
      "id" uuid PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
      "userId" uuid NOT NULL REFERENCES "${this.usersTableName}" (id),
      "parkingSpotId" uuid NOT NULL REFERENCES "${this.parkingSpotsTableName}" (id) ON DELETE CASCADE,
      "startDate" TIMESTAMPTZ NOT NULL,
      "endDate" TIMESTAMPTZ NOT NULL,
      "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );`;

    await queryRunner.query(createTableQuery);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(this.bookingsTableName);
  }
}
