import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';

import { PartnerClubService } from './partner-club.service';

import { Partner } from '../partner/partner.entity';
import { Club } from '../club/club.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Partner, Club])],
  providers: [PartnerClubService],
  exports: [PartnerClubService]
})
export class PartnerClubModule {}
