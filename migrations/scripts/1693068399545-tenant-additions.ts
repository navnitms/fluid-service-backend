import { MigrationInterface, QueryRunner } from 'typeorm';

export class TenantAdditions1693068399545 implements MigrationInterface {
  name = 'TenantAdditions1693068399545';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "tenant" ADD "status" character varying NOT NULL DEFAULT 'ACTIVE'`,
    );
    await queryRunner.query(
      `ALTER TABLE "tenant_settings" ADD "phone" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "tenant" DROP COLUMN "status"`);
    await queryRunner.query(
      `ALTER TABLE "tenant_settings" DROP COLUMN "phone"`,
    );
  }
}
