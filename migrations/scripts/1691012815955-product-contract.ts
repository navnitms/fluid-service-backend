import { MigrationInterface, QueryRunner } from 'typeorm';

export class ProductContract1691012815955 implements MigrationInterface {
  name = 'ProductContract1691012815955';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "product" ("created_at" TIMESTAMP(0) NOT NULL DEFAULT now(), "updated_at" TIMESTAMP(0) NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP(0), "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "is_visible" boolean NOT NULL DEFAULT true, CONSTRAINT "PK_bebc9158e480b949565b4dc7a82" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "idx_product_name" ON "product" ("name") WHERE "deleted_at" IS NULL`,
    );
    await queryRunner.query(
      `CREATE TABLE "contract_product" ("created_at" TIMESTAMP(0) NOT NULL DEFAULT now(), "updated_at" TIMESTAMP(0) NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP(0), "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "contract_id" uuid NOT NULL, "product_id" uuid NOT NULL, "remark" character varying, "count" integer, "product_amount" integer, CONSTRAINT "PK_e1add3c6809fa475189c15b4c99" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_contract_product_contract_id" ON "contract_product" ("contract_id") WHERE "deleted_at" IS NULL`,
    );
    await queryRunner.query(
      `CREATE TABLE "contract" ("created_at" TIMESTAMP(0) NOT NULL DEFAULT now(), "updated_at" TIMESTAMP(0) NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP(0), "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "tenant_id" uuid NOT NULL, "from_date" TIMESTAMP WITH TIME ZONE NOT NULL, "to_date" TIMESTAMP WITH TIME ZONE NOT NULL, "payment_date" TIMESTAMP WITH TIME ZONE, "status" character varying NOT NULL DEFAULT 'SCHEDULED', "remark" character varying, "amount" integer, CONSTRAINT "PK_17c3a89f58a2997276084e706e8" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_contract_tenant_id" ON "contract" ("tenant_id") WHERE "deleted_at" IS NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "contract" ADD CONSTRAINT "FK_06554242b62c37599f0cba5616a" FOREIGN KEY ("tenant_id") REFERENCES "tenant"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "contract" DROP CONSTRAINT "FK_06554242b62c37599f0cba5616a"`,
    );
    await queryRunner.query(`DROP INDEX "public"."idx_contract_tenant_id"`);
    await queryRunner.query(`DROP TABLE "contract"`);
    await queryRunner.query(
      `DROP INDEX "public"."idx_contract_product_contract_id"`,
    );
    await queryRunner.query(`DROP TABLE "contract_product"`);
    await queryRunner.query(`DROP INDEX "public"."idx_product_name"`);
    await queryRunner.query(`DROP TABLE "product"`);
  }
}
