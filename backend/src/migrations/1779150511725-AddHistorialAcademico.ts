import { MigrationInterface, QueryRunner } from "typeorm";

export class AddHistorialAcademico1779150511725 implements MigrationInterface {
    name = 'AddHistorialAcademico1779150511725'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "historial_academico" ("id_historial" SERIAL NOT NULL, "titulo" character varying(150) NOT NULL, "institucion" character varying(150) NOT NULL, "anio" character varying(20) NOT NULL, "descripcion" text NOT NULL, "url_certificado" character varying(255), "id_estudiante" integer, CONSTRAINT "PK_49d23e28dfbf772df6836ac9e01" PRIMARY KEY ("id_historial"))`);
        await queryRunner.query(`ALTER TABLE "historial_academico" ADD CONSTRAINT "FK_24c6379678a071c8502ab14e043" FOREIGN KEY ("id_estudiante") REFERENCES "estudiante"("id_estudiante") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "historial_academico" DROP CONSTRAINT "FK_24c6379678a071c8502ab14e043"`);
        await queryRunner.query(`DROP TABLE "historial_academico"`);
    }

}
