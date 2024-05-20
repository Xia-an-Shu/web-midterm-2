import { Body, Controller, Delete, Get, HttpCode, Param, Post, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';

import { PartnerClubService } from './partner-club.service';
import { Partner } from '../partner/partner.entity';
import { Club } from '../club/club.entity';
import { PartnerDto } from '../partner/partner.dto';
import { ClubDto } from '../club/club.dto'; 

import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';

@UseInterceptors(BusinessErrorsInterceptor)
@Controller('clubs')
export class PartnerClubController {

    /*
    Agregue la ruta
    de modo que se acceda a los endpoints a través del club (ej.
    /clubs/1/members/4 para findMemberFromClub) e implemente los
    endpoints:
    - addMemberToClub
    - findMembersFromClub
    - findMemberFromClub
    - updateMembersFromClub
    - deleteMemberFromClub

    */

    constructor(private readonly partnerClubService: PartnerClubService) {}

    @Post(':clubId/members/:partnerId')
    async addMemberToClub(@Param('partnerId') partnerId: string, @Param('clubId') clubId: string) {
        return this.partnerClubService.addMemberToClub(partnerId, clubId);
    }

    @Get(':clubId/members')
    async findMembersFromClub(@Param('clubId') clubId: string) {
        return this.partnerClubService.findMembersFromClub(clubId);
    }

    @Get(':clubId/members/:partnerId')
    async findMemberFromClub(@Param('partnerId') partnerId: string, @Param('clubId') clubId: string) {
        return this.partnerClubService.findMemberFromClub(partnerId, clubId);
    }

    @Post(':clubId/members')
    async updateMembersFromClub(@Param('clubId') clubId: string, @Body() partnerDtos: PartnerDto[]) {
        const partners = plainToInstance(Partner, partnerDtos);
        return await this.partnerClubService.updateMembersFromClub(clubId, partners);
    }

    @Delete(':clubId/members/:partnerId')
    @HttpCode(204)
    async deleteMemberFromClub(@Param('partnerId') partnerId: string, @Param('clubId') clubId: string) {
        return await this.partnerClubService.deleteMemberFromClub(partnerId, clubId);
    }

}
