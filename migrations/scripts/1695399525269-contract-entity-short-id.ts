import { MigrationInterface, QueryRunner } from 'typeorm';

export class ContractEntityShortId1695399525269 implements MigrationInterface {
  name = 'ContractEntityShortId1695399525269';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "contract" ADD "short_id" character varying NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "contract" DROP COLUMN "short_id"`);
  }
}
