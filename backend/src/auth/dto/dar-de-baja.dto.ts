import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class DarDeBajaDto {
  @ApiProperty({ description: 'Motivo de la baja' })
  @IsNotEmpty()
  @IsString()
  motivo: string;

  @ApiProperty({ description: 'Observación detallada' })
  @IsOptional()
  @IsString()
  observacion?: string;
}
