import { MigrationInterface, QueryRunner } from "typeorm";

export class Fase2Estudiante1779146027694 implements MigrationInterface {
    name = 'Fase2Estudiante1779146027694'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "mencion" ("id" SERIAL NOT NULL, "nombre_mencion" character varying(150) NOT NULL, CONSTRAINT "PK_ac9178a2fd61514c64effe329bb" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."actividad_bitacora_estado_semaforo_enum" AS ENUM('Pendiente', 'En_curso', 'Completada', 'No_completada')`);
        await queryRunner.query(`CREATE TABLE "actividad_bitacora" ("id_tarea" SERIAL NOT NULL, "titulo_actividad" character varying(255), "descripcion_actividad" text, "fecha_asignacion" TIMESTAMP, "id_jefe_asignador" integer, "estado_semaforo" "public"."actividad_bitacora_estado_semaforo_enum" NOT NULL DEFAULT 'Pendiente', "nota_actividad" integer, "id_inscripcion" integer, CONSTRAINT "PK_43ba69fadfee7260c6fc1166f14" PRIMARY KEY ("id_tarea"))`);
        await queryRunner.query(`ALTER TABLE "estudiante" ADD "id_mencion" integer`);
        await queryRunner.query(`ALTER TABLE "estudiante" ADD "url_foto_perfil" character varying(255)`);
        await queryRunner.query(`ALTER TABLE "estudiante" ADD "url_ci_anverso" character varying(255)`);
        await queryRunner.query(`ALTER TABLE "estudiante" ADD "url_ci_reverso" character varying(255)`);
        await queryRunner.query(`ALTER TABLE "estudiante" ADD "url_matricula" character varying(255)`);
        await queryRunner.query(`ALTER TABLE "inscripcion" ADD "comentario_jefe" text`);
        await queryRunner.query(`CREATE TYPE "public"."inscripcion_estado_ejecucion_enum" AS ENUM('En Curso', 'Finalizada', 'Abandonada')`);
        await queryRunner.query(`ALTER TABLE "inscripcion" ADD "estado_ejecucion" "public"."inscripcion_estado_ejecucion_enum"`);
        await queryRunner.query(`ALTER TABLE "pasantia" ADD "horario_laboral" character varying(255)`);
        await queryRunner.query(`ALTER TABLE "pasantia" ADD "cupos_totales" integer NOT NULL DEFAULT '1'`);
        await queryRunner.query(`ALTER TABLE "empresa" ADD "url_logo" character varying(255)`);
        await queryRunner.query(`ALTER TABLE "empresa" ADD "url_portada" character varying(255)`);
        await queryRunner.query(`ALTER TABLE "hoja_vida" ADD "url_certificado" character varying(255)`);
        await queryRunner.query(`ALTER TABLE "informe_final" ADD "crit_conocimiento_tecnico" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "informe_final" ADD "crit_responsabilidad" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "informe_final" ADD "crit_trabajo_equipo" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "informe_final" ADD "crit_iniciativa" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "informe_final" ADD "evaluacion_cualitativa" text`);
        await queryRunner.query(`ALTER TABLE "informe_final" ADD "comentario_estudiante" text`);
        await queryRunner.query(`ALTER TABLE "informe_final" ADD "valoracion_estrellas" integer`);
        await queryRunner.query(`ALTER TABLE "estudiante" ADD CONSTRAINT "FK_6c8527fbf6e769b1698eafad43d" FOREIGN KEY ("id_mencion") REFERENCES "mencion"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "actividad_bitacora" ADD CONSTRAINT "FK_ad70a8988d31c6dd8fcceb80ff0" FOREIGN KEY ("id_jefe_asignador") REFERENCES "jefe_pasantes"("id_jefe") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "actividad_bitacora" ADD CONSTRAINT "FK_da1b2eda21804d287b6af016d22" FOREIGN KEY ("id_inscripcion") REFERENCES "inscripcion"("id_inscripcion") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "actividad_bitacora" DROP CONSTRAINT "FK_da1b2eda21804d287b6af016d22"`);
        await queryRunner.query(`ALTER TABLE "actividad_bitacora" DROP CONSTRAINT "FK_ad70a8988d31c6dd8fcceb80ff0"`);
        await queryRunner.query(`ALTER TABLE "estudiante" DROP CONSTRAINT "FK_6c8527fbf6e769b1698eafad43d"`);
        await queryRunner.query(`ALTER TABLE "informe_final" DROP COLUMN "valoracion_estrellas"`);
        await queryRunner.query(`ALTER TABLE "informe_final" DROP COLUMN "comentario_estudiante"`);
        await queryRunner.query(`ALTER TABLE "informe_final" DROP COLUMN "evaluacion_cualitativa"`);
        await queryRunner.query(`ALTER TABLE "informe_final" DROP COLUMN "crit_iniciativa"`);
        await queryRunner.query(`ALTER TABLE "informe_final" DROP COLUMN "crit_trabajo_equipo"`);
        await queryRunner.query(`ALTER TABLE "informe_final" DROP COLUMN "crit_responsabilidad"`);
        await queryRunner.query(`ALTER TABLE "informe_final" DROP COLUMN "crit_conocimiento_tecnico"`);
        await queryRunner.query(`ALTER TABLE "hoja_vida" DROP COLUMN "url_certificado"`);
        await queryRunner.query(`ALTER TABLE "empresa" DROP COLUMN "url_portada"`);
        await queryRunner.query(`ALTER TABLE "empresa" DROP COLUMN "url_logo"`);
        await queryRunner.query(`ALTER TABLE "pasantia" DROP COLUMN "cupos_totales"`);
        await queryRunner.query(`ALTER TABLE "pasantia" DROP COLUMN "horario_laboral"`);
        await queryRunner.query(`ALTER TABLE "inscripcion" DROP COLUMN "estado_ejecucion"`);
        await queryRunner.query(`DROP TYPE "public"."inscripcion_estado_ejecucion_enum"`);
        await queryRunner.query(`ALTER TABLE "inscripcion" DROP COLUMN "comentario_jefe"`);
        await queryRunner.query(`ALTER TABLE "estudiante" DROP COLUMN "url_matricula"`);
        await queryRunner.query(`ALTER TABLE "estudiante" DROP COLUMN "url_ci_reverso"`);
        await queryRunner.query(`ALTER TABLE "estudiante" DROP COLUMN "url_ci_anverso"`);
        await queryRunner.query(`ALTER TABLE "estudiante" DROP COLUMN "url_foto_perfil"`);
        await queryRunner.query(`ALTER TABLE "estudiante" DROP COLUMN "id_mencion"`);
        await queryRunner.query(`DROP TABLE "actividad_bitacora"`);
        await queryRunner.query(`DROP TYPE "public"."actividad_bitacora_estado_semaforo_enum"`);
        await queryRunner.query(`DROP TABLE "mencion"`);
    }

}
