import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';

import { PartnerService } from './partner.service';
import { Partner } from './partner.entity';
import { PartnerController } from './partner.controller';


@Module({
  imports: [TypeOrmModule.forFeature([Partner])],
  providers: [PartnerService],
  exports: [PartnerService],
  controllers: [PartnerController]
})
export class PartnerModule {}
