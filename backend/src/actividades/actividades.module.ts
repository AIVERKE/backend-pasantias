import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActividadesService } from './actividades.service';
import { ActividadesController } from './actividades.controller';
import { Actividad } from '../pasantias/entities/actividad.entity';
import { Pasantia } from '../pasantias/entities/pasantia.entity';
import { Tarea } from '../pasantias/entities/tarea.entity';
import { Inscripcion } from '../pasantias/entities/inscripcion.entity';
import { JefePasantes } from '../usuarios/entities/jefe-pasantes.entity';
import { ComentarioActividad } from './entities/comentario-actividad.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Actividad, Pasantia, Tarea, Inscripcion, JefePasantes, ComentarioActividad])],
  providers: [ActividadesService],
  controllers: [ActividadesController],
  exports: [ActividadesService],
})
export class ActividadesModule {}


