import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ClubEntity } from './entity/club.entity';

import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';

/*
Defina la lógica de Club, esta debe incluir los métodos findAll, findOne,
create, update y delete. Dentro de los métodos create y update, valide que la
descripción no supere el máximo de caracteres permitidos.
*/

@Injectable()
export class ClubService {

    constructor(
        @InjectRepository(ClubEntity)
        private clubRepository: Repository<ClubEntity>,
    ) { }
    
    async findAll(): Promise<ClubEntity[]> {
        return this.clubRepository.find({ relations: ['socios'] });
    }

    async findOne(id: string): Promise<ClubEntity> {
        const club = await this.clubRepository.findOne({where: {id}, relations: ['socios']});
        if (!club) {
            throw new BusinessLogicException("Club no encontrado", BusinessError.NOT_FOUND);
        }

        return club;
    }

    async create(club: ClubEntity): Promise<ClubEntity> {
        if (club.getDesciption().length > 100) {
            throw new BusinessLogicException("Descripción muy larga", BusinessError.PRECONDITION_FAILED);
        }

        return this.clubRepository.save(club);
    }

    async update(id: string, club: ClubEntity): Promise<ClubEntity> {
        const persistedClub = await this.clubRepository.findOne({where: {id}});
        if (!persistedClub) {
            throw new BusinessLogicException("Club no encontrado", BusinessError.NOT_FOUND);
        }

        if (club.getDesciption().length > 100) {
            throw new BusinessLogicException("Descripción muy larga", BusinessError.PRECONDITION_FAILED);
        }

        return await this.clubRepository.save({...persistedClub, ...club});
    }

    async delete(id: string) {
        const persistedClub = await this.clubRepository.findOne({where: {id}});
        if (!persistedClub) {
            throw new BusinessLogicException("Club no encontrado", BusinessError.NOT_FOUND);
        }

        await this.clubRepository.remove(persistedClub);
    }



}
