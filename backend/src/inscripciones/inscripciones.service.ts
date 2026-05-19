import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Inscripcion, EstadoInscripcion } from '../pasantias/entities/inscripcion.entity';
import { Estudiante } from '../usuarios/entities/estudiante.entity';
import { Pasantia } from '../pasantias/entities/pasantia.entity';
import { Tutor } from '../usuarios/entities/tutor.entity';
import { JefePasantes } from '../usuarios/entities/jefe-pasantes.entity';
import { CreateInscripcionDto } from './dto/create-inscripcion.dto';
import { UpdateEvaluacionDto } from './dto/update-evaluacion.dto';
import { AsignarSupervisoresDto } from './dto/asignar-supervisores.dto';

@Injectable()
export class InscripcionesService {
  constructor(
    @InjectRepository(Inscripcion)
    private readonly inscripcionRepository: Repository<Inscripcion>,
    @InjectRepository(Estudiante)
    private readonly estudianteRepository: Repository<Estudiante>,
    @InjectRepository(Pasantia)
    private readonly pasantiaRepository: Repository<Pasantia>,
    @InjectRepository(Tutor)
    private readonly tutorRepository: Repository<Tutor>,
    @InjectRepository(JefePasantes)
    private readonly jefeRepository: Repository<JefePasantes>,
  ) {}

  findByPasantia(pasantiaId: number): Promise<Inscripcion[]> {
    return this.inscripcionRepository.find({
      where: { pasantia: { id_pasantia: pasantiaId } },
      relations: ['estudiante', 'estudiante.usuario'],
    });
  }

  async findByEstudiante(estudianteId: number): Promise<any[]> {
    const inscripciones = await this.inscripcionRepository.find({
      where: { estudiante: { id_estudiante: estudianteId } },
      relations: ['pasantia', 'pasantia.empresa', 'pasantia.inscripciones'],
    });

    return inscripciones.map(i => {
      if (i.pasantia) {
        const approvedCount = i.pasantia.inscripciones
          ? i.pasantia.inscripciones.filter(ins => ins.estado === EstadoInscripcion.APROBADA || ins.estado === EstadoInscripcion.COMPLETADA).length
          : 0;
        (i.pasantia as any).cupos_ocupados = approvedCount;
        delete (i.pasantia as any).inscripciones;
      }
      return i;
    });
  }

  async create(dto: CreateInscripcionDto): Promise<Inscripcion> {
    const estudiante = await this.estudianteRepository.findOne({ where: { id_estudiante: dto.id_estudiante } });
    if (!estudiante) throw new NotFoundException(`Estudiante con ID ${dto.id_estudiante} no encontrado`);
    const pasantia = await this.pasantiaRepository.findOne({ where: { id_pasantia: dto.id_pasantia } });
    if (!pasantia) throw new NotFoundException(`Pasantía con ID ${dto.id_pasantia} no encontrada`);
    const inscripcion = this.inscripcionRepository.create({
      estado: EstadoInscripcion.PENDIENTE,
      fecha_inscripcion: new Date(),
      estudiante,
      pasantia,
    });
    return this.inscripcionRepository.save(inscripcion);
  }

  async updateEvaluacion(id: number, dto: UpdateEvaluacionDto): Promise<Inscripcion> {
    const inscripcion = await this.inscripcionRepository.findOne({ where: { id_inscripcion: id } });
    if (!inscripcion) throw new NotFoundException(`Inscripción con ID ${id} no encontrada`);
    inscripcion.estado = dto.estado;
    if (dto.estado === EstadoInscripcion.APROBADA) {
      if (dto.fecha_inicio_periodo) inscripcion.fecha_inicio_periodo = new Date(dto.fecha_inicio_periodo);
      if (dto.fecha_fin_periodo) inscripcion.fecha_fin_periodo = new Date(dto.fecha_fin_periodo);
    }
    return this.inscripcionRepository.save(inscripcion);
  }

  async asignarSupervisores(id: number, dto: AsignarSupervisoresDto): Promise<Inscripcion> {
    const inscripcion = await this.inscripcionRepository.findOne({ where: { id_inscripcion: id } });
    if (!inscripcion) throw new NotFoundException(`Inscripción con ID ${id} no encontrada`);
    const tutor = await this.tutorRepository.findOne({ where: { id_tutor: dto.id_tutor } });
    if (!tutor) throw new NotFoundException(`Tutor con ID ${dto.id_tutor} no encontrado`);
    const jefe = await this.jefeRepository.findOne({ where: { id_jefe: dto.id_jefe } });
    if (!jefe) throw new NotFoundException(`Jefe de pasantes con ID ${dto.id_jefe} no encontrado`);
    inscripcion.tutor = tutor;
    inscripcion.jefe = jefe;
    return this.inscripcionRepository.save(inscripcion);
  }

  async cancelar(id: number): Promise<void> {
    const inscripcion = await this.inscripcionRepository.findOne({ where: { id_inscripcion: id } });
    if (!inscripcion) throw new NotFoundException(`Inscripción con ID ${id} no encontrada`);
    if (inscripcion.estado !== EstadoInscripcion.PENDIENTE) {
      const { BadRequestException } = require('@nestjs/common');
      throw new BadRequestException('Solo se pueden cancelar postulaciones pendientes');
    }
    await this.inscripcionRepository.softDelete(id);
  }
}
