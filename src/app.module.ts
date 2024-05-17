import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SocioModule } from './socio/socio.module';
import { ClubModule } from './club/club.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SocioClubModule } from './socio-club/socio-club.module';

@Module({
  imports: [SocioModule, ClubModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'social_club',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      dropSchema: true,
      synchronize: true,
      keepConnectionAlive: true
    }),
    SocioClubModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
