import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ComentarioActividad } from '../actividades/entities/comentario-actividad.entity';
import { Inscripcion } from '../pasantias/entities/inscripcion.entity';

@Injectable()
export class NotificacionesService {
  constructor(
    @InjectRepository(ComentarioActividad)
    private readonly comentarioRepository: Repository<ComentarioActividad>,
    @InjectRepository(Inscripcion)
    private readonly inscripcionRepository: Repository<Inscripcion>,
  ) {}

  async getConteoPendientes(idEstudiante: number) {
    const inscripciones = await this.inscripcionRepository.find({
      where: { estudiante: { id_estudiante: idEstudiante } }
    });

    if (inscripciones.length === 0) {
      return { count: 0 };
    }

    // Ya que no tenemos un sistema formal de is_read, mockearemos
    const unreadMessagesCount = 2; 
    let hasFinalReport = 1; // Simular que tiene reporte

    return { count: unreadMessagesCount + hasFinalReport };
  }
}
