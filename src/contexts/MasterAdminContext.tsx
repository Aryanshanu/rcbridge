import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface MasterAdminContextType {
  isAuthenticated: boolean;
  username: string | null;
  sessionToken: string | null;
  login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isLoading: boolean;
}

const MasterAdminContext = createContext<MasterAdminContextType | undefined>(undefined);

export function MasterAdminProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session on mount
    const token = localStorage.getItem('master_admin_token');
    const storedUsername = localStorage.getItem('master_admin_username');
    
    if (token && storedUsername) {
      validateSession(token, storedUsername);
    } else {
      setIsLoading(false);
    }
  }, []);

  const validateSession = async (token: string, user: string) => {
    try {
      const { data, error } = await supabase.rpc('validate_master_admin_session', {
        session_token: token
      });

      const result = data as { valid: boolean } | null;

      if (error || !result?.valid) {
        logout();
      } else {
        setSessionToken(token);
        setUsername(user);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Session validation error:', error);
      logout();
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (username: string, password: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('master-admin-auth', {
        body: { username, password }
      });

      if (error || !data?.success) {
        return { success: false, error: data?.error || 'Login failed' };
      }

      localStorage.setItem('master_admin_token', data.sessionToken);
      localStorage.setItem('master_admin_username', data.username);
      
      setSessionToken(data.sessionToken);
      setUsername(data.username);
      setIsAuthenticated(true);

      return { success: true };
    } catch (error: any) {
      console.error('Login error:', error);
      return { success: false, error: error.message || 'Login failed' };
    }
  };

  const logout = () => {
    localStorage.removeItem('master_admin_token');
    localStorage.removeItem('master_admin_username');
    setSessionToken(null);
    setUsername(null);
    setIsAuthenticated(false);
  };

  return (
    <MasterAdminContext.Provider
      value={{ isAuthenticated, username, sessionToken, login, logout, isLoading }}
    >
      {children}
    </MasterAdminContext.Provider>
  );
}

export function useMasterAdmin() {
  const context = useContext(MasterAdminContext);
  if (!context) {
    throw new Error('useMasterAdmin must be used within MasterAdminProvider');
  }
  return context;
}
