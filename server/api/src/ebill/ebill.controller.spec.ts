import { Test, TestingModule } from '@nestjs/testing';
import { EbillController } from './ebill.controller';
import { EbillService } from './ebill.service';
import { StorageService } from '../storage/storage.service';
import { SupaAuthGuard } from '../supa-auth/supa-auth.guard';
import { NotFoundException } from '@nestjs/common';

describe('EbillController tests', () => {
  let controller: EbillController;

  const mockEbillService = { findAll: jest.fn(), findOneById: jest.fn(), update: jest.fn() };
  const mockStorageService = { uploadFile: jest.fn() };

  const mockEbill = {
    uuid: '123e7777-e89b-12d3-a456-426614174000',
    contents: {
      name: 'John Doe',
      address: '123 Main St',
      city: 'Anytown',
      state: 'CA',
      zip: '12345',
    },
    eb_number: 'EB-001',
    eb_date: new Date('2023-01-01'),
    eb_due_date: new Date('2023-02-01'),
    eb_supplier: 'Supplier Inc.',
    eb_items: [
      { item_name: 'Item 1', item_price: 100, item_quantity: 2 },
      { item_name: 'Item 2', item_price: 50, item_quantity: 1 },
    ],
    eb_taxes: 15,
    eb_total: 265,
    created_at: new Date(),
    modified_at: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EbillController],
      providers: [
        { provide: EbillService, useValue: mockEbillService },
        { provide: StorageService, useValue: mockStorageService },
      ],
    })
      .overrideGuard(SupaAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get(EbillController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return all ebills', async () => {
    const result = [{ id: 1, name: 'Ebill1' }];
    jest.spyOn(mockEbillService, 'findAll').mockResolvedValue(result);

    expect(await controller.getAllEbill()).toBe(result);
  });

  it('should return a single ebill by uuid', async () => {
    const result = { id: 1, name: 'Ebill1' };
    jest.spyOn(mockEbillService, 'findOneById').mockResolvedValue(result);

    expect(await controller.getEbill('1')).toBe(result);
  });

  it('should throw NotFoundException if ebill not found', async () => {
    jest.spyOn(mockEbillService, 'findOneById').mockResolvedValue(undefined);

    await expect(controller.getEbill('1')).rejects.toThrow(NotFoundException);
  });

  it('should update an ebill', async () => {
    const result = { data: mockEbill, error: null };
    jest.spyOn(mockEbillService, 'update').mockResolvedValue(mockEbill);

    expect(await controller.updateEbill(mockEbill)).toBe(result.data);
  });
});
