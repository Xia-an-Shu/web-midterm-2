import { Body, Controller, Delete, Get, HttpCode, Param, Post, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';

import { PartnerClubService } from './partner-club.service';
import { Partner } from '../partner/partner.entity';
import { PartnerDto } from '../partner/partner.dto';

import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';

@UseInterceptors(BusinessErrorsInterceptor)
@Controller('clubs')
export class PartnerClubController {

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
        return this.partnerClubService.findMemberFromClub(clubId, partnerId);
    }

    @Post(':clubId/members')
    async updateMembersFromClub(@Param('clubId') clubId: string, @Body() partnerDtos: PartnerDto[]) {
        const partners = plainToInstance(Partner, partnerDtos);
        return await this.partnerClubService.updateMembersFromClub(clubId, partners);
    }

    @Delete(':clubId/members/:partnerId')
    @HttpCode(204)
    async deleteMemberFromClub(@Param('partnerId') partnerId: string, @Param('clubId') clubId: string) {
        return await this.partnerClubService.deleteMemberFromClub(clubId, partnerId);
    }

}
