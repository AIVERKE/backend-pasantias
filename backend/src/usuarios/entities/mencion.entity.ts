import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('mencion')
export class Mencion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 150 })
  nombre_mencion: string;
}
