import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { typeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';

import { faker } from '@faker-js/faker';

import { SocioClubService } from './socio-club.service';
import { SocioEntity } from '../socio/entity/socio.entity';
import { ClubEntity } from '../club/entity/club.entity';

describe('SocioClubService', () => {
  let service: SocioClubService;
  let socioRepository: Repository<SocioEntity>;
  let clubRepository: Repository<ClubEntity>;
  let sociosList: SocioEntity[];
  let clubsList: ClubEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...typeOrmTestingConfig()],
      providers: [SocioClubService],
    }).compile();

    service = module.get<SocioClubService>(SocioClubService);
    socioRepository = module.get<Repository<SocioEntity>>(getRepositoryToken(SocioEntity));
    clubRepository = module.get<Repository<ClubEntity>>(getRepositoryToken(ClubEntity));

    await seedData();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  const seedData =  async () => {
    socioRepository.clear();
    clubRepository.clear();
    sociosList = [];
    clubsList = [];

    for (let i = 0; i < 5; i++) {
      const socio: SocioEntity = await socioRepository.save({
        username: faker.internet.userName(),
        email: faker.internet.email(),
        birthdate: faker.date.past(),
      });
      sociosList.push(socio);
      const club: ClubEntity = await clubRepository.save({
        name: faker.company.name(),
        foundationDate: faker.date.past(),
        image: faker.image.imageUrl(),
        description: faker.lorem.sentence(),
      });
      clubsList.push(club);
    }

  }

  it('should add member to club', async () => {
    const socio: SocioEntity = sociosList[0];
    const club: ClubEntity = clubsList[0];

    const clubUpdated = await service.addMemberToClub(socio.id, club.id);

    expect(clubUpdated).not.toBeNull();
    expect(clubUpdated.socios).toContainEqual(socio);
  });

  it('should find members from club', async () => {
    const club: ClubEntity = clubsList[0];
    const socios = await service.findMembersFromClub(club.id);

    expect(socios).not.toBeNull();
    expect(socios).toHaveLength(club.socios.length);
  });

  it('should find member from club', async () => {
    const club: ClubEntity = clubsList[0];
    const socio: SocioEntity = club.socios[0];

    const foundSocio = await service.findMemberFromClub(club.id, socio.id);

    expect(foundSocio).not.toBeNull();
    expect(foundSocio).toEqual(socio);
  });

  it('should update members from club', async () => {
    const club: ClubEntity = clubsList[0];
    const newSocios = sociosList.slice(0, 3);

    const clubUpdated = await service.updateMembersFromClub(club.id, newSocios);

    expect(clubUpdated).not.toBeNull();
    expect(clubUpdated.socios).toEqual(newSocios);
  });

  it('should delete member from club', async () => {
    const club: ClubEntity = clubsList[0];
    const socio: SocioEntity = club.socios[0];

    const clubUpdated = await service.deleteMemberFromClub(club.id, socio.id);

    expect(clubUpdated).not.toBeNull();
    expect(clubUpdated.socios).not.toContainEqual(socio);
  });

  it('should fail to add member to non-existing club', async () => {
    const socio: SocioEntity = sociosList[0];
    await expect(() => service.addMemberToClub(socio.id, '0')).rejects.toHaveProperty("message", "Club no encontrado");
  });

  it('should fail to add non-existing member to club', async () => {
    const club: ClubEntity = clubsList[0];
    await expect(() => service.addMemberToClub('0', club.id)).rejects.toHaveProperty("message", "Socio no encontrado");
  });

  it('should fail to find members from non-existing club', async () => {
    await expect(() => service.findMembersFromClub('0')).rejects.toHaveProperty("message", "Club no encontrado");
  });

  it('should fail to find member from non-existing club', async () => {
    await expect(() => service.findMemberFromClub('0', '0')).rejects.toHaveProperty("message", "Club no encontrado");
  });

  it('should fail to find non-existing member from club', async () => {
    const club: ClubEntity = clubsList[0];
    await expect(() => service.findMemberFromClub(club.id, '0')).rejects.toHaveProperty("message", "Socio no encontrado");
  });

  it('should fail to update members from non-existing club', async () => {
    await expect(() => service.updateMembersFromClub('0', [])).rejects.toHaveProperty("message", "Club no encontrado");
  });

  it('should fail to delete member from non-existing club', async () => {
    await expect(() => service.deleteMemberFromClub('0', '0')).rejects.toHaveProperty("message", "Club no encontrado");
  });

  it('should fail to delete non-existing member from club', async () => {
    const club: ClubEntity = clubsList[0];
    await expect(() => service.deleteMemberFromClub(club.id, '0')).rejects.toHaveProperty("message", "Socio no encontrado");
  });

});
