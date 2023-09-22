import { MigrationInterface, QueryRunner } from 'typeorm';

export class Notes1694028298099 implements MigrationInterface {
  name = 'Notes1694028298099';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "contract_notes" ("created_at" TIMESTAMP(0) NOT NULL DEFAULT now(), "updated_at" TIMESTAMP(0) NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP(0), "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "contract_id" character varying NOT NULL, "remark" character varying(1024) NOT NULL, "tenant_id" uuid NOT NULL, CONSTRAINT "PK_d9f916794633ce55739037703c2" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_contract_notes_contract_id" ON "contract_notes" ("contract_id") WHERE "deleted_at" IS NULL`,
    );
    await queryRunner.query(`ALTER TABLE "tenant_notes" DROP COLUMN "remark"`);
    await queryRunner.query(
      `ALTER TABLE "tenant_notes" ADD "remark" character varying(1024) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "contract_notes" ADD CONSTRAINT "FK_ade86d3d0e03cf046675ad91f73" FOREIGN KEY ("tenant_id") REFERENCES "tenant"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "contract_notes" DROP CONSTRAINT "FK_ade86d3d0e03cf046675ad91f73"`,
    );
    await queryRunner.query(`ALTER TABLE "tenant_notes" DROP COLUMN "remark"`);
    await queryRunner.query(
      `ALTER TABLE "tenant_notes" ADD "remark" character varying NOT NULL`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."idx_contract_notes_contract_id"`,
    );
    await queryRunner.query(`DROP TABLE "contract_notes"`);
  }
}
