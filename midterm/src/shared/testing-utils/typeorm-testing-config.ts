/* eslint-disable prettier/prettier */
import { TypeOrmModule } from '@nestjs/typeorm';

import { PartnerEntity } from '../../partner/partner.entity';
import { ClubEntity } from '../../club/club.entity';

export const typeOrmTestingConfig = () => [
    TypeOrmModule.forRoot({
        type: 'sqlite',
        database: ':memory:',
        dropSchema: true,
        entities: [PartnerEntity, ClubEntity],
        synchronize: true,
        keepConnectionAlive: true
    }),
    TypeOrmModule.forFeature([PartnerEntity, ClubEntity])
];