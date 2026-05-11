import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Actividad, EstadoActividad } from '../pasantias/entities/actividad.entity';
import { Pasantia } from '../pasantias/entities/pasantia.entity';
import { Tarea, EstadoTarea } from '../pasantias/entities/tarea.entity';
import { Inscripcion } from '../pasantias/entities/inscripcion.entity';
import { JefePasantes } from '../usuarios/entities/jefe-pasantes.entity';
import { CreateActividadDto } from './dto/create-actividad.dto';
import { UpdateActividadDto } from './dto/update-actividad.dto';
import { CreateTareaDto } from './dto/create-tarea.dto';
import { UpdateTareaDto } from './dto/update-tarea.dto';

@Injectable()
export class ActividadesService {
  constructor(
    @InjectRepository(Actividad)
    private readonly actividadRepository: Repository<Actividad>,
    @InjectRepository(Pasantia)
    private readonly pasantiaRepository: Repository<Pasantia>,
    @InjectRepository(Tarea)
    private readonly tareaRepository: Repository<Tarea>,
    @InjectRepository(Inscripcion)
    private readonly inscripcionRepository: Repository<Inscripcion>,
    @InjectRepository(JefePasantes)
    private readonly jefeRepository: Repository<JefePasantes>,
  ) {}

  findByPasantia(pasantiaId: number): Promise<Actividad[]> {
    return this.actividadRepository.find({
      where: { pasantia: { id_pasantia: pasantiaId } },
      relations: ['pasantia'],
    });
  }

  async create(dto: CreateActividadDto): Promise<Actividad> {
    const pasantia = await this.pasantiaRepository.findOne({ where: { id_pasantia: dto.id_pasantia } });
    if (!pasantia) throw new NotFoundException(`Pasantía con ID ${dto.id_pasantia} no encontrada`);
    const actividad = this.actividadRepository.create({
      descripcion: dto.descripcion,
      fecha: new Date(dto.fecha),
      estado: EstadoActividad.CON_CUPOS,
      pasantia,
    });
    return this.actividadRepository.save(actividad);
  }

  async update(id: number, dto: UpdateActividadDto): Promise<Actividad> {
    const actividad = await this.actividadRepository.findOne({ where: { id_actividad: id } });
    if (!actividad) throw new NotFoundException(`Actividad con ID ${id} no encontrada`);
    if (dto.descripcion !== undefined) actividad.descripcion = dto.descripcion;
    if (dto.fecha !== undefined) actividad.fecha = new Date(dto.fecha);
    if (dto.estado !== undefined) actividad.estado = dto.estado;
    return this.actividadRepository.save(actividad);
  }

  // Métodos para Tareas (Actividades del Jefe)
  
  findTareasByJefe(jefeId: number): Promise<Tarea[]> {
    return this.tareaRepository.find({
      where: { jefe: { id_jefe: jefeId } },
      relations: ['inscripcion', 'inscripcion.estudiante', 'inscripcion.estudiante.usuario'],
    });
  }

  async createTarea(jefeId: number, dto: CreateTareaDto): Promise<Tarea> {
    const jefe = await this.jefeRepository.findOne({ where: { id_jefe: jefeId } });
    if (!jefe) throw new NotFoundException(`Jefe con ID ${jefeId} no encontrado`);

    let inscripcion = null;
    if (dto.id_inscripcion) {
      inscripcion = await this.inscripcionRepository.findOne({ where: { id_inscripcion: dto.id_inscripcion } });
      if (!inscripcion) throw new NotFoundException(`Inscripción con ID ${dto.id_inscripcion} no encontrada`);
    }

    const tarea = this.tareaRepository.create({
      titulo: dto.titulo,
      descripcion: dto.descripcion,
      fecha_limite: new Date(dto.fecha_limite),
      estado: EstadoTarea.ACTIVO,
      jefe,
      inscripcion: inscripcion || undefined,
    });

    return this.tareaRepository.save(tarea);
  }

  async updateTarea(id: number, dto: UpdateTareaDto): Promise<Tarea> {
    const tarea = await this.tareaRepository.findOne({ where: { id_tarea: id } });
    if (!tarea) throw new NotFoundException(`Tarea con ID ${id} no encontrada`);

    if (dto.titulo !== undefined) tarea.titulo = dto.titulo;
    if (dto.descripcion !== undefined) tarea.descripcion = dto.descripcion;
    if (dto.fecha_limite !== undefined) tarea.fecha_limite = new Date(dto.fecha_limite);
    if (dto.estado !== undefined) tarea.estado = dto.estado;

    return this.tareaRepository.save(tarea);
  }
}

