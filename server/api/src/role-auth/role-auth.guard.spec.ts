import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RoleAuthGuard } from './role-auth.guard';
import { SupabaseClient } from '@supabase/supabase-js';
import { Request } from 'express';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';

describe('RoleAuthGuard', () => {
  let guard: RoleAuthGuard;
  let mockReflector: Reflector;
  let mockSupabaseClient: Partial<SupabaseClient>;

  const fakeToken = 'fake.jwt.token';

  const mockRequest: Partial<Request> = {
    headers: {
      authorization: `Bearer ${fakeToken}`,
      get: jest.fn().mockReturnValue(`Bearer ${fakeToken}`),
    } as any,
    method: 'GET',
    url: '/some-endpoint',
    body: {},
  };

  const mockHttpArgsHost = {
    getRequest: () => mockRequest as unknown as Request,
    getResponse: () => ({}),
    getNext: () => ({}),
  };

  let mockExecutionContext: ExecutionContext = {
    switchToHttp: () => mockHttpArgsHost as unknown as HttpArgumentsHost,
    getHandler: jest.fn(),
    getClass: jest.fn(),
    getArgs: jest.fn(),
    switchToRpc: jest.fn(),
    switchToWs: jest.fn(),
    getArgByIndex: jest.fn(),
    getType: jest.fn().mockReturnValue('http'),
  };

  const mockUserId = 'user-123';
  const requiredPermissions = ['ebill'];

  beforeEach(() => {
    mockReflector = {
      getAllAndOverride: jest.fn().mockReturnValue(requiredPermissions),
    } as any;

    mockSupabaseClient = {
      auth: {
        getUser: jest.fn().mockResolvedValue({
          data: { user: { id: mockUserId } },
          error: null,
        }),
      },
      from: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockResolvedValue({
        data: [
          {
            fk_role: {
              roles_permissions: [
                {
                  fk_permission: {
                    permissions: 'ebill',
                  },
                },
              ],
            },
          },
        ],
        error: null,
      }),
    } as unknown as Partial<SupabaseClient>;

    guard = new RoleAuthGuard(mockReflector, mockSupabaseClient as SupabaseClient);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('should allow if no permissions are required', async () => {
    (mockReflector.getAllAndOverride as jest.Mock).mockReturnValue([]);
    const result = await guard.canActivate(mockExecutionContext);
    expect(result).toBe(true);
  });

  it('should deny if no token is found', async () => {
    const originalGetter = mockRequest.headers!.get;
    (mockRequest.headers as Record<string, any>).get = jest.fn().mockReturnValue(undefined);
    
    const result = await guard.canActivate(mockExecutionContext);
    expect(result).toBe(false);
  
    (mockRequest.headers as Record<string, any>).get = originalGetter;
  });

  it('should allow if token is found', async () => {
    const result = await guard.canActivate(mockExecutionContext);
    expect(result).toBe(true);
  });

  it('should deny if token auth fails', async () => {
    ((mockSupabaseClient.auth?.getUser as jest.Mock) ?? jest.fn()).mockResolvedValueOnce({
      data: null,
      error: { message: 'Invalid token' },
    });
    const result = await guard.canActivate(mockExecutionContext);
    expect(result).toBe(false);
  });

  it('should deny if user lacks required permissions', async () => {
    (mockSupabaseClient.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockResolvedValueOnce({
          data: [
            {
              fk_role: {
                roles_permissions: [
                  {
                    fk_permission: {
                      permissions: 'other-permission',
                    },
                  },
                ],
              },
            },
          ],
          error: null,
        }),
      }),
    });
    

    const result = await guard.canActivate(mockExecutionContext);
    expect(result).toBe(false);
  });
});
