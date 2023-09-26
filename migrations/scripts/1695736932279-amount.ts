import { MigrationInterface, QueryRunner } from 'typeorm';

export class Amount1695736932279 implements MigrationInterface {
  name = 'Amount1695736932279';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "product" ADD "amount" integer`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "amount"`);
  }
}
