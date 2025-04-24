import { ExecutionContext, Injectable } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { Request } from 'express';
import { BaseSupabaseAuthGuard } from 'nestjs-supabase-js';

@Injectable()
export class SupaAuthGuard extends BaseSupabaseAuthGuard {
  public constructor(supabaseClient: SupabaseClient) {
    super(supabaseClient);
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromRequest(request);

    if (!token) return false;

    const isAuthenticated = await this.isAuthenticated(token);
    if (isAuthenticated) return true;
    return false;
  }

  protected extractTokenFromRequest(request: Request): string | undefined {
    const authorization = request.headers.authorization
    if (!authorization) return undefined

    const token = authorization.split(' ')[1]
    if (!token) return undefined
    return token
  }
  
  protected async isAuthenticated(token: string): Promise<boolean> {
    const { data, error } = await this.supabaseClient.auth.getUser(token)
    
    if (error || !data?.user) {
      return false
    }
    return true
  }
}
