import { IsDateString, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdatePasantiaDto {
  @ApiProperty({ example: 'Pasantía en Desarrollo Web', required: false })
  @IsString()
  @IsOptional()
  titulo?: string;

  @ApiProperty({ example: 'Desarrollo de aplicaciones web con React y Node.js', required: false })
  @IsString()
  @IsOptional()
  descripcion?: string;

  @ApiProperty({ example: '2026-06-01', required: false })
  @IsDateString()
  @IsOptional()
  fecha_inicio?: string;

  @ApiProperty({ example: '2026-12-01', required: false })
  @IsDateString()
  @IsOptional()
  fecha_fin?: string;

  @ApiProperty({ example: 'Tecnología', required: false })
  @IsString()
  @IsOptional()
  area?: string;
}
