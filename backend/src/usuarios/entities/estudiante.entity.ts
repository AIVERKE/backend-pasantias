import { Entity, Column, PrimaryColumn, OneToOne, JoinColumn, ManyToOne } from 'typeorm';
import { Usuario } from './usuario.entity';
import { Mencion } from './mencion.entity';

@Entity('estudiante')
export class Estudiante {
  @PrimaryColumn()
  id_estudiante: number;

  @OneToOne(() => Usuario)
  @JoinColumn({ name: 'id_estudiante' })
  usuario: Usuario;

  @Column({ type: 'varchar', length: 150 })
  carrera: string;

  @Column({ type: 'int' })
  semestre: number;

  @Column({ type: 'varchar', length: 50, unique: true })
  registro_universitario: string;

  @Column({ type: 'int', nullable: true })
  id_mencion: number;

  @ManyToOne(() => Mencion)
  @JoinColumn({ name: 'id_mencion' })
  mencion: Mencion;

  @Column({ type: 'varchar', length: 255, nullable: true })
  url_foto_perfil: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  url_ci_anverso: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  url_ci_reverso: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  url_matricula: string;
}
