/* eslint-disable prettier/prettier */
import { TypeOrmModule } from '@nestjs/typeorm';

import { SocioEntity } from 'src/socio/entity/socio.entity';
import { ClubEntity } from 'src/club/entity/club.entity';

export const typeOrmTestingConfig = () => [
    TypeOrmModule.forRoot({
        type: 'sqlite',
        database: ':memory:',
        dropSchema: true,
        entities: [SocioEntity, ClubEntity],
        synchronize: true,
        keepConnectionAlive: true
    }),
    TypeOrmModule.forFeature([SocioEntity, ClubEntity])
];