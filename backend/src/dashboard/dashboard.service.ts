import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Inscripcion } from '../pasantias/entities/inscripcion.entity';
import { Tarea, EstadoSemaforo } from '../pasantias/entities/tarea.entity';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Inscripcion)
    private readonly inscripcionRepository: Repository<Inscripcion>,
    @InjectRepository(Tarea)
    private readonly tareaRepository: Repository<Tarea>,
  ) {}

  async getDashboardEstudiante(idEstudiante: number) {
    // Buscar la inscripción más reciente del estudiante
    const inscripcion = await this.inscripcionRepository.findOne({
      where: { estudiante: { id_estudiante: idEstudiante } },
      order: { fecha_inscripcion: 'DESC' },
      relations: ['pasantia', 'pasantia.empresa'],
    });

    if (!inscripcion) {
      // Estado vacío si no hay inscripciones
      return {
        estado_pasantia: 'Sin Pasantía',
        tareas_completadas: { completadas: 0, totales: 0 },
        evaluacion_promedio: 0,
        actividades_recientes: []
      };
    }

    // Tareas / Actividades asociadas a esta inscripción
    const tareas = await this.tareaRepository.find({
      where: { inscripcion: { id_inscripcion: inscripcion.id_inscripcion } },
      order: { fecha_asignacion: 'DESC' },
    });

    // Cálculos
    const totales = tareas.length;
    const completadas = tareas.filter(t => t.estado_semaforo === EstadoSemaforo.COMPLETADA).length;
    
    const tareasConNota = tareas.filter(t => t.nota_actividad != null);
    let promedio = 0;
    if (tareasConNota.length > 0) {
      const suma = tareasConNota.reduce((acc, t) => acc + t.nota_actividad, 0);
      promedio = Math.round(suma / tareasConNota.length);
    }

    // Últimas actividades (max 5)
    const actividades_recientes = tareas.slice(0, 5).map(t => ({
      id: t.id_tarea,
      titulo: t.titulo_actividad,
      estado: t.estado_semaforo,
      fecha: t.fecha_asignacion,
      nota: t.nota_actividad,
    }));

    return {
      estado_pasantia: inscripcion.estado_ejecucion || inscripcion.estado,
      tareas_completadas: { completadas, totales },
      evaluacion_promedio: promedio,
      actividades_recientes,
    };
  }
}
