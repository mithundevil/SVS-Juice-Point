import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';

export interface OwnerSession {
  user: {
    id: string;
    email?: string;
  };
  profile: {
    role: string;
    fullName?: string;
  };
}

/**
 * Verifies if the incoming request has an authenticated session with 'owner' or 'admin' role.
 * Throws or returns null if unauthenticated or unauthorized.
 */
export async function verifyOwnerSession(): Promise<OwnerSession | null> {
  const supabase = await createClient();
  if (!supabase) {
    // If Supabase is not configured yet, check if in dev mode bypass
    return null;
  }

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return null;
  }

  // Use admin client to reliably check profiles table without RLS recursion
  const adminClient = createAdminClient();
  const db = adminClient || supabase;

  const { data: profile, error: profileError } = await db
    .from('profiles')
    .select('role, full_name')
    .eq('id', user.id)
    .single();

  if (profileError || !profile) {
    return null;
  }

  if (profile.role !== 'owner' && profile.role !== 'admin') {
    return null;
  }

  return {
    user: {
      id: user.id,
      email: user.email,
    },
    profile: {
      role: profile.role,
      fullName: profile.full_name,
    },
  };
}
