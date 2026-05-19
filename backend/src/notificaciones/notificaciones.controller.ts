import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { NotificacionesService } from './notificaciones.service';

@Controller('notificaciones')
export class NotificacionesController {
  constructor(private readonly notificacionesService: NotificacionesService) {}

  @Get('conteo/:estudianteId')
  getConteoPendientes(@Param('estudianteId', ParseIntPipe) estudianteId: number) {
    return this.notificacionesService.getConteoPendientes(estudianteId);
  }
}
