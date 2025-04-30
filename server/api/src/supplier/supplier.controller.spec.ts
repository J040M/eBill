import { Test, TestingModule } from '@nestjs/testing';
import { SupplierController } from './supplier.controller';
import { SupplierService } from './supplier.service';
import { SupaAuthGuard } from '../supa-auth/supa-auth.guard';
import { Supplier } from 'src/types';

describe('SupplierController', () => {
  let controller: SupplierController;

  const mockSupplierService = { 
    find: jest.fn(),
    findAll: jest.fn(),
    update: jest.fn(),
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SupplierController],
      providers: [
        { provide: SupplierService, useValue: mockSupplierService },
      ],
    })
      .overrideGuard(SupaAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<SupplierController>(SupplierController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return all suppliers', async () => {
    const result = [{ id: 1, name: 'Supplier1' }];
    jest.spyOn(mockSupplierService, 'findAll').mockResolvedValue(result);

    expect(await controller.findAll()).toBe(result);
  });

  it('should return a supplier by uuid', async () => {
    const uuid = '123e4567-e89b-12d3-a456-426614174000';
    const result = { id: 1, name: 'Supplier1' };
    jest.spyOn(mockSupplierService, 'find').mockResolvedValue(result);

    expect(await controller.find(uuid)).toBe(result);
  });

  it('should create a supplier', async () => {
    const supplier = { name: 'New Supplier' } as Supplier;
    const result = { id: 1, name: 'New Supplier' };
    jest.spyOn(mockSupplierService, 'create').mockResolvedValue(result);

    expect(await controller.create(supplier)).toBe(result);
  });

  it('should update a supplier', async () => {
    const uuid = '123e4567-e89b-12d3-a456-426614174000';
    const supplier = { name: 'Updated Supplier' } as Supplier;
    const result = { id: 1, name: 'Updated Supplier' };
    jest.spyOn(mockSupplierService, 'update').mockResolvedValue(result);

    expect(await controller.update(uuid, supplier)).toBe(result);
  });
});