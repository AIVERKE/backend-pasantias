import { IsDateString, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTareaDto {
  @ApiProperty({ example: 'Implementar CRUD de actividades' })
  @IsString()
  @IsNotEmpty()
  titulo: string;

  @ApiProperty({ example: 'Hacer que la tabla sea responsiva y cargue datos reales' })
  @IsString()
  @IsNotEmpty()
  descripcion: string;

  @ApiProperty({ example: '2026-05-15' })
  @IsDateString()
  fecha_limite: string;

  @ApiProperty({ example: 1, description: 'ID de la inscripción del pasante (null para todos)', required: false })
  @IsInt()
  @IsOptional()
  id_inscripcion?: number;
}
