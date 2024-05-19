/* eslint-disable prettier/prettier */
import { TypeOrmModule } from '@nestjs/typeorm';

import { Partner } from '../../partner/partner.entity';
import { Club } from '../../club/club.entity';

export const typeOrmTestingConfig = () => [
    TypeOrmModule.forRoot({
        type: 'sqlite',
        database: ':memory:',
        dropSchema: true,
        entities: [Partner, Club],
        synchronize: true,
        keepConnectionAlive: true
    }),
    TypeOrmModule.forFeature([Partner, Club])
];