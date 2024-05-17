import { Module } from '@nestjs/common';
import { SocioService } from './socio.service';

import { TypeOrmModule } from '@nestjs/typeorm';

import { SocioEntity } from './entity/socio.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SocioEntity])],
  providers: [SocioService]
})

export class SocioModule {}
