import { SupabaseClient } from '@supabase/supabase-js';
import { SupaAuthGuard } from './supa-auth.guard';

describe('SupaAuthGuardGuard', () => {
  it('should be defined', () => {
    const mockSupabaseClient = {} as SupabaseClient; // Mock or provide a valid instance
    expect(new SupaAuthGuard(mockSupabaseClient)).toBeDefined();
  });
});
