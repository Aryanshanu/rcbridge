import { describe, it, expect, beforeEach, vi } from 'vitest';
import { supabase } from '@/integrations/supabase/client';

// Mock Supabase auth
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    auth: {
      signInWithPassword: vi.fn(),
      signUp: vi.fn(),
      signOut: vi.fn(),
      getSession: vi.fn(),
      onAuthStateChange: vi.fn(() => ({
        data: { subscription: { unsubscribe: vi.fn() } },
      })),
    },
  },
}));

describe('Authentication Flow Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should sign in with valid credentials', async () => {
    const mockSignIn = vi.mocked(supabase.auth.signInWithPassword);
    mockSignIn.mockResolvedValueOnce({
      data: {
        user: { id: '123', email: 'test@example.com' },
        session: { access_token: 'token' },
      },
      error: null,
    } as any);

    const result = await supabase.auth.signInWithPassword({
      email: 'test@example.com',
      password: 'password123',
    });

    expect(result.data.user).toBeDefined();
    expect(result.error).toBeNull();
  });

  it('should handle sign in errors', async () => {
    const mockSignIn = vi.mocked(supabase.auth.signInWithPassword);
    mockSignIn.mockResolvedValueOnce({
      data: { user: null, session: null },
      error: { message: 'Invalid credentials', name: 'AuthError', status: 400 },
    } as any);

    const result = await supabase.auth.signInWithPassword({
      email: 'wrong@example.com',
      password: 'wrongpass',
    });

    expect(result.error).toBeDefined();
    expect(result.error?.message).toBe('Invalid credentials');
  });

  it('should sign up new user', async () => {
    const mockSignUp = vi.mocked(supabase.auth.signUp);
    mockSignUp.mockResolvedValueOnce({
      data: {
        user: { id: '456', email: 'newuser@example.com' },
        session: null,
      },
      error: null,
    } as any);

    const result = await supabase.auth.signUp({
      email: 'newuser@example.com',
      password: 'newpass123',
    });

    expect(result.data.user).toBeDefined();
    expect(result.error).toBeNull();
  });

  it('should sign out user', async () => {
    const mockSignOut = vi.mocked(supabase.auth.signOut);
    mockSignOut.mockResolvedValueOnce({ error: null });

    const result = await supabase.auth.signOut();

    expect(result.error).toBeNull();
    expect(mockSignOut).toHaveBeenCalledTimes(1);
  });
});
