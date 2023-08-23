import { MigrationInterface, QueryRunner } from "typeorm";

export class Seed1692723031655 implements MigrationInterface {
    name = 'Seed1692723031655'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."account_role_enum" AS ENUM('Admin', 'Student')`);
        await queryRunner.query(`CREATE TABLE "account" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "username" character varying NOT NULL, "password" character varying, "name" character varying NOT NULL, "role" "public"."account_role_enum" NOT NULL DEFAULT 'Student', "avatarUrl" character varying, CONSTRAINT "PK_54115ee388cdb6d86bb4bf5b2ea" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "account"`);
        await queryRunner.query(`DROP TYPE "public"."account_role_enum"`);
    }

}
