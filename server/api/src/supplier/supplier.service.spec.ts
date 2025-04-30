import { Test, TestingModule } from '@nestjs/testing';
import { SupplierService } from './supplier.service';
import { SupabaseClient } from '@supabase/supabase-js';

describe('SupplierService', () => {
  let service: SupplierService;
  let mockSupabaseClient: any;

  const terminalResult = { data: [{ id: 1 }], error: null };
  const singleResult = { data: { id: 1 }, error: null };

  const createQueryBuilder = () => {
    const builder: any = {};

    builder.insert = jest.fn(() => builder);
    builder.update = jest.fn(() => builder);
    builder.select = jest.fn(() => builder);
    builder.eq = jest.fn(() => builder);
    builder.ilike = jest.fn(() => builder);
    builder.single = jest.fn(() => Promise.resolve(singleResult));

    builder.then = jest.fn((resolve) => resolve(terminalResult));

    builder.insert.mockImplementation(() => ({
      select: () => Promise.resolve(terminalResult),
    }));

    builder.update.mockImplementation(() => ({
      eq: () => ({
        select: () => Promise.resolve(terminalResult),
      }),
    }));

    builder.ilike.mockImplementation(() =>
      Promise.resolve(terminalResult)
    );

    return builder;
  };

  beforeEach(async () => {
    mockSupabaseClient = {
      from: jest.fn(() => createQueryBuilder()),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SupplierService,
        { provide: SupabaseClient, useValue: mockSupabaseClient },
      ],
    }).compile();

    service = module.get<SupplierService>(SupplierService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a supplier', async () => {
    const supplier = { name: 'Test Supplier' };
    const result = await service.create(supplier as any);
    expect(mockSupabaseClient.from).toHaveBeenCalledWith('suppliers');
    expect(result).toEqual(terminalResult.data);
  });

  it('should find a supplier by ID', async () => {
    const uuid = '1234';
    const result = await service.find(uuid);
    expect(mockSupabaseClient.from).toHaveBeenCalledWith('suppliers');
    expect(result).toEqual(singleResult.data);
  });

  it('should find all suppliers', async () => {
    const result = await service.findAll();
    expect(mockSupabaseClient.from).toHaveBeenCalledWith('suppliers');
    expect(result).toEqual(terminalResult.data);
  });

  it('should update a supplier', async () => {
    const uuid = '1234';
    const supplier = { name: 'Updated Supplier' };
    const result = await service.update(uuid, supplier as any);
    expect(mockSupabaseClient.from).toHaveBeenCalledWith('suppliers');
    expect(result).toEqual(terminalResult.data);
  });

  it('should archive a supplier', async () => {
    const uuid = '1234';
    await service.archiveSupplier(uuid);
    expect(mockSupabaseClient.from).toHaveBeenCalledWith('suppliers');
  });
});
