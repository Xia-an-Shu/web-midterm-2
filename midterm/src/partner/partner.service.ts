import { Injectable } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Partner } from './partner.entity';

import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';

@Injectable()
export class PartnerService {

    constructor(
        @InjectRepository(Partner)
        private partnerRepository: Repository<Partner>,
    ) { }
    
    async findAll(): Promise<Partner[]> {
        return this.partnerRepository.find({ relations: ['clubs'] });
    }

    async findOne(id: string): Promise<Partner> {
        const partner = await this.partnerRepository.findOne({where: {id}, relations: ['clubs']});
        if (!partner) {
            throw new BusinessLogicException("Partner not found", BusinessError.NOT_FOUND);
        }

        return partner;
    }

    async create(partner: Partner): Promise<Partner> {
        if (!partner.email.includes('@')) {
            throw new BusinessLogicException("Invalid email", BusinessError.PRECONDITION_FAILED);
        }

        return this.partnerRepository.save(partner);
    }

    async update(id: string, partner: Partner): Promise<Partner> {
        const persistedPartner = await this.partnerRepository.findOne({where: {id}});
        if (!persistedPartner) {
            throw new BusinessLogicException("Partner not found", BusinessError.NOT_FOUND);
        }

        if (!partner.email.includes('@')) {
            throw new BusinessLogicException("Invalid email", BusinessError.PRECONDITION_FAILED);
        }

        return await this.partnerRepository.save({...persistedPartner, ...partner});
    }

    async delete(id: string) {
        const persistedPartner = await this.partnerRepository.findOne({where: {id}});
        if (!persistedPartner) {
            throw new BusinessLogicException("Partner not found", BusinessError.NOT_FOUND);
        }

        await this.partnerRepository.remove(persistedPartner);
    }

}
