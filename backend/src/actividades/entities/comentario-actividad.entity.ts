import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Tarea } from '../../pasantias/entities/tarea.entity';

@Entity('comentario_actividad')
export class ComentarioActividad {
  @PrimaryGeneratedColumn()
  id_comentario: number;

  @Column({ type: 'text' })
  texto: string;

  @Column({ type: 'varchar', length: 50 }) // 'Estudiante' o 'Jefe'
  rol: string;

  @Column({ type: 'varchar', length: 150 }) // Nombre del autor
  autor: string;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  fecha: Date;

  @ManyToOne(() => Tarea, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_tarea' })
  tarea: Tarea;
}
