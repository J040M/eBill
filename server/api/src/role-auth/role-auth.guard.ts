import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { SupabaseClient } from '@supabase/supabase-js';
import { PERMISSIONS_KEY } from '../permissions/permissions.decorator';

@Injectable()
export class RoleAuthGuard implements CanActivate {

  public constructor(private reflector: Reflector, private supabaseClient: SupabaseClient) { }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> {
    console.log('Can activate Roles called')
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(PERMISSIONS_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    console.log('Required roles:', requiredPermissions)

    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }

    const token = this.extractTokenFromRequest(context.switchToHttp().getRequest());
    console.log('Extracted token:', token ? 'Token found' : 'No token');
    if (!token) return false;

    return this.validateRolesPermissions(token, requiredPermissions);

  }

  protected async validateRolesPermissions(token: string, requiredPermissions: string[]): Promise<boolean> {
    console.log('Validating roles and permissions for token');
    const authResult = await this.authenticate(token);
    console.log('Auth result:', authResult ? `User ID: ${authResult.user.id}` : 'Authentication failed');
    if (!authResult) return false;

    const userId = authResult.user.id;

    console.log('Querying database for user roles with userId:', userId);
    const { data, error } = await this.supabaseClient
      .from('users_roles')
      .select(`
        fk_role (
          roles_permissions (
            fk_permission (
              permissions
            )
          )
        )
      `)
      .eq('fk_user', userId);

    console.log('Query result:', error ? `Error: ${error.message}` : `Retrieved ${data?.length || 0} user roles`);
    if (error || !data) return false;

    const userPermissions: string[] = [];

    for (const userRole of data) {
      const role = userRole.fk_role;
      console.log('Processing role:', role ? 'Role found' : 'Role not found');
      if (!role) continue;

      for (const rolePermission of (role as any).roles_permissions || []) {
        const permissionName = rolePermission.fk_permission?.permissions;
        console.log('Found permission:', permissionName || 'Permission not found');
        if (permissionName) {
          userPermissions.push(permissionName);
        }
      }
    }

    console.log('User permissions:', userPermissions);
    console.log('Required permissions:', requiredPermissions);
    const hasPermissions = requiredPermissions.every(p => userPermissions.includes(p));
    console.log('Has required permissions:', hasPermissions);
    return hasPermissions;
  }

  private async authenticate(token: string) {
    const { data, error } = await this.supabaseClient.auth.getUser(token);
    if (error) return false;
    return data;
  }

  private extractTokenFromRequest(request: Request): string | undefined {
    const token = request.headers.get('authorization') || undefined;
    return token;
  }
}
