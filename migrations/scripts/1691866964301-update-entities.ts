import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateEntities1691866964301 implements MigrationInterface {
  name = 'UpdateEntities1691866964301';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" ADD "admin_password" boolean NOT NULL DEFAULT true`,
    );
    await queryRunner.query(
      `ALTER TABLE "incident_log" ADD "text" character varying(1024) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "incident" ADD "search_term" tsvector`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "incident" DROP COLUMN "search_term"`);
    await queryRunner.query(`ALTER TABLE "incident_log" DROP COLUMN "text"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "admin_password"`);
  }
}
