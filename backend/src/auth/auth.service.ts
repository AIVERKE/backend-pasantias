import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull, In, Not } from 'typeorm';
import { UsuariosService } from '../usuarios/usuarios.service';
import { Empresa } from '../empresas/entities/empresa.entity';
import { InformacionEmpresa } from '../empresas/entities/informacion-empresa.entity';
import { Usuario } from '../usuarios/entities/usuario.entity';
import { TipoUsuario } from '../usuarios/entities/usuario.entity';
import { Inscripcion, EstadoInscripcion } from '../pasantias/entities/inscripcion.entity';
import { Pasantia, EstadoPasantia } from '../pasantias/entities/pasantia.entity';
import { InformeFinal } from '../documentos/entities/informe-final.entity';
import { Bitacora } from '../documentos/entities/bitacora.entity';
import { CreateUsuarioDto } from '../usuarios/dto/create-usuario.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usuariosService: UsuariosService,
    private readonly jwtService: JwtService,
    @InjectRepository(Empresa)
    private readonly empresaRepository: Repository<Empresa>,
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
    @InjectRepository(Inscripcion)
    private readonly inscripcionRepository: Repository<Inscripcion>,
    @InjectRepository(InformacionEmpresa)
    private readonly infoEmpresaRepository: Repository<InformacionEmpresa>,
    @InjectRepository(InformeFinal)
    private readonly informeRepository: Repository<InformeFinal>,
    @InjectRepository(Bitacora)
    private readonly bitacoraRepository: Repository<Bitacora>,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usuariosService.findByEmail(email);
    if (user && await bcrypt.compare(pass, user.contrasena)) {
      const { contrasena, ...result } = user;
      return result;
    }
    return null;
  }

  async getProfile(userId: number) {
    return this.usuariosService.findOne(userId);
  }

  async login(user: any) {
    const payload = { 
      email: user.email, 
      sub: user.id_usuario, 
      tipo: user.tipo_usuario, 
      nivel: user.nivel_acceso 
    };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id_usuario,
        nombre: user.nombre,
        apellido: user.apellido,
        email: user.email,
        tipo: user.tipo_usuario,
        nivel: user.nivel_acceso
      }
    };
  }

  async getGerenteDashboard(gerenteUserId: number) {
    // 1. Obtener el perfil del gerente para saber su empresa
    const gerentePerfil = await this.usuariosService.findOne(gerenteUserId);
    
    if (!gerentePerfil.gerente?.empresa) {
      throw new NotFoundException('El gerente no tiene una empresa asignada');
    }

    const empresaId = gerentePerfil.gerente.empresa.id_empresa;

    // 2. Obtener empresa con pasantías y relaciones completas
    const empresa = await this.empresaRepository.findOne({
      where: { id_empresa: empresaId },
      relations: ['pasantias', 'pasantias.inscripciones', 'pasantias.inscripciones.estudiante', 'pasantias.inscripciones.estudiante.usuario'],
    });

    // 3. Contar métricas
    let pasantesActivos = 0;
    let pasantiasPublicadas = 0;
    const pasantiasList: any[] = [];

    const pasantias = empresa?.pasantias || [];
    for (const p of pasantias) {
      // Solo contar pasantías publicadas o en curso
      if (p.estado === EstadoPasantia.EN_CURSO || p.estado === EstadoPasantia.PENDIENTE) {
        pasantiasPublicadas++;
      }
      
      // Contar pasantes aprobados por pasantía
      const inscripciones = p.inscripciones || [];
      const pasantesEnThisPasantia = inscripciones.filter((i: Inscripcion) => i.estado === EstadoInscripcion.APROBADA).length || 0;
      const postulantes = inscripciones.filter((i: Inscripcion) => i.estado === EstadoInscripcion.PENDIENTE).length || 0;
      
      pasantesActivos += pasantesEnThisPasantia;

      // Obtener nombre del jefe (buscar en inscripciones con jefe asignado)
      const inscripcionConJefe = inscripciones.find((i: Inscripcion) => i.jefe);
      let jefeNombre = 'Sin asignar';
      if (inscripcionConJefe?.jefe) {
        const jefe = await this.usuarioRepository.findOne({
          where: { id_usuario: inscripcionConJefe.jefe.id_jefe },
        });
        if (jefe) {
          jefeNombre = `${jefe.nombre} ${jefe.apellido}`;
        }
      }

      pasantiasList.push({
        id: p.id_pasantia,
        titulo: p.titulo,
        descripcion: p.descripcion,
        estado: p.estado,
        pasantes: pasantesEnThisPasantia,
        postulantes: postulantes,
        jefe: jefeNombre,
      });
    }

    // 4. Contar equipo (jefes de pasantes) de la empresa específica
    const equipo = await this.usuarioRepository
      .createQueryBuilder('usuario')
      .innerJoin('usuario.jefe_pasantes', 'jefe')
      .where('usuario.tipo_usuario = :tipo', { tipo: TipoUsuario.JEFE_PASANTES })
      .andWhere('jefe.id_empresa = :empresaId', { empresaId })
      .getCount();

    return {
      pasantesActivos,
      pasantiasPublicadas,
      equipo,
      pasantiasRecientes: pasantiasList.slice(0, 5),
    };
  }

  async getJefeDashboard(jefeUserId: number) {
    // 1. Contar pasantes activos (Inscripciones aprobadas para este jefe)
    const pasantesActivos = await this.inscripcionRepository.count({
      where: {
        jefe: { id_jefe: jefeUserId },
        estado: EstadoInscripcion.APROBADA
      }
    });

    // 2. Contar inscripciones pendientes para este jefe
    const inscripcionesPendientes = await this.inscripcionRepository.count({
      where: {
        jefe: { id_jefe: jefeUserId },
        estado: EstadoInscripcion.PENDIENTE
      }
    });

    // 3. Contar informes por emitir (Informes finales sin nota para este jefe)
    const informesPorEmitir = await this.informeRepository.count({
      where: {
        jefe: { id_jefe: jefeUserId },
        nota_final: IsNull()
      }
    });

    // 4. Obtener las 5 inscripciones más recientes
    const inscripcionesRecientes = await this.inscripcionRepository.find({
      where: {
        jefe: { id_jefe: jefeUserId }
      },
      relations: ['estudiante', 'estudiante.usuario', 'pasantia'],
      order: { created_at: 'DESC' },
      take: 5
    });

    // Transformar para el frontend
    const inscripcionesList = inscripcionesRecientes.map(ins => ({
      id: ins.id_inscripcion,
      iniciales: ins.estudiante?.usuario ? `${ins.estudiante.usuario.nombre[0]}${ins.estudiante.usuario.apellido[0]}`.toUpperCase() : '??',
      estudiante: ins.estudiante?.usuario ? `${ins.estudiante.usuario.nombre} ${ins.estudiante.usuario.apellido}` : 'Desconocido',
      ci: ins.estudiante?.registro_universitario || 'S/N',
      pasantia: ins.pasantia?.titulo || 'Sin título',
      fecha: ins.fecha_inscripcion ? new Date(ins.fecha_inscripcion).toLocaleDateString('es-BO') : 'S/F',
      estado: ins.estado === EstadoInscripcion.PENDIENTE ? 'Pendiente' : ins.estado === EstadoInscripcion.APROBADA ? 'Aprobada' : 'Rechazada'
    }));

    return {
      pasantesActivos,
      inscripcionesPendientes,
      informesPorEmitir,
      inscripcionesRecientes: inscripcionesList
    };
  }

  async getJefeInscripciones(jefeUserId: number) {
    const inscripciones = await this.inscripcionRepository.find({
      where: {
        jefe: { id_jefe: jefeUserId }
      },
      relations: ['estudiante', 'estudiante.usuario', 'pasantia'],
      order: { created_at: 'DESC' }
    });

    return inscripciones.map(ins => ({
      id: ins.id_inscripcion,
      iniciales: ins.estudiante?.usuario ? `${ins.estudiante.usuario.nombre[0]}${ins.estudiante.usuario.apellido[0]}`.toUpperCase() : '??',
      estudiante: ins.estudiante?.usuario ? `${ins.estudiante.usuario.nombre} ${ins.estudiante.usuario.apellido}` : 'Desconocido',
      ci: ins.estudiante?.registro_universitario || 'S/N',
      pasantia: ins.pasantia?.titulo || 'Sin título',
      fecha: ins.fecha_inscripcion ? new Date(ins.fecha_inscripcion).toLocaleDateString('es-BO') : 'S/F',
      estado: ins.estado === EstadoInscripcion.PENDIENTE ? 'Pendiente' : ins.estado === EstadoInscripcion.APROBADA ? 'Aprobada' : 'Rechazada'
    }));
  }

  async getJefePasantes(jefeUserId: number) {
    const inscripciones = await this.inscripcionRepository.find({
      where: [
        { jefe: { id_jefe: jefeUserId }, estado: In([EstadoInscripcion.APROBADA, EstadoInscripcion.COMPLETADA]) },
        { jefe: { id_jefe: jefeUserId }, estado: EstadoInscripcion.RECHAZADA, motivo_baja: Not(IsNull()) }
      ],
      relations: ['estudiante', 'estudiante.usuario', 'pasantia'],
      order: { created_at: 'DESC' }
    });

    return inscripciones.map(ins => ({
      id: ins.id_inscripcion,
      iniciales: ins.estudiante?.usuario ? `${ins.estudiante.usuario.nombre[0]}${ins.estudiante.usuario.apellido[0]}`.toUpperCase() : '??',
      estudiante: ins.estudiante?.usuario ? `${ins.estudiante.usuario.nombre} ${ins.estudiante.usuario.apellido}` : 'Desconocido',
      ci: ins.estudiante?.registro_universitario || 'S/N',
      pasantia: ins.pasantia?.titulo || 'Sin título',
      fechaInicio: ins.fecha_inicio_periodo ? new Date(ins.fecha_inicio_periodo).toLocaleDateString('es-BO') : 'S/F',
      progreso: 0,
      estado: ins.estado
    }));
  }

  async getJefeBitacoras(jefeUserId: number) {
    const bitacoras = await this.bitacoraRepository.find({
      where: {
        inscripcion: { jefe: { id_jefe: jefeUserId } }
      },
      relations: ['inscripcion', 'inscripcion.estudiante', 'inscripcion.estudiante.usuario', 'actividad'],
      order: { fecha: 'DESC' }
    });

    return bitacoras.map(bit => ({
      id: bit.id_bitacora,
      iniciales: bit.inscripcion?.estudiante?.usuario ? `${bit.inscripcion.estudiante.usuario.nombre[0]}${bit.inscripcion.estudiante.usuario.apellido[0]}`.toUpperCase() : '??',
      estudiante: bit.inscripcion?.estudiante?.usuario ? `${bit.inscripcion.estudiante.usuario.nombre} ${bit.inscripcion.estudiante.usuario.apellido}` : 'Desconocido',
      semana: bit.fecha && bit.inscripcion?.fecha_inicio_periodo ? 
        Math.floor((new Date(bit.fecha).getTime() - new Date(bit.inscripcion.fecha_inicio_periodo).getTime()) / (1000 * 60 * 60 * 24 * 7)) + 1 : 1,
      fechaEnvio: bit.fecha ? new Date(bit.fecha).toLocaleDateString('es-BO') : 'S/F',
      estado: bit.porcentaje > 0 ? 'Calificada' : 'Pendiente',
      nota: bit.porcentaje,
      obs: bit.observaciones || '',
      actividad: bit.actividad?.descripcion || 'Sin descripción'
    }));
  }

  async calificarBitacora(id: number, nota: number, observacion?: string) {
    const bitacora = await this.bitacoraRepository.findOne({
      where: { id_bitacora: id }
    });

    if (!bitacora) {
      throw new NotFoundException('Bitácora no encontrada');
    }

    bitacora.porcentaje = nota;
    bitacora.observaciones = observacion || '';

    return this.bitacoraRepository.save(bitacora);
  }

  async getJefeInformes(jefeUserId: number) {
    const inscripciones = await this.inscripcionRepository.find({
      where: [
        { jefe: { id_jefe: jefeUserId }, estado: EstadoInscripcion.APROBADA },
        { jefe: { id_jefe: jefeUserId }, estado: EstadoInscripcion.COMPLETADA }
      ],
      relations: ['estudiante', 'estudiante.usuario', 'pasantia'],
      order: { created_at: 'DESC' }
    });

    const result = [];
    for (const ins of inscripciones) {
      const bitacoras = await this.bitacoraRepository.find({
        where: { inscripcion: { id_inscripcion: ins.id_inscripcion } }
      });

      const total = bitacoras.length;
      const evaluadas = bitacoras.filter(b => b.porcentaje > 0).length;
      const sumaNotas = bitacoras.reduce((acc, b) => acc + (b.porcentaje || 0), 0);
      const promedio = total > 0 ? Math.round(sumaNotas / total) : 0;

      const informe = await this.informeRepository.findOne({
        where: { inscripcion: { id_inscripcion: ins.id_inscripcion } }
      });

      result.push({
        id: ins.id_inscripcion,
        informeId: informe?.id_informe || null,
        iniciales: ins.estudiante?.usuario ? `${ins.estudiante.usuario.nombre[0]}${ins.estudiante.usuario.apellido[0]}`.toUpperCase() : '??',
        estudiante: ins.estudiante?.usuario ? `${ins.estudiante.usuario.nombre} ${ins.estudiante.usuario.apellido}` : 'Desconocido',
        pasantia: ins.pasantia?.titulo || 'Sin título',
        bitacorasEvaluadas: evaluadas,
        totalBitacoras: total,
        notaSugerida: promedio,
        estado: informe ? 'Emitido' : 'Pendiente',
        contenido: informe?.contenido || '',
        notaFinal: informe?.nota_final || null
      });
    }

    return result;
  }

  async emitirInformeFinal(inscripcionId: number, apreciacion: string) {
    const inscripcion = await this.inscripcionRepository.findOne({
      where: { id_inscripcion: inscripcionId },
      relations: ['jefe']
    });

    if (!inscripcion) {
      throw new NotFoundException('Inscripción no encontrada');
    }

    // Calcular nota sugerida
    const bitacoras = await this.bitacoraRepository.find({
      where: { inscripcion: { id_inscripcion: inscripcionId } }
    });

    const total = bitacoras.length;
    const sumaNotas = bitacoras.reduce((acc, b) => acc + (b.porcentaje || 0), 0);
    const promedio = total > 0 ? Math.round(sumaNotas / total) : 0;

    // Crear informe
    const informe = new InformeFinal();
    informe.inscripcion = inscripcion;
    informe.jefe = inscripcion.jefe;
    informe.fecha_entrega = new Date();
    informe.contenido = apreciacion;
    informe.nota_final = promedio;

    return this.informeRepository.save(informe);
  }

  async darDeBaja(id: number, motivo: string, observacion?: string) {
    const inscripcion = await this.inscripcionRepository.findOne({
      where: { id_inscripcion: id }
    });

    if (!inscripcion) {
      throw new NotFoundException('Inscripción no encontrada');
    }

    inscripcion.estado = EstadoInscripcion.RECHAZADA;
    inscripcion.motivo_baja = motivo;
    inscripcion.observacion_baja = observacion || '';

    await this.inscripcionRepository.save(inscripcion);

    return { message: 'Pasante dado de baja correctamente' };
  }

  async cambiarEstado(id: number, estado: EstadoInscripcion) {
    const inscripcion = await this.inscripcionRepository.findOne({
      where: { id_inscripcion: id }
    });

    if (!inscripcion) {
      throw new NotFoundException('Inscripción no encontrada');
    }

    inscripcion.estado = estado;
    await this.inscripcionRepository.save(inscripcion);

    return { message: 'Estado actualizado correctamente' };
  }

  async getGerenteEmpresa(gerenteUserId: number) {
    // 1. Obtener el perfil del gerente para saber su empresa
    const gerentePerfil = await this.usuariosService.findOne(gerenteUserId);
    
    if (!gerentePerfil.gerente?.empresa) {
      throw new NotFoundException('El gerente no tiene una empresa asignada');
    }

    const empresaId = gerentePerfil.gerente.empresa.id_empresa;

    // 2. Obtener empresa completa
    const empresa = await this.empresaRepository.findOne({
      where: { id_empresa: empresaId },
    });

    // 3. Obtener información extendida (misión, visión, objetivos, quiénes_somos)
    const	infoEmpresa = await this.infoEmpresaRepository.findOne({
      where: { id: empresaId },
    });

    // 4. Combinar datos
    return {
      ...empresa,
      mision: infoEmpresa?.mision || '',
      vision: infoEmpresa?.vision || '',
      objetivos: infoEmpresa?.objetivos || '',
      quienes_somos: infoEmpresa?.quienes_somos || '',
    };
  }

  async updateGerenteEmpresa(gerenteUserId: number, updateData: any) {
    // 1. Obtener el perfil del gerente para saber su empresa
    const gerentePerfil = await this.usuariosService.findOne(gerenteUserId);
    
    if (!gerentePerfil.gerente?.empresa) {
      throw new NotFoundException('El gerente no tiene una empresa asignada');
    }

    const empresaId = gerentePerfil.gerente.empresa.id_empresa;

    // 2. Separar datos de empresa vs información extendida
    const { mision, vision, objetivos, quienes_somos, ...empresaData } = updateData;

    // 3. Actualizar empresa base si hay datos
    if (Object.keys(empresaData).length > 0) {
      await this.empresaRepository.update(empresaId, empresaData);
    }

    // 4. Actualizar o crear información extendida
    const existingInfo = await this.infoEmpresaRepository.findOne({
      where: { id: empresaId },
    });

    if (existingInfo) {
      await this.infoEmpresaRepository.update(empresaId, {
        mision: mision || existingInfo.mision,
        vision: vision || existingInfo.vision,
        objetivos: objetivos || existingInfo.objetivos,
        quienes_somos: quienes_somos || existingInfo.quienes_somos,
      });
    } else if (mision || vision || objetivos || quienes_somos) {
      await this.infoEmpresaRepository.insert({
        id: empresaId,
        mision: mision || '',
        vision: vision || '',
        objetivos: objetivos || '',
        quienes_somos: quienes_somos || '',
      });
    }

    // 5. Devolver empresa actualizada
    return this.getGerenteEmpresa(gerenteUserId);
  }

  async getGerenteEquipo(gerenteUserId: number) {
    // 1. Obtener el perfil del gerente para saber su empresa
    const gerentePerfil = await this.usuariosService.findOne(gerenteUserId);
    
    if (!gerentePerfil.gerente?.empresa) {
      throw new NotFoundException('El gerente no tiene una empresa asignada');
    }

    const empresaId = gerentePerfil.gerente.empresa.id_empresa;

    // 2. Obtener usuarios con rol JEFE_PASANTES de esa empresa
    const Jefes = await this.usuarioRepository
      .createQueryBuilder('usuario')
      .innerJoin('usuario.jefe_pasantes', 'jefe')
      .addSelect(['jefe.departamento'])
      .where('usuario.tipo_usuario = :tipo', { tipo: TipoUsuario.JEFE_PASANTES })
      .andWhere('jefe.id_empresa = :empresaId', { empresaId })
      .getMany();

    // 3. Transformar para el frontend con conteos
    const result = [];
    for (const jefe of Jefes) {
      // Contar pasantes asignados
      const pasantesAsignados = await this.inscripcionRepository.count({
        where: {
          jefe: { id_jefe: jefe.id_usuario },
          estado: EstadoInscripcion.APROBADA
        }
      });

      // Contar pasantías activas
      const pasantiasActivas = await this.usuarioRepository.manager
        .createQueryBuilder(Pasantia, 'p')
        .innerJoin('p.jefe_pasantes', 'jefe_p')
        .where('jefe_p.id_jefe = :jefeId', { jefeId: jefe.id_usuario })
        .andWhere('p.estado = :estado', { estado: EstadoPasantia.EN_CURSO })
        .getCount();

      result.push({
        id: jefe.id_usuario,
        nombre: `${jefe.nombre} ${jefe.apellido}`,
        iniciales: `${jefe.nombre[0]}${jefe.apellido[0]}`.toUpperCase(),
        area: (jefe as any).jefe_pasantes?.departamento || 'Sin área',
        email: jefe.email,
        pasantiasActivas,
        pasantesAsignados
      });
    }

    return result;
  }

  async getGerenteEquipoPasantes(jefeId: number) {
    const inscripciones = await this.inscripcionRepository.find({
      where: {
        jefe: { id_jefe: jefeId },
        estado: EstadoInscripcion.APROBADA
      },
      relations: ['estudiante', 'estudiante.usuario', 'pasantia']
    });

    return inscripciones.map(ins => {
      const inicio = ins.fecha_inicio_periodo ? new Date(ins.fecha_inicio_periodo) : null;
      const fin = ins.fecha_fin_periodo ? new Date(ins.fecha_fin_periodo) : null;
      let progreso = 0;

      if (inicio && fin) {
        const total = fin.getTime() - inicio.getTime();
        const transcurrido = new Date().getTime() - inicio.getTime();
        if (total > 0) {
          progreso = Math.min(100, Math.max(0, Math.round((transcurrido / total) * 100)));
        }
      }

      return {
        id: ins.id_inscripcion,
        estudiante: ins.estudiante?.usuario ? `${ins.estudiante.usuario.nombre} ${ins.estudiante.usuario.apellido}` : 'Desconocido',
        pasantia: ins.pasantia?.titulo || 'Sin título',
        progreso,
        estado: ins.estado
      };
    });
  }

  async getGerentePasantes(gerenteUserId: number) {
    // 1. Obtener el perfil del gerente para saber su empresa
    const gerentePerfil = await this.usuariosService.findOne(gerenteUserId);
    
    if (!gerentePerfil.gerente?.empresa) {
      throw new NotFoundException('El gerente no tiene una empresa asignada');
    }

    const empresaId = gerentePerfil.gerente.empresa.id_empresa;

    // 2. Obtener inscripciones aprobadas para esa empresa
    const inscripciones = await this.inscripcionRepository.find({
      where: {
        pasantia: { empresa: { id_empresa: empresaId } },
        estado: EstadoInscripcion.APROBADA
      },
      relations: ['estudiante', 'estudiante.usuario', 'pasantia', 'jefe', 'jefe.usuario']
    });

    return inscripciones.map(ins => {
      const inicio = ins.fecha_inicio_periodo ? new Date(ins.fecha_inicio_periodo) : null;
      const fin = ins.fecha_fin_periodo ? new Date(ins.fecha_fin_periodo) : null;
      let progreso = 0;

      if (inicio && fin) {
        const total = fin.getTime() - inicio.getTime();
        const transcurrido = new Date().getTime() - inicio.getTime();
        if (total > 0) {
          progreso = Math.min(100, Math.max(0, Math.round((transcurrido / total) * 100)));
        }
      }

      return {
        id: ins.id_inscripcion,
        nombre: ins.estudiante?.usuario ? `${ins.estudiante.usuario.nombre} ${ins.estudiante.usuario.apellido}` : 'Desconocido',
        ci: ins.estudiante?.registro_universitario || 'S/N',
        pasantia: ins.pasantia?.titulo || 'Sin título',
        jefe: ins.jefe?.usuario ? `${ins.jefe.usuario.nombre} ${ins.jefe.usuario.apellido}` : 'Sin asignar',
        fechaInicio: ins.fecha_inicio_periodo ? new Date(ins.fecha_inicio_periodo).toLocaleDateString('es-BO') : 'S/F',
        progreso
      };
    });
  }

  async invitarJefe(gerenteUserId: number, data: { email: string, nombre: string, apellido: string, departamento: string, contrasena?: string }) {
    const gerentePerfil = await this.usuariosService.findOne(gerenteUserId);
    if (!gerentePerfil.gerente?.empresa) {
      throw new NotFoundException('El gerente no tiene una empresa asignada');
    }
    const empresaId = gerentePerfil.gerente.empresa.id_empresa;

    const createUsuarioDto: CreateUsuarioDto = {
      email: data.email,
      contrasena: data.contrasena || 'Temporal123*', // Usar la proporcionada o una por defecto
      nombre: data.nombre,
      apellido: data.apellido,
      tipo_usuario: TipoUsuario.JEFE_PASANTES,
      id_empresa: empresaId,
      departamento: data.departamento,
    };

    return this.usuariosService.create(createUsuarioDto);
  }

  async updateGerenteEquipo(gerenteUserId: number, id: number, data: any) {
    const gerentePerfil = await this.usuariosService.findOne(gerenteUserId);
    const jefe = await this.usuariosService.findOne(id);

    if (!jefe.jefe_pasantes || jefe.jefe_pasantes.empresa?.id_empresa !== gerentePerfil.gerente?.empresa?.id_empresa) {
      throw new ForbiddenException('No tenés permiso para editar este jefe de pasantes');
    }

    return this.usuariosService.update(id, data);
  }

  async deleteGerenteEquipo(gerenteUserId: number, id: number) {
    const gerentePerfil = await this.usuariosService.findOne(gerenteUserId);
    const jefe = await this.usuariosService.findOne(id);

    if (!jefe.jefe_pasantes || jefe.jefe_pasantes.empresa?.id_empresa !== gerentePerfil.gerente?.empresa?.id_empresa) {
      throw new ForbiddenException('No tenés permiso para eliminar este jefe de pasantes');
    }

    return this.usuariosService.remove(id);
  }
}

