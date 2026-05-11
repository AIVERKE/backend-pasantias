import { MigrationInterface, QueryRunner } from "typeorm";

export class AddBajaColumns1778531909093 implements MigrationInterface {
    name = 'AddBajaColumns1778531909093'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "inscripcion" ADD "motivo_baja" character varying`);
        await queryRunner.query(`ALTER TABLE "inscripcion" ADD "observacion_baja" text`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "inscripcion" DROP COLUMN "observacion_baja"`);
        await queryRunner.query(`ALTER TABLE "inscripcion" DROP COLUMN "motivo_baja"`);
    }

}
