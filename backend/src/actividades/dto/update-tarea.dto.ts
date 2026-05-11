import { IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { EstadoTarea } from '../../pasantias/entities/tarea.entity';

export class UpdateTareaDto {
  @ApiPropertyOptional({ example: 'Implementar CRUD de actividades' })
  @IsOptional()
  @IsString()
  titulo?: string;

  @ApiPropertyOptional({ example: 'Hacer que la tabla sea responsiva y cargue datos reales' })
  @IsOptional()
  @IsString()
  descripcion?: string;

  @ApiPropertyOptional({ example: '2026-05-15' })
  @IsOptional()
  @IsDateString()
  fecha_limite?: string;

  @ApiPropertyOptional({ enum: EstadoTarea, example: EstadoTarea.COMPLETADO })
  @IsOptional()
  @IsEnum(EstadoTarea)
  estado?: EstadoTarea;
}
