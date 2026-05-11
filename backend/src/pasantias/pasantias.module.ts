import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PasantiasService } from './pasantias.service';
import { PasantiasController } from './pasantias.controller';
import { Pasantia } from './entities/pasantia.entity';
import { Empresa } from '../empresas/entities/empresa.entity';
import { Gerente } from '../usuarios/entities/gerente.entity';
import { JefePasantes } from '../usuarios/entities/jefe-pasantes.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Pasantia, Empresa, Gerente, JefePasantes])],
  providers: [PasantiasService],
  controllers: [PasantiasController],
  exports: [PasantiasService],
})
export class PasantiasModule {}
