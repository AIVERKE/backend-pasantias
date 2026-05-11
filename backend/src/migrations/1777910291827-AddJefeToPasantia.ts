import { MigrationInterface, QueryRunner } from "typeorm";

export class AddJefeToPasantia1777910291827 implements MigrationInterface {
    name = 'AddJefeToPasantia1777910291827'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pasantia" ADD "id_jefe" integer`);
        await queryRunner.query(`ALTER TABLE "pasantia" ADD CONSTRAINT "FK_f1890c545f47186c890dca03c2a" FOREIGN KEY ("id_jefe") REFERENCES "jefe_pasantes"("id_jefe") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pasantia" DROP CONSTRAINT "FK_f1890c545f47186c890dca03c2a"`);
        await queryRunner.query(`ALTER TABLE "pasantia" DROP COLUMN "id_jefe"`);
    }

}
