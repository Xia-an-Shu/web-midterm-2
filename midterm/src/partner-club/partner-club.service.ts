import { Injectable } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Partner } from '../partner/partner.entity';
import { Club } from '../club/club.entity';

import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';

@Injectable()
export class PartnerClubService {

    constructor(
        @InjectRepository(Partner)
        private partnerRepository: Repository<Partner>,
        @InjectRepository(Club)
        private clubRepository: Repository<Club>,
    ) { }

    async addMemberToClub(partnerId: string, clubId: string): Promise<Club> {
        const partner = await this.partnerRepository.findOne({where: {id: partnerId}, relations: ["clubs"]});
        if (!partner) {
            throw new BusinessLogicException("Partner not found", BusinessError.NOT_FOUND);
        }

        const club = await this.clubRepository.findOne({where: {id: clubId}, relations: ["partners"]});
        if (!club) {
            throw new BusinessLogicException("Club not found", BusinessError.NOT_FOUND);
        }

        // console.log("Club before adding:\n", club);

        // Add the partner to the club
        club.partners = club.partners || [];
        club.partners.push(partner);
        const updatedClub = await this.clubRepository.save(club);

        // Add the club to the partner
        partner.clubs = partner.clubs || [];
        partner.clubs.push(club);
        await this.partnerRepository.save(partner);

        // console.log("Club after adding:\n", updatedClub);

        return updatedClub;
    }

    async findMembersFromClub(clubId: string): Promise<Partner[]> {
        const club = await this.clubRepository.findOne({where: {id: clubId}, relations: ['partners']});
        if (!club) {
            throw new BusinessLogicException("Club not found", BusinessError.NOT_FOUND);
        }

        return club.partners;
    }

    async findMemberFromClub(clubId: string, partnerId: string): Promise<Partner> {
        const club = await this.clubRepository.findOne({where: {id: clubId}, relations: ['partners']});
        if (!club) {
            throw new BusinessLogicException("Club not found", BusinessError.NOT_FOUND);
        }

        const partner = club.partners.find(partner => partner.id === partnerId);
        if (!partner) {
            throw new BusinessLogicException("Partner not found", BusinessError.NOT_FOUND);
        }

        return partner;
    }

    async updateMembersFromClub(clubId: string, partners: Partner[]): Promise<Club> {
        const club = await this.clubRepository.findOne({where: {id: clubId}, relations: ['partners']});
        if (!club) {
            throw new BusinessLogicException("Club not found", BusinessError.NOT_FOUND);
        }

        club.partners = partners;
        return this.clubRepository.save(club);
    }

    async deleteMemberFromClub(clubId: string, partnerId: string): Promise<Club> {
        const club = await this.clubRepository.findOne({where: {id: clubId}, relations: ['partners']});
        if (!club) {
            throw new BusinessLogicException("Club not found", BusinessError.NOT_FOUND);
        }

        const partner = club.partners.find(partner => partner.id === partnerId);
        if (!partner) {
            throw new BusinessLogicException("Partner not found", BusinessError.NOT_FOUND);
        }

        club.partners = club.partners.filter(partner => partner.id !== partnerId);
        return this.clubRepository.save(club);
    }

}
