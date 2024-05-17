import { Module } from '@nestjs/common';
import { SocioClubService } from './socio-club.service';

import { TypeOrmModule } from '@nestjs/typeorm';

import { SocioEntity } from 'src/socio/entity/socio.entity';
import { ClubEntity } from 'src/club/entity/club.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SocioEntity, ClubEntity])],
  providers: [SocioClubService]
})
export class SocioClubModule {}
