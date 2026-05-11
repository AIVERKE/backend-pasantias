import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTarea1778533766777 implements MigrationInterface {
    name = 'CreateTarea1778533766777'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."tarea_estado_enum" AS ENUM('Activo', 'Vencido', 'Completado')`);
        await queryRunner.query(`CREATE TABLE "tarea" ("id_tarea" SERIAL NOT NULL, "titulo" character varying(255) NOT NULL, "descripcion" text NOT NULL, "fecha_limite" date NOT NULL, "estado" "public"."tarea_estado_enum" NOT NULL DEFAULT 'Activo', "id_jefe" integer, "id_inscripcion" integer, CONSTRAINT "PK_aa385a04099a3575f7b4dec6894" PRIMARY KEY ("id_tarea"))`);
        await queryRunner.query(`ALTER TABLE "tarea" ADD CONSTRAINT "FK_1f481c92fac515e5e947b2b0311" FOREIGN KEY ("id_jefe") REFERENCES "jefe_pasantes"("id_jefe") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tarea" ADD CONSTRAINT "FK_2033c8cac2f9c86d64344678f1b" FOREIGN KEY ("id_inscripcion") REFERENCES "inscripcion"("id_inscripcion") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tarea" DROP CONSTRAINT "FK_2033c8cac2f9c86d64344678f1b"`);
        await queryRunner.query(`ALTER TABLE "tarea" DROP CONSTRAINT "FK_1f481c92fac515e5e947b2b0311"`);
        await queryRunner.query(`DROP TABLE "tarea"`);
        await queryRunner.query(`DROP TYPE "public"."tarea_estado_enum"`);
    }

}
