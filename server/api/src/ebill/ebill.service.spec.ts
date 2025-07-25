import { Test, TestingModule } from '@nestjs/testing';
import { EbillService } from './ebill.service';
import { SupabaseClient } from '@supabase/supabase-js';

describe('EbillService', () => {
  let service: EbillService;
  let mockSupabaseClient: any;

  const terminalResult = { data: [{ id: 1 }], error: null };
  const singleResult = { data: { id: 1 }, error: null };
  const ebillResultEx = {
    data: [
      {
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
      },
    ],
    error: null,
  };

  const createQueryBuilder = () => {
    const builder: any = {};

    builder.insert = jest.fn(() => builder);
    builder.update = jest.fn(() => builder);
    builder.select = jest.fn(() => builder);
    builder.eq = jest.fn(() => builder);
    builder.ilike = jest.fn(() => builder);
    builder.single = jest.fn(() => Promise.resolve(singleResult));

    builder.select.mockImplementation(() => builder);
    builder.eq.mockImplementation(() => builder);
    builder.ilike.mockImplementation(() => Promise.resolve(terminalResult));
    builder.insert.mockImplementation(() => ({
      select: () => Promise.resolve(terminalResult),
    }));
    builder.update.mockImplementation(() => ({
      eq: () => ({
        select: () => Promise.resolve(ebillResultEx),
      }),
    }));

    return builder;
  };

  beforeEach(async () => {
    mockSupabaseClient = {
      from: jest.fn(() => createQueryBuilder()),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EbillService,
        { provide: SupabaseClient, useValue: mockSupabaseClient },
      ],
    }).compile();

    service = module.get<EbillService>(EbillService);
  });

  it('should create an ebill', async () => {
    const result = await service.create(ebillResultEx.data[0]);
    expect(result).toEqual([{ id: 1 }]);
  });

  it('should find one ebill by uuid', async () => {
    const result = await service.findOneById('uuid123');
    expect(result).toEqual({ id: 1 });
  });

  it('should find all ebills', async () => {
    const builder = createQueryBuilder();
    builder.select = jest.fn(() => Promise.resolve(terminalResult));
    mockSupabaseClient.from = jest.fn(() => builder);

    const result = await service.findAll();
    expect(result).toEqual([{id:1}]);
  });

  it('should update an ebill', async () => {
    const result = await service.update(ebillResultEx.data[0]);
    expect(result).toEqual(ebillResultEx.data);
  });

  it('should archive an ebill', async () => {
    const archiveBuilder = {
      update: jest.fn(() => ({
        eq: jest.fn(() => Promise.resolve({ data: null, error: null })),
      })),
    };
    mockSupabaseClient.from = jest.fn(() => archiveBuilder);
    await expect(service.archiveEbill('uuid123')).resolves.toBeUndefined();
  });

  it('should search by number', async () => {
    const result = await service.searchByNumber('123');
    expect(result).toEqual([{ id: 1 }]);
  });

  it('should search by date', async () => {
    const terminalResult = { data: [{ id: 1 }], error: null };

    const builder: any = {
      from: () => builder,
      select: () => builder,
      eq: () => Promise.resolve(terminalResult),
    };

    mockSupabaseClient.from = jest.fn(() => builder);

    const result = await service.searchByDate(new Date());
    expect(result).toEqual([{ id: 1 }]);
  });

  it('should throw on Supabase error', async () => {
    mockSupabaseClient.from = jest.fn(() => ({
      select: jest.fn(() => Promise.resolve({ data: null, error: { message: 'Supabase error' } })),
    }));
    await expect(service.findAll()).rejects.toThrow('Supabase error');
  });
});
