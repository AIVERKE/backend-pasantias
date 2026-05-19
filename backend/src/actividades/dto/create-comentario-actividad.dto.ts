import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsIn } from 'class-validator';

export class CreateComentarioActividadDto {
  @ApiProperty({ description: 'Texto del comentario' })
  @IsNotEmpty()
  @IsString()
  texto: string;

  @ApiProperty({ description: 'Rol del emisor', enum: ['Estudiante', 'Jefe'] })
  @IsNotEmpty()
  @IsString()
  @IsIn(['Estudiante', 'Jefe'])
  rol: string;

  @ApiProperty({ description: 'Nombre completo del autor' })
  @IsNotEmpty()
  @IsString()
  autor: string;
}
