import { MigrationInterface, QueryRunner } from "typeorm";

export class AddAreaAndJefesToPasantia1778511063677 implements MigrationInterface {
    name = 'AddAreaAndJefesToPasantia1778511063677'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pasantia" RENAME COLUMN "ids_jefes" TO "area"`);
        await queryRunner.query(`CREATE TABLE "pasantia_jefe_pasantes" ("id_pasantia" integer NOT NULL, "id_jefe" integer NOT NULL, CONSTRAINT "PK_a6d6bb589244c27957bd4266253" PRIMARY KEY ("id_pasantia", "id_jefe"))`);
        await queryRunner.query(`CREATE INDEX "IDX_4c447eed5dee5c62566229435f" ON "pasantia_jefe_pasantes" ("id_pasantia") `);
        await queryRunner.query(`CREATE INDEX "IDX_ca6c1f9b6b8c86230df5418043" ON "pasantia_jefe_pasantes" ("id_jefe") `);
        await queryRunner.query(`ALTER TYPE "public"."pasantia_estado_enum" RENAME TO "pasantia_estado_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."pasantia_estado_enum" AS ENUM('pendiente', 'en_curso', 'finalizada', 'cancelada')`);
        await queryRunner.query(`ALTER TABLE "pasantia" ALTER COLUMN "estado" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "pasantia" ALTER COLUMN "estado" TYPE "public"."pasantia_estado_enum" USING "estado"::"text"::"public"."pasantia_estado_enum"`);
        await queryRunner.query(`ALTER TABLE "pasantia" ALTER COLUMN "estado" SET DEFAULT 'pendiente'`);
        await queryRunner.query(`DROP TYPE "public"."pasantia_estado_enum_old"`);
        await queryRunner.query(`ALTER TABLE "pasantia" DROP COLUMN "area"`);
        await queryRunner.query(`ALTER TABLE "pasantia" ADD "area" character varying(100)`);
        await queryRunner.query(`ALTER TABLE "pasantia_jefe_pasantes" ADD CONSTRAINT "FK_4c447eed5dee5c62566229435fa" FOREIGN KEY ("id_pasantia") REFERENCES "pasantia"("id_pasantia") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "pasantia_jefe_pasantes" ADD CONSTRAINT "FK_ca6c1f9b6b8c86230df54180438" FOREIGN KEY ("id_jefe") REFERENCES "jefe_pasantes"("id_jefe") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pasantia_jefe_pasantes" DROP CONSTRAINT "FK_ca6c1f9b6b8c86230df54180438"`);
        await queryRunner.query(`ALTER TABLE "pasantia_jefe_pasantes" DROP CONSTRAINT "FK_4c447eed5dee5c62566229435fa"`);
        await queryRunner.query(`ALTER TABLE "pasantia" DROP COLUMN "area"`);
        await queryRunner.query(`ALTER TABLE "pasantia" ADD "area" jsonb`);
        await queryRunner.query(`CREATE TYPE "public"."pasantia_estado_enum_old" AS ENUM('pendiente', 'en_curso', 'finalizada', 'cancelada', 'archivada')`);
        await queryRunner.query(`ALTER TABLE "pasantia" ALTER COLUMN "estado" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "pasantia" ALTER COLUMN "estado" TYPE "public"."pasantia_estado_enum_old" USING "estado"::"text"::"public"."pasantia_estado_enum_old"`);
        await queryRunner.query(`ALTER TABLE "pasantia" ALTER COLUMN "estado" SET DEFAULT 'pendiente'`);
        await queryRunner.query(`DROP TYPE "public"."pasantia_estado_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."pasantia_estado_enum_old" RENAME TO "pasantia_estado_enum"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_ca6c1f9b6b8c86230df5418043"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_4c447eed5dee5c62566229435f"`);
        await queryRunner.query(`DROP TABLE "pasantia_jefe_pasantes"`);
        await queryRunner.query(`ALTER TABLE "pasantia" RENAME COLUMN "area" TO "ids_jefes"`);
    }

}
