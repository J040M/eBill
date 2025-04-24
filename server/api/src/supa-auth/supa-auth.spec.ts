import { SupabaseClient } from '@supabase/supabase-js';
import { SupaAuthGuard } from './supa-auth.guard';
import { ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

describe('SupaAuthGuard', () => {
  let mockSupabaseClient: Partial<SupabaseClient>;
  let guard: SupaAuthGuard;

  const mockToken = 'mockToken';

  const createMockExecutionContext = (authHeader?: string): ExecutionContext => ({
    switchToHttp: () => ({
      getRequest: () => {
        const headers = authHeader !== undefined
          ? { authorization: authHeader }
          : {};
  
        return {
          headers,
        } as Partial<Request>;
      },
    }),
    getHandler: jest.fn(),
    getClass: jest.fn(),
    getArgs: jest.fn(),
    getArgByIndex: jest.fn(),
    getType: jest.fn().mockReturnValue('http'),
    switchToRpc: jest.fn(),
    switchToWs: jest.fn(),
  }) as unknown as ExecutionContext;
  

  const mockUserId = 'user-123';
  
  beforeEach(() => {
    mockSupabaseClient = {
      auth: {
        getUser: jest.fn().mockResolvedValue({
          data: { user: { id: mockUserId } },
          error: null,
        }),
      },
    } as unknown as SupabaseClient

    guard = new SupaAuthGuard(mockSupabaseClient as SupabaseClient);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });
});
