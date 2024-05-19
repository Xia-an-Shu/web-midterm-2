import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';

import { PartnerService } from './partner.service';
import { Partner } from './partner.entity';


@Module({
  imports: [TypeOrmModule.forFeature([Partner])],
  providers: [PartnerService],
  exports: [PartnerService]
})
export class PartnerModule {}
