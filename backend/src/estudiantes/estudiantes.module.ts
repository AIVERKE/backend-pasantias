import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EstudiantesService } from './estudiantes.service';
import { EstudiantesController } from './estudiantes.controller';
import { Estudiante } from '../usuarios/entities/estudiante.entity';
import { Usuario } from '../usuarios/entities/usuario.entity';
import { HojaVida } from '../documentos/entities/hoja-vida.entity';
import { Habilidad } from '../documentos/entities/habilidad.entity';
import { HistorialAcademico } from '../documentos/entities/historial-academico.entity';
import { Mencion } from '../usuarios/entities/mencion.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Estudiante, Usuario, HojaVida, Habilidad, HistorialAcademico, Mencion])],
  providers: [EstudiantesService],
  controllers: [EstudiantesController],
  exports: [EstudiantesService],
})
export class EstudiantesModule {}
