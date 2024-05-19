import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClubModule } from './club/club.module';
import { PartnerModule } from './partner/partner.module';
import { PartnerClubModule } from './partner-club/partner-club.module';

import { TypeOrmModule } from '@nestjs/typeorm';

import { ClubEntity } from './club/club.entity';
import { PartnerEntity } from './partner/partner.entity';

@Module({
  imports: [ClubModule, PartnerModule, PartnerClubModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'social_club',
      entities: [PartnerEntity, ClubEntity],
      dropSchema: true,
      synchronize: true,
      keepConnectionAlive: true
    })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
