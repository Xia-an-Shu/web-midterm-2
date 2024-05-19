import { Test, TestingModule } from '@nestjs/testing';
import { PartnerClubService } from './partner-club.service';

describe('PartnerClubService', () => {
  let service: PartnerClubService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PartnerClubService],
    }).compile();

    service = module.get<PartnerClubService>(PartnerClubService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
