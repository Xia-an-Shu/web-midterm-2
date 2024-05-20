import { Body, Controller, Delete, Get, HttpCode, Param, Post, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';

import { ClubService } from './club.service';
import { Club } from './club.entity';
import { ClubDto } from './club.dto';

import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';

@UseInterceptors(BusinessErrorsInterceptor)
@Controller('club')
export class ClubController {

    constructor(private readonly clubService: ClubService) {}

    @Get()
    async findAll() {
        return this.clubService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.clubService.findOne(id);
    }

    @Post()
    async create(@Body() clubDto: ClubDto) {
        const club = plainToInstance(Club, clubDto);
        return await this.clubService.create(club);
    }

    @Post(':id')
    async update(@Param('id') id: string, @Body() clubDto: ClubDto) {
        const club = plainToInstance(Club, clubDto);
        return await this.clubService.update(id, club);
    }

    @Delete(':id')
    @HttpCode(204)
    async delete(@Param('id') id: string) {
        return await this.clubService.delete(id);
    }

}
