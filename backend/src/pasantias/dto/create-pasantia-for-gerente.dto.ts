import { IsDateString, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePasantiaForGerenteDto {
  @ApiProperty({ example: 'Pasantía en Desarrollo Web' })
  @IsString()
  @IsNotEmpty()
  titulo: string;

  @ApiProperty({ example: 'Desarrollo de aplicaciones web con React y Node.js' })
  @IsString()
  @IsNotEmpty()
  descripcion: string;

  @ApiProperty({ example: '2026-06-01' })
  @IsDateString()
  fecha_inicio: string;

  @ApiProperty({ example: '2026-12-01', required: false })
  @IsDateString()
  @IsOptional()
  fecha_fin?: string;

  @ApiProperty({ example: 'Tecnología', required: false })
  @IsString()
  @IsOptional()
  area?: string;
}
