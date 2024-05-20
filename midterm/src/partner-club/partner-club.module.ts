import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';

import { PartnerClubService } from './partner-club.service';

import { Partner } from '../partner/partner.entity';
import { Club } from '../club/club.entity';
import { PartnerClubController } from './partner-club.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Partner, Club])],
  providers: [PartnerClubService],
  exports: [PartnerClubService],
  controllers: [PartnerClubController]
})
export class PartnerClubModule {}
