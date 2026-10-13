import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, email, password } = body;

    const supabase = await createClient();

    if (action === 'login') {
      if (!email || !password) {
        return NextResponse.json(
          { success: false, error: 'Email and password are required' },
          { status: 400 }
        );
      }

      if (!supabase) {
        // Dev bypass if Supabase is unconfigured
        if (email === 'admin@svsjuice.com' && password === 'admin123') {
          return NextResponse.json({
            success: true,
            user: { id: 'dev-owner', email, role: 'owner' },
            message: 'Logged in under local development mode',
          });
        }
        return NextResponse.json(
          {
            success: false,
            error: 'Supabase credentials are not configured in .env.local',
          },
          { status: 500 }
        );
      }

      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError || !authData.user) {
        return NextResponse.json(
          { success: false, error: authError?.message || 'Invalid email or password' },
          { status: 401 }
        );
      }

      // Check role in profiles table
      const adminClient = createAdminClient() || supabase;
      const { data: profile } = await adminClient
        .from('profiles')
        .select('role, full_name')
        .eq('id', authData.user.id)
        .single();

      if (!profile || (profile.role !== 'owner' && profile.role !== 'admin')) {
        await supabase.auth.signOut();
        return NextResponse.json(
          {
            success: false,
            error: 'Unauthorized. You do not have owner or administrator privileges.',
          },
          { status: 403 }
        );
      }

      return NextResponse.json({
        success: true,
        user: {
          id: authData.user.id,
          email: authData.user.email,
          role: profile.role,
          fullName: profile.full_name,
        },
      });
    }

    if (action === 'logout') {
      if (supabase) {
        await supabase.auth.signOut();
      }
      return NextResponse.json({ success: true });
    }

    if (action === 'session') {
      if (!supabase) {
        return NextResponse.json({
          authenticated: false,
          configured: false,
        });
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return NextResponse.json({ authenticated: false });
      }

      const adminClient = createAdminClient() || supabase;
      const { data: profile } = await adminClient
        .from('profiles')
        .select('role, full_name')
        .eq('id', user.id)
        .single();

      const isAuthorized = profile?.role === 'owner' || profile?.role === 'admin';

      return NextResponse.json({
        authenticated: isAuthorized,
        user: isAuthorized
          ? {
              id: user.id,
              email: user.email,
              role: profile?.role,
              fullName: profile?.full_name,
            }
          : null,
      });
    }

    return NextResponse.json(
      { success: false, error: 'Invalid action' },
      { status: 400 }
    );
  } catch (error: any) {
    console.error('Admin auth error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Authentication error' },
      { status: 500 }
    );
  }
}
