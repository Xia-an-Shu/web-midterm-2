import { Test, TestingModule } from '@nestjs/testing';

import { Partner } from './partner.entity';
import { PartnerService } from './partner.service';

import { faker } from '@faker-js/faker';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { typeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';

describe('PartnerService', () => {
  let service: PartnerService;
  let repository: Repository<Partner>;
  let data: Partner[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...typeOrmTestingConfig()],
      providers: [PartnerService],
    }).compile();

    service = module.get<PartnerService>(PartnerService);
    repository = module.get<Repository<Partner>>(getRepositoryToken(Partner));

    await seedData();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  const seedData = async () => {
    repository.clear();
    data = [];
    for (let i = 0; i < 5; i++) {
      const partner: Partner = await repository.save({
        name: faker.person.firstName(),
        email: faker.internet.email(),
        birthdate: faker.date.past(),
      });
      data.push(partner);
    }
  }

  it('should return all partners', async () => {
    const partners = await service.findAll();
    expect(partners).not.toBeNull();
    expect(partners).toHaveLength(data.length);
  });

  it('should return one partner', async () => {
    const storedPartner: Partner = data[0];
    const partner: Partner = await service.findOne(storedPartner.id);

    expect(partner).not.toBeNull();
    expect(partner.name).toEqual(storedPartner.name);
    expect(partner.email).toEqual(storedPartner.email);
    expect(partner.birthdate).toEqual(storedPartner.birthdate);
  });

  it("should fail to get a non-existing partner", async () => {
    await expect(service.findOne('non-existing-id')).rejects.toHaveProperty("message", "Partner not found");
  });

  it('should create a partner', async () => {
    const partner: Partner = {
      id: "",
      name: faker.person.firstName(),
      email: faker.internet.email(),
      birthdate: faker.date.past(),
      clubs: [],
    };

    const createdPartner: Partner = await service.create(partner);

    expect(createdPartner).not.toBeNull();
    expect(createdPartner.name).toEqual(partner.name);
    expect(createdPartner.email).toEqual(partner.email);
    expect(createdPartner.birthdate).toEqual(partner.birthdate);
  });

  it("should fail to create a partner with an invalid email", async () => {
    const partner: Partner = {
      id: "",
      name: faker.person.firstName(),
      email: "invalid-email",
      birthdate: faker.date.past(),
      clubs: [],
    };

    await expect(service.create(partner)).rejects.toHaveProperty("message", "Invalid email");
  });

  it("should update a partner", async () => {
    const storedPartner: Partner = data[0];
    const updatedPartner: Partner = {
      id: storedPartner.id,
      name: faker.person.firstName(),
      email: faker.internet.email(),
      birthdate: faker.date.past(),
      clubs: [],
    };

    const partner: Partner = await service.update(storedPartner.id, updatedPartner);

    expect(partner).not.toBeNull();
    expect(partner.name).toEqual(updatedPartner.name);
    expect(partner.email).toEqual(updatedPartner.email);
    expect(partner.birthdate).toEqual(updatedPartner.birthdate);
  });

  it("should fail to update a non-existing partner", async () => {
    await expect(service.update('non-existing-id', {} as Partner)).rejects.toHaveProperty("message", "Partner not found");
  });

  it("should fail to update a partner with an invalid email", async () => {
    const storedPartner: Partner = data[0];
    const updatedPartner: Partner = {
      id: storedPartner.id,
      name: faker.person.firstName(),
      email: "invalid-email",
      birthdate: faker.date.past(),
      clubs: [],
    };

    await expect(service.update(storedPartner.id, updatedPartner)).rejects.toHaveProperty("message", "Invalid email");
  });

  it('should delete a partner', async () => {
    const storedPartner: Partner = data[0];
    await service.delete(storedPartner.id);
    const partners = await service.findAll();

    expect(partners).toHaveLength(data.length - 1);
    
    const foundPartner = await repository.findOne({where: {id: storedPartner.id}});
    expect(foundPartner).toBeNull();
  });

  it("should fail to delete a non-existing partner", async () => {
    await expect(service.delete('non-existing-id')).rejects.toHaveProperty("message", "Partner not found");
  });

});
