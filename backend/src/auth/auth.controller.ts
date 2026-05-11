import { Controller, Post, Get, Patch, Delete, UseGuards, Request, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LoginDto } from './dto/login.dto';
import { DarDeBajaDto } from './dto/dar-de-baja.dto';
import { EstadoInscripcion } from '../pasantias/entities/inscripcion.entity';
import { UsuariosService } from '../usuarios/usuarios.service';
import { CreateUsuarioDto } from '../usuarios/dto/create-usuario.dto';

@ApiTags('Autenticación')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usuariosService: UsuariosService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiOperation({ summary: 'Iniciar sesión y obtener token JWT' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: 200, description: 'Login exitoso, devuelve JWT' })
  @ApiResponse({ status: 401, description: 'Credenciales inválidas' })
  async login(@Request() req: any) {
    return this.authService.login(req.user);
  }

  @Post('register')
  @ApiOperation({ summary: 'Registrar un nuevo usuario con su perfil específico' })
  @ApiBody({ type: CreateUsuarioDto })
  @ApiResponse({ status: 201, description: 'Usuario registrado exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos de entrada inválidos' })
  @ApiResponse({ status: 409, description: 'El correo electrónico ya existe' })
  async register(@Body() createUsuarioDto: CreateUsuarioDto) {
    return this.usuariosService.create(createUsuarioDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener perfil del usuario autenticado' })
  @ApiResponse({ status: 200, description: 'Perfil del usuario con datos de rol' })
  @ApiResponse({ status: 401, description: 'Token inválido o ausente' })
  async getProfile(@Request() req: any) {
    return this.authService.getProfile(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cerrar sesión del usuario' })
  @ApiResponse({ status: 200, description: 'Sesión cerrada exitosamente' })
  @ApiResponse({ status: 401, description: 'Token inválido o ausente' })
  async logout(@Request() req: any) {
    return { message: 'Sesión cerrada correctamente', userId: req.user.userId };
  }

  @UseGuards(JwtAuthGuard)
  @Get('gerente/dashboard')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener dashboard del gerente con métricas de su empresa' })
  @ApiResponse({ status: 200, description: 'Dashboard del gerente' })
  @ApiResponse({ status: 401, description: 'Token inválido o ausente' })
  @ApiResponse({ status: 403, description: 'Acceso restringido a gerentes' })
  async getGerenteDashboard(@Request() req: any) {
    // Verificar que es un gerente
    if (req.user.tipo !== 'gerente' && req.user.tipo !== 'GERENTE') {
      return { message: 'Acceso restringido a gerentes' };
    }
    return this.authService.getGerenteDashboard(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('jefe/dashboard')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener dashboard del jefe de pasantes' })
  @ApiResponse({ status: 200, description: 'Dashboard del jefe de pasantes' })
  @ApiResponse({ status: 401, description: 'Token inválido o ausente' })
  @ApiResponse({ status: 403, description: 'Acceso restringido a jefes de pasantes' })
  async getJefeDashboard(@Request() req: any) {
    if (req.user.tipo !== 'jefe_pasantes' && req.user.tipo !== 'JEFE_PASANTES') {
      return { message: 'Acceso restringido a jefes de pasantes' };
    }
    return this.authService.getJefeDashboard(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('jefe/inscripciones')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener inscripciones a cargo del jefe de pasantes' })
  @ApiResponse({ status: 200, description: 'Lista de inscripciones' })
  @ApiResponse({ status: 401, description: 'Token inválido o ausente' })
  @ApiResponse({ status: 403, description: 'Acceso restringido a jefes de pasantes' })
  async getJefeInscripciones(@Request() req: any) {
    if (req.user.tipo !== 'jefe_pasantes' && req.user.tipo !== 'JEFE_PASANTES') {
      return { message: 'Acceso restringido a jefes de pasantes' };
    }
    return this.authService.getJefeInscripciones(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('jefe/pasantes')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener pasantes a cargo del jefe de pasantes' })
  @ApiResponse({ status: 200, description: 'Lista de pasantes' })
  @ApiResponse({ status: 401, description: 'Token inválido o ausente' })
  @ApiResponse({ status: 403, description: 'Acceso restringido a jefes de pasantes' })
  async getJefePasantes(@Request() req: any) {
    if (req.user.tipo !== 'jefe_pasantes' && req.user.tipo !== 'JEFE_PASANTES') {
      return { message: 'Acceso restringido a jefes de pasantes' };
    }
    return this.authService.getJefePasantes(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('jefe/bitacoras')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener bitácoras a cargo del jefe de pasantes' })
  @ApiResponse({ status: 200, description: 'Lista de bitácoras' })
  @ApiResponse({ status: 401, description: 'Token inválido o ausente' })
  @ApiResponse({ status: 403, description: 'Acceso restringido a jefes de pasantes' })
  async getJefeBitacoras(@Request() req: any) {
    if (req.user.tipo !== 'jefe_pasantes' && req.user.tipo !== 'JEFE_PASANTES') {
      return { message: 'Acceso restringido a jefes de pasantes' };
    }
    return this.authService.getJefeBitacoras(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('jefe/bitacoras/:id/calificar')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Calificar una bitácora' })
  @ApiResponse({ status: 200, description: 'Bitácora calificada' })
  @ApiResponse({ status: 401, description: 'Token inválido o ausente' })
  @ApiResponse({ status: 403, description: 'Acceso restringido a jefes de pasantes' })
  async calificarBitacora(@Param('id') id: string, @Body() body: { nota: number, observacion?: string }, @Request() req: any) {
    if (req.user.tipo !== 'jefe_pasantes' && req.user.tipo !== 'JEFE_PASANTES') {
      return { message: 'Acceso restringido a jefes de pasantes' };
    }
    return this.authService.calificarBitacora(+id, body.nota, body.observacion);
  }

  @UseGuards(JwtAuthGuard)
  @Get('jefe/informes')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener informes finales a cargo del jefe de pasantes' })
  @ApiResponse({ status: 200, description: 'Lista de informes' })
  @ApiResponse({ status: 401, description: 'Token inválido o ausente' })
  @ApiResponse({ status: 403, description: 'Acceso restringido a jefes de pasantes' })
  async getJefeInformes(@Request() req: any) {
    if (req.user.tipo !== 'jefe_pasantes' && req.user.tipo !== 'JEFE_PASANTES') {
      return { message: 'Acceso restringido a jefes de pasantes' };
    }
    return this.authService.getJefeInformes(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('jefe/informes/:id/emitir')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Emitir informe final' })
  @ApiResponse({ status: 200, description: 'Informe emitido' })
  @ApiResponse({ status: 401, description: 'Token inválido o ausente' })
  @ApiResponse({ status: 403, description: 'Acceso restringido a jefes de pasantes' })
  async emitirInformeFinal(@Param('id') id: string, @Body() body: { apreciacion: string }, @Request() req: any) {
    if (req.user.tipo !== 'jefe_pasantes' && req.user.tipo !== 'JEFE_PASANTES') {
      return { message: 'Acceso restringido a jefes de pasantes' };
    }
    return this.authService.emitirInformeFinal(+id, body.apreciacion);
  }

  @UseGuards(JwtAuthGuard)
  @Post('jefe/pasantes/:id/baja')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Dar de baja a un pasante' })
  @ApiResponse({ status: 200, description: 'Pasante dado de baja' })
  async darDeBaja(@Param('id') id: string, @Body() dto: DarDeBajaDto, @Request() req: any) {
    if (req.user.tipo !== 'jefe_pasantes' && req.user.tipo !== 'JEFE_PASANTES') {
      return { message: 'Acceso restringido a jefes de pasantes' };
    }
    return this.authService.darDeBaja(+id, dto.motivo, dto.observacion);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('jefe/pasantes/:id/estado')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cambiar estado de un pasante' })
  @ApiResponse({ status: 200, description: 'Estado actualizado' })
  async cambiarEstado(@Param('id') id: string, @Body() dto: { estado: EstadoInscripcion }, @Request() req: any) {
    if (req.user.tipo !== 'jefe_pasantes' && req.user.tipo !== 'JEFE_PASANTES') {
      return { message: 'Acceso restringido a jefes de pasantes' };
    }
    return this.authService.cambiarEstado(+id, dto.estado);
  }

  @UseGuards(JwtAuthGuard)
  @Get('gerente/empresa')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener información de la empresa del gerente' })
  @ApiResponse({ status: 200, description: 'Datos de la empresa' })
  @ApiResponse({ status: 401, description: 'Token inválido o ausente' })
  async getGerenteEmpresa(@Request() req: any) {
    return this.authService.getGerenteEmpresa(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('gerente/empresa')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Actualizar información de la empresa del gerente' })
  @ApiResponse({ status: 200, description: 'Empresa actualizada' })
  @ApiResponse({ status: 401, description: 'Token inválido o ausente' })
  async updateGerenteEmpresa(@Request() req: any, @Body() body: any) {
    return this.authService.updateGerenteEmpresa(req.user.userId, body);
  }

  @UseGuards(JwtAuthGuard)
  @Get('gerente/equipo')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener equipo de la empresa del gerente' })
  @ApiResponse({ status: 200, description: 'Lista de jefes de pasantes' })
  @ApiResponse({ status: 401, description: 'Token inválido o ausente' })
  async getGerenteEquipo(@Request() req: any) {
    if (req.user.tipo !== 'gerente' && req.user.tipo !== 'GERENTE') {
      return { message: 'Acceso restringido a gerentes' };
    }
    return this.authService.getGerenteEquipo(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('gerente/equipo/:id/pasantes')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener pasantes a cargo de un jefe específico' })
  @ApiResponse({ status: 200, description: 'Lista de pasantes' })
  @ApiResponse({ status: 401, description: 'Token inválido o ausente' })
  async getGerenteEquipoPasantes(@Request() req: any, @Param('id') id: string) {
    if (req.user.tipo !== 'gerente' && req.user.tipo !== 'GERENTE') {
      return { message: 'Acceso restringido a gerentes' };
    }
    return this.authService.getGerenteEquipoPasantes(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('gerente/equipo/invitar')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Invitar a un nuevo jefe de pasantes' })
  @ApiResponse({ status: 201, description: 'Jefe invitado exitosamente' })
  @ApiResponse({ status: 401, description: 'Token inválido o ausente' })
  async invitarJefe(@Request() req: any, @Body() body: { email: string, nombre: string, apellido: string, departamento: string, contrasena?: string }) {
    if (req.user.tipo !== 'gerente' && req.user.tipo !== 'GERENTE') {
      return { message: 'Acceso restringido a gerentes' };
    }
    return this.authService.invitarJefe(req.user.userId, body);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('gerente/equipo/:id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Actualizar un jefe de pasantes' })
  @ApiResponse({ status: 200, description: 'Jefe actualizado exitosamente' })
  @ApiResponse({ status: 401, description: 'Token inválido o ausente' })
  @ApiResponse({ status: 403, description: 'Acceso prohibido' })
  async updateGerenteEquipo(@Request() req: any, @Param('id') id: string, @Body() body: any) {
    if (req.user.tipo !== 'gerente' && req.user.tipo !== 'GERENTE') {
      return { message: 'Acceso restringido a gerentes' };
    }
    return this.authService.updateGerenteEquipo(req.user.userId, +id, body);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('gerente/equipo/:id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Eliminar un jefe de pasantes' })
  @ApiResponse({ status: 200, description: 'Jefe eliminado exitosamente' })
  @ApiResponse({ status: 401, description: 'Token inválido o ausente' })
  @ApiResponse({ status: 403, description: 'Acceso prohibido' })
  async deleteGerenteEquipo(@Request() req: any, @Param('id') id: string) {
    if (req.user.tipo !== 'gerente' && req.user.tipo !== 'GERENTE') {
      return { message: 'Acceso restringido a gerentes' };
    }
    return this.authService.deleteGerenteEquipo(req.user.userId, +id);
  }
}
