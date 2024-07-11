import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateParkingSpotsTable1720649252040
  implements MigrationInterface
{
  private parkingSpotsTableName = "parking-spots";
  public async up(queryRunner: QueryRunner): Promise<void> {
    const createTableQuery = `
    CREATE TABLE "${this.parkingSpotsTableName}" (
      "id" uuid PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
      "name" varchar NOT NULL,
      "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );`;

    await queryRunner.query(createTableQuery);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(this.parkingSpotsTableName);
  }
}
