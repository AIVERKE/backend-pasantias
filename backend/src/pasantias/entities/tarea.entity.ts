import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { JefePasantes } from '../../usuarios/entities/jefe-pasantes.entity';
import { Inscripcion } from './inscripcion.entity';

export enum EstadoSemaforo {
  PENDIENTE = 'Pendiente',
  EN_CURSO = 'En_curso',
  COMPLETADA = 'Completada',
  NO_COMPLETADA = 'No_completada',
}

export enum EstadoTarea {
  ACTIVO = 'Activo',
  VENCIDO = 'Vencido',
  COMPLETADO = 'Completado',
}

@Entity('actividad_bitacora')
export class Tarea {
  @PrimaryGeneratedColumn()
  id_tarea: number; // mapped from id_actividad in specs
  
  @Column({ type: 'varchar', length: 255, nullable: true })
  titulo_actividad: string;

  @Column({ type: 'text', nullable: true })
  descripcion_actividad: string;

  @Column({ type: 'timestamp', nullable: true })
  fecha_asignacion: Date;

  @Column({ type: 'int', nullable: true })
  id_jefe_asignador: number;

  @Column({
    type: 'enum',
    enum: EstadoSemaforo,
    default: EstadoSemaforo.PENDIENTE,
  })
  estado_semaforo: EstadoSemaforo;

  @Column({ type: 'int', nullable: true })
  nota_actividad: number;

  @ManyToOne(() => JefePasantes)
  @JoinColumn({ name: 'id_jefe_asignador' })
  jefe: JefePasantes;

  @ManyToOne(() => Inscripcion, { nullable: true })
  @JoinColumn({ name: 'id_inscripcion' })
  inscripcion: Inscripcion;
}
