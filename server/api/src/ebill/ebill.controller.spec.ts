import { Test, TestingModule } from '@nestjs/testing';
import { EbillController } from './ebill.controller';

describe('EbillController', () => {
  let controller: EbillController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EbillController],
    }).compile();

    controller = module.get<EbillController>(EbillController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
