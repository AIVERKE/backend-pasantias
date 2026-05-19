import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Inscripcion } from '../pasantias/entities/inscripcion.entity';
import { Tarea } from '../pasantias/entities/tarea.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Inscripcion, Tarea])],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
