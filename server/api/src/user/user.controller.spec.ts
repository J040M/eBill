import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { SupaAuthGuard } from '../supa-auth/supa-auth.guard';
import { SignInWithOAuthCredentials, User } from '@supabase/supabase-js';

describe('UserController', () => {
  let controller: UserController;

  const mockUserService = {
    listAll: jest.fn(),
    find: jest.fn(),
    update: jest.fn(),
    verifyEmailOtp: jest.fn(),
    create: jest.fn(),
    signInWithOAuth: jest.fn(),
    signInWithPassword: jest.fn(),
    refresh: jest.fn(),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        { provide: UserService, useValue: mockUserService },
      ],
    })
    .overrideGuard(SupaAuthGuard)
    .useValue({ canActivate: () => true })
    .compile();

    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return all users', async () => {
    const result = [{ id: 1, name: 'User1' }];
    jest.spyOn(mockUserService, 'listAll').mockResolvedValue(result);

    expect(await controller.listAll()).toBe(result);
  });

  it('should return a user by uuid', async () => {
    const uuid = '123e4567-e89b-12d3-a456-426614174000';
    const result = { id: 1, name: 'User1' };
    jest.spyOn(mockUserService, 'find').mockResolvedValue(result);

    expect(await controller.find(uuid)).toBe(result);
  });

  it('should update a user', async () => {
    const uuid = '123e4567-e89b-12d3-a456-426614174000';
    const user = { name: 'Updated User' } as unknown as User;
    const result = { id: 1, name: 'Updated User' };
    jest.spyOn(mockUserService, 'update').mockResolvedValue(result);

    expect(await controller.update(uuid, user)).toBe(result);
  });

  it('should verify email with OTP', async () => {
    const email = 'test@example.com';
    const token = '123456';
    const user = { id: 1, email } as unknown as User;
    
    jest.spyOn(mockUserService, 'verifyEmailOtp').mockResolvedValueOnce(user);
    const response = await controller.verifyEmailWithOtp(token, email);
    expect(response).toEqual(user);
  });

  it('should create a user', async () => {
    const signup = { email: 'test@example.com', password: 'password123' };
    const result = { id: 1, email: 'test@example.com' };
    jest.spyOn(mockUserService, 'create').mockResolvedValue(result);

    expect(await controller.createUser(signup)).toBe(result);
  });

  it('should throw BadRequestException if email or password is missing during user creation', async () => {
    const signup = { password: 'password123' }; // Missing email

    await expect(controller.createUser(signup as any)).rejects.toThrow('Email and password are required');
  });

  it('should login with OAuth credentials', async () => {
    const oauth = { provider: 'google', access_token: 'oauth_token' } as SignInWithOAuthCredentials;
    const body = { oauth };
    const result = { id: 1, email: 'test@example.com' };
    jest.spyOn(mockUserService, 'signInWithOAuth').mockResolvedValue(result);

    expect(await controller.login(body)).toBe(result);
  });

  it('should login with email and password', async () => {
    const login = { email: 'test@example.com', password: 'password123' };
    const body = { login };
    const result = { id: 1, email: 'test@example.com' };
    jest.spyOn(mockUserService, 'signInWithPassword').mockResolvedValue(result);

    expect(await controller.login(body)).toBe(result);
  });

  it('should throw an error for invalid login payload', async () => {
    const body = {};

    await expect(controller.login(body as any)).rejects.toThrow('Invalid login payload');
  });

  it('should refresh a token', async () => {
    const refresh = { refresh_token: 'refresh_token' };
    const result = { access_token: 'new_access_token' };
    jest.spyOn(mockUserService, 'refresh').mockResolvedValue(result);

    expect(await controller.refresh(refresh)).toBe(result);
  });
});
