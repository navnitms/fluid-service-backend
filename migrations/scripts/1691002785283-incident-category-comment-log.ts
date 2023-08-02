import { MigrationInterface, QueryRunner } from 'typeorm';

export class IncidentCategoryCommentLog1691002785283
  implements MigrationInterface
{
  name = 'IncidentCategoryCommentLog1691002785283';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "category" ("created_at" TIMESTAMP(0) NOT NULL DEFAULT now(), "updated_at" TIMESTAMP(0) NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP(0), "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "is_visible" boolean NOT NULL DEFAULT true, CONSTRAINT "PK_9c4e4a89e3674fc9f382d733f03" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "idx_category_name" ON "category" ("name") WHERE "deleted_at" IS NULL`,
    );
    await queryRunner.query(
      `CREATE TABLE "incident_log" ("created_at" TIMESTAMP(0) NOT NULL DEFAULT now(), "updated_at" TIMESTAMP(0) NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP(0), "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "incident_id" uuid NOT NULL, "user_id" uuid NOT NULL, "operation" character varying NOT NULL, CONSTRAINT "PK_88374be0294237ceafc01c4535b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_incident_activity_log_user_id_date" ON "incident_log" ("incident_id") WHERE "deleted_at" IS NULL`,
    );
    await queryRunner.query(
      `CREATE TABLE "incident" ("created_at" TIMESTAMP(0) NOT NULL DEFAULT now(), "updated_at" TIMESTAMP(0) NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP(0), "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying(1024) NOT NULL, "description" character varying(100000) NOT NULL, "status" character varying NOT NULL, "category_id" uuid NOT NULL, "tenant_id" uuid NOT NULL, "created_by_id" uuid NOT NULL, "assignee_id" uuid, "acknowledged_by_id" uuid, "escalated_by_id" uuid, CONSTRAINT "PK_5f90b28b0b8238d89ee8edcf96e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_incident_tenant_id_status" ON "incident" ("tenant_id", "status") WHERE "deleted_at" IS NULL`,
    );
    await queryRunner.query(
      `CREATE TABLE "comment" ("created_at" TIMESTAMP(0) NOT NULL DEFAULT now(), "updated_at" TIMESTAMP(0) NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP(0), "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "tenant_id" uuid NOT NULL, "text" character varying NOT NULL, "incident_id" uuid NOT NULL, "user_id" uuid NOT NULL, CONSTRAINT "PK_0b0e4bbc8415ec426f87f3a88e2" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_incident_comment" ON "comment" ("incident_id") WHERE "deleted_at" IS NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "incident_log" ADD CONSTRAINT "FK_09bd2095656f306aadb3959ca90" FOREIGN KEY ("incident_id") REFERENCES "incident"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "incident_log" ADD CONSTRAINT "FK_667228832297182ddd70ce74ee6" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "incident" ADD CONSTRAINT "FK_692c022da87709980ea718aaa0b" FOREIGN KEY ("category_id") REFERENCES "category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "incident" ADD CONSTRAINT "FK_c0cb7a2bdfbed5cd123596c1905" FOREIGN KEY ("tenant_id") REFERENCES "tenant"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "incident" ADD CONSTRAINT "FK_e680ed2677952578169d56306f1" FOREIGN KEY ("created_by_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "incident" ADD CONSTRAINT "FK_8417b1889d6395840818c70f041" FOREIGN KEY ("assignee_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "incident" ADD CONSTRAINT "FK_5620c8f336035e7dea645cc5877" FOREIGN KEY ("acknowledged_by_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "incident" ADD CONSTRAINT "FK_2a0e0210c793a9f8e8219dbd275" FOREIGN KEY ("escalated_by_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "comment" ADD CONSTRAINT "FK_57204849bfc3754efbd371fe3c5" FOREIGN KEY ("tenant_id") REFERENCES "tenant"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "comment" ADD CONSTRAINT "FK_bbfe153fa60aa06483ed35ff4a7" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "comment" DROP CONSTRAINT "FK_bbfe153fa60aa06483ed35ff4a7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "comment" DROP CONSTRAINT "FK_57204849bfc3754efbd371fe3c5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "incident" DROP CONSTRAINT "FK_2a0e0210c793a9f8e8219dbd275"`,
    );
    await queryRunner.query(
      `ALTER TABLE "incident" DROP CONSTRAINT "FK_5620c8f336035e7dea645cc5877"`,
    );
    await queryRunner.query(
      `ALTER TABLE "incident" DROP CONSTRAINT "FK_8417b1889d6395840818c70f041"`,
    );
    await queryRunner.query(
      `ALTER TABLE "incident" DROP CONSTRAINT "FK_e680ed2677952578169d56306f1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "incident" DROP CONSTRAINT "FK_c0cb7a2bdfbed5cd123596c1905"`,
    );
    await queryRunner.query(
      `ALTER TABLE "incident" DROP CONSTRAINT "FK_692c022da87709980ea718aaa0b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "incident_log" DROP CONSTRAINT "FK_667228832297182ddd70ce74ee6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "incident_log" DROP CONSTRAINT "FK_09bd2095656f306aadb3959ca90"`,
    );
    await queryRunner.query(`DROP INDEX "public"."idx_incident_comment"`);
    await queryRunner.query(`DROP TABLE "comment"`);
    await queryRunner.query(
      `DROP INDEX "public"."idx_incident_tenant_id_status"`,
    );
    await queryRunner.query(`DROP TABLE "incident"`);
    await queryRunner.query(
      `DROP INDEX "public"."idx_incident_activity_log_user_id_date"`,
    );
    await queryRunner.query(`DROP TABLE "incident_log"`);
    await queryRunner.query(`DROP INDEX "public"."idx_category_name"`);
    await queryRunner.query(`DROP TABLE "category"`);
  }
}
