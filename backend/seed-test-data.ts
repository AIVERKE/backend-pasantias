import { DataSource } from 'typeorm';

const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "123456",
  database: "pasantias_db",
  synchronize: false,
  entities: ["src/**/*.entity.ts"],
});

async function run() {
  await AppDataSource.initialize();
  console.log("Conectado a la base de datos.");

  // Aquí crearemos la data
  // Necesitamos:
  // - 1 Empresa (si no hay)
  // - 2 Pasantias
  // - 2 Inscripciones
  // - 6 Tareas (3 por cada inscripcion)
  // - 1 ComentarioActividad

  // ... (voy a leer primero los IDs existentes de Estudiante para saber a quién asignarle)
  const estudiantes = await AppDataSource.query(`SELECT * FROM estudiante LIMIT 1;`);
  if(estudiantes.length === 0) {
    console.log("No hay estudiantes.");
    process.exit(1);
  }
  const idEstudiante = estudiantes[0].id_estudiante;

  let empresa = await AppDataSource.query(`SELECT * FROM empresa LIMIT 1;`);
  if(empresa.length === 0) {
    await AppDataSource.query(`INSERT INTO empresa (nombre, rubro, direccion, telefono) VALUES ('Mock Empresa', 'IT', 'Mock Dir', '1234')`);
    empresa = await AppDataSource.query(`SELECT * FROM empresa LIMIT 1;`);
  }
  const idEmpresa = empresa[0].id_empresa;

  const idJefeQuery = await AppDataSource.query(`SELECT * FROM jefe_pasantes LIMIT 1;`);
  let idJefe = null;
  if(idJefeQuery.length > 0) {
    idJefe = idJefeQuery[0].id_jefe;
  } else {
      // Necesito crear un usuario jefe
      const resUser = await AppDataSource.query(`INSERT INTO usuario (nombre, apellido, email, contrasena, tipo_usuario) VALUES ('Jefe', 'Mock', 'jefe@mock.com', '123', 'jefe_pasantes') RETURNING id_usuario`);
      idJefe = resUser[0].id_usuario;
      await AppDataSource.query(`INSERT INTO jefe_pasantes (id_jefe, departamento, id_empresa) VALUES (${idJefe}, 'IT', ${idEmpresa})`);
  }

  // Pasantia 1
  const resPas1 = await AppDataSource.query(`INSERT INTO pasantia (titulo, descripcion, fecha_inicio, estado, id_empresa, area, cupos_totales) VALUES ('Desarrollador Frontend', 'Mock', CURRENT_DATE, 'en_curso', ${idEmpresa}, 'Sistemas', 5) RETURNING id_pasantia`);
  const idPas1 = resPas1[0].id_pasantia;
  
  // Pasantia 2
  const resPas2 = await AppDataSource.query(`INSERT INTO pasantia (titulo, descripcion, fecha_inicio, estado, id_empresa, area, cupos_totales) VALUES ('Desarrollador Backend', 'Mock', CURRENT_DATE, 'en_curso', ${idEmpresa}, 'Infraestructura', 5) RETURNING id_pasantia`);
  const idPas2 = resPas2[0].id_pasantia;

  // Inscripcion 1
  const resIns1 = await AppDataSource.query(`INSERT INTO inscripcion (fecha_inscripcion, estado, id_estudiante, id_pasantia, estado_ejecucion) VALUES (CURRENT_DATE, 'aprobada', ${idEstudiante}, ${idPas1}, 'En Curso') RETURNING id_inscripcion`);
  const idIns1 = resIns1[0].id_inscripcion;

  // Inscripcion 2
  const resIns2 = await AppDataSource.query(`INSERT INTO inscripcion (fecha_inscripcion, estado, id_estudiante, id_pasantia, estado_ejecucion) VALUES (CURRENT_DATE, 'aprobada', ${idEstudiante}, ${idPas2}, 'En Curso') RETURNING id_inscripcion`);
  const idIns2 = resIns2[0].id_inscripcion;

  // Tareas Ins1
  await AppDataSource.query(`INSERT INTO actividad_bitacora (titulo_actividad, descripcion_actividad, fecha_asignacion, id_jefe_asignador, estado_semaforo, id_inscripcion) VALUES 
    ('Levantar requerimientos', '...', CURRENT_DATE, ${idJefe}, 'Completada', ${idIns1}),
    ('Diseñar UI', '...', CURRENT_DATE, ${idJefe}, 'En_curso', ${idIns1}),
    ('Programar frontend', '...', CURRENT_DATE, ${idJefe}, 'Pendiente', ${idIns1})`);

  // Tareas Ins2
  const resTar = await AppDataSource.query(`INSERT INTO actividad_bitacora (titulo_actividad, descripcion_actividad, fecha_asignacion, id_jefe_asignador, estado_semaforo, id_inscripcion) VALUES 
    ('Configurar DB', '...', CURRENT_DATE, ${idJefe}, 'Completada', ${idIns2}),
    ('Crear endpoints', '...', CURRENT_DATE, ${idJefe}, 'En_curso', ${idIns2}),
    ('Testing backend', '...', CURRENT_DATE, ${idJefe}, 'Pendiente', ${idIns2}) RETURNING id_tarea`);
  
  const idTar = resTar[0].id_tarea;

  // Comentario
  await AppDataSource.query(`INSERT INTO comentario_actividad (texto, rol, autor, id_tarea) VALUES ('Revisa esta tarea por favor', 'Jefe', 'Jefe Mock', ${idTar})`);

  console.log("Seeding terminado.");
  process.exit(0);
}

run().catch(console.error);
