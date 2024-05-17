import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { typeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';

import { faker } from '@faker-js/faker';

import { ClubService } from './club.service';
import { ClubEntity } from './entity/club.entity';

describe('ClubService', () => {
  let service: ClubService;
  let repository: Repository<ClubEntity>;
  let clubsList: ClubEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...typeOrmTestingConfig()],
      providers: [ClubService],
    }).compile();

    service = module.get<ClubService>(ClubService);
    repository = module.get<Repository<ClubEntity>>(getRepositoryToken(ClubEntity));

    await seedData();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  const seedData =  async () => {
    repository.clear();
    clubsList = [];
    for (let i = 0; i < 5; i++) {
      const club: ClubEntity = await repository.save({
        name: faker.company.name(),
        foundationDate: faker.date.past(),
        image: faker.image.imageUrl(),
        description: faker.lorem.sentence(),
      });
      clubsList.push(club);
    }
  }

  it('should return all clubs', async () => {
    const clubs = await service.findAll();
    expect(clubs).not.toBeNull();
    expect(clubs).toHaveLength(clubsList.length);
  });

  it('should return one club', async () => {
    const storedClub: ClubEntity = clubsList[0];
    const club: ClubEntity = await service.findOne(storedClub.id);

    expect(club).not.toBeNull();
    expect(club.name).toEqual(storedClub.name);
    expect(club.foundationDate).toEqual(storedClub.foundationDate);
    expect(club.image).toEqual(storedClub.image);
    expect(club.description).toEqual(storedClub.description);
  });

  it('should fail to get a non-existing club', async () => {
    await expect(() => service.findOne('0')).rejects.toHaveProperty("message", "Club no encontrado");
  });

  it('should create a club', async () => {
    const club: ClubEntity = {
      id: "",
      name: faker.company.name(),
      foundationDate: faker.date.past(),
      image: faker.image.imageUrl(),
      description: faker.lorem.sentence(),
      socios: [],
    };

    const createdClub: ClubEntity = await service.create(club);
    expect(createdClub).not.toBeNull();
    expect(createdClub.name).toEqual(club.name);
    expect(createdClub.foundationDate).toEqual(club.foundationDate);
    expect(createdClub.image).toEqual(club.image);
    expect(createdClub.description).toEqual(club.description);
  });

  it('should fail to create a club with a long description', async () => {
    const club: ClubEntity = {
      id: "",
      name: faker.company.name(),
      foundationDate: faker.date.past(),
      image: faker.image.imageUrl(),
      description: "a".repeat(101),
      socios: [],
    };

    await expect(() => service.create(club)).rejects.toHaveProperty("message", "Descripción muy larga");
  });

  it('should update a club', async () => {
    const storedClub: ClubEntity = clubsList[0];
    const updatedClub: ClubEntity = {
      id: storedClub.id,
      name: faker.company.name(),
      foundationDate: faker.date.past(),
      image: faker.image.imageUrl(),
      description: faker.lorem.sentence(),
      socios: [],
    };

    const club: ClubEntity = await service.update(storedClub.id, updatedClub);
    expect(club).not.toBeNull();
    expect(club.name).toEqual(updatedClub.name);
    expect(club.foundationDate).toEqual(updatedClub.foundationDate);
    expect(club.image).toEqual(updatedClub.image);
    expect(club.description).toEqual(updatedClub.description);
  });

  it('should fail to update a club with a long description', async () => {
    const storedClub: ClubEntity = clubsList[0];
    const updatedClub: ClubEntity = {
      id: storedClub.id,
      name: faker.company.name(),
      foundationDate: faker.date.past(),
      image: faker.image.imageUrl(),
      description: "a".repeat(101),
      socios: [],
    };

    await expect(() => service.update(storedClub.id, updatedClub)).rejects.toHaveProperty("message", "Descripción muy larga");
  });

  it('should fail to update a non-existing club', async () => {
    const updatedClub: ClubEntity = {
      id: "0",
      name: faker.company.name(),
      foundationDate: faker.date.past(),
      image: faker.image.imageUrl(),
      description: faker.lorem.sentence(),
      socios: [],
    };

    await expect(() => service.update("0", updatedClub)).rejects.toHaveProperty("message", "Club no encontrado");
  });

  it('should delete a club', async () => {
    const storedClub: ClubEntity = clubsList[0];
    await service.delete(storedClub.id);

    const club: ClubEntity = await repository.findOne({where: {id: storedClub.id}});
    expect(club).toBeUndefined();
  });

  it('should fail to delete a non-existing club', async () => {
    await expect(() => service.delete("0")).rejects.toHaveProperty("message", "Club no encontrado");
  });

});
