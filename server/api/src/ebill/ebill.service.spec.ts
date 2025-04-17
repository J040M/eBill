import { Test, TestingModule } from '@nestjs/testing';
import { EbillService } from './ebill.service';

describe('EbillService', () => {
  let service: EbillService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EbillService],
    }).compile();

    service = module.get<EbillService>(EbillService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
