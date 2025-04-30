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
    bill_number: 'EB-001',
    issue_date: new Date('2023-01-01'),
    due_date: new Date('2023-02-01'),
    supplier_label: 'Supplier Inc.',
    items: [
      { label: 'Item 1', price_unit: 100, quantity: 2 },
      { label: 'Item 2', price_unit: 50, quantity: 3 },
    ],
    tax: [
      {
        label: "",
        value: 3
      }
    ],
    total: 265,
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

    expect(await controller.getAllEbills()).toBe(result);
  });

  it('should return a single ebill by uuid', async () => {
    const result = { id: 1, name: 'Ebill1' };
    jest.spyOn(mockEbillService, 'findOneById').mockResolvedValue(result);

    expect(await controller.find('1')).toBe(result);
  });

  it('should throw NotFoundException if ebill not found', async () => {
    jest.spyOn(mockEbillService, 'findOneById').mockResolvedValue(undefined);

    await expect(controller.find('1')).rejects.toThrow(NotFoundException);
  });

  it('should update an ebill', async () => {
    const result = { data: mockEbill, error: null };
    jest.spyOn(mockEbillService, 'update').mockResolvedValue(mockEbill);

    expect(await controller.updateEbill(mockEbill)).toBe(result.data);
  });
});
