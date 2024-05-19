import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';

import { PartnerClubService } from './partner-club.service';

import { PartnerEntity } from '../partner/partner.entity';
import { ClubEntity } from '../club/club.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PartnerEntity, ClubEntity])],
  providers: [PartnerClubService],
  exports: [PartnerClubService]
})
export class PartnerClubModule {}
