import { MigrationInterface, QueryRunner } from "typeorm";

export class AddArchivadaState1777913914067 implements MigrationInterface {
    name = 'AddArchivadaState1777913914067'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TYPE "public"."pasantia_estado_enum" RENAME TO "pasantia_estado_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."pasantia_estado_enum" AS ENUM('pendiente', 'en_curso', 'finalizada', 'cancelada', 'archivada')`);
        await queryRunner.query(`ALTER TABLE "pasantia" ALTER COLUMN "estado" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "pasantia" ALTER COLUMN "estado" TYPE "public"."pasantia_estado_enum" USING "estado"::"text"::"public"."pasantia_estado_enum"`);
        await queryRunner.query(`ALTER TABLE "pasantia" ALTER COLUMN "estado" SET DEFAULT 'pendiente'`);
        await queryRunner.query(`DROP TYPE "public"."pasantia_estado_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."pasantia_estado_enum_old" AS ENUM('pendiente', 'en_curso', 'finalizada', 'cancelada')`);
        await queryRunner.query(`ALTER TABLE "pasantia" ALTER COLUMN "estado" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "pasantia" ALTER COLUMN "estado" TYPE "public"."pasantia_estado_enum_old" USING "estado"::"text"::"public"."pasantia_estado_enum_old"`);
        await queryRunner.query(`ALTER TABLE "pasantia" ALTER COLUMN "estado" SET DEFAULT 'pendiente'`);
        await queryRunner.query(`DROP TYPE "public"."pasantia_estado_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."pasantia_estado_enum_old" RENAME TO "pasantia_estado_enum"`);
    }

}
