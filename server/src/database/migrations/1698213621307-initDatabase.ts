import { MigrationInterface, QueryRunner } from "typeorm";

export class InitDatabase1698213621307 implements MigrationInterface {
	name = "InitDatabase1698213621307";

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`CREATE TABLE "session_entity" ("id" SERIAL NOT NULL, "refreshToken" character varying NOT NULL, CONSTRAINT "PK_897bc09b92e1a7ef6b30cba4786" PRIMARY KEY ("id"))`,
		);
		await queryRunner.query(
			`CREATE TABLE "user_entity" ("id" character varying NOT NULL DEFAULT 'c70c2f34-da06-4269-b7f7-f2623f6dd055', "username" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying, "authProvider" "public"."user_entity_authprovider_enum" NOT NULL DEFAULT 'vanilla', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "sessionId" integer, CONSTRAINT "UQ_9b998bada7cff93fcb953b0c37e" UNIQUE ("username"), CONSTRAINT "UQ_415c35b9b3b6fe45a3b065030f5" UNIQUE ("email"), CONSTRAINT "REL_715216267405f61aae9cc8cb73" UNIQUE ("sessionId"), CONSTRAINT "PK_b54f8ea623b17094db7667d8206" PRIMARY KEY ("id"))`,
		);
		await queryRunner.query(
			`CREATE UNIQUE INDEX "IDX_415c35b9b3b6fe45a3b065030f" ON "user_entity" ("email") `,
		);
		await queryRunner.query(
			`ALTER TABLE "user_entity" ADD CONSTRAINT "FK_715216267405f61aae9cc8cb73f" FOREIGN KEY ("sessionId") REFERENCES "session_entity"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`ALTER TABLE "user_entity" DROP CONSTRAINT "FK_715216267405f61aae9cc8cb73f"`,
		);
		await queryRunner.query(`DROP INDEX "public"."IDX_415c35b9b3b6fe45a3b065030f"`);
		await queryRunner.query(`DROP TABLE "user_entity"`);
		await queryRunner.query(`DROP TABLE "session_entity"`);
	}
}
