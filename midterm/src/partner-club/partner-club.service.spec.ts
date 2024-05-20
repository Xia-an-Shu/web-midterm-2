import { Test, TestingModule } from '@nestjs/testing';

import { PartnerClubService } from './partner-club.service';
import { Partner } from '../partner/partner.entity';
import { Club } from '../club/club.entity';

import { faker } from '@faker-js/faker';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { typeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';

describe('PartnerClubService', () => {
  let service: PartnerClubService;
  let partnerRepository: Repository<Partner>; 
  let clubRepository: Repository<Club>;

  let partners: Partner[];
  let clubs: Club[];


  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...typeOrmTestingConfig()],
      providers: [PartnerClubService],
    }).compile();

    service = module.get<PartnerClubService>(PartnerClubService);
    partnerRepository = module.get<Repository<Partner>>(getRepositoryToken(Partner));
    clubRepository = module.get<Repository<Club>>(getRepositoryToken(Club));

    await seedData();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  
  const seedData = async () => {
    partnerRepository.clear();
    clubRepository.clear();
    partners = [];
    clubs = [];

    for (let i = 0; i < 5; i++) {
      const partner: Partner = await partnerRepository.save({
        name: faker.person.firstName(),
        email: faker.internet.email(),
        birthdate: faker.date.past(),
        clubs: [],
      });
      partners.push(partner);
      const club: Club = await clubRepository.save({
        name: faker.company.name(),
        foundationDate: faker.date.past(),
        image: faker.image.url(),
        description: faker.lorem.sentence(),
        partners: [],
      });
      clubs.push(club);

      partner.clubs = [club];
      await partnerRepository.save(partner);

      club.partners = [partner];
      await clubRepository.save(club);
    }
  }

  it('should add member to club', async () => {
    const partner = partners[3];
    const club = clubs[0];

    // console.log("Partner:\n", partner);

    const updatedClub = await service.addMemberToClub(partner.id, club.id);

    expect(updatedClub).not.toBeNull();
    // Club.partners[i] will not contain value "clubs" but partners[i] will, so we only check that the id is contained
    let listOfIds = updatedClub.partners.map(partner => partner.id);
    expect(listOfIds).toContain(partner.id);

    // Check that the partner has the club in its clubs
    const updatedPartner = await partnerRepository.findOne({where: {id: partner.id}, relations: ['clubs']});
    expect(updatedPartner).not.toBeNull();
    let listOfClubIds = updatedPartner.clubs.map(club => club.id);
    expect(listOfClubIds).toContain(club.id);

  });

  it('should find members from club', async () => {
    const club = clubs[0];
    const partnersFromClub = await service.findMembersFromClub(club.id);

    expect(partnersFromClub).not.toBeNull();
    expect(partnersFromClub).toHaveLength(club.partners.length);
  });

  it('should find member from club', async () => {
    const club = clubs[0];
    const partner = club.partners[0];

    const foundPartner = await service.findMemberFromClub(club.id, partner.id);

    expect(foundPartner).not.toBeNull();
    expect(foundPartner.id).toEqual(partner.id);
  });

  it('should update members from club', async () => {
    const club = clubs[0];
    const newPartners = partners.slice(0, 3);

    const updatedClub = await service.updateMembersFromClub(club.id, newPartners);

    expect(updatedClub).not.toBeNull();
    let listOfIds = updatedClub.partners.map(partner => partner.id);
    expect(listOfIds).toEqual(newPartners.map(partner => partner.id));
  });

  it('should delete member from club', async () => {
    const club = clubs[0];
    const partner = club.partners[0];

    const updatedClub = await service.deleteMemberFromClub(club.id, partner.id);

    expect(updatedClub).not.toBeNull();
    let listOfIds = updatedClub.partners.map(partner => partner.id);
    expect(listOfIds).not.toContain(partner.id);
  });

  it('should fail to add member to non-existing club', async () => {
    const partner = partners[0];
    await expect(() => service.addMemberToClub(partner.id, '0')).rejects.toHaveProperty("message", "Club not found");
  });

  it('should fail to add non-existing member to club', async () => {
    const club = clubs[0];
    await expect(() => service.addMemberToClub('0', club.id)).rejects.toHaveProperty("message", "Partner not found");
  });

  it('should fail to find members from non-existing club', async () => {
    await expect(() => service.findMembersFromClub('0')).rejects.toHaveProperty("message", "Club not found");
  });

  it('should fail to find member from non-existing club', async () => {
    const partner = partners[0];
    await expect(() => service.findMemberFromClub('0', partner.id)).rejects.toHaveProperty("message", "Club not found");
  });

  it('should fail to find non-existing member from club', async () => {
    const club = clubs[0];
    await expect(() => service.findMemberFromClub(club.id, '0')).rejects.toHaveProperty("message", "Partner not found");
  });

  it('should fail to update members from non-existing club', async () => {
    const newPartners = partners.slice(0, 3);
    await expect(() => service.updateMembersFromClub('0', newPartners)).rejects.toHaveProperty("message", "Club not found");
  });

  it('should fail to delete member from non-existing club', async () => {
    await expect(() => service.deleteMemberFromClub('0', '0')).rejects.toHaveProperty("message", "Club not found");
  });

  it('should fail to delete non-existing member from club', async () => {
    const club = clubs[0];
    await expect(() => service.deleteMemberFromClub(club.id, '0')).rejects.toHaveProperty("message", "Partner not found");
  });

});
