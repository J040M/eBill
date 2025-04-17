import { ExecutionContext, Injectable } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { BaseSupabaseAuthGuard } from 'nestjs-supabase-js';

@Injectable()
export class SupaAuthGuard extends BaseSupabaseAuthGuard {
  public constructor(supabaseClient: SupabaseClient) {
    super(supabaseClient);
  }

  protected extractTokenFromRequest(request: any): string | undefined {
    const authorization = request.headers.authorization
    if (!authorization) return undefined

    const token = authorization.split(' ')[1]
    if (!token) return undefined
    return token
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromRequest(request);

    if (!token) return false;

    const isAuthenticated = await this.isAuthenticated(token);
    if (isAuthenticated) return true;
    return false;
  }

  protected async isAuthenticated(token: string): Promise<any> {
    const { error } = await this.supabaseClient.auth.getUser(token)
    
    if (error) return false
    return true
  }
}
