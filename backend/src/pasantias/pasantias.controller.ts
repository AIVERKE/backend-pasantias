import { Controller, Get, Post, Patch, Body, Param, Query, ParseIntPipe, UseGuards, Request, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { PasantiasService } from './pasantias.service';
import { CreatePasantiaDto } from './dto/create-pasantia.dto';
import { UpdateEstadoPasantiaDto } from './dto/update-estado-pasantia.dto';
import { EstadoPasantia } from './entities/pasantia.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreatePasantiaForGerenteDto } from './dto/create-pasantia-for-gerente.dto';
import { UpdatePasantiaDto } from './dto/update-pasantia.dto';

@ApiTags('Pasantías')
@Controller('pasantias')
export class PasantiasController {
  constructor(private readonly pasantiasService: PasantiasService) {}

  @Get()
  @ApiOperation({ summary: 'Listar pasantías con filtros opcionales' })
  @ApiQuery({ name: 'estado', enum: EstadoPasantia, required: false })
  @ApiQuery({ name: 'empresa_id', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Lista de pasantías' })
  findAll(
    @Query('estado') estado?: EstadoPasantia,
    @Query('empresa_id') empresaId?: number,
  ) {
    return this.pasantiasService.findAll(estado, empresaId ? +empresaId : undefined);
  }

  @UseGuards(JwtAuthGuard)
  @Get('gerente')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Listar pasantías de la empresa del gerente' })
  @ApiResponse({ status: 200, description: 'Lista de pasantías' })
  findForGerente(@Request() req: any) {
    return this.pasantiasService.findForGerente(req.user.userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener detalle de una pasantía' })
  @ApiParam({ name: 'id', description: 'ID de la pasantía' })
  @ApiResponse({ status: 200, description: 'Detalle de la pasantía' })
  @ApiResponse({ status: 404, description: 'Pasantía no encontrada' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.pasantiasService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Crear una nueva pasantía (estado inicial: PENDIENTE)' })
  @ApiResponse({ status: 201, description: 'Pasantía creada' })
  @ApiResponse({ status: 404, description: 'Empresa no encontrada' })
  create(@Body() dto: CreatePasantiaDto) {
    return this.pasantiasService.create(dto);
  }

  @Patch(':id/estado')
  @ApiOperation({ summary: 'Actualizar estado de una pasantía' })
  @ApiParam({ name: 'id', description: 'ID de la pasantía' })
  @ApiResponse({ status: 200, description: 'Estado actualizado' })
  @ApiResponse({ status: 404, description: 'Pasantía no encontrada' })
  updateEstado(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateEstadoPasantiaDto) {
    return this.pasantiasService.updateEstado(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('gerente')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Crear pasantía asignada a la empresa del gerente' })
  @ApiResponse({ status: 201, description: 'Pasantía creada' })
  createForGerente(@Request() req: any, @Body() dto: CreatePasantiaForGerenteDto) {
    return this.pasantiasService.createForGerente(req.user.userId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Actualizar una pasantía' })
  @ApiResponse({ status: 200, description: 'Pasantía actualizada' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdatePasantiaDto) {
    return this.pasantiasService.update(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('jefes/by-empresa/:empresaId')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Listar jefes disponibles por empresa' })
  @ApiResponse({ status: 200, description: 'Lista de jefes' })
  findJefesByEmpresa(@Param('empresaId', ParseIntPipe) empresaId: number) {
    return this.pasantiasService.findJefesByEmpresa(empresaId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/jefe')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Asignar jefe a pasantía' })
  @ApiResponse({ status: 200, description: 'Jefe asignado' })
  assignJefe(@Param('id', ParseIntPipe) id: number, @Body('jefe_user_id', ParseIntPipe) jefeUserId: number) {
    return this.pasantiasService.assignJefe(id, jefeUserId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id/jefe')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Quitar jefe de pasantía' })
  @ApiResponse({ status: 200, description: 'Jefe removido' })
  removeJefe(@Param('id', ParseIntPipe) id: number, @Query('jefe_id', ParseIntPipe) jefeId: number) {
    return this.pasantiasService.removeJefe(id, jefeId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Eliminar una pasantía' })
  @ApiResponse({ status: 200, description: 'Pasantía eliminada' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.pasantiasService.remove(id);
  }
}
