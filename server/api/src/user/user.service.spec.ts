import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { SignInWithOAuthCredentials, SupabaseClient, User } from '@supabase/supabase-js';

describe('UserService', () => {
  let service: UserService;

  const mockUser = { id: '1', email: 'test@email.com' };
  const mockSession = { access_token: 'token' };

  const mockSupabaseClient = {
    auth: {
      signUp: jest.fn().mockResolvedValue({ data: { user: mockUser }, error: null }),
      verifyOtp: jest.fn().mockResolvedValue({ data: { user: mockUser }, error: null }),
      signInWithPassword: jest.fn().mockResolvedValue({ data: { user: mockUser, session: mockSession }, error: null }),
      signInWithOAuth: jest.fn().mockResolvedValue({ data: { provider: 'google', url: 'http://oauth' }, error: null }),
      refreshSession: jest.fn().mockResolvedValue({ data: { session: mockSession }, error: null }),
      admin: {
        signOut: jest.fn().mockResolvedValue({ error: null }),
        getUserById: jest.fn().mockResolvedValue({ data: { user: mockUser }, error: null }),
        listUsers: jest.fn().mockResolvedValue({ data: { users: [mockUser] }, error: null }),
        updateUserById: jest.fn().mockResolvedValue({ data: { user: mockUser }, error: null }),
      },
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: SupabaseClient, useValue: mockSupabaseClient },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a user', async () => {
    const user = await service.create('my@email.com', 'somefakepassword');
    expect(mockSupabaseClient.auth.signUp).toHaveBeenCalledWith({
      email: 'my@email.com',
      password: 'somefakepassword',
    });
    expect(user).toEqual(mockUser);
  });

  it('should throw an error if create user fails', async () => {
    const email = 'fail@email.com';
    const password = 'badpass';
  
    const mockError = { message: 'User creation failed' };
  
    // Override the default mock just for this test
    mockSupabaseClient.auth.signUp.mockResolvedValueOnce({
      data: null,
      error: mockError,
    });
  
    await expect(service.create(email, password)).rejects.toThrow('User creation failed');
  
    expect(mockSupabaseClient.auth.signUp).toHaveBeenCalledWith({ email, password });
  });

  it('should verify email otp', async () => {
    const email = 'verify@email.com';
    const token = '123456';
  
    const user = await service.verifyEmailOtp(email, token);
  
    expect(mockSupabaseClient.auth.verifyOtp).toHaveBeenCalledWith({
      email,
      token,
      type: 'email',
    });
    expect(user).toEqual({ id: '1', email: 'test@email.com' });
  });

  it('should throw an error if verifyEmailOtp fails', async () => {
    const email = 'fail@email.com';
    const token = 'wrong-token';
  
    const mockError = { message: 'OTP verification failed' };
  
    mockSupabaseClient.auth.verifyOtp.mockResolvedValueOnce({
      data: null,
      error: mockError,
    });
  
    await expect(service.verifyEmailOtp(email, token)).rejects.toThrow('OTP verification failed');
  
    expect(mockSupabaseClient.auth.verifyOtp).toHaveBeenCalledWith({
      email,
      token,
      type: 'email',
    });
  });

  it('should sign in with password', async () => {
    const email = 'user@email.com';
    const password = 'securepassword';
  
    const result = await service.signInWithPassword(email, password);
  
    expect(mockSupabaseClient.auth.signInWithPassword).toHaveBeenCalledWith({
      email,
      password,
    });
    expect(result).toEqual({
      user: { id: '1', email: 'test@email.com' },
      session: { access_token: 'token' },
    });
  });

  it('should throw an error if signInWithPassword fails', async () => {
    const email = 'wrong@email.com';
    const password = 'invalidpassword';
  
    const mockError = { message: 'Invalid login credentials' };
  
    // Override the default mock for this test
    mockSupabaseClient.auth.signInWithPassword.mockResolvedValueOnce({
      data: null,
      error: mockError,
    });
  
    await expect(service.signInWithPassword(email, password)).rejects.toThrow('Invalid login credentials');
  
    expect(mockSupabaseClient.auth.signInWithPassword).toHaveBeenCalledWith({ email, password });
  });

  it('should sign in with OAuth', async () => {
    const oauthCredentials = {
      provider: 'google',
      options: {
        redirectTo: 'http://localhost/callback',
      },
    } as SignInWithOAuthCredentials;
  
    const result = await service.signInWithOAuth(oauthCredentials);
  
    expect(mockSupabaseClient.auth.signInWithOAuth).toHaveBeenCalledWith(oauthCredentials);
    expect(result).toEqual({
      provider: 'google',
      url: 'http://oauth',
    });
  });

  it('should throw an error if signInWithOAuth fails', async () => {
    const oauthCredentials = {
      provider: 'google',
      options: { redirectTo: 'http://localhost/callback' },
    } as SignInWithOAuthCredentials;
  
    const mockError = { message: 'OAuth sign-in failed' };
  
    // Override the mock to simulate an error response
    mockSupabaseClient.auth.signInWithOAuth.mockResolvedValueOnce({
      data: null,
      error: mockError,
    });
  
    await expect(service.signInWithOAuth(oauthCredentials)).rejects.toThrow('OAuth sign-in failed');
  
    expect(mockSupabaseClient.auth.signInWithOAuth).toHaveBeenCalledWith(oauthCredentials);
  });

  it('should sign out a user', async () => {
    const accessToken = 'someAccessToken';
  
    await service.signOut(accessToken);
  
    expect(mockSupabaseClient.auth.admin.signOut).toHaveBeenCalledWith(accessToken, 'local');
  });

  it('should throw an error if signOut fails', async () => {
    const accessToken = 'someAccessToken';
    const mockError = { message: 'Sign out failed' };
  
    mockSupabaseClient.auth.admin.signOut.mockResolvedValueOnce({
      error: mockError,
    });
  
    await expect(service.signOut(accessToken)).rejects.toThrow('Sign out failed');
  
    expect(mockSupabaseClient.auth.admin.signOut).toHaveBeenCalledWith(accessToken, 'local');
  });
  
  it('should find a user by ID', async () => {
    const userId = '1';
  
    const user = await service.find(userId);
  
    expect(mockSupabaseClient.auth.admin.getUserById).toHaveBeenCalledWith(userId);
    expect(user).toEqual({ id: '1', email: 'test@email.com' });
  });

  it('should throw an error if find fails', async () => {
    const userId = '1';
    const mockError = { message: 'User not found' };
  
    mockSupabaseClient.auth.admin.getUserById.mockResolvedValueOnce({
      data: null,
      error: mockError,
    });
  
    await expect(service.find(userId)).rejects.toThrow('User not found');
  
    expect(mockSupabaseClient.auth.admin.getUserById).toHaveBeenCalledWith(userId);
  });

  it('should list all users', async () => {
    const users = await service.listAll();
  
    expect(mockSupabaseClient.auth.admin.listUsers).toHaveBeenCalled();
    expect(users).toEqual([{ id: '1', email: 'test@email.com' }]);
  });

  it('should throw an error if listAll fails', async () => {
    const mockError = { message: 'Failed to list users' };
  
    // Override the mock for this test
    mockSupabaseClient.auth.admin.listUsers.mockResolvedValueOnce({
      data: null,
      error: mockError,
    });
  
    await expect(service.listAll()).rejects.toThrow('Failed to list users');
  
    expect(mockSupabaseClient.auth.admin.listUsers).toHaveBeenCalled();
  });

  it('should update a user by ID', async () => {
    const userId = '1';
    const updatedUser = { id: '1', email: 'updated@email.com' };
  
    mockSupabaseClient.auth.admin.updateUserById.mockResolvedValueOnce({
      data: { user: updatedUser },
      error: null,
    });
  
    const result = await service.update(userId, updatedUser as User);
  
    expect(mockSupabaseClient.auth.admin.updateUserById).toHaveBeenCalledWith(userId, updatedUser);
    expect(result).toEqual(updatedUser);
  });

  it('should throw an error if update fails', async () => {
    const userId = '1';
    const updatedUser = { id: '1', email: 'updated@email.com' } as User;
    const mockError = { message: 'User update failed' };
  
    // Override the mock for this test
    mockSupabaseClient.auth.admin.updateUserById.mockResolvedValueOnce({
      data: null,
      error: mockError,
    });
  
    await expect(service.update(userId, updatedUser)).rejects.toThrow('User update failed');
  
    expect(mockSupabaseClient.auth.admin.updateUserById).toHaveBeenCalledWith(userId, updatedUser);
  });
});