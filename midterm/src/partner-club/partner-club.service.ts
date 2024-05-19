import { Injectable } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { PartnerEntity } from '../partner/partner.entity';
import { ClubEntity } from '../club/club.entity';

import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';

@Injectable()
export class PartnerClubService {

    constructor(
        @InjectRepository(PartnerEntity)
        private partnerRepository: Repository<PartnerEntity>,
        @InjectRepository(ClubEntity)
        private clubRepository: Repository<ClubEntity>,
    ) { }

    async addMemberToClub(partnerId: string, clubId: string): Promise<ClubEntity> {
        const partner = await this.partnerRepository.findOne({where: {id: partnerId}});
        if (!partner) {
            throw new BusinessLogicException("Partner not found", BusinessError.NOT_FOUND);
        }

        const club = await this.clubRepository.findOne({where: {id: clubId}});
        if (!club) {
            throw new BusinessLogicException("Club not found", BusinessError.NOT_FOUND);
        }

        club.partners.push(partner);
        return this.clubRepository.save(club);
    }

    async findMembersFromClub(clubId: string): Promise<PartnerEntity[]> {
        const club = await this.clubRepository.findOne({where: {id: clubId}, relations: ['partners']});
        if (!club) {
            throw new BusinessLogicException("Club not found", BusinessError.NOT_FOUND);
        }

        return club.partners;
    }

    async findMemberFromClub(clubId: string, partnerId: string): Promise<PartnerEntity> {
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

    async updateMembersFromClub(clubId: string, partners: PartnerEntity[]): Promise<ClubEntity> {
        const club = await this.clubRepository.findOne({where: {id: clubId}, relations: ['partners']});
        if (!club) {
            throw new BusinessLogicException("Club not found", BusinessError.NOT_FOUND);
        }

        club.partners = partners;
        return this.clubRepository.save(club);
    }

    async deleteMemberFromClub(clubId: string, partnerId: string): Promise<ClubEntity> {
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
