import { MigrationInterface, QueryRunner } from "typeorm";

export class AddComentarioActividad1779149029335 implements MigrationInterface {
    name = 'AddComentarioActividad1779149029335'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "comentario_actividad" ("id_comentario" SERIAL NOT NULL, "texto" text NOT NULL, "rol" character varying(50) NOT NULL, "autor" character varying(150) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "id_tarea" integer, CONSTRAINT "PK_9e4266f0fb57a0568da9e1ef318" PRIMARY KEY ("id_comentario"))`);
        await queryRunner.query(`ALTER TABLE "comentario_actividad" ADD CONSTRAINT "FK_6d7a2a807284df2fa4161e52411" FOREIGN KEY ("id_tarea") REFERENCES "actividad_bitacora"("id_tarea") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "comentario_actividad" DROP CONSTRAINT "FK_6d7a2a807284df2fa4161e52411"`);
        await queryRunner.query(`DROP TABLE "comentario_actividad"`);
    }

}
