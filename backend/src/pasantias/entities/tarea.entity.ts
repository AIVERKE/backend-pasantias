import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { JefePasantes } from '../../usuarios/entities/jefe-pasantes.entity';
import { Inscripcion } from './inscripcion.entity';

export enum EstadoTarea {
  ACTIVO = 'Activo',
  VENCIDO = 'Vencido',
  COMPLETADO = 'Completado',
}

@Entity('tarea')
export class Tarea {
  @PrimaryGeneratedColumn()
  id_tarea: number;

  @Column({ type: 'varchar', length: 255 })
  titulo: string;

  @Column({ type: 'text' })
  descripcion: string;

  @Column({ type: 'date' })
  fecha_limite: Date;

  @Column({
    type: 'enum',
    enum: EstadoTarea,
    default: EstadoTarea.ACTIVO,
  })
  estado: EstadoTarea;

  @ManyToOne(() => JefePasantes)
  @JoinColumn({ name: 'id_jefe' })
  jefe: JefePasantes;

  @ManyToOne(() => Inscripcion, { nullable: true })
  @JoinColumn({ name: 'id_inscripcion' })
  inscripcion: Inscripcion;
}
