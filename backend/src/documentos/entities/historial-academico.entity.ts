import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Estudiante } from '../../usuarios/entities/estudiante.entity';

@Entity('historial_academico')
export class HistorialAcademico {
  @PrimaryGeneratedColumn()
  id_historial: number;

  @Column({ type: 'varchar', length: 150 })
  titulo: string;

  @Column({ type: 'varchar', length: 150 })
  institucion: string;

  @Column({ type: 'varchar', length: 20 })
  anio: string;

  @Column({ type: 'text' })
  descripcion: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  url_certificado: string;

  @ManyToOne(() => Estudiante)
  @JoinColumn({ name: 'id_estudiante' })
  estudiante: Estudiante;
}
