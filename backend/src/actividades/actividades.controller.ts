import { Controller, Get, Post, Patch, Body, Param, ParseIntPipe, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { ActividadesService } from './actividades.service';
import { CreateActividadDto } from './dto/create-actividad.dto';
import { UpdateActividadDto } from './dto/update-actividad.dto';
import { CreateTareaDto } from './dto/create-tarea.dto';
import { UpdateTareaDto } from './dto/update-tarea.dto';
import { CreateComentarioActividadDto } from './dto/create-comentario-actividad.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Actividades')
@Controller('actividades')
export class ActividadesController {
  constructor(private readonly actividadesService: ActividadesService) {}

  @Get('pasantia/:id')
  @ApiOperation({ summary: 'Listar actividades de una pasantía' })
  @ApiParam({ name: 'id', description: 'ID de la pasantía' })
  @ApiResponse({ status: 200, description: 'Lista de actividades' })
  findByPasantia(@Param('id', ParseIntPipe) id: number) {
    return this.actividadesService.findByPasantia(id);
  }

  @Post()
  @ApiOperation({ summary: 'Crear una actividad para una pasantía (estado inicial: CON_CUPOS)' })
  @ApiResponse({ status: 201, description: 'Actividad creada' })
  @ApiResponse({ status: 404, description: 'Pasantía no encontrada' })
  create(@Body() dto: CreateActividadDto) {
    return this.actividadesService.create(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar una actividad' })
  @ApiParam({ name: 'id', description: 'ID de la actividad' })
  @ApiResponse({ status: 200, description: 'Actividad actualizada' })
  @ApiResponse({ status: 404, description: 'Actividad no encontrada' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateActividadDto) {
    return this.actividadesService.update(id, dto);
  }

  // Endpoints para Tareas (Actividades del Jefe)

  @Get('jefe')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Listar tareas asignadas por el jefe' })
  @ApiResponse({ status: 200, description: 'Lista de tareas' })
  findTareasByJefe(@Request() req: any) {
    return this.actividadesService.findTareasByJefe(req.user.id_usuario);
  }

  @Post('jefe')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Crear una tarea asignada por el jefe' })
  @ApiResponse({ status: 201, description: 'Tarea creada' })
  createTarea(@Request() req: any, @Body() dto: CreateTareaDto) {
    return this.actividadesService.createTarea(req.user.id_usuario, dto);
  }

  @Patch('jefe/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Actualizar una tarea asignada por el jefe' })
  @ApiParam({ name: 'id', description: 'ID de la tarea' })
  @ApiResponse({ status: 200, description: 'Tarea actualizada' })
  updateTarea(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateTareaDto) {
    return this.actividadesService.updateTarea(id, dto);
  }

  @Get('estudiante/:id')
  @ApiOperation({ summary: 'Listar actividades de un estudiante con nota promedio' })
  @ApiParam({ name: 'id', description: 'ID del estudiante' })
  @ApiResponse({ status: 200, description: 'Actividades y promedio' })
  findTareasByEstudiante(@Param('id', ParseIntPipe) id: number) {
    return this.actividadesService.findTareasByEstudiante(id);
  }

  @Get(':id/comentarios')
  @ApiOperation({ summary: 'Listar comentarios de una actividad/tarea' })
  @ApiParam({ name: 'id', description: 'ID de la actividad/tarea' })
  @ApiResponse({ status: 200, description: 'Historial de comentarios' })
  findComentariosByTarea(@Param('id', ParseIntPipe) id: number) {
    return this.actividadesService.findComentariosByTarea(id);
  }

  @Post(':id/comentarios')
  @ApiOperation({ summary: 'Agregar un comentario a una actividad/tarea' })
  @ApiParam({ name: 'id', description: 'ID de la actividad/tarea' })
  @ApiResponse({ status: 201, description: 'Comentario creado' })
  createComentario(@Param('id', ParseIntPipe) id: number, @Body() dto: CreateComentarioActividadDto) {
    return this.actividadesService.createComentario(id, dto);
  }
}

