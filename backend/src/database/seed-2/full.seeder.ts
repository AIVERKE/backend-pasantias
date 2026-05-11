import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Usuario, TipoUsuario } from '../../usuarios/entities/usuario.entity';
import { Empresa } from '../../empresas/entities/empresa.entity';
import { Estudiante } from '../../usuarios/entities/estudiante.entity';
import { Tutor } from '../../usuarios/entities/tutor.entity';
import { Gerente } from '../../usuarios/entities/gerente.entity';
import { JefePasantes } from '../../usuarios/entities/jefe-pasantes.entity';
import { Pasantia, EstadoPasantia } from '../../pasantias/entities/pasantia.entity';
import { Inscripcion, EstadoInscripcion } from '../../pasantias/entities/inscripcion.entity';
import { Actividad, EstadoActividad } from '../../pasantias/entities/actividad.entity';
import { Bitacora } from '../../documentos/entities/bitacora.entity';
import { InformeFinal } from '../../documentos/entities/informe-final.entity';
import { Tarea, EstadoTarea } from '../../pasantias/entities/tarea.entity';

export default class FullSeeder implements Seeder {
  async run(
    dataSource: DataSource,
    _factoryManager: SeederFactoryManager,
  ): Promise<void> {
    const SALT_ROUNDS = 10;

    // ─── Repositorios ────────────────────────────────────────────────────────
    const usuarioRepo = dataSource.getRepository(Usuario);
    const empresaRepo = dataSource.getRepository(Empresa);
    const estudianteRepo = dataSource.getRepository(Estudiante);
    const tutorRepo = dataSource.getRepository(Tutor);
    const gerenteRepo = dataSource.getRepository(Gerente);
    const jefeRepo = dataSource.getRepository(JefePasantes);
    const pasantiaRepo = dataSource.getRepository(Pasantia);
    const inscripcionRepo = dataSource.getRepository(Inscripcion);
    const actividadRepo = dataSource.getRepository(Actividad);
    const bitacoraRepo = dataSource.getRepository(Bitacora);
    const informeRepo = dataSource.getRepository(InformeFinal);
    const tareaRepo = dataSource.getRepository(Tarea);

    // ─── 1. Empresas (Buscar existentes o crear) ────────────────────────────
    console.log('🏢 Buscando empresas...');

    let techBolivia = await empresaRepo.findOneBy({ nombre: 'TechBolivia S.R.L.' });
    if (!techBolivia) {
      techBolivia = await empresaRepo.save(
        empresaRepo.create({
          nombre: 'TechBolivia S.R.L.',
          rubro: 'Tecnología de la Información',
          direccion: 'Av. Arce 2631, La Paz',
          telefono: '+591-2-2441200',
        }),
      );
    }

    let grupoNorte = await empresaRepo.findOneBy({ nombre: 'Grupo Empresarial Norte S.A.' });
    if (!grupoNorte) {
      grupoNorte = await empresaRepo.save(
        empresaRepo.create({
          nombre: 'Grupo Empresarial Norte S.A.',
          rubro: 'Consultoría y Servicios',
          direccion: 'Calle Sucre 345, Cochabamba',
          telefono: '+591-4-4523100',
        }),
      );
    }

    // ─── 2. Usuarios Adicionales ─────────────────────────────────────────────
    console.log('👥 Creando usuarios adicionales...');

    // Gerente adicional
    let gerenteUser = await usuarioRepo.findOneBy({ email: 'andres.sosa@techbolivia.com' });
    if (!gerenteUser) {
      gerenteUser = await usuarioRepo.save(
        usuarioRepo.create({
          nombre: 'Andrés',
          apellido: 'Sosa Lopez',
          email: 'andres.sosa@techbolivia.com',
          contrasena: await bcrypt.hash('Gerente@2024!', SALT_ROUNDS),
          tipo_usuario: TipoUsuario.GERENTE,
          nivel_acceso: 4,
        }),
      );
    }

    let gerente = await gerenteRepo.findOneBy({ id_gerente: gerenteUser.id_usuario });
    if (!gerente) {
      await gerenteRepo.save(
        gerenteRepo.create({
          id_gerente: gerenteUser.id_usuario,
          cargo: 'Gerente de Proyectos',
          carrera: 'Ingeniería Industrial',
          empresa: techBolivia,
        }),
      );
    } else {
      gerente.empresa = techBolivia;
      await gerenteRepo.save(gerente);
    }

    // Jefe adicional
    let jefeUser = await usuarioRepo.findOneBy({ email: 'marcos.delgado@techbolivia.com' });
    if (!jefeUser) {
      jefeUser = await usuarioRepo.save(
        usuarioRepo.create({
          nombre: 'Marcos',
          apellido: 'Delgado Ortiz',
          email: 'marcos.delgado@techbolivia.com',
          contrasena: await bcrypt.hash('Jefe@2024!', SALT_ROUNDS),
          tipo_usuario: TipoUsuario.JEFE_PASANTES,
          nivel_acceso: 3,
        }),
      );
    }

    let jefe = await jefeRepo.findOneBy({ id_jefe: jefeUser.id_usuario });
    if (!jefe) {
      await jefeRepo.save(
        jefeRepo.create({
          id_jefe: jefeUser.id_usuario,
          departamento: 'Operaciones',
          empresa: techBolivia,
        }),
      );
    } else {
      jefe.empresa = techBolivia;
      await jefeRepo.save(jefe);
    }

    // Tutor adicional
    let tutorUser = await usuarioRepo.findOneBy({ email: 'rvillagomez@umsa.edu.bo' });
    if (!tutorUser) {
      tutorUser = await usuarioRepo.save(
        usuarioRepo.create({
          nombre: 'Ricardo',
          apellido: 'Villagomez Ruiz',
          email: 'rvillagomez@umsa.edu.bo',
          contrasena: await bcrypt.hash('Tutor@2024!', SALT_ROUNDS),
          tipo_usuario: TipoUsuario.TUTOR,
          nivel_acceso: 2,
        }),
      );
    }

    let tutor = await tutorRepo.findOneBy({ id_tutor: tutorUser.id_usuario });
    if (!tutor) {
      await tutorRepo.save(
        tutorRepo.create({
          id_tutor: tutorUser.id_usuario,
          especialidad: 'Sistemas Distribuidos',
          institucion: 'Universidad Mayor de San Andrés',
        }),
      );
    }

    // Estudiantes adicionales
    const estudiantesNuevos = [
      {
        nombre: 'Ana',
        apellido: 'Gutiérrez Claro',
        email: 'ana.gutierrez@est.umsa.edu.bo',
        password: 'Estudiante@2024!',
        carrera: 'Ingeniería en Sistemas',
        semestre: 8,
        registro_universitario: 'UMSA-2020-002',
      },
      {
        nombre: 'Carlos',
        apellido: 'Villazón Murillo',
        email: 'carlos.villazon@est.ucb.edu.bo',
        password: 'Estudiante@2024!',
        carrera: 'Sistemas de Información',
        semestre: 7,
        registro_universitario: 'UCB-2021-013',
      },
    ];

    const estudiantesCreados = [];
    for (const data of estudiantesNuevos) {
      let u = await usuarioRepo.findOneBy({ email: data.email });
      if (!u) {
        u = await usuarioRepo.save(
          usuarioRepo.create({
            nombre: data.nombre,
            apellido: data.apellido,
            email: data.email,
            contrasena: await bcrypt.hash(data.password, SALT_ROUNDS),
            tipo_usuario: TipoUsuario.ESTUDIANTE,
            nivel_acceso: 1,
          }),
        );
      }

      let e = await estudianteRepo.findOneBy({ id_estudiante: u.id_usuario });
      if (!e) {
        e = await estudianteRepo.save(
          estudianteRepo.create({
            id_estudiante: u.id_usuario,
            carrera: data.carrera,
            semestre: data.semestre,
            registro_universitario: data.registro_universitario,
          }),
        );
      }
      estudiantesCreados.push(e);
    }

    // Buscar estudiantes existentes de seed-1 para tener más variedad
    const lucia = await estudianteRepo.findOne({
      where: { registro_universitario: 'UMSA-2020-001' },
      relations: ['usuario'],
    });
    const diego = await estudianteRepo.findOne({
      where: { registro_universitario: 'UMSA-2019-045' },
      relations: ['usuario'],
    });

    // ─── 3. Pasantías ────────────────────────────────────────────────────────
    console.log('💼 Creando pasantías...');

    let p1 = await pasantiaRepo.findOneBy({ titulo: 'Desarrollo Full Stack Junior' });
    if (!p1) {
      p1 = await pasantiaRepo.save(
        pasantiaRepo.create({
          titulo: 'Desarrollo Full Stack Junior',
          descripcion: 'Apoyo en el desarrollo de la plataforma web principal.',
          fecha_inicio: new Date('2026-06-01'),
          fecha_fin: new Date('2026-12-01'),
          estado: EstadoPasantia.PENDIENTE,
          area: 'Sistemas',
          empresa: techBolivia,
        }),
      );
    }

    let p2 = await pasantiaRepo.findOneBy({ titulo: 'Soporte de Redes y Seguridad' });
    if (!p2) {
      p2 = await pasantiaRepo.save(
        pasantiaRepo.create({
          titulo: 'Soporte de Redes y Seguridad',
          descripcion: 'Monitoreo de redes y configuración de firewalls.',
          fecha_inicio: new Date('2026-05-01'),
          fecha_fin: new Date('2026-11-01'),
          estado: EstadoPasantia.EN_CURSO,
          area: 'Infraestructura',
          empresa: techBolivia,
        }),
      );
    }

    let p3 = await pasantiaRepo.findOneBy({ titulo: 'Analista de Datos Junior' });
    if (!p3) {
      p3 = await pasantiaRepo.save(
        pasantiaRepo.create({
          titulo: 'Analista de Datos Junior',
          descripcion: 'Procesamiento de datos y generación de reportes.',
          fecha_inicio: new Date('2026-01-01'),
          fecha_fin: new Date('2026-04-30'),
          estado: EstadoPasantia.FINALIZADA,
          area: 'BI',
          empresa: grupoNorte,
        }),
      );
    }

    let p4 = await pasantiaRepo.findOneBy({ titulo: 'Asistente de RRHH' });
    if (!p4) {
      p4 = await pasantiaRepo.save(
        pasantiaRepo.create({
          titulo: 'Asistente de RRHH',
          descripcion: 'Apoyo en la digitalización de files de personal.',
          fecha_inicio: new Date('2026-02-01'),
          fecha_fin: new Date('2026-05-01'),
          estado: EstadoPasantia.CANCELADA,
          area: 'RRHH',
          empresa: grupoNorte,
        }),
      );
    }

    // Asociar Jefes a Pasantías (ManyToMany)
    // Buscamos el jefe de seed-1
    const roberto = await jefeRepo.findOne({
      relations: ['usuario'],
      where: { usuario: { email: 'roberto.flores@techbolivia.com' } },
    });

    if (roberto) {
      p1.jefe_pasantes = [roberto];
      p2.jefe_pasantes = [roberto];
      await pasantiaRepo.save(p1);
      await pasantiaRepo.save(p2);
    }

    const marcos = await jefeRepo.findOne({
      relations: ['usuario'],
      where: { id_jefe: jefeUser.id_usuario },
    });

    if (marcos) {
      // Asignamos marcos a p1 y p2 (TechBolivia) para que el gerente los vea
      p1.jefe_pasantes = roberto ? [roberto, marcos] : [marcos];
      p2.jefe_pasantes = roberto ? [roberto, marcos] : [marcos];
      await pasantiaRepo.save(p1);
      await pasantiaRepo.save(p2);

      // Y también a p3 y p4 (Grupo Norte)
      p3.jefe_pasantes = [marcos];
      p4.jefe_pasantes = [marcos];
      await pasantiaRepo.save(p3);
      await pasantiaRepo.save(p4);
    }

    // ─── 4. Inscripciones ────────────────────────────────────────────────────
    console.log('📝 Creando inscripciones...');

    // Inscripción Pendiente
    if (lucia) {
      await inscripcionRepo.save(
        inscripcionRepo.create({
          fecha_inscripcion: new Date(),
          estado: EstadoInscripcion.PENDIENTE,
          estudiante: lucia,
          pasantia: p1,
        }),
      );
    }

    // Inscripción Aprobada (En curso)
    let inscripcionActiva: Inscripcion | undefined = undefined;
    if (lucia) {
      inscripcionActiva = await inscripcionRepo.save(
        inscripcionRepo.create({
          fecha_inscripcion: new Date('2026-04-15'),
          fecha_inicio_periodo: new Date('2026-05-01'),
          fecha_fin_periodo: new Date('2026-11-01'),
          estado: EstadoInscripcion.APROBADA,
          estudiante: lucia,
          pasantia: p2,
          jefe: roberto || undefined,
        }),
      );
    }

    // Inscripción Completada
    let inscripcionCompletada: Inscripcion | undefined = undefined;
    if (diego) {
      inscripcionCompletada = await inscripcionRepo.save(
        inscripcionRepo.create({
          fecha_inscripcion: new Date('2025-12-15'),
          fecha_inicio_periodo: new Date('2026-01-01'),
          fecha_fin_periodo: new Date('2026-04-30'),
          estado: EstadoInscripcion.COMPLETADA,
          estudiante: diego,
          pasantia: p3,
          jefe: marcos || undefined,
        }),
      );
    }

    // Inscripción Rechazada
    if (estudiantesCreados[0]) {
      await inscripcionRepo.save(
        inscripcionRepo.create({
          fecha_inscripcion: new Date('2026-02-01'),
          estado: EstadoInscripcion.RECHAZADA,
          estudiante: estudiantesCreados[0],
          pasantia: p4,
        }),
      );
    }

    // ─── 5. Actividades (Para Pasantía En Curso) ────────────────────────────
    console.log('🏃 Creando actividades...');

    const act1 = await actividadRepo.save(
      actividadRepo.create({
        descripcion: 'Implementación de API REST para usuarios',
        fecha: new Date('2026-05-10'),
        estado: EstadoActividad.EN_DESARROLLO,
        pasantia: p2,
      }),
    );

    const act2 = await actividadRepo.save(
      actividadRepo.create({
        descripcion: 'Documentación de arquitectura en Swagger',
        fecha: new Date('2026-05-15'),
        estado: EstadoActividad.CON_CUPOS,
        pasantia: p2,
      }),
    );

    // ─── 6. Bitácoras ────────────────────────────────────────────────────────
    console.log('📓 Creando bitácoras...');

    if (inscripcionActiva && act1 && roberto) {
      await bitacoraRepo.save(
        bitacoraRepo.create({
          fecha: new Date('2026-05-10'),
          contenido: 'Se avanzó en la creación de los endpoints de login y registro. Se presentaron problemas con JWT pero se solucionaron.',
          porcentaje: 60,
          observaciones: 'Buen avance, continuar con las pruebas.',
          jefe: roberto || undefined,
          inscripcion: inscripcionActiva,
          actividad: act1,
        }),
      );
    }

    // ─── 7. Tareas (Actividades asignadas con fecha límite) ─────────────────
    console.log('📌 Creando tareas...');

    if (inscripcionActiva && roberto) {
      await tareaRepo.save(
        tareaRepo.create({
          titulo: 'Crear DTOs de validación',
          descripcion: 'Crear los DTOs necesarios para el módulo de usuarios usando class-validator.',
          fecha_limite: new Date('2026-05-20'),
          estado: EstadoTarea.ACTIVO,
          jefe: roberto || undefined,
          inscripcion: inscripcionActiva,
        }),
      );

      await tareaRepo.save(
        tareaRepo.create({
          titulo: 'Configurar entorno de desarrollo',
          descripcion: 'Clonar el repositorio y levantar los contenedores de Docker.',
          fecha_limite: new Date('2026-05-01'),
          estado: EstadoTarea.COMPLETADO,
          jefe: roberto || undefined,
          inscripcion: inscripcionActiva,
        }),
      );
    }

    // ─── 8. Informes Finales ─────────────────────────────────────────────────
    console.log('📊 Creando informes finales...');

    if (inscripcionCompletada && marcos) {
      await informeRepo.save(
        informeRepo.create({
          fecha_entrega: new Date('2026-05-02'),
          contenido: 'El pasante cumplió con todas las expectativas. Demostró gran capacidad para el análisis de datos y trabajo en equipo.',
          nota_final: 92.5,
          observaciones: 'Recomendado para contratación futura.',
          inscripcion: inscripcionCompletada,
          jefe: marcos || undefined,
        }),
      );
    }

    console.log('✅ Seed-2 completado exitosamente.');
    console.log('');
    console.log('📋 Credenciales de prueba adicionales:');
    console.log('  👔 Gerente:    andres.sosa@techbolivia.com / Gerente@2024!');
    console.log('  🧑‍💼 Jefe:       marcos.delgado@techbolivia.com / Jefe@2024!');
    console.log('  👨‍🏫 Tutor:      rvillagomez@umsa.edu.bo          / Tutor@2024!');
    console.log('  🎓 Estudiante: ana.gutierrez@est.umsa.edu.bo  / Estudiante@2024!');
    console.log('  🎓 Estudiante: carlos.villazon@est.ucb.edu.bo  / Estudiante@2024!');
  }
}
