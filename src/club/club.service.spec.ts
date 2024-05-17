import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { typeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';

import { ClubService } from './club.service';
import { ClubEntity } from './entity/club.entity';

describe('ClubService', () => {
  let service: ClubService;
  

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ClubService],
    }).compile();

    service = module.get<ClubService>(ClubService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
