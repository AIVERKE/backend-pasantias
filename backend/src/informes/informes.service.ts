import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InformeFinal } from '../documentos/entities/informe-final.entity';
import { Inscripcion } from '../pasantias/entities/inscripcion.entity';
import PDFDocument = require('pdfkit');

@Injectable()
export class InformesService {
  constructor(
    @InjectRepository(InformeFinal)
    private readonly informeRepository: Repository<InformeFinal>,
    @InjectRepository(Inscripcion)
    private readonly inscripcionRepository: Repository<Inscripcion>
  ) {}

  async getHistorialEstudiante(idEstudiante: number) {
    const inscripciones = await this.inscripcionRepository.find({
      where: { estudiante: { id_estudiante: idEstudiante } },
      relations: ['pasantia', 'pasantia.empresa', 'jefe', 'jefe.usuario'],
      order: { fecha_inscripcion: 'DESC' }
    });

    const resultados = [];
    for (const ins of inscripciones) {
      const informe = await this.informeRepository.findOne({
        where: { inscripcion: { id_inscripcion: ins.id_inscripcion } },
        order: { fecha_entrega: 'DESC' }
      });

      let resena = null;
      if (informe && informe.valoracion_estrellas && informe.comentario_estudiante) {
        resena = {
          estrellas: informe.valoracion_estrellas,
          comentario: informe.comentario_estudiante
        };
      }

      let criterios: any[] = [];
      if (informe) {
        criterios = [
          { nombre: 'Conocimiento Técnico', puntaje: informe.crit_conocimiento_tecnico || 0 },
          { nombre: 'Responsabilidad', puntaje: informe.crit_responsabilidad || 0 },
          { nombre: 'Trabajo en Equipo', puntaje: informe.crit_trabajo_equipo || 0 },
          { nombre: 'Iniciativa', puntaje: informe.crit_iniciativa || 0 }
        ];
      }

      let nombreEvaluador = 'Jefe no asignado';
      if (ins.jefe && ins.jefe.usuario) {
        nombreEvaluador = `${ins.jefe.usuario.nombre} ${ins.jefe.usuario.apellido}`;
      }

      resultados.push({
        id: ins.id_inscripcion,
        estado: ins.estado_ejecucion || ins.estado,
        empresa: ins.pasantia?.empresa?.nombre || 'Empresa Desconocida',
        cargo: ins.pasantia?.titulo || 'Cargo No Especificado',
        periodo: `${new Date(ins.fecha_inscripcion).toLocaleDateString()} - ${ins.fecha_fin_periodo ? new Date(ins.fecha_fin_periodo).toLocaleDateString() : 'Presente'}`,
        nota: informe?.nota_final || null,
        promedioActividades: 90,
        evaluador: nombreEvaluador,
        comentarios: informe?.evaluacion_cualitativa || null,
        criterios: criterios,
        resenaEstudiante: resena,
      });
    }

    return resultados;
  }

  async getDetalleInforme(idInscripcion: number) {
    const informe = await this.informeRepository.findOne({
      where: { inscripcion: { id_inscripcion: idInscripcion } },
      relations: ['jefe', 'jefe.usuario', 'inscripcion']
    });
    if (!informe) throw new NotFoundException('Informe final no encontrado');
    return informe;
  }

  async guardarResena(idInscripcion: number, resena: { estrellas: number; comentario: string }) {
    const informe = await this.informeRepository.findOne({ where: { inscripcion: { id_inscripcion: idInscripcion } } });
    if (!informe) throw new NotFoundException('Informe no encontrado para registrar reseña');
    
    informe.valoracion_estrellas = resena.estrellas;
    informe.comentario_estudiante = resena.comentario;
    await this.informeRepository.save(informe);
    
    return { success: true, message: 'Reseña guardada correctamente' };
  }

  async generarPdf(idInscripcion: number): Promise<Buffer> {
    const informe = await this.informeRepository.findOne({
      where: { inscripcion: { id_inscripcion: idInscripcion } },
      relations: ['inscripcion', 'inscripcion.pasantia', 'inscripcion.pasantia.empresa', 'jefe', 'jefe.usuario']
    });

    if (!informe) throw new NotFoundException('Informe no encontrado');

    return new Promise((resolve) => {
      const doc = new PDFDocument({ margin: 50 });
      const buffers: Buffer[] = [];
      
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => resolve(Buffer.concat(buffers)));

      let nombreEvaluador = 'N/A';
      if (informe.jefe && informe.jefe.usuario) {
        nombreEvaluador = `${informe.jefe.usuario.nombre} ${informe.jefe.usuario.apellido}`;
      }

      doc.fontSize(20).text('INFORME FINAL DE DESEMPEÑO', { align: 'center' });
      doc.moveDown();
      doc.fontSize(12).text(`Empresa: ${informe.inscripcion?.pasantia?.empresa?.nombre || 'N/A'}`);
      doc.text(`Cargo: ${informe.inscripcion?.pasantia?.titulo || 'N/A'}`);
      doc.text(`Evaluador: ${nombreEvaluador}`);
      doc.moveDown();

      doc.fontSize(14).text('RESULTADOS DE EVALUACIÓN:', { underline: true });
      doc.fontSize(12).text(`Nota Final: ${informe.nota_final || 0}/100`);
      doc.text(`Conocimiento Técnico: ${informe.crit_conocimiento_tecnico}%`);
      doc.text(`Responsabilidad: ${informe.crit_responsabilidad}%`);
      doc.text(`Trabajo en Equipo: ${informe.crit_trabajo_equipo}%`);
      doc.text(`Iniciativa: ${informe.crit_iniciativa}%`);
      doc.moveDown();

      doc.fontSize(14).text('EVALUACIÓN CUALITATIVA:', { underline: true });
      doc.fontSize(12).text(informe.evaluacion_cualitativa || 'Sin observaciones.');
      doc.moveDown();

      if (informe.valoracion_estrellas) {
        doc.fontSize(14).text('RESEÑA DEL ESTUDIANTE:', { underline: true });
        doc.fontSize(12).text(`Calificación: ${informe.valoracion_estrellas} Estrellas`);
        doc.text(`Comentario: "${informe.comentario_estudiante}"`);
      }

      doc.end();
    });
  }
}
