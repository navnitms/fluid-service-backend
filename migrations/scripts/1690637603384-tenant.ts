import { MigrationInterface, QueryRunner } from 'typeorm';

export class Tenant1690637603384 implements MigrationInterface {
  name = 'Tenant1690637603384';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "state" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying, "is_disabled" boolean NOT NULL DEFAULT false, "deleted_at" TIMESTAMP, CONSTRAINT "PK_549ffd046ebab1336c3a8030a12" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "district" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying, "state_id" uuid NOT NULL, "deleted_at" TIMESTAMP, CONSTRAINT "PK_ee5cb6fd5223164bb87ea693f1e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "address" ("created_at" TIMESTAMP(0) NOT NULL DEFAULT now(), "updated_at" TIMESTAMP(0) NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP(0), "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "tenant_id" uuid NOT NULL, "value" character varying, "pincode" integer, "district_id" uuid, CONSTRAINT "PK_d92de1f82754668b5f5f5dd4fd5" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_address_tenant_id" ON "address" ("tenant_id") WHERE "deleted_at" IS NULL`,
    );
    await queryRunner.query(
      `CREATE TABLE "tenant_category" ("created_at" TIMESTAMP(0) NOT NULL DEFAULT now(), "updated_at" TIMESTAMP(0) NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP(0), "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, CONSTRAINT "PK_eda742e5d62e5f2f68cd6b75dbd" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "idx_tenant_category_name" ON "tenant_category" ("name") WHERE "deleted_at" IS NULL`,
    );
    await queryRunner.query(
      `CREATE TABLE "tenant_settings" ("created_at" TIMESTAMP(0) NOT NULL DEFAULT now(), "updated_at" TIMESTAMP(0) NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP(0), "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "tenant_id" character varying NOT NULL, "reply_to_email" character varying NOT NULL, "auto_escalation" boolean NOT NULL DEFAULT true, CONSTRAINT "PK_69225c0ca64bcbbf9af8a217043" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_tenant_settings_tenant_id" ON "tenant_settings" ("tenant_id") WHERE "deleted_at" IS NULL`,
    );
    await queryRunner.query(
      `CREATE TABLE "tenant" ("created_at" TIMESTAMP(0) NOT NULL DEFAULT now(), "updated_at" TIMESTAMP(0) NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP(0), "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "address_id" uuid, "category_id" uuid NOT NULL, "tenant_setting_id" uuid NOT NULL, CONSTRAINT "REL_e1570d6f99d30f7b77e2e4a543" UNIQUE ("tenant_setting_id"), CONSTRAINT "PK_da8c6efd67bb301e810e56ac139" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "idx_tenant_name" ON "tenant" ("name") WHERE "deleted_at" IS NULL`,
    );
    await queryRunner.query(
      `CREATE TABLE "tenant_fa" ("created_at" TIMESTAMP(0) NOT NULL DEFAULT now(), "updated_at" TIMESTAMP(0) NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP(0), "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "tenant_id" uuid NOT NULL, "date" TIMESTAMP WITH TIME ZONE NOT NULL, "remark" character varying NOT NULL, CONSTRAINT "PK_45a6b9240a1001de2c0240a091f" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_tenant_fa_tenant_id" ON "tenant_fa" ("tenant_id") WHERE "deleted_at" IS NULL`,
    );
    await queryRunner.query(
      `CREATE TABLE "tenant_notes" ("created_at" TIMESTAMP(0) NOT NULL DEFAULT now(), "updated_at" TIMESTAMP(0) NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP(0), "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "tenant_id" uuid NOT NULL, "remark" character varying NOT NULL, CONSTRAINT "PK_2ecbf3569492950f6fcd001048b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_tenant_notes_tenant_id" ON "tenant_notes" ("tenant_id") WHERE "deleted_at" IS NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "tenant" ADD CONSTRAINT "FK_e1570d6f99d30f7b77e2e4a5435" FOREIGN KEY ("tenant_setting_id") REFERENCES "tenant_settings"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "tenant" ADD CONSTRAINT "FK_eda742e5d62e5f2f68cd6b75dbd" FOREIGN KEY ("category_id") REFERENCES "tenant_category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "tenant_fa" ADD CONSTRAINT "FK_5ff3e2515a48fb2f40280c10772" FOREIGN KEY ("tenant_id") REFERENCES "tenant"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "tenant_notes" ADD CONSTRAINT "FK_6c67e27d3402b06ea48e5e6262b" FOREIGN KEY ("tenant_id") REFERENCES "tenant"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "tenant_notes" DROP CONSTRAINT "FK_6c67e27d3402b06ea48e5e6262b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "tenant_fa" DROP CONSTRAINT "FK_5ff3e2515a48fb2f40280c10772"`,
    );
    await queryRunner.query(
      `ALTER TABLE "tenant" DROP CONSTRAINT "FK_eda742e5d62e5f2f68cd6b75dbd"`,
    );
    await queryRunner.query(
      `ALTER TABLE "tenant" DROP CONSTRAINT "FK_e1570d6f99d30f7b77e2e4a5435"`,
    );
    await queryRunner.query(`DROP INDEX "public"."idx_tenant_notes_tenant_id"`);
    await queryRunner.query(`DROP TABLE "tenant_notes"`);
    await queryRunner.query(`DROP INDEX "public"."idx_tenant_fa_tenant_id"`);
    await queryRunner.query(`DROP TABLE "tenant_fa"`);
    await queryRunner.query(`DROP INDEX "public"."idx_tenant_name"`);
    await queryRunner.query(`DROP TABLE "tenant"`);
    await queryRunner.query(
      `DROP INDEX "public"."idx_tenant_settings_tenant_id"`,
    );
    await queryRunner.query(`DROP TABLE "tenant_settings"`);
    await queryRunner.query(`DROP INDEX "public"."idx_tenant_category_name"`);
    await queryRunner.query(`DROP TABLE "tenant_category"`);
    await queryRunner.query(`DROP INDEX "public"."idx_address_tenant_id"`);
    await queryRunner.query(`DROP TABLE "address"`);
    await queryRunner.query(`DROP TABLE "district"`);
    await queryRunner.query(`DROP TABLE "state"`);
  }
}
