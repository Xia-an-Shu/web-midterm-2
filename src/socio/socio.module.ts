import { Module } from '@nestjs/common';
import { SocioService } from './socio.service';

import { TypeOrmModule } from '@nestjs/typeorm';

import { ClubEntity } from 'src/club/entity/club.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ClubEntity])],
  providers: [SocioService]
})
export class SocioModule {}
