import { MigrationInterface, QueryRunner } from 'typeorm';

export class Upload1695422054153 implements MigrationInterface {
  name = 'Upload1695422054153';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "upload" ("created_at" TIMESTAMP(0) NOT NULL DEFAULT now(), "updated_at" TIMESTAMP(0) NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP(0), "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "tenant_id" uuid NOT NULL, "name" character varying NOT NULL, "key" character varying NOT NULL, "reference_id" uuid NOT NULL, "status" character varying NOT NULL, "reference_type" character varying NOT NULL, CONSTRAINT "PK_1fe8db121b3de4ddfa677fc51f3" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "upload"`);
  }
}
