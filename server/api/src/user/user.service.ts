import { Injectable } from '@nestjs/common';
import { Provider, Session, SignInWithOAuthCredentials, SupabaseClient, User } from '@supabase/supabase-js';

@Injectable()
export class UserService {

    constructor(private readonly supabaseClient: SupabaseClient) { }

    async create(email: string, password: string): Promise<User | null> {
        const { data, error } = await this.supabaseClient
            .auth.signUp({ email, password })
        if (error) throw new Error(error.message)
        return data.user
    }

    async verifyEmailOtp(email: string, token: string): Promise<User | null> {
        const { data, error } = await this.supabaseClient
            .auth.verifyOtp({ email, token, type: 'email' })
        if (error) throw new Error(error.message)
        return data.user
    }

    async signInWithPassword(email: string, password: string): Promise<{user: User, session: Session}> {
        const { data, error } = await this.supabaseClient
            .auth.signInWithPassword({ email, password })
        if (error) throw new Error(error.message)
        return data
    }

    async signInWithOAuth(provider: SignInWithOAuthCredentials): Promise<{provider: Provider, url: string}> {
        const { data, error } = await this.supabaseClient
            .auth.signInWithOAuth(provider)
        if (error) throw new Error(error.message)
        return data
    }

    async refresh(refresh_token: string): Promise<Session | null> {
        const { data, error } = await this.supabaseClient.auth.refreshSession({refresh_token})
        if (error) throw new Error(error.message)
        return data.session
    }

    async signOut(accessToken: string): Promise<void> {
        if (!accessToken) throw new Error('No active session found');
        const { error } = await this.supabaseClient.auth.admin.signOut(accessToken, 'local');
        if (error) throw new Error(error.message)
    }

    async find(id: string): Promise<User> {
        const { data, error } = await this.supabaseClient.auth.admin
            .getUserById(id)

        if (error) throw new Error(error.message)
        return data.user
    }

    async listAll(): Promise<User[]> {
        const { data, error } = await this.supabaseClient.auth.admin
            .listUsers()

        if (error) throw new Error(error.message)
        return data.users
    }

    async update(id: string, user: User): Promise<User> {
        const { data, error } = await this.supabaseClient.auth.admin
            .updateUserById(id, user)

        if (error) throw new Error(error.message)
        return data.user
    }
}
