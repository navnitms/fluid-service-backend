import { MigrationInterface, QueryRunner } from 'typeorm';

export class UserRolePermission1690996214515 implements MigrationInterface {
  name = 'UserRolePermission1690996214515';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "permission" ("created_at" TIMESTAMP(0) NOT NULL DEFAULT now(), "updated_at" TIMESTAMP(0) NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP(0), "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "active" boolean NOT NULL DEFAULT true, CONSTRAINT "PK_3b8b97af9d9d8807e41e6f48362" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_permission_name_id" ON "permission" ("name") WHERE "deleted_at" IS NULL`,
    );
    await queryRunner.query(
      `CREATE TABLE "role" ("created_at" TIMESTAMP(0) NOT NULL DEFAULT now(), "updated_at" TIMESTAMP(0) NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP(0), "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "active" boolean NOT NULL DEFAULT true, CONSTRAINT "PK_b36bcfe02fc8de3c57a8b2391c2" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "idx_role_name" ON "role" ("name") WHERE "deleted_at" IS NULL`,
    );
    await queryRunner.query(
      `CREATE TABLE "user" ("created_at" TIMESTAMP(0) NOT NULL DEFAULT now(), "updated_at" TIMESTAMP(0) NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP(0), "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying, "tenant_id" uuid NOT NULL, "email" character varying NOT NULL, "status" character varying NOT NULL DEFAULT 'INVITED', "password" character varying NOT NULL, "refresh_token" character varying, "invite_token" character varying, "role_id" uuid, CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "idx_user_email" ON "user" ("email") WHERE "deleted_at" IS NULL`,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_user_tenant_id_status" ON "user" ("tenant_id", "status") WHERE "deleted_at" IS NULL`,
    );
    await queryRunner.query(
      `CREATE TABLE "role_permission" ("created_at" TIMESTAMP(0) NOT NULL DEFAULT now(), "updated_at" TIMESTAMP(0) NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP(0), "permission_id" uuid NOT NULL, "role_id" uuid NOT NULL, CONSTRAINT "PK_19a94c31d4960ded0dcd0397759" PRIMARY KEY ("permission_id", "role_id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "address" ALTER COLUMN "district_id" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "address" ALTER COLUMN "district_id" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "FK_ae07d48a61ca20ab3586d397a71" FOREIGN KEY ("tenant_id") REFERENCES "tenant"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "FK_ae07d48a61ca20ab3586d397a71"`,
    );
    await queryRunner.query(
      `ALTER TABLE "address" ALTER COLUMN "district_id" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "address" ALTER COLUMN "district_id" DROP NOT NULL`,
    );
    await queryRunner.query(`DROP TABLE "role_permission"`);
    await queryRunner.query(`DROP INDEX "public"."idx_user_tenant_id_status"`);
    await queryRunner.query(`DROP INDEX "public"."idx_user_email"`);
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`DROP INDEX "public"."idx_role_name"`);
    await queryRunner.query(`DROP TABLE "role"`);
    await queryRunner.query(`DROP INDEX "public"."idx_permission_name_id"`);
    await queryRunner.query(`DROP TABLE "permission"`);
  }
}
