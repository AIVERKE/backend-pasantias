import { Module } from '@nestjs/common';
import { InformesService } from './informes.service';
import { InformesController } from './informes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InformeFinal } from '../documentos/entities/informe-final.entity';
import { Inscripcion } from '../pasantias/entities/inscripcion.entity';

@Module({
  imports: [TypeOrmModule.forFeature([InformeFinal, Inscripcion])],
  controllers: [InformesController],
  providers: [InformesService],
})
export class InformesModule {}
