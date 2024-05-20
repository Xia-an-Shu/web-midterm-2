import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';

import { Club } from './club.entity';
import { ClubService } from './club.service';
import { ClubController } from './club.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Club])],
  providers: [ClubService],
  exports: [ClubService],
  controllers: [ClubController]
})
export class ClubModule {}
