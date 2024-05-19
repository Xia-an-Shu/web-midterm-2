import { Injectable } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { PartnerEntity } from './partner.entity';

import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';

@Injectable()
export class PartnerService {

    constructor(
        @InjectRepository(PartnerEntity)
        private partnerRepository: Repository<PartnerEntity>,
    ) { }
    
    async findAll(): Promise<PartnerEntity[]> {
        return this.partnerRepository.find({ relations: ['clubs'] });
    }

    async findOne(id: string): Promise<PartnerEntity> {
        const partner = await this.partnerRepository.findOne({where: {id}, relations: ['clubs']});
        if (!partner) {
            throw new BusinessLogicException("Partner not found", BusinessError.NOT_FOUND);
        }

        return partner;
    }

    async create(partner: PartnerEntity): Promise<PartnerEntity> {
        if (!partner.email.includes('@')) {
            throw new BusinessLogicException("Invalid email", BusinessError.PRECONDITION_FAILED);
        }

        return this.partnerRepository.save(partner);
    }

    async update(id: string, partner: PartnerEntity): Promise<PartnerEntity> {
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
