import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';
import { Pasantia } from './pasantia.entity';
import { Estudiante } from '../../usuarios/entities/estudiante.entity';
import { Tutor } from '../../usuarios/entities/tutor.entity';
import { JefePasantes } from '../../usuarios/entities/jefe-pasantes.entity';

export enum EstadoEjecucion {
  EN_CURSO = 'En Curso',
  FINALIZADA = 'Finalizada',
  ABANDONADA = 'Abandonada',
}

export enum EstadoInscripcion {
  PENDIENTE = 'pendiente',
  APROBADA = 'aprobada',
  RECHAZADA = 'rechazada',
  COMPLETADA = 'completada',
}

@Entity('inscripcion')
export class Inscripcion {
  @PrimaryGeneratedColumn()
  id_inscripcion: number;

  @Column({ type: 'date' })
  fecha_inscripcion: Date;

  @Column({ type: 'date', nullable: true })
  fecha_inicio_periodo: Date;

  @Column({ type: 'date', nullable: true })
  fecha_fin_periodo: Date;

  @Column({
    type: 'enum',
    enum: EstadoInscripcion,
    default: EstadoInscripcion.PENDIENTE,
  })
  estado: EstadoInscripcion;

  @ManyToOne(() => Estudiante)
  @JoinColumn({ name: 'id_estudiante' })
  estudiante: Estudiante;

  @ManyToOne(() => Pasantia)
  @JoinColumn({ name: 'id_pasantia' })
  pasantia: Pasantia;

  @ManyToOne(() => Tutor, { nullable: true })
  @JoinColumn({ name: 'id_tutor' })
  tutor: Tutor;

  @ManyToOne(() => JefePasantes, { nullable: true })
  @JoinColumn({ name: 'id_jefe' })
  jefe: JefePasantes;

  @Column({ nullable: true })
  motivo_baja: string;

  @Column({ type: 'text', nullable: true })
  observacion_baja: string;

  @Column({ type: 'text', nullable: true })
  comentario_jefe: string;

  @Column({
    type: 'enum',
    enum: EstadoEjecucion,
    nullable: true,
  })
  estado_ejecucion: EstadoEjecucion;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deleted_at: Date;
}
