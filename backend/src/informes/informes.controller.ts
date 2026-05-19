import { Controller, Get, Post, Body, Patch, Param, Res, ParseIntPipe, Response } from '@nestjs/common';
import { InformesService } from './informes.service';

@Controller('informes')
export class InformesController {
  constructor(private readonly informesService: InformesService) {}

  @Get('estudiante/:id')
  getHistorialEstudiante(@Param('id', ParseIntPipe) id: number) {
    return this.informesService.getHistorialEstudiante(id);
  }

  @Get(':id/detalle')
  getDetalleInforme(@Param('id', ParseIntPipe) id: number) {
    return this.informesService.getDetalleInforme(id);
  }

  @Patch(':id/resena')
  guardarResena(
    @Param('id', ParseIntPipe) id: number,
    @Body() resena: { estrellas: number; comentario: string }
  ) {
    return this.informesService.guardarResena(id, resena);
  }

  @Get(':id/descargar-pdf')
  async descargarPdf(@Param('id', ParseIntPipe) id: number, @Res() res: any) {
    const buffer = await this.informesService.generarPdf(id);
    
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=informe_final_${id}.pdf`,
      'Content-Length': buffer.length,
    });
    
    res.end(buffer);
  }
}
