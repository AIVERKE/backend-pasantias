import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pasantia, EstadoPasantia } from './entities/pasantia.entity';
import { Empresa } from '../empresas/entities/empresa.entity';
import { Gerente } from '../usuarios/entities/gerente.entity';
import { JefePasantes } from '../usuarios/entities/jefe-pasantes.entity';
import { CreatePasantiaDto } from './dto/create-pasantia.dto';
import { UpdateEstadoPasantiaDto } from './dto/update-estado-pasantia.dto';
import { CreatePasantiaForGerenteDto } from './dto/create-pasantia-for-gerente.dto';
import { UpdatePasantiaDto } from './dto/update-pasantia.dto';

@Injectable()
export class PasantiasService {
  constructor(
    @InjectRepository(Pasantia)
    private readonly pasantiaRepository: Repository<Pasantia>,
    @InjectRepository(Empresa)
    private readonly empresaRepository: Repository<Empresa>,
    @InjectRepository(Gerente)
    private readonly gerenteRepository: Repository<Gerente>,
    @InjectRepository(JefePasantes)
    private readonly jefePasantesRepository: Repository<JefePasantes>,
  ) {}

  async findAll(estado?: EstadoPasantia, empresaId?: number): Promise<Pasantia[]> {
    const qb = this.pasantiaRepository.createQueryBuilder('pasantia')
      .leftJoinAndSelect('pasantia.empresa', 'empresa')
      .loadRelationCountAndMap(
        'pasantia.cupos_ocupados',
        'pasantia.inscripciones',
        'inscripcion',
        (qb) => qb.where("inscripcion.estado = 'aprobada' OR inscripcion.estado = 'completada'")
      )
      .orderBy('pasantia.created_at', 'DESC');

    if (estado) qb.andWhere('pasantia.estado = :estado', { estado });
    if (empresaId) qb.andWhere('empresa.id_empresa = :empresaId', { empresaId });

    return qb.getMany();
  }

  async findOne(id: number): Promise<Pasantia> {
    const pasantia = await this.pasantiaRepository.createQueryBuilder('pasantia')
      .leftJoinAndSelect('pasantia.empresa', 'empresa')
      .loadRelationCountAndMap(
        'pasantia.cupos_ocupados',
        'pasantia.inscripciones',
        'inscripcion',
        (qb) => qb.where("inscripcion.estado = 'aprobada' OR inscripcion.estado = 'completada'")
      )
      .where('pasantia.id_pasantia = :id', { id })
      .getOne();

    if (!pasantia) throw new NotFoundException(`Pasantía con ID ${id} no encontrada`);
    return pasantia;
  }

  async create(dto: CreatePasantiaDto): Promise<Pasantia> {
    const empresa = await this.empresaRepository.findOne({ where: { id_empresa: dto.id_empresa } });
    if (!empresa) throw new NotFoundException(`Empresa con ID ${dto.id_empresa} no encontrada`);
    const pasantia = this.pasantiaRepository.create({
      titulo: dto.titulo,
      descripcion: dto.descripcion,
      fecha_inicio: new Date(dto.fecha_inicio),
      estado: EstadoPasantia.PENDIENTE,
      empresa,
    });
    return this.pasantiaRepository.save(pasantia);
  }

  async updateEstado(id: number, dto: UpdateEstadoPasantiaDto): Promise<Pasantia> {
    const pasantia = await this.findOne(id);
    pasantia.estado = dto.estado;
    if (dto.estado === EstadoPasantia.FINALIZADA || dto.estado === EstadoPasantia.CANCELADA) {
      pasantia.fecha_fin = new Date();
    }
    return this.pasantiaRepository.save(pasantia);
  }
  async findForGerente(userId: number): Promise<Pasantia[]> {
    const gerente = await this.gerenteRepository.findOne({
      where: { id_gerente: userId },
      relations: ['empresa'],
    });
    if (!gerente || !gerente.empresa) {
      throw new NotFoundException(`Gerente o empresa no encontrada para el usuario ${userId}`);
    }
    return this.pasantiaRepository.find({
      where: { empresa: { id_empresa: gerente.empresa.id_empresa } },
      relations: ['empresa', 'jefe_pasantes', 'jefe_pasantes.usuario'],
      order: { created_at: 'DESC' },
    });
  }

  async createForGerente(userId: number, dto: CreatePasantiaForGerenteDto): Promise<Pasantia> {
    const gerente = await this.gerenteRepository.findOne({
      where: { id_gerente: userId },
      relations: ['empresa'],
    });
    if (!gerente || !gerente.empresa) {
      throw new NotFoundException(`Gerente o empresa no encontrada para el usuario ${userId}`);
    }
    const pasantia = this.pasantiaRepository.create({
      titulo: dto.titulo,
      descripcion: dto.descripcion,
      fecha_inicio: new Date(`${dto.fecha_inicio}T00:00:00`),
      estado: EstadoPasantia.PENDIENTE,
      area: dto.area,
      fecha_fin: dto.fecha_fin ? new Date(`${dto.fecha_fin}T00:00:00`) : null,
      empresa: gerente.empresa,
    });
    return this.pasantiaRepository.save(pasantia);
  }

  async update(id: number, dto: UpdatePasantiaDto): Promise<Pasantia> {
    const pasantia = await this.findOne(id);
    if (dto.titulo) pasantia.titulo = dto.titulo;
    if (dto.descripcion) pasantia.descripcion = dto.descripcion;
    if (dto.fecha_inicio) pasantia.fecha_inicio = new Date(`${dto.fecha_inicio}T00:00:00`);
    if (dto.area) pasantia.area = dto.area;
    if (dto.fecha_fin !== undefined) {
      pasantia.fecha_fin = dto.fecha_fin ? new Date(`${dto.fecha_fin}T00:00:00`) : null;
    }
    return this.pasantiaRepository.save(pasantia);
  }

  async findJefesByEmpresa(empresaId: number): Promise<JefePasantes[]> {
    return this.jefePasantesRepository.find({
      where: { empresa: { id_empresa: empresaId } },
      relations: ['usuario'],
    });
  }

  async assignJefe(id: number, jefeUserId: number): Promise<Pasantia> {
    const pasantia = await this.pasantiaRepository.findOne({
      where: { id_pasantia: id },
      relations: ['jefe_pasantes'],
    });
    if (!pasantia) throw new NotFoundException(`Pasantía con ID ${id} no encontrada`);

    const jefe = await this.jefePasantesRepository.findOne({
      where: { id_jefe: jefeUserId },
      relations: ['usuario'],
    });
    if (!jefe) throw new NotFoundException(`Jefe con ID ${jefeUserId} no encontrado`);

    if (!pasantia.jefe_pasantes) pasantia.jefe_pasantes = [];
    
    // Check if already assigned
    const exists = pasantia.jefe_pasantes.some(j => j.id_jefe === jefe.id_jefe);
    if (!exists) {
      pasantia.jefe_pasantes.push(jefe);
    }

    return this.pasantiaRepository.save(pasantia);
  }

  async removeJefe(id: number, jefeId: number): Promise<Pasantia> {
    const pasantia = await this.pasantiaRepository.findOne({
      where: { id_pasantia: id },
      relations: ['jefe_pasantes'],
    });
    if (!pasantia) throw new NotFoundException(`Pasantía con ID ${id} no encontrada`);

    if (pasantia.jefe_pasantes) {
      pasantia.jefe_pasantes = pasantia.jefe_pasantes.filter(j => j.id_jefe !== jefeId);
    }

    return this.pasantiaRepository.save(pasantia);
  }

  async remove(id: number): Promise<void> {
    const result = await this.pasantiaRepository.softDelete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Pasantía con ID ${id} no encontrada`);
    }
  }
}
