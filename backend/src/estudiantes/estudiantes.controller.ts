import { Controller, Get, Post, Patch, Delete, Body, Param, Query, ParseIntPipe, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiConsumes } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { EstudiantesService } from './estudiantes.service';
import { CreateEstudianteDto } from './dto/create-estudiante.dto';
import { UpdateEstudianteDto } from './dto/update-estudiante.dto';

@ApiTags('Estudiantes')
@Controller('estudiantes')
export class EstudiantesController {
  constructor(private readonly estudiantesService: EstudiantesService) {}

  @Get()
  @ApiOperation({ summary: 'Listar todos los estudiantes con filtros opcionales' })
  @ApiQuery({ name: 'carrera', required: false, description: 'Filtrar por carrera' })
  @ApiQuery({ name: 'semestre', required: false, type: Number, description: 'Filtrar por semestre' })
  @ApiResponse({ status: 200, description: 'Lista de estudiantes' })
  findAll(
    @Query('carrera') carrera?: string,
    @Query('semestre') semestre?: number,
  ) {
    return this.estudiantesService.findAll(carrera, semestre ? +semestre : undefined);
  }

  @Get('perfil/:id')
  @ApiOperation({ summary: 'Obtener perfil unificado de hoja de vida del estudiante' })
  @ApiParam({ name: 'id', description: 'ID del estudiante' })
  @ApiResponse({ status: 200, description: 'Perfil completo del estudiante' })
  getPerfil(@Param('id', ParseIntPipe) id: number) {
    return this.estudiantesService.getPerfil(id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener perfil completo de un estudiante' })
  @ApiParam({ name: 'id', description: 'ID del estudiante' })
  @ApiResponse({ status: 200, description: 'Perfil del estudiante' })
  @ApiResponse({ status: 404, description: 'Estudiante no encontrado' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.estudiantesService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Crear perfil de estudiante para un usuario existente' })
  @ApiResponse({ status: 201, description: 'Perfil de estudiante creado' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  create(@Body() dto: CreateEstudianteDto) {
    return this.estudiantesService.create(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar carrera y/o semestre del estudiante' })
  @ApiParam({ name: 'id', description: 'ID del estudiante' })
  @ApiResponse({ status: 200, description: 'Estudiante actualizado' })
  @ApiResponse({ status: 404, description: 'Estudiante no encontrado' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: any) {
    return this.estudiantesService.update(id, dto);
  }

  @Post(':id/historial-academico')
  @ApiOperation({ summary: 'Agregar un registro al historial académico del estudiante' })
  @ApiParam({ name: 'id', description: 'ID del estudiante' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('certificado', {
    storage: diskStorage({
      destination: './uploads/certificados',
      filename: (req: any, file: any, cb: any) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = extname(file.originalname);
        cb(null, `${uniqueSuffix}${ext}`);
      }
    }),
    fileFilter: (req: any, file: any, cb: any) => {
      if (file.mimetype === 'application/pdf') {
        cb(null, true);
      } else {
        cb(new BadRequestException('Solo se permiten archivos PDF'), false);
      }
    }
  }))
  addHistorialAcademico(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: any,
    @UploadedFile() file: any
  ) {
    if (!file) {
      throw new BadRequestException('El archivo certificado (PDF) es obligatorio');
    }
    const filePath = `/uploads/certificados/${file.filename}`;
    return this.estudiantesService.addHistorialAcademico(id, dto, filePath);
  }

  @Delete('historial-academico/:idHistorial')
  @ApiOperation({ summary: 'Eliminar una entrada del historial académico' })
  @ApiParam({ name: 'idHistorial', description: 'ID del historial a eliminar' })
  removeHistorialAcademico(
    @Param('idHistorial', ParseIntPipe) idHistorial: number
  ) {
    return this.estudiantesService.removeHistorialAcademico(idHistorial);
  }
}
