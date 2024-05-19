import { Test, TestingModule } from '@nestjs/testing';

import { Club } from './club.entity';
import { ClubService } from './club.service';

import { faker } from '@faker-js/faker';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { typeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';

describe('ClubService', () => {
  let service: ClubService;
  let repository: Repository<Club>;
  let data: Club[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...typeOrmTestingConfig()],
      providers: [ClubService],
    }).compile();

    service = module.get<ClubService>(ClubService);
    repository = module.get<Repository<Club>>(getRepositoryToken(Club));

    await seedData();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  const seedData = async () => {
    repository.clear();
    data = [];
    for (let i = 0; i < 5; i++) {
      const club: Club = await repository.save({
        name: faker.company.name(),
        foundationDate: faker.date.past(),
        image: faker.image.url(),
        description: faker.lorem.sentence(),
      });
      data.push(club);
    }
  }

  it('should return all clubs', async () => {
    const clubs = await service.findAll();
    expect(clubs).not.toBeNull();
    expect(clubs).toHaveLength(data.length);
  });

  it('should return one club', async () => {
    const storedClub: Club = data[0];
    const club: Club = await service.findOne(storedClub.id);

    expect(club).not.toBeNull();
    expect(club.name).toEqual(storedClub.name);
    expect(club.foundationDate).toEqual(storedClub.foundationDate);
    expect(club.image).toEqual(storedClub.image);
    expect(club.description).toEqual(storedClub.description);
  });

  it("should fail to get a non-existing club", async () => {
    await expect(service.findOne("non-existing-id")).rejects.toHaveProperty("message", "Club not found");
  });

  it("should create a new club", async () => {
    const newClub: Club = {
      id: "",
      name: faker.company.name(),
      foundationDate: faker.date.past(),
      image: faker.image.url(),
      description: faker.lorem.sentence(),
      partners: [],
    };

    const createdClub: Club = await service.create(newClub);
    expect(createdClub).not.toBeNull();
    expect(createdClub.name).toEqual(newClub.name);
    expect(createdClub.foundationDate).toEqual(newClub.foundationDate);
    expect(createdClub.image).toEqual(newClub.image);
    expect(createdClub.description).toEqual(newClub.description);
  });

  it("should fail to create a club with a long description", async () => {
    const newClub: Club = {
      id: "",
      name: faker.company.name(),
      foundationDate: faker.date.past(),
      image: faker.image.url(),
      description:  "a".repeat(1000),
      partners: [],
    };

    await expect(service.create(newClub)).rejects.toHaveProperty("message", "Long description");
  });

  it("should update a club", async () => {
    const storedClub: Club = data[0];
    const updatedClub: Club = {
      ...storedClub,
      description: faker.lorem.sentence(),
    };

    const club = await service.update(storedClub.id, updatedClub);
    expect(club).not.toBeNull();
    expect(club.id).toEqual(storedClub.id);
    expect(club.name).toEqual(storedClub.name);
    expect(club.foundationDate).toEqual(storedClub.foundationDate);
    expect(club.image).toEqual(storedClub.image);
    expect(club.description).toEqual(updatedClub.description);
  });

  it("should fail to update a club with a long description", async () => {
    const storedClub: Club = data[0];
    const updatedClub: Club = {
      ...storedClub,
      description: "a".repeat(1000),
    };

    await expect(service.update(storedClub.id, updatedClub)).rejects.toHaveProperty("message", "Long description");
  });

  it("should fail to update a non-existing club", async () => {
    const updatedClub: Club = {
      id: "non-existing-id",
      name: faker.company.name(),
      foundationDate: faker.date.past(),
      image: faker.image.url(),
      description: faker.lorem.sentence(),
      partners: [],
    };

    await expect(service.update("non-existing-id", updatedClub)).rejects.toHaveProperty("message", "Club not found");
  });

  it("should delete a club", async () => {
    const storedClub: Club = data[0];
    await service.delete(storedClub.id);
    const clubs = await service.findAll();
    expect(clubs).toHaveLength(data.length - 1);
  });

  it("should fail to delete a non-existing club", async () => {
    await expect(service.delete("non-existing-id")).rejects.toHaveProperty("message", "Club not found");
  });

});
