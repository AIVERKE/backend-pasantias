import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Estudiante } from '../usuarios/entities/estudiante.entity';
import { Usuario } from '../usuarios/entities/usuario.entity';
import { HojaVida } from '../documentos/entities/hoja-vida.entity';
import { Habilidad } from '../documentos/entities/habilidad.entity';
import { HistorialAcademico } from '../documentos/entities/historial-academico.entity';
import { Mencion } from '../usuarios/entities/mencion.entity';
import { CreateEstudianteDto } from './dto/create-estudiante.dto';
import { UpdateEstudianteDto } from './dto/update-estudiante.dto';

@Injectable()
export class EstudiantesService {
  constructor(
    @InjectRepository(Estudiante)
    private readonly estudianteRepository: Repository<Estudiante>,
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
    @InjectRepository(HojaVida)
    private readonly hojaVidaRepository: Repository<HojaVida>,
    @InjectRepository(Habilidad)
    private readonly habilidadRepository: Repository<Habilidad>,
    @InjectRepository(HistorialAcademico)
    private readonly historialRepository: Repository<HistorialAcademico>,
    @InjectRepository(Mencion)
    private readonly mencionRepository: Repository<Mencion>,
  ) {}

  findAll(carrera?: string, semestre?: number): Promise<Estudiante[]> {
    const where: any = {};
    if (carrera) where.carrera = carrera;
    if (semestre) where.semestre = semestre;
    return this.estudianteRepository.find({ where, relations: ['usuario'] });
  }

  async findOne(id: number): Promise<Estudiante> {
    const estudiante = await this.estudianteRepository.findOne({
      where: { id_estudiante: id },
      relations: ['usuario'],
    });
    if (!estudiante) throw new NotFoundException(`Estudiante con ID ${id} no encontrado`);
    return estudiante;
  }

  async create(dto: CreateEstudianteDto): Promise<Estudiante> {
    const usuario = await this.usuarioRepository.findOne({ where: { id_usuario: dto.id_usuario } });
    if (!usuario) throw new NotFoundException(`Usuario con ID ${dto.id_usuario} no encontrado`);
    const estudiante = this.estudianteRepository.create({
      id_estudiante: dto.id_usuario,
      carrera: dto.carrera,
      semestre: dto.semestre,
      registro_universitario: dto.registro_universitario,
    });
    return this.estudianteRepository.save(estudiante);
  }

  async getPerfil(id: number) {
    const estudiante = await this.estudianteRepository.findOne({
      where: { id_estudiante: id },
      relations: ['usuario', 'mencion'],
    });
    if (!estudiante) throw new NotFoundException(`Estudiante no encontrado`);

    let hojaVida = await this.hojaVidaRepository.findOne({
      where: { estudiante: { id_estudiante: id } },
      relations: ['habilidades'],
    });

    if (!hojaVida) {
      hojaVida = this.hojaVidaRepository.create({
        resumen: '',
        fecha_actualizacion: new Date(),
        estudiante: { id_estudiante: id } as any,
      });
      await this.hojaVidaRepository.save(hojaVida);
      hojaVida.habilidades = [];
    }

    const historial = await this.historialRepository.find({
      where: { estudiante: { id_estudiante: id } },
      order: { id_historial: 'DESC' }
    });

    return {
      id_estudiante: estudiante.id_estudiante,
      nombre: estudiante.usuario.nombre,
      apellido_paterno: estudiante.usuario.apellido,
      apellido_materno: '',
      semestre: estudiante.semestre,
      mencion: estudiante.mencion?.nombre_mencion || '',
      sobreMi: hojaVida.resumen,
      cvLink: hojaVida.url_certificado || '',
      habilidades: hojaVida.habilidades.map(h => h.nombre),
      historialAcademico: historial,
    };
  }

  async update(id: number, data: any): Promise<any> {
    const estudiante = await this.findOne(id);
    if (data.carrera !== undefined) estudiante.carrera = data.carrera;
    if (data.semestre !== undefined) estudiante.semestre = data.semestre;
    
    if (data.mencion !== undefined) {
      let mencionObj = await this.mencionRepository.findOne({ where: { nombre_mencion: data.mencion } });
      if (!mencionObj) {
        mencionObj = this.mencionRepository.create({ nombre_mencion: data.mencion });
        await this.mencionRepository.save(mencionObj);
      }
      estudiante.mencion = mencionObj;
      estudiante.id_mencion = mencionObj.id;
    }
    await this.estudianteRepository.save(estudiante);

    let hojaVida = await this.hojaVidaRepository.findOne({
      where: { estudiante: { id_estudiante: id } },
      relations: ['habilidades'],
    });

    if (!hojaVida) {
      hojaVida = this.hojaVidaRepository.create({
        resumen: data.sobre_mi || '',
        url_certificado: data.cvLink || '',
        fecha_actualizacion: new Date(),
        estudiante: { id_estudiante: id } as any,
      });
      await this.hojaVidaRepository.save(hojaVida);
      hojaVida.habilidades = [];
    } else {
      if (data.sobre_mi !== undefined) hojaVida.resumen = data.sobre_mi;
      if (data.cvLink !== undefined) hojaVida.url_certificado = data.cvLink;
      hojaVida.fecha_actualizacion = new Date();
      await this.hojaVidaRepository.save(hojaVida);
    }

    if (data.habilidades && Array.isArray(data.habilidades)) {
      await this.habilidadRepository.delete({ hoja_vida: { id_hoja_vida: hojaVida.id_hoja_vida } });
      
      const nuevasHabilidades = data.habilidades.map((habNombre: string) => {
        return this.habilidadRepository.create({
          nombre: habNombre,
          nivel: 'intermedio' as any,
          hoja_vida: hojaVida,
        });
      });
      if (nuevasHabilidades.length > 0) {
        await this.habilidadRepository.save(nuevasHabilidades);
      }
    }

    return this.getPerfil(id);
  }

  async addHistorialAcademico(id: number, dto: any, filePath: string) {
    const estudiante = await this.findOne(id);
    const historial = this.historialRepository.create({
      titulo: dto.titulo,
      institucion: dto.institucion,
      anio: dto.anio,
      descripcion: dto.descripcion,
      url_certificado: filePath,
      estudiante: estudiante
    });
    return this.historialRepository.save(historial);
  }

  async removeHistorialAcademico(idHistorial: number) {
    const historial = await this.historialRepository.findOne({ where: { id_historial: idHistorial } });
    if (!historial) {
      throw new NotFoundException(`Entrada de historial con ID ${idHistorial} no encontrada`);
    }
    await this.historialRepository.remove(historial);
    return { message: 'Entrada eliminada correctamente' };
  }
}
