import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { DashboardService } from './dashboard.service';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('estudiante/:id')
  getDashboardEstudiante(@Param('id', ParseIntPipe) id: number) {
    return this.dashboardService.getDashboardEstudiante(id);
  }
}
