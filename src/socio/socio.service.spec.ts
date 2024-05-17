import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { typeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';

import { faker } from '@faker-js/faker';

import { SocioService } from './socio.service';
import { SocioEntity } from './entity/socio.entity';

describe('SocioService', () => {
  let service: SocioService;
  let repository: Repository<SocioEntity>;
  let sociosList: SocioEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...typeOrmTestingConfig()],
      providers: [SocioService],
    }).compile();

    service = module.get<SocioService>(SocioService);
    repository = module.get<Repository<SocioEntity>>(getRepositoryToken(SocioEntity));

    await seedData();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  const seedData =  async () => {
    repository.clear();
    sociosList = [];
    for (let i = 0; i < 5; i++) {
      const socio: SocioEntity = await repository.save({
        username: faker.internet.userName(),
        email: faker.internet.email(),
        birthdate: faker.date.past(),
      });
      sociosList.push(socio);
    }
  }

  it('should return all socios', async () => {
    const socios = await service.findAll();
    expect(socios).not.toBeNull();
    expect(socios).toHaveLength(sociosList.length);
  });

  it('should return one socio', async () => {
    const storedSocio: SocioEntity = sociosList[0];
    const socio: SocioEntity = await service.findOne(storedSocio.id);

    expect(socio).not.toBeNull();
    expect(socio.username).toEqual(storedSocio.username);
    expect(socio.email).toEqual(storedSocio.email);
    expect(socio.birthdate).toEqual(storedSocio.birthdate);
  });

  it('should fail to get a non-existing socio', async () => {
    await expect(() => service.findOne('0')).rejects.toHaveProperty("message", "Socio no encontrado");
  });

  it('should create a new socio', async () => {
    const newSocio = {
      id: "",
      username: faker.internet.userName(),
      email: faker.internet.email(),
      birthdate: faker.date.past(),
      clubs: []
    };

    const createdSocio = await service.create(newSocio);
    expect(createdSocio).not.toBeNull();

    const storedSocio = await repository.findOne({where: {id: createdSocio.id}});
    expect(storedSocio).not.toBeNull();

    expect(storedSocio.username).toEqual(newSocio.username);
    expect(storedSocio.email).toEqual(newSocio.email);
    expect(storedSocio.birthdate).toEqual(newSocio.birthdate);
  });

  it('should fail to create a new socio with invalid email', async () => {
    const newSocio = {
      id: "",
      username: faker.internet.userName(),
      email: "invalid-email",
      birthdate: faker.date.past(),
      clubs: []
    };

    await expect(() => service.create(newSocio)).rejects.toHaveProperty("message", "Correo electrónico inválido");
  });

  it('should update a socio', async () => {
    const storedSocio: SocioEntity = sociosList[0];
    const updatedSocio = {
      id: storedSocio.id,
      username: faker.internet.userName(),
      email: faker.internet.email(),
      birthdate: faker.date.past(),
      clubs: []
    };

    const socio = await service.update(storedSocio.id, updatedSocio);
    expect(socio).not.toBeNull();
    expect(socio.username).toEqual(updatedSocio.username);
    expect(socio.email).toEqual(updatedSocio.email);
    expect(socio.birthdate).toEqual(updatedSocio.birthdate);
  });

  it('should fail to update a non-existing socio', async () => {
    const updatedSocio = {
      id: "0",
      username: faker.internet.userName(),
      email: faker.internet.email(),
      birthdate: faker.date.past(),
      clubs: []
    };

    await expect(() => service.update("0", updatedSocio)).rejects.toHaveProperty("message", "Socio no encontrado");
  });

  it('should fail to update a socio with invalid email', async () => {
    const storedSocio: SocioEntity = sociosList[0];
    const updatedSocio = {
      id: storedSocio.id,
      username: faker.internet.userName(),
      email: "invalid-email",
      birthdate: faker.date.past(),
      clubs: []
    };

    await expect(() => service.update(storedSocio.id, updatedSocio)).rejects.toHaveProperty("message", "Correo electrónico inválido");
  });

  it('should delete a socio', async () => {
    const storedSocio: SocioEntity = sociosList[0];
    await service.delete(storedSocio.id);

    const socio = await repository.findOne({where: {id: storedSocio.id}});
    expect(socio).toBeUndefined();
  });

  it('should fail to delete a non-existing socio', async () => {
    await expect(() => service.delete("0")).rejects.toHaveProperty("message", "Socio no encontrado");
  });

});
