import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddIdsJefesColumn1777914637098 implements MigrationInterface {
    name = 'AddIdsJefesColumn1777914637098'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Drop foreign key constraint first
        await queryRunner.query(`ALTER TABLE "pasantia" DROP CONSTRAINT IF EXISTS "FK_f1890c545f47186c890dca03c2a"`);
        // Drop old id_jefe column if exists
        await queryRunner.query(`ALTER TABLE "pasantia" DROP COLUMN IF EXISTS "id_jefe"`);
        // Add new ids_jefes column as jsonb
        await queryRunner.addColumn('pasantia', new TableColumn({
            name: 'ids_jefes',
            type: 'jsonb',
            isNullable: true,
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pasantia" DROP COLUMN IF EXISTS "ids_jefes"`);
        await queryRunner.addColumn('pasantia', new TableColumn({
            name: 'id_jefe',
            type: 'int',
            isNullable: true,
        }));
        await queryRunner.query(`ALTER TABLE "pasantia" ADD CONSTRAINT "FK_f1890c545f47186c890dca03c2a" FOREIGN KEY ("id_jefe") REFERENCES "jefe_pasantes"("id_jefe") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
