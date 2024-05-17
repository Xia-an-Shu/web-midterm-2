import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { SocioEntity } from 'src/socio/entity/socio.entity';
import { ClubEntity } from 'src/club/entity/club.entity';

import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';

/*
Defina la lógica de la asociación, esta debe incluir 5 métodos con las
siguientes acciones:
- addMemberToClub: Asociar un socio a un grupo.
- findMembersFromClub: Obtener los socios de un grupo.
- findMemberFromClub: Obtener un socio de un grupo.
- updateMembersFromClub: Actualizar los socios de un grupo.
- deleteMemberFromClub: Eliminar un socio de un grupo.
*/

@Injectable()
export class SocioClubService {

    constructor(
        @InjectRepository(SocioEntity)
        private socioRepository: Repository<SocioEntity>,
        @InjectRepository(ClubEntity)
        private clubRepository: Repository<ClubEntity>,
    ) { }

    async addMemberToClub(socioId: string, clubId: string): Promise<ClubEntity> {
        const socio = await this.socioRepository.findOne({where: {id: socioId}});
        if (!socio) {
            throw new BusinessLogicException("Socio no encontrado", BusinessError.NOT_FOUND);
        }

        const club = await this.clubRepository.findOne({where: {id: clubId}});
        if (!club) {
            throw new BusinessLogicException("Club no encontrado", BusinessError.NOT_FOUND);
        }

        club.socios.push(socio);
        return this.clubRepository.save(club);
    }

    async findMembersFromClub(clubId: string): Promise<SocioEntity[]> {
        const club = await this.clubRepository.findOne({where: {id: clubId}, relations: ['socios']});
        if (!club) {
            throw new BusinessLogicException("Club no encontrado", BusinessError.NOT_FOUND);
        }

        return club.socios;
    }

    async findMemberFromClub(clubId: string, socioId: string): Promise<SocioEntity> {
        const club = await this.clubRepository.findOne({where: {id: clubId}, relations: ['socios']});
        if (!club) {
            throw new BusinessLogicException("Club no encontrado", BusinessError.NOT_FOUND);
        }

        const socio = club.socios.find(socio => socio.id === socioId);
        if (!socio) {
            throw new BusinessLogicException("Socio no encontrado", BusinessError.NOT_FOUND);
        }

        return socio;
    }

    async updateMembersFromClub(clubId: string, socios: SocioEntity[]): Promise<ClubEntity> {
        const club = await this.clubRepository.findOne({where: {id: clubId}, relations: ['socios']});
        if (!club) {
            throw new BusinessLogicException("Club no encontrado", BusinessError.NOT_FOUND);
        }

        club.socios = socios;
        return this.clubRepository.save(club);
    }

    async deleteMemberFromClub(clubId: string, socioId: string): Promise<ClubEntity> {
        const club = await this.clubRepository.findOne({where: {id: clubId}, relations: ['socios']});
        if (!club) {
            throw new BusinessLogicException("Club no encontrado", BusinessError.NOT_FOUND);
        }

        const socio = club.socios.find(socio => socio.id === socioId);
        if (!socio) {
            throw new BusinessLogicException("Socio no encontrado", BusinessError.NOT_FOUND);
        }

        club.socios = club.socios.filter(socio => socio.id !== socioId);
        return this.clubRepository.save(club);
    }

}
