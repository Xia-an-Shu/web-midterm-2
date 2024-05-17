import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { SocioEntity } from './entity/socio.entity';

import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';

/*
Defina la lógica de Socio, esta debe incluir los métodos findAll, findOne,
create, update y delete. Dentro de los métodos create y update, realice una
validación básica del correo electrónico, es decir que tenga el caracter ‘@’.
*/

@Injectable()
export class SocioService {

    constructor(
        @InjectRepository(SocioEntity)
        private socioRepository: Repository<SocioEntity>,
    ) { }

    async findAll(): Promise<SocioEntity[]> {
        return this.socioRepository.find({ relations: ['clubs'] });
    }

    async findOne(id: string): Promise<SocioEntity> {
        const socio = await this.socioRepository.findOne({where: {id}, relations: ['clubs']});
        if (!socio) {
            throw new BusinessLogicException("Socio no encontrado", BusinessError.NOT_FOUND);
        }

        return socio;
    }

    async create(socio: SocioEntity): Promise<SocioEntity> {
        if (!socio.email.includes('@')) {
            throw new BusinessLogicException("Correo electrónico inválido", BusinessError.PRECONDITION_FAILED);
        }

        return this.socioRepository.save(socio);
    }

    async update(id: string, socio: SocioEntity): Promise<SocioEntity> {
        const persistedSocio = await this.socioRepository.findOne({where: {id}});
        if (!persistedSocio) {
            throw new BusinessLogicException("Socio no encontrado", BusinessError.NOT_FOUND);
        }

        if (!socio.email.includes('@')) {
            throw new BusinessLogicException("Correo electrónico inválido", BusinessError.PRECONDITION_FAILED);
        }

        return await this.socioRepository.save({...persistedSocio, ...socio});
    }

    async delete(id: string) {
        const persistedSocio = await this.socioRepository.findOne({where: {id}});
        if (!persistedSocio) {
            throw new BusinessLogicException("Socio no encontrado", BusinessError.NOT_FOUND);
        }

        await this.socioRepository.remove(persistedSocio);
    }



}
