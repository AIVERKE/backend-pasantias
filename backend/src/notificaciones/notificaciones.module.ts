import { Module } from '@nestjs/common';
import { NotificacionesService } from './notificaciones.service';
import { NotificacionesController } from './notificaciones.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ComentarioActividad } from '../actividades/entities/comentario-actividad.entity';
import { Inscripcion } from '../pasantias/entities/inscripcion.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ComentarioActividad, Inscripcion])],
  controllers: [NotificacionesController],
  providers: [NotificacionesService],
})
export class NotificacionesModule {}
