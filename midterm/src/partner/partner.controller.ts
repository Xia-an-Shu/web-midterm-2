import { Body, Controller, Delete, Get, HttpCode, Param, Post, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';

import { PartnerService } from './partner.service';
import { Partner } from './partner.entity';
import { PartnerDto } from './partner.dto';

import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';

@UseInterceptors(BusinessErrorsInterceptor)
@Controller('members')
export class PartnerController {

    constructor(private readonly partnerService: PartnerService) {}

    @Get()
    async findAll() {
        return this.partnerService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.partnerService.findOne(id);
    }

    @Post()
    async create(@Body() partnerDto: PartnerDto) {
        const partner = plainToInstance(Partner, partnerDto);
        return await this.partnerService.create(partner);
    }

    @Post(':id')
    async update(@Param('id') id: string, @Body() partnerDto: PartnerDto) {
        const partner = plainToInstance(Partner, partnerDto);
        return await this.partnerService.update(id, partner);
    }

    @Delete(':id')
    @HttpCode(204)
    async delete(@Param('id') id: string) {
        return await this.partnerService.delete(id);
    }

}
