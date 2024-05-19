import { Injectable } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Club } from './club.entity';

import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';

@Injectable()
export class ClubService {

    constructor(
        @InjectRepository(Club)
        private clubRepository: Repository<Club>,
    ) { }

    async findAll(): Promise<Club[]> {
        return this.clubRepository.find({ relations: ['partners'] });
    }

    async findOne(id: string): Promise<Club> {
        const club = await this.clubRepository.findOne({where: {id}, relations: ['partners']});
        if (!club) {
            throw new BusinessLogicException("Club not found", BusinessError.NOT_FOUND);
        }

        return club;
    }

    async create(club: Club): Promise<Club> {
        if (club.description.length > 100) {
            throw new BusinessLogicException("Long description", BusinessError.PRECONDITION_FAILED);
        }

        return this.clubRepository.save(club);
    }

    async update(id: string, club: Club): Promise<Club> {
        const persistedClub = await this.clubRepository.findOne({where: {id}});
        if (!persistedClub) {
            throw new BusinessLogicException("Club not found", BusinessError.NOT_FOUND);
        }

        if (club.description.length > 100) {
            throw new BusinessLogicException("Long description", BusinessError.PRECONDITION_FAILED);
        }

        return await this.clubRepository.save({...persistedClub, ...club});
    }

    async delete(id: string) {
        const persistedClub = await this.clubRepository.findOne({where: {id}});
        if (!persistedClub) {
            throw new BusinessLogicException("Club not found", BusinessError.NOT_FOUND);
        }

        await this.clubRepository.remove(persistedClub);
    }

}
